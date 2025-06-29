import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const teamId = searchParams.get("id");

  if (!teamId) {
    return NextResponse.json({ error: "Parameter 'id' tim wajib ada." }, { status: 400 });
  }

  const apiKey = process.env.FOOTBALL_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Konfigurasi server tidak lengkap." }, { status: 500 });
  }

  const season = "2023";

  const teamInfoUrl = `https://v3.football.api-sports.io/teams?id=${teamId}`;
  const squadUrl = `https://v3.football.api-sports.io/players/squads?team=${teamId}`;
  const fixturesUrl = `https://v3.football.api-sports.io/fixtures?team=${teamId}&season=${season}&last=5`;

  try {
    const [teamInfoRes, squadRes, fixturesRes] = await Promise.all([
      fetch(teamInfoUrl, { headers: { "x-apisports-key": apiKey }, next: { revalidate: 86400 } }), // Cache info tim 1 hari
      fetch(squadUrl, { headers: { "x-apisports-key": apiKey }, next: { revalidate: 86400 } }), // Cache skuad 1 hari
      fetch(fixturesUrl, { headers: { "x-apisports-key": apiKey }, next: { revalidate: 3600 } }), // Cache jadwal 1 jam
    ]);

    if (!teamInfoRes.ok || !squadRes.ok || !fixturesRes.ok) {
      throw new Error("Gagal mengambil semua detail data klub dari API eksternal.");
    }

    const teamInfoData = await teamInfoRes.json();
    const squadData = await squadRes.json();
    const fixturesData = await fixturesRes.json();

    const combinedData = {
      team: teamInfoData.response[0],
      squad: squadData.response[0]?.players,
      fixtures: fixturesData.response,
    };

    return NextResponse.json(combinedData);
  } catch (error) {
    console.error("Fetch failed (Club Detail):", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server saat mengambil detail klub." }, { status: 500 });
  }
}
