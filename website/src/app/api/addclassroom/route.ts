import { getFirebase } from "@/database/firebase";
import { randomUUID } from "crypto";
import { Timestamp } from "firebase-admin/firestore";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const data = await request.json();
    let firebase = await getFirebase();
    let col = firebase.getCollection("classrooms");

    for (let classroom in data) {
        await col?.doc(classroom).set(data[classroom]);
        (await firebase.getClassroomData())[classroom] = data[classroom];
    }
    return Response.json({ ok: true });
}
