import { getFirebase } from "@/database/firebase";
import { randomUUID } from "crypto";
import { Timestamp } from "firebase-admin/firestore";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const data = await request.json();

    let content = data["content"];
    let pvte = data["private"];
    let concerned = (data["concerned"] || []).filter(
        (v: string) => v != null && v != "" && v != undefined
    );
    let firebase = await getFirebase();

    let col = firebase.getCollection("entries");

    if (concerned.length != 0 && content != "") {
        let id = randomUUID();
        let time = Timestamp.now();
        col?.doc(id).set({
            content: content,
            concerned: concerned,
            private: pvte,
            starred: false,
            date: time,
        });

        let entries = await firebase.getEntriesData();

        entries.entries[id] = {
            date: time.toDate().toLocaleDateString(),
            concerned: concerned,
            content: content,
            private: pvte,
        };

        let names: string[] = [];

        for (let c of entries.entries[id].concerned) {
            names.push(await firebase.getNameFromId(c));
        }

        const body = await {
            date: entries.entries[id].date,
            content: entries.entries[id].content,
            private: entries.entries[id].private,
            concerned: names,
        };

        await fetch("http://localhost:2999/addentry", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
    }
    return Response.json({ ok: concerned.length != 0 && content != "" });
}
