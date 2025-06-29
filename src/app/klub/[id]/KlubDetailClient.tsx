"use client";

import Link from "next/link";
import { ArrowLeft } from "phosphor-react";

interface Team {
  id: number;
  name: string;
  logo: string;
}

interface Fixture {
  fixture: {
    id: number;
    date: string;
    venue: { name: string | null; city: string | null };
  };
  teams: {
    home: Team;
    away: Team;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  league: {
    id: number;
    name: string;
    logo: string;
    round: string;
  };
}

interface ClubDetails {
  team: {
    team: {
      id: number;
      name: string;
      logo: string;
      country: string;
      founded: number;
    };
    venue: {
      name: string;
      city: string;
      capacity: number;
      image: string;
    };
  };
  squad: Array<{
    id: number;
    name: string;
    age: number;
    number: number;
    position: string;
    photo: string;
  }>;
  fixtures: Fixture[];
}

function FixtureItem({ fixture }: { fixture: Fixture }) {
  const matchDate = new Date(fixture.fixture.date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 text-sm">
      <div className="flex items-center gap-2 w-1/4">
        <img src={fixture.league.logo} alt={fixture.league.name} className="h-5 w-5 object-contain" />
        <span className="font-semibold text-gray-700 truncate">{fixture.league.name}</span>
      </div>
      <div className="flex items-center justify-end w-1/3 text-right">
        <span className="font-semibold mr-2 text-gray-700">{fixture.teams.home.name}</span>
        <img src={fixture.teams.home.logo} alt={fixture.teams.home.name} className="h-6 w-6 object-contain" />
      </div>
      <div className="text-center text-gray-700 font-bold text-lg bg-gray-100 px-3 py-1 rounded-md">
        {fixture.goals.home} - {fixture.goals.away}
      </div>
      <div className="flex items-center justify-start w-1/3">
        <img src={fixture.teams.away.logo} alt={fixture.teams.away.name} className="h-6 w-6 object-contain" />
        <span className="font-semibold text-gray-700 ml-2">{fixture.teams.away.name}</span>
      </div>
      <div className="w-1/5 text-right text-gray-500">{matchDate}</div>
    </div>
  );
}

export default function KlubDetailClient({ details }: { details: ClubDetails }) {
  const { team, squad, fixtures } = details;

  return (
    <>
      <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 font-semibold transition-colors">
        <ArrowLeft size={18} weight="bold" />
        <span>Kembali ke Dasbor</span>
      </Link>

      <div className="space-y-8">
        {/* Info Club */}
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row items-center gap-6">
          <img src={team.team.logo} alt={team.team.name} className="h-24 w-24 object-contain" />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">{team.team.name}</h1>
            <p className="text-gray-500">
              Didirikan: {team.team.founded} | {team.team.country}
            </p>
            <p className="mt-2 text-gray-700">
              {team.venue.name} ({team.venue.city}) - Kapasitas: {team.venue.capacity.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* Bagian pertandingan */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">5 Pertandingan Terakhir</h2>
          <div className="space-y-2">{fixtures?.length > 0 ? fixtures.map((item) => <FixtureItem key={item.fixture.id} fixture={item} />) : <p className="text-center text-gray-500 py-4">Data pertandingan tidak tersedia.</p>}</div>
        </div>

        {/* Club Skuad */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Skuad Tim (Musim 2023/2024)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {squad?.map((player) => (
              <Link href={`/pemain/${player.id}`} key={player.id} className="flex items-center gap-3 p-2 border rounded-md hover:bg-gray-100 transition-colors">
                <img src={player.photo} alt={player.name} className="h-10 w-10 rounded-full bg-gray-200 object-cover" />
                <div>
                  <p className="font-semibold text-gray-700">{player.name}</p>
                  <p className="text-xs text-gray-500">
                    {player.position} | Umur: {player.age}
                  </p>
                </div>
              </Link>
            ))}
            {!squad && <p>Data skuad tidak tersedia.</p>}
          </div>
        </div>
      </div>
    </>
  );
}
