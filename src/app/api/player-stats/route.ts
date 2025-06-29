import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const leagueId = searchParams.get("league");
  const statType = searchParams.get("stat");

  if (!leagueId || !statType) {
    return NextResponse.json({ error: "Parameter 'league' dan 'stat' wajib ada." }, { status: 400 });
  }

  if (statType !== "topscorers" && statType !== "topassists") {
    return NextResponse.json({ error: "Parameter 'stat' harus 'topscorers' atau 'topassists'." }, { status: 400 });
  }

  const apiKey = process.env.FOOTBALL_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Konfigurasi server tidak lengkap." }, { status: 500 });
  }

  const season = "2023";
  const url = `https://v3.football.api-sports.io/players/${statType}?league=${leagueId}&season=${season}`;

  try {
    const res = await fetch(url, {
      headers: { "x-apisports-key": apiKey },
      // Cache selama 1 hari.
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: `Gagal mengambil data ${statType}.`, details: errorData }, { status: res.status });
    }

    const data = await res.json();

    if (!data.response || data.response.length === 0) {
      return NextResponse.json([]); // Kembalikan array kosong jika tidak ada data
    }

    // Ambil hanya 5 pemain teratas untuk mengurangi beban di frontend
    const top5Players = data.response.slice(0, 5);

    return NextResponse.json(top5Players);
  } catch (error) {
    console.error(`Fetch failed (${statType}):`, error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
