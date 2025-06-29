"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface StandingTeam {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  all: {
    played: number;
  };
}

interface LeagueData {
  id: number;
  name: string;
  logo: string;
  standings: StandingTeam[][];
}

const topLeagues = [
  { id: 39, name: "Premier League" },
  { id: 140, name: "La Liga" },
  { id: 135, name: "Serie A" },
  { id: 78, name: "Bundesliga" },
  { id: 61, name: "Ligue 1" },
];

// Sub-komponen untuk menampilkan satu tabel liga
function LeagueTable({ leagueData }: { leagueData: LeagueData }) {
  // Ambil 10 tim teratas
  const top10 = leagueData.standings[0].slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-3 flex items-center gap-3 bg-gray-50 border-b">
        <img src={leagueData.logo} alt={leagueData.name} className="h-6" />
        <h3 className="font-bold text-md text-gray-800">{leagueData.name}</h3>
      </div>
      <table className="min-w-full text-sm">
        <tbody>
          {top10.map((team) => (
            <tr key={team.team.id} className="border-b last:border-b-0 hover:bg-gray-50">
              <td className="p-2 text-center font-medium w-8 text-gray-700">{team.rank}</td>
              <td className="p-2 w-14">
                <img src={team.team.logo} alt={team.team.name} className="h-5 w-5" />
              </td>
              <td className="p-2 font-semibold text-gray-700">
                <Link href={`/klub/${team.team.id}`} className="hover:underline">
                  {team.team.name}
                </Link>
              </td>
              <td className="p-2 text-center text-gray-900">{team.all.played}</td>
              <td className="p-2 text-center font-bold text-gray-900">{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AllLeaguesStandings() {
  const [allStandings, setAllStandings] = useState<LeagueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllStandings = async () => {
      setLoading(true);
      try {
        const fetchPromises = topLeagues.map((league) =>
          fetch(`/api/standings?league=${league.id}`).then((res) => {
            if (!res.ok) throw new Error(`Gagal mengambil data untuk liga ${league.name}`);
            return res.json();
          })
        );

        const results = await Promise.all(fetchPromises);

        const validResults = results.filter((result) => !result.error);

        setAllStandings(validResults);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan tidak diketahui");
      } finally {
        setLoading(false);
      }
    };

    fetchAllStandings();
  }, []);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Peringkat Teratas Klub Eropa (Musim 2023/2024)</h2>

      {loading && <p className="text-center py-10">Memuat semua klasemen...</p>}
      {error && <p className="text-center py-10 text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {allStandings.map((leagueData) => (
            <LeagueTable key={leagueData.id} leagueData={leagueData} />
          ))}
        </div>
      )}
    </div>
  );
}
