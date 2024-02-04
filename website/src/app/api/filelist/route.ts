import { getFirebase } from "@/database/firebase";
import { NextRequest } from "next/server";
import * as fs from "fs";

export async function GET(request: NextRequest) {
    return Response.json((await getFirebase()).getFileListData());
}
