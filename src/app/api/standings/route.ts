// app/api/standings/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const leagueId = searchParams.get("league");

  if (!leagueId) {
    return NextResponse.json({ error: "Parameter 'league' wajib ada." }, { status: 400 });
  }

  const apiKey = process.env.FOOTBALL_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Konfigurasi server tidak lengkap." }, { status: 500 });
  }

  const season = "2023";
  const url = `https://v3.football.api-sports.io/standings?league=${leagueId}&season=${season}`;

  try {
    const res = await fetch(url, {
      headers: { "x-apisports-key": apiKey },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: "Gagal mengambil data klasemen.", details: errorData }, { status: res.status });
    }

    const data = await res.json();

    if (!data.response || data.response.length === 0) {
      return NextResponse.json({ error: "Tidak ada data klasemen untuk liga ini." }, { status: 404 });
    }

    return NextResponse.json(data.response[0].league);
  } catch (error) {
    console.error("Fetch failed (Standings):", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
