import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

async function getUserSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return null;
  }
  return session.user;
}

export async function GET() {
  const user = await getUserSession();
  if (!user) return NextResponse.json({ error: "Tidak terotentikasi" }, { status: 401 });

  try {
    const favoriteTeams = await prisma.favoriteTeam.findMany({ where: { userId: user.id }, select: { teamApiId: true } });
    const favoritePlayers = await prisma.favoritePlayer.findMany({ where: { userId: user.id }, select: { playerApiId: true } });
    return NextResponse.json({ teams: favoriteTeams.map((t) => t.teamApiId), players: favoritePlayers.map((p) => p.playerApiId) });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data favorit." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getUserSession();
  if (!user) return NextResponse.json({ error: "Tidak terotentikasi" }, { status: 401 });

  try {
    const { type, id } = await request.json();
    if (type === "team") await prisma.favoriteTeam.create({ data: { teamApiId: id, userId: user.id } });
    else if (type === "player") await prisma.favoritePlayer.create({ data: { playerApiId: id, userId: user.id } });
    else return NextResponse.json({ error: "Tipe favorit tidak valid." }, { status: 400 });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menambahkan favorit." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getUserSession();
  if (!user) return NextResponse.json({ error: "Tidak terotentikasi" }, { status: 401 });

  try {
    const { type, id } = await request.json();
    if (type === "team") await prisma.favoriteTeam.deleteMany({ where: { teamApiId: id, userId: user.id } });
    else if (type === "player") await prisma.favoritePlayer.deleteMany({ where: { playerApiId: id, userId: user.id } });
    else return NextResponse.json({ error: "Tipe favorit tidak valid." }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus favorit." }, { status: 500 });
  }
}
