import { getFirebase } from "@/database/firebase";
import { NextRequest } from "next/server";
import * as fs from "fs";
import AdmZip from "adm-zip";

export async function GET(request: NextRequest) {
    const data = request.nextUrl.searchParams;
    let event = data.get("event") || "RdKhousKhous";
    let year = data.get("year") || "230";

    const folder = "./public/pz/" + year + "/" + event;

    if (!fs.existsSync(folder))
        return Response.json({ error: "Couldn't find folder" });

    const zip = new AdmZip();
    await zip.addLocalFolderPromise(folder, { zipPath: "" });

    const headers = new Headers();
    headers.append(
        "Content-Disposition",
        "attachment; filename=" + year + "-" + event + ".zip"
    );
    headers.append("Content-Type", "application/zip");

    return new Response(await zip.toBufferPromise(), {
        headers,
    });
}
