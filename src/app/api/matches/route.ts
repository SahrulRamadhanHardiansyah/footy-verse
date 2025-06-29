import { NextResponse } from "next/server";

const TOP_5_LEAGUE_IDS = [39, 140, 135, 78, 61];

const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export async function GET() {
  const apiKey = process.env.FOOTBALL_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Konfigurasi server tidak lengkap." }, { status: 500 });
  }

  const today = new Date();

  const dateFrom = new Date(today);
  dateFrom.setDate(today.getDate() - 1); // Kemarin

  const dateTo = new Date(today);
  dateTo.setDate(today.getDate() + 1); // Besok

  const from = formatDate(dateFrom);
  const to = formatDate(dateTo);

  try {
    const fetchPromises = TOP_5_LEAGUE_IDS.map((leagueId) => {
      const url = `https://v3.football.api-sports.io/fixtures?league=${leagueId}&season=2025&from=${from}&to=${to}`;
      return fetch(url, {
        headers: { "x-apisports-key": apiKey },
        next: { revalidate: 300 },
      }).then((res) => res.json());
    });

    const results = await Promise.all(fetchPromises);
    const allFixtures = results.flatMap((result) => result.response || []);
    allFixtures.sort((a, b) => new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime());

    return NextResponse.json(allFixtures);
  } catch (error) {
    console.error("Failed to fetch fixtures:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
