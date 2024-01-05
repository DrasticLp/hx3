import { getFirebase } from "@/database/firebase";

export async function GET() {
    return Response.json(await (await getFirebase()).getClassroomData());
}
