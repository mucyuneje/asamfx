import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()
    if (!email || !password || !name) return NextResponse.json({ error: "All fields required" }, { status: 400 })

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) return NextResponse.json({ error: "User already exists" }, { status: 400 })

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, role: "STUDENT" },
    })

    return NextResponse.json({ message: "User registered successfully", user })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
