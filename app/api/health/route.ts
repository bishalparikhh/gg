import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "okk" }, { status: 200 });
}
