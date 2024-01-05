import { getFirebase } from "@/database/firebase";
import { Timestamp } from "firebase-admin/firestore";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const data = await request.json();
    let firebase = await getFirebase();
    let col = firebase.getCollection("entries");

    let id = data["id"];
    let token = data["token"] || "-1";
    let username = data["username"] || "";
    let content = data["content"];
    let pvte = data["private"];
    let concerned = (data["concerned"] || []).filter(
        (v: string) => v != null && v != "" && v != undefined
    );

    if (concerned.length == 0 || content == "")
        return Response.json({ res: "size" });

    let doc = await col?.doc(id).get();

    if (!(await firebase.checkEditEntriesPermission(username, token)))
        return Response.json({ res: "perm" });
    let database = await firebase.getEntriesData();

    let beforenames: string[] = [];

    if (database.entries[id])
        for (let c of database.entries[id].concerned) {
            beforenames.push(await firebase.getNameFromId(c));
        }
    const body: any = {
        before: {
            date: database.entries[id]?.date || "",
            content: database.entries[id]?.content || "",
            private: database.entries[id]?.private || "",
            concerned: beforenames,
        },
    };

    if (doc?.exists) {
        await col?.doc(id).update({
            content: content,
            concerned: concerned,
            private: pvte,
        });

        database.entries[id].concerned = concerned;
        database.entries[id].private = pvte;
        database.entries[id].content = content;
    } else {
        let time = Timestamp.now();
        col?.doc(id).set({
            content: content,
            concerned: concerned,
            starred: false,
            private: pvte,
            date: time,
        });

        database.entries[id] = {
            date: time.toDate().toLocaleDateString(),
            concerned: concerned,
            content: content,
            private: pvte,
        };
    }

    let afternames: string[] = [];

    for (let c of database.entries[id].concerned) {
        afternames.push(await firebase.getNameFromId(c));
    }

    body.after = {
        date: database.entries[id].date,
        content: database.entries[id].content,
        private: database.entries[id].private,
        concerned: afternames,
    };

    await fetch("http://localhost:2999/editentry", {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    return Response.json({ res: "ok" });
}
