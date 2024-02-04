import { getFirebase } from "@/database/firebase";
import { NextRequest } from "next/server";
import * as fs from "fs";

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    let firebase = await getFirebase();

    let year = formData.get("year");
    let event = formData.get("event");
    let token = formData.get("token") as string;
    let username = formData.get("username") as string;

    if (!year || !event) return;

    if (!(await firebase.checkEditPzPermission(username, token)))
        return Response.json({ res: "perm" });
    const folder = "./public/pz/" + year + "/" + event;

    if (fs.existsSync(folder)) {
        await fs.promises.rm(folder, { recursive: true, force: true });
        return Response.json({ res: "ok" });
    }

    return Response.json({ res: "event" });
}
