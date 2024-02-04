import { getFirebase } from "@/database/firebase";
import * as fs from "fs";
import isValidFilename from "valid-filename";
export async function POST(request: Request): Promise<Response> {
    const formData = await request.formData();
    let firebase = await getFirebase();

    let token = (formData.get("token") as string) || "-1";
    let username = (formData.get("username") as string) || "";

    let year = (formData.get("year") as string) || "";
    let event = (formData.get("event") as string) || "";

    if (!(await firebase.checkEditPzPermission(username, token)))
        return Response.json({ res: "perm" });

    if (!isValidFilename(event)) return Response.json({ res: "invalidfile" });
    const files = formData.getAll("files");

    if (files.length == 0) return Response.json({ res: "nofiles" });

    const folder = "./public/pz/" + year + "/" + event;

    if (!fs.existsSync(folder)) await fs.promises.mkdir(folder);

    for (let f of files) {
        const file = f as File;
        const buffer = Buffer.from(await file.arrayBuffer());

        try {
            await fs.promises.writeFile(folder + "/" + file.name, buffer);
        } catch (e) {
            if (fs.existsSync(folder + "/" + file.name))
                await fs.promises.rm(folder + "/" + file.name);

            return Response.json({ res: "unknownerror" });
        }
    }

    return Response.json({ res: "ok" });
}
