"use client";

import Link from "next/link";
import PlayerStats from "./components/PlayerStats";
import AllLeaguesStandings from "./components/AllLeaguesStandings";
import FixturesList from "./components/FixturesList";
import GreatestPlayers from "./components/GreatestPlayers";

const popularLeagues = [
  { id: 39, name: "Premier League", logo: "https://media.api-sports.io/football/leagues/39.png" },
  { id: 140, name: "La Liga", logo: "https://media.api-sports.io/football/leagues/140.png" },
  { id: 135, name: "Serie A", logo: "https://media.api-sports.io/football/leagues/135.png" },
  { id: 78, name: "Bundesliga", logo: "https://media.api-sports.io/football/leagues/78.png" },
  { id: 61, name: "Ligue 1", logo: "https://media.api-sports.io/football/leagues/61.png" },
  { id: 88, name: "Eredivisie", logo: "https://media.api-sports.io/football/leagues/88.png" },
  { id: 94, name: "Primeira Liga", logo: "https://media.api-sports.io/football/leagues/94.png" },
  { id: 71, name: "Brasileirão", logo: "https://media.api-sports.io/football/leagues/71.png" },
  { id: 270, name: "Liga 1", logo: "https://media.api-sports.io/football/leagues/270.png" },
  { id: 2, name: "UEFA Champions League", logo: "https://media.api-sports.io/football/leagues/2.png" },
];

export default function Home() {
  return (
    <main className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">Footyverse Dashboard</h1>

        {/* Bagian Jadwal & Hasil Pertandingan */}
        <FixturesList />

        {/* Bagian Klasemen Gabungan */}
        <AllLeaguesStandings />

        {/* Bagian Tombol Klasemen */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border">
          <h2 className="text-xl font-bold text-gray-700 mb-3">Lihat Klasemen Detail</h2>
          <div className="flex overflow-x-auto gap-3 pb-3 scrollbar-hide">
            {popularLeagues.map((league) => (
              <Link
                key={league.id}
                href={`/klasemen?league=${league.id}&name=${encodeURIComponent(league.name)}`}
                className="flex-shrink-0 flex items-center gap-2 bg-white hover:bg-gray-200 border border-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md transition-colors duration-200"
              >
                <img src={league.logo} alt={league.name} className="h-5 w-5" />
                <span>{league.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Bagian Statistik Pemain */}
        <PlayerStats />

        {/* Bagian Pemain Terbaik */}
        <GreatestPlayers />
      </div>
    </main>
  );
}
