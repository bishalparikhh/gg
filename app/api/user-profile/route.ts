// app/api/user-profile/route.ts
import { NextResponse } from "next/server";
import { auth0 } from "../../../lib/auth0";

export async function GET() {
  try {
    const session = await auth0.getSession();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      name: session.user.name,
      email: session.user.email,
      nickname: session.user.nickname,
      picture: session.user.picture,
    });
  } catch (err) {
    console.error("❌ Error fetching user profile:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
