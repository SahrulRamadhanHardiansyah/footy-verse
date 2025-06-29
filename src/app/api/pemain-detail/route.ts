import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const playerId = searchParams.get("id");

  if (!playerId) {
    return NextResponse.json({ error: "Parameter 'id' pemain wajib ada." }, { status: 400 });
  }

  const apiKey = process.env.FOOTBALL_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Konfigurasi server tidak lengkap." }, { status: 500 });
  }

  const season = "2023";
  const url = `https://v3.football.api-sports.io/players?id=${playerId}&season=${season}`;

  try {
    const res = await fetch(url, {
      headers: { "x-apisports-key": apiKey },
      next: { revalidate: 86400 }, // Cache data pemain selama 1 hari
    });

    if (!res.ok) {
      throw new Error("Gagal mengambil data detail pemain dari API eksternal.");
    }

    const data = await res.json();

    if (!data.response || data.response.length === 0) {
      return NextResponse.json({ error: "Pemain tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json(data.response[0]);
  } catch (error) {
    console.error("Fetch failed (Player Detail):", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
