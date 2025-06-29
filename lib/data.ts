// lib/data.ts
import "server-only";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const API_KEY = process.env.FOOTBALL_API_KEY;
const API_BASE_URL = "https://v3.football.api-sports.io";

export async function getProfileData(userId: string) {
  const favoriteTeamRecords = await prisma.favoriteTeam.findMany({
    where: { userId },
    select: { teamApiId: true },
  });
  const favoritePlayerRecords = await prisma.favoritePlayer.findMany({
    where: { userId },
    select: { playerApiId: true },
  });

  const favoriteTeamIds = favoriteTeamRecords.map((t) => t.teamApiId);
  const favoritePlayerIds = favoritePlayerRecords.map((p) => p.playerApiId);

  const teamPromises = favoriteTeamIds.map((id) =>
    fetch(`${API_BASE_URL}/teams?id=${id}`, {
      headers: { "x-apisports-key": API_KEY! },
      next: { revalidate: 86400 }, // Cache 1 hari
    }).then((res) => res.json())
  );

  const playerPromises = favoritePlayerIds.map((id) =>
    fetch(`${API_BASE_URL}/players?id=${id}&season=2023`, {
      headers: { "x-apisports-key": API_KEY! },
      next: { revalidate: 86400 },
    }).then((res) => res.json())
  );

  const [teamResults, playerResults] = await Promise.all([Promise.all(teamPromises), Promise.all(playerPromises)]);

  const favoriteTeams = teamResults.flatMap((result) => result.response);
  const favoritePlayers = playerResults.flatMap((result) => result.response);

  return { favoriteTeams, favoritePlayers };
}
