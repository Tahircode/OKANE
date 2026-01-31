import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { getContacts } from "../../../../../packages/db/src/cache/contacts";
import { NextResponse } from "next/server";
export async function GET(){
    try {
          const session = await getServerSession(authOptions);
          if(!session?.user?.id) {
            return NextResponse.json({
                error: "Unauthorized"
            },
        {status : 401});
          }
        const contacts = await getContacts(session.user.id);
          return NextResponse.json( contacts || [] )

    }catch(e){
    return NextResponse.json({ error: "Internal Server Error while fetching contacts", e }, { status: 500 },);
    }
}