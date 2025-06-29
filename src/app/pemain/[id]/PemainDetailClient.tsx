"use client";

import { ArrowLeft, SoccerBall, PersonSimpleRun, Shield, Cardholder, Star } from "phosphor-react";
import Link from "next/link";
import { useFavorites } from "../../hooks/useFavorites";

interface PlayerDetails {
  player: {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    age: number;
    birth: { date: string; place: string; country: string };
    nationality: string;
    height: string;
    weight: string;
    injured: boolean;
    photo: string;
  };
  statistics: Array<{
    team: { id: number; name: string; logo: string };
    league: { id: number; name: string; country: string; logo: string; season: number };
    games: { appearences: number; lineups: number; minutes: number; position: string };
    goals: { total: number | null; assists: number | null };
    cards: { yellow: number; yellowred: number; red: number };
  }>;
}

export default function PemainDetailClient({ details }: { details: PlayerDetails }) {
  const { player, statistics } = details;
  const { toggleFavorite, isFavorite, isLoadingFavorites } = useFavorites();
  const isFavorited = isFavorite("player", player.id);

  return (
    <>
      <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 font-semibold transition-colors">
        <ArrowLeft size={18} weight="bold" />
        <span>Kembali ke Dasbor</span>
      </Link>

      <div className="space-y-8">
        {/* Kartu Info Utama Pemain */}
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row items-center gap-6">
          <img src={player.photo} alt={player.name} className="h-40 w-40 rounded-full object-cover border-4 border-gray-200" />
          <div className="flex-grow text-center sm:text-left">
            <h1 className="text-4xl font-extrabold text-gray-800">{player.name}</h1>
            <p className="text-lg text-gray-600">
              {player.nationality} | Umur: {player.age}
            </p>
            <div className="mt-2 flex justify-center sm:justify-start gap-4 text-gray-600">
              <span>Tinggi: {player.height}</span>
              <span>Berat: {player.weight}</span>
            </div>
          </div>

          <button
            onClick={() => toggleFavorite("player", player.id)}
            disabled={isLoadingFavorites}
            className="p-2 rounded-full hover:scale-105 hover:-translate-y-0.5 ease-in-out duration-300 transition-all"
            aria-label="Tambahkan ke favorit"
          >
            <Star size={32} weight={isFavorited ? "fill" : "regular"} className={isFavorited ? "text-yellow-400" : "text-gray-400"} />
          </button>
        </div>

        {/* Statistik per Kompetisi */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Statistik Musim {statistics[0]?.league.season || "2023/2024"}</h2>
          <div className="space-y-4">
            {statistics.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 border">
                <div className="flex items-center gap-4 mb-3 pb-3 border-b">
                  <img src={stat.league.logo} alt={stat.league.name} className="h-8 object-contain" />
                  <div>
                    <p className="font-bold text-gray-700">{stat.league.name}</p>
                    <p className="text-xs text-gray-500">{stat.team.name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-700">Main</p>
                    <p className="font-bold text-xl flex items-center justify-center gap-1 text-gray-700">
                      <PersonSimpleRun /> {stat.games.appearences}
                    </p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-700">Gol</p>
                    <p className="font-bold text-xl flex items-center justify-center gap-1 text-gray-700">
                      <SoccerBall /> {stat.goals.total ?? 0}
                    </p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-700">Assist</p>
                    <p className="font-bold text-xl flex items-center justify-center gap-1 text-gray-700">
                      <Shield /> {stat.goals.assists ?? 0}
                    </p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-700">Kartu</p>
                    <p className="font-bold text-xl flex items-center justify-center gap-1 text-gray-700">
                      <Cardholder /> {stat.cards.yellow + stat.cards.red}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
