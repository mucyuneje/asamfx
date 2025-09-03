import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../[...nextauth]/route"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 })
  }

  // Invalidate session by removing cookie
  return NextResponse.json({ message: "Logged out" })
}
