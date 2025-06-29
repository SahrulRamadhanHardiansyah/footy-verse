import { NextResponse } from "next/server";

// ID Liga: 39 = Premier League, 140 = La Liga, 135 = Serie A
const LEAGUE_ID = 39;
const SEASON = new Date().getFullYear() - 1; // Ambil musim yang sudah selesai

export async function GET() {
  const apiKey = process.env.FOOTBALL_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Konfigurasi server tidak lengkap." }, { status: 500 });
  }

  const apiUrl = `https://v3.football.api-sports.io/teams?league=${LEAGUE_ID}&season=${SEASON}`;

  try {
    const res = await fetch(apiUrl, {
      headers: { "x-apisports-key": apiKey },
      next: { revalidate: 86400 }, // Cache data tim selama 1 hari (86400 detik)
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: "Gagal mengambil data tim.", details: errorData }, { status: res.status });
    }

    const data = await res.json();

    // Kirim hanya data tim yang relevan
    const teams = data.response.map((item: any) => ({
      id: item.team.id,
      name: item.team.name,
      logo: item.team.logo,
    }));

    return NextResponse.json(teams);
  } catch (error) {
    console.error("Fetch teams failed:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
