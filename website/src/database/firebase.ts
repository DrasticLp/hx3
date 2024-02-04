import { credential, firestore } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs, { readFileSync, unwatchFile } from "fs";
import { config } from "dotenv";
import CryptoJS from "crypto-js";
import imageSize from "image-size";

config();

/**
 * Wrapper class for firestore
 */
export class Database {
    database: firestore.Firestore;
    private collections: Map<
        string,
        firestore.CollectionReference<firestore.DocumentData>
    > = new Map();

    classroomData: any;
    entriesData: any;
    fileListData: any;
    authData: Map<
        string,
        { canEditEntries: boolean; canEditPz: boolean; password: string }
    > = new Map();
    key = CryptoJS.enc.Base64.parse(
        process.env.PRIVATE_KEY || "0000000000000000000000"
    );
    iv = CryptoJS.enc.Base64.parse(process.env.IV || "0000000000000000000000");

    constructor() {
        let json = JSON.parse(fs.readFileSync("./firebase.json", "utf-8"));
        try {
            initializeApp({
                credential: credential.cert(json),
            });
        } catch (e) {}

        this.database = getFirestore();
    }

    async getAuthData() {
        if (this.authData.size == 0) await this.fetchAuthData();
        return this.authData;
    }

    async getClassroomData() {
        if (!this.classroomData) await this.fetchClassroomData();
        return this.classroomData;
    }

    async getEntriesData() {
        if (!this.entriesData) await this.fetchEntriesData();
        return this.entriesData;
    }

    getFileListData() {
        if (!this.fileListData) this.fetchFileListData();
        return this.fileListData;
    }

    async fetchClassroomData() {
        let coll = this.getCollection("classrooms");
        let snapshot = await coll?.get();

        let res: any = {};

        if (!snapshot) {
            this.classroomData = res;
            return;
        }

        for (let doc of snapshot?.docs) {
            let data = doc.data();

            res[doc.id] = data;
        }

        this.classroomData = res;
    }

    async fetchAuthData() {
        let col = this.getCollection("auth");
        let snapshot = await col?.get();

        if (!snapshot) return;

        for (let doc of snapshot.docs)
            this.authData.set(doc.id, {
                canEditEntries: doc.data().canEditEntries,
                canEditPz: doc.data().canEditPz,
                password: (
                    await this.encryptPassword(doc.data().password)
                ).toString(),
            });
    }

    async fetchEntriesData() {
        let coll = this.getCollection("entries");

        let snapshot = await coll?.get();

        let res: any = { entries: {}, starred: [] };

        if (!snapshot) {
            this.entriesData = res;
            return;
        }

        for (let doc of snapshot?.docs) {
            let data = doc.data();

            res.entries[doc.id] = {
                date: data.date.toDate().toLocaleDateString(),
                concerned: data.concerned,
                content: data.content,
                private: data.private,
            };

            if (data.starred) res.starred.push(doc.id);
        }

        this.entriesData = res;
    }

    fetchFileListData() {
        this.fileListData = this.getFolderContents("");
    }

    getFolderContents(folder: string) {
        let list = fs.readdirSync("./public/pz/" + folder);
        let files: any = {};

        for (let f of list) {
            let stat = fs.statSync("./public/pz/" + folder + "/" + f);

            if (stat.isDirectory()) {
                if (f == "zips") continue;
                files[f] = this.getFolderContents(folder + "/" + f);

                for (let s in files[f])
                    if (!s.includes(".") && s != "hasSubDirs") {
                        files[f].hasSubDirs = true;
                        break;
                    }
            } else {
                const dim = imageSize("./public" + "/pz" + folder + "/" + f);
                files[f] = {
                    url: "/pz" + folder + "/" + f,
                    width: dim.orientation == 6 ? dim.height : dim.width,
                    height: dim.orientation == 6 ? dim.width : dim.height,
                };
            }
        }

        return files;
    }

    /**
     * Returns the queried collectio
     * @param collection
     * @returns
     */
    getCollection(collection: string) {
        if (
            !this.collections.has(collection) ||
            this.collections.get(collection) == undefined
        )
            this.collections.set(
                collection,
                this.database.collection(collection)
            );
        return this.collections.get(collection);
    }

    /**
     * Returns the incremented field value
     * @param count
     * @returns
     */
    increment(count: number) {
        return firestore.FieldValue.increment(count);
    }

    /**
     * Delete all documents from collection
     * @param collection
     */
    async clearCollection(collection: string) {
        let val = await this.getCollection(collection)?.listDocuments();

        val?.map((val) => val.delete());
    }

    encryptPassword(password: string) {
        return CryptoJS.AES.encrypt(password, this.key, { iv: this.iv });
    }

    async checkPassword(username: string, token: string) {
        return token == (await this.getAuthData()).get(username)?.password;
    }

    async checkEditEntriesPermission(username: string, token: string) {
        let authData = await this.getAuthData();
        let user = authData.get(username);

        return (
            user != null &&
            user != undefined &&
            token == user.password &&
            user.canEditEntries
        );
    }

    async checkEditPzPermission(username: string, token: string) {
        let authData = await this.getAuthData();
        let user = authData.get(username);

        return (
            user != null &&
            user != undefined &&
            token == user.password &&
            user.canEditPz
        );
    }

    async getNameFromId(id: string) {
        let cData = await this.getClassroomData();

        for (let c in cData) {
            let classroom = cData[c];

            for (let s in classroom.students) {
                if (s == id) return classroom.students[s].name;
            }
        }

        return "";
    }
}

let firebase: Database = new Database();

export async function getFirebase() {
    if (!firebase || !firebase.database) firebase = new Database();
    return firebase;
}
