"use client";

import Image from "next/image";
import Link from "next/link";
import { Session } from "next-auth";
import { Club, Football, ArrowLeft, PersonSimpleRun, ShieldCheck } from "phosphor-react";

type ProfileData = {
  user: Session["user"];
  favoriteTeams: any[];
  favoritePlayers: any[];
};

export default function ProfileClient({ data }: { data: ProfileData }) {
  const { user, favoriteTeams, favoritePlayers } = data;

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 font-semibold transition-colors">
        <ArrowLeft size={18} weight="bold" />
        <span>Kembali ke Dasbor</span>
      </Link>

      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center gap-6">
          <Image src={user?.image || ""} alt={user?.name || "User Avatar"} width={80} height={80} className="rounded-full" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center text-gray-700 gap-2">
            <ShieldCheck size={24} /> Tim Favorit
          </h2>
          {favoriteTeams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteTeams.map((item) => (
                <Link href={`/klub/${item.team.id}`} key={item.team.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <Image src={item.team.logo} alt={item.team.name} width={40} height={40} className="object-contain" />
                  <span className="font-semibold text-gray-600">{item.team.name}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Anda belum memiliki tim favorit.</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center text-gray-700 gap-2">
            <PersonSimpleRun size={24} /> Pemain Favorit
          </h2>
          {favoritePlayers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoritePlayers.map((item) => (
                <Link href={`/pemain/${item.player.id}`} key={item.player.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <Image src={item.player.photo} alt={item.player.name} width={40} height={40} className="rounded-full object-cover" />
                  <span className="font-semibold text-gray-600">{item.player.name}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Anda belum memiliki pemain favorit.</p>
          )}
        </div>
      </div>
    </div>
  );
}
