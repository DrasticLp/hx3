import { getFirebase } from "@/database/firebase";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const data = await request.json();
    let firebase = await getFirebase();
    let col = firebase.getCollection("entries");

    let id = data["id"];
    let token = data["token"] || "-1";
    let username = data["username"] || "";

    let doc = await col?.doc(id).get();

    if (!(await firebase.checkEditEntriesPermission(username, token)))
        return Response.json({ res: "perm" });

    let fData = await firebase.getEntriesData();
    if (doc?.exists && fData.entries[id]) {
        let entry = fData.entries[id];
        await col?.doc(id).delete();

        let names: string[] = [];

        for (let c of fData.entries[id].concerned) {
            names.push(await firebase.getNameFromId(c));
        }

        const body = await {
            date: fData.entries[id].date,
            content: fData.entries[id].content,
            private: fData.entries[id].private,
            concerned: names,
        };

        await fetch("http://localhost:2999/deleteentry", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        delete fData.entries[id];
        return Response.json({ res: "ok", entry: entry });
    }

    return Response.json({ res: "entry" });
}
