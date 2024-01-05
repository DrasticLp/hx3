import { getFirebase } from "@/database/firebase";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const data = request.nextUrl.searchParams;
    let token = data.get("token") || "-1";
    let username = data.get("username") || "";

    let firebase = await getFirebase();
    let rData = await firebase.getEntriesData();

    const editPerms = await firebase.checkEditEntriesPermission(
        username,
        token
    );

    //console.log(editPerms);

    if (!editPerms) {
        let toDelete: string[] = [];
        for (let e in rData.entries) {
            if (rData.entries[e].private) toDelete.push(e);
        }
        for (let e of toDelete) {
            delete rData.entries[e];
        }
    }

    return Response.json(rData);
}
