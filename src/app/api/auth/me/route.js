import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { publicUser } from "@/lib/security";
export async function GET(request) { const user = await getUserFromRequest(request); return user ? NextResponse.json({ user: publicUser(user) }) : NextResponse.json({ error: "Not authenticated" }, { status: 401 }); }
