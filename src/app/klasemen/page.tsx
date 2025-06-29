"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "phosphor-react";

interface StandingTeam {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  goalsDiff: number;
  group?: string;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
  };
}

interface LeagueData {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
  standings: StandingTeam[][]; // array di dalam array (satu untuk setiap grup)
}

// Komponen untuk menampilkan SATU tabel klasemen (baik liga tunggal maupun satu grup)
function SingleTable({ standings, title }: { standings: StandingTeam[]; title?: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 ">
      {title && <h2 className="text-xl font-bold p-4 bg-gray-50 border-b text-gray-700">{title}</h2>}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="p-3 font-semibold text-center">Pos</th>
              <th className="p-3 font-semibold" colSpan={2}>
                Klub
              </th>
              <th className="p-3 font-semibold text-center">M</th>
              <th className="p-3 font-semibold text-center">M</th>
              <th className="p-3 font-semibold text-center">S</th>
              <th className="p-3 font-semibold text-center">K</th>
              <th className="p-3 font-semibold text-center">SG</th>
              <th className="p-3 font-semibold text-center">Poin</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {standings.map((team) => (
              <tr key={team.team.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-bold text-center">{team.rank}</td>
                <td className="p-3 w-14">
                  <img src={team.team.logo} alt={team.team.name} className="h-8 w-8" />
                </td>
                <td className="p-3 font-semibold">
                  <Link href={`/klub/${team.team.id}`} className="hover:underline">
                    {team.team.name}
                  </Link>
                </td>
                <td className="p-3 text-center">{team.all.played}</td>
                <td className="p-3 text-center">{team.all.win}</td>
                <td className="p-3 text-center">{team.all.draw}</td>
                <td className="p-3 text-center">{team.all.lose}</td>
                <td className="p-3 text-center">{team.goalsDiff}</td>
                <td className="p-3 font-extrabold text-center">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StandingsDisplay() {
  const searchParams = useSearchParams();
  const leagueId = searchParams.get("league");
  const leagueName = searchParams.get("name");

  const [leagueData, setLeagueData] = useState<LeagueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (leagueId) {
      setLoading(true);
      setError(null);
      fetch(`/api/standings?league=${leagueId}`)
        .then((res) => {
          if (!res.ok) throw new Error(`Gagal memuat data. Status: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (data.error) throw new Error(data.error);
          setLeagueData(data);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [leagueId]);

  if (loading) return <p className="text-center py-10">Memuat klasemen...</p>;
  if (error) return <p className="text-center py-10 text-red-600">{error}</p>;
  if (!leagueData || leagueData.standings.length === 0) return <p className="text-center py-10">Data klasemen tidak tersedia untuk kompetisi ini.</p>;

  const isTournament = leagueData.standings.length > 1;

  return (
    <div>
      <div className="p-4 flex items-center gap-4 mb-4 bg-white rounded-lg shadow-sm border">
        <img src={leagueData.logo} alt={leagueData.name} className="h-10" />
        <div>
          <h1 className="text-2xl font-bold text-gray-700">{leagueData.name}</h1>
          <p className="text-sm text-gray-500">
            {leagueData.country} - Musim {leagueData.season}
          </p>
        </div>
      </div>

      {leagueData.standings.map((groupStandings, index) => (
        <SingleTable key={index} standings={groupStandings} title={isTournament ? groupStandings[0]?.group : undefined} />
      ))}
    </div>
  );
}

export default function KlasemenPage() {
  return (
    <main className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 font-semibold transition-colors">
          <ArrowLeft size={18} weight="bold" />
          <span>Kembali ke Dasbor</span>
        </Link>
        <Suspense fallback={<p className="text-center py-10">Memuat data...</p>}>
          <StandingsDisplay />
        </Suspense>
      </div>
    </main>
  );
}
