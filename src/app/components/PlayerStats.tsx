"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface PlayerStat {
  player: {
    id: number;
    name: string;
    photo: string;
  };
  statistics: Array<{
    team: { id: number; name: string };
    goals?: {
      total: number | null;
      assists: number | null;
    };
  }>;
}

const topLeagues = [
  { id: 39, name: "Premier League" },
  { id: 140, name: "La Liga" },
  { id: 135, name: "Serie A" },
  { id: 78, name: "Bundesliga" },
  { id: 61, name: "Ligue 1" },
];

function StatList({ title, players, statType }: { title: string; players: PlayerStat[]; statType: "goals" | "assists" }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="font-bold text-lg mb-3 text-gray-800">{title}</h3>
      {players.length > 0 ? (
        <ul className="space-y-3">
          {players.map((item, index) => (
            <li key={item.player.id} className="flex items-center gap-3 text-sm p-2 rounded-md hover:bg-gray-100">
              <span className="font-bold w-5 text-center text-gray-700">{index + 1}</span>

              <Link href={`/pemain/${item.player.id}`}>
                <img src={item.player.photo} alt={item.player.name} className="h-9 w-9 rounded-full object-cover bg-gray-200" />
              </Link>

              <div className="flex-grow">
                <Link href={`/pemain/${item.player.id}`} className="font-semibold text-gray-700 hover:underline">
                  {item.player.name}
                </Link>
                <Link href={`/klub/${item.statistics[0].team.id}`} className="block text-gray-500 text-xs hover:underline">
                  {item.statistics[0].team.name}
                </Link>
              </div>

              <span className="font-extrabold text-lg text-gray-800">{statType === "goals" ? item.statistics[0].goals?.total ?? 0 : item.statistics[0].goals?.assists ?? 0}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">Data tidak tersedia.</p>
      )}
    </div>
  );
}

export default function PlayerStats() {
  const [activeLeagueId, setActiveLeagueId] = useState<number>(topLeagues[0].id);
  const [scorers, setScorers] = useState<PlayerStat[]>([]);
  const [assists, setAssists] = useState<PlayerStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const [scorersRes, assistsRes] = await Promise.all([fetch(`/api/player-stats?league=${activeLeagueId}&stat=topscorers`), fetch(`/api/player-stats?league=${activeLeagueId}&stat=topassists`)]);

        if (!scorersRes.ok || !assistsRes.ok) {
          throw new Error("Gagal memuat data statistik pemain.");
        }

        const scorersData = await scorersRes.json();
        const assistsData = await assistsRes.json();

        setScorers(scorersData);
        setAssists(assistsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [activeLeagueId]);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-700 mb-3">Statistik Pemain (Musim 2023/2024)</h2>
      <div className="flex flex-wrap gap-2 border-b mb-4">
        {topLeagues.map((league) => (
          <button
            key={league.id}
            onClick={() => setActiveLeagueId(league.id)}
            className={`py-2 px-4 text-sm font-semibold rounded-t-lg transition-colors ${activeLeagueId === league.id ? "bg-blue-600 text-white border-b-2 border-blue-600" : "text-gray-600 hover:bg-gray-200"}`}
          >
            {league.name}
          </button>
        ))}
      </div>

      {loading && <p className="text-center py-5">Memuat statistik...</p>}
      {error && <p className="text-center py-5 text-red-600">{error}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatList title="Top Skor" players={scorers} statType="goals" />
          <StatList title="Top Assist" players={assists} statType="assists" />
        </div>
      )}
    </div>
  );
}
