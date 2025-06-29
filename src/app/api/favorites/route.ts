import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, team } = body;

  const newTeam = await prisma.team.create({
    data: {
      name: team.name,
      country: team.country,
      logo: team.logo,
      userId: userId,
    },
  });

  return NextResponse.json(newTeam);
}
