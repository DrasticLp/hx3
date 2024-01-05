import { getFirebase } from "@/database/firebase";

export async function GET(request: Request) {
    let firebase = await getFirebase();
    await firebase.fetchEntriesData();
    await firebase.fetchClassroomData();

    return Response.json({ Done: true });
}
