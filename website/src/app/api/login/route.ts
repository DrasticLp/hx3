import { getFirebase } from "@/database/firebase";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    let firebase = await getFirebase();
    let token = await firebase
        .encryptPassword(request.nextUrl.searchParams.get("password") || "")
        .toString();

    if (
        !(await firebase.checkPassword(
            request.nextUrl.searchParams.get("username") || "",
            token
        ))
    )
        token = "-1";

    return Response.json({
        token: token,
    });
}
