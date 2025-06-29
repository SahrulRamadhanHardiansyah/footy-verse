"use client";

import { useState } from "react";
import { PlusCircle } from "phosphor-react";

interface LegendaryPlayer {
  rank: number;
  name: string;
  photoUrl: string;
  country: string;
  era: string;
  description: string;
}

// Data statis pemain terbaik sepanjang masa (Anda bisa menambah/mengubah daftar ini)
const legendaryPlayers: LegendaryPlayer[] = [
  {
    rank: 1,
    name: "Lionel Messi",
    photoUrl: "https://img.a.transfermarkt.technology/portrait/big/28003-1740766555.jpg?lm=1",
    country: "Argentina",
    era: "2000s-2020s",
    description: "Dianggap oleh banyak orang sebagai yang terhebat, dengan rekor 8 Ballon d'Or.",
  },
  {
    rank: 2,
    name: "Cristiano Ronaldo",
    photoUrl: "https://img.a.transfermarkt.technology/portrait/big/8198-1694609670.jpg?lm=1",
    country: "Portugal",
    era: "2000s-2020s",
    description: "Pencetak gol terbanyak sepanjang masa dan ikon kebugaran serta dedikasi.",
  },
  {
    rank: 3,
    name: "Pelé",
    photoUrl: "https://img.a.transfermarkt.technology/portrait/big/17121-1672341199.jpg?lm=1",
    country: "Brasil",
    era: "1950s-1970s",
    description: "Satu-satunya pemain yang memenangkan 3 Piala Dunia, ikon global sepak bola.",
  },
  {
    rank: 4,
    name: "Diego Maradona",
    photoUrl: "https://img.a.transfermarkt.technology/portrait/big/8024-1606322777.png?lm=1",
    country: "Argentina",
    era: "1970s-1990s",
    description: "Terkenal dengan 'Gol Tangan Tuhan' dan gol solo abad ini di Piala Dunia 1986.",
  },
  {
    rank: 5,
    name: "Johan Cruyff",
    photoUrl: "https://img.a.transfermarkt.technology/portrait/big/8021-1458823519.jpg?lm=1",
    country: "Belanda",
    era: "1960s-1980s",
    description: "Otak di balik 'Total Football' dan merevolusi permainan sebagai pemain dan pelatih.",
  },
  {
    rank: 6,
    name: "Zinedine Zidane",
    photoUrl: "https://img.a.transfermarkt.technology/portrait/big/3111-1478769687.jpg?lm=1",
    country: "Prancis",
    era: "1990s-2000s",
    description: "Seorang maestro lini tengah dengan keanggunan dan visi yang luar biasa.",
  },
  {
    rank: 7,
    name: "Franz Beckenbauer",
    photoUrl: "https://img.a.transfermarkt.technology/portrait/big/72347-1704730756.png?lm=1",
    country: "Jerman",
    era: "1960s-1980s",
    description: "Menciptakan posisi 'libero' dan memenangkan Piala Dunia sebagai pemain dan pelatih.",
  },
  {
    rank: 8,
    name: "Alfredo Di Stéfano",
    photoUrl: "https://img.a.transfermarkt.technology/portrait/big/135778-1465807355.jpg?lm=1",
    country: "Argentina/Spanyol",
    era: "1940s-1960s",
    description: "Kekuatan pendorong di balik dominasi Real Madrid di awal Piala Eropa.",
  },
  {
    rank: 9,
    name: "Ronaldo Nazário",
    photoUrl: "https://img.a.transfermarkt.technology/portrait/header/3140-1489417571.jpg?lm=1",
    country: "Brasil",
    era: "1990s-2000s",
    description: "'Il Fenomeno', kombinasi kecepatan, kekuatan, dan penyelesaian akhir yang mematikan.",
  },
  {
    rank: 10,
    name: "Michel Platini",
    photoUrl: "https://img.a.transfermarkt.technology/portrait/big/88994-1592212447.jpg?lm=1",
    country: "Prancis",
    era: "1970s-1980s",
    description: "Gelandang serang produktif yang memenangkan 3 Ballon d'Or berturut-turut.",
  },
  {
    rank: 11,
    name: "Gerd Müller",
    photoUrl: "https://img.a.transfermarkt.technology/portrait/big/35604-1629028308.jpg?lm=1",
    country: "Jerman",
    era: "1960s-1970s",
    description: "Salah satu 'fox in the box' terhebat, pencetak gol ulung dengan insting tajam.",
  },
  {
    rank: 12,
    name: "Ferenc Puskás",
    photoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQThM05gkx_FK03LbxvqhfJznUUK5NyOMB1Lg&s",
    country: "Hungaria",
    era: "1940s-1960s",
    description: "Pemimpin 'Magical Magyars' dan terkenal dengan tendangan kaki kiri geledeknya.",
  },
  {
    rank: 13,
    name: "Paolo Maldini",
    photoUrl: "https://img.a.transfermarkt.technology/portrait/big/5803-1570438594.jpg?lm=1",
    country: "Italia",
    era: "1980s-2000s",
    description: "Bek ikonik yang melambangkan kesetiaan dan keunggulan dalam bertahan.",
  },
  {
    rank: 14,
    name: "George Best",
    photoUrl: "https://img.a.transfermarkt.technology/portrait/big/174986-1599483666.jpg?lm=1",
    country: "Irlandia Utara",
    era: "1960s-1970s",
    description: "Dribbler jenius dan selebriti sepak bola pertama, 'The Fifth Beatle'.",
  },
  {
    rank: 15,
    name: "Eusébio",
    photoUrl: "https://img.a.transfermarkt.technology/portrait/big/89230-1464768840.jpg?lm=1",
    country: "Portugal",
    era: "1960s-1970s",
    description: "Dikenal sebagai 'Black Panther' karena kecepatan dan kekuatan fisiknya.",
  },
];

export default function GreatestPlayers() {
  const [visibleCount, setVisibleCount] = useState(10);

  const showMorePlayers = () => {
    setVisibleCount(100);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Pemain Terbaik Sepanjang Masa</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-700">
            <tr>
              <th className="p-3 font-semibold text-center w-12">Peringkat</th>
              <th className="p-3 font-semibold" colSpan={2}>
                Pemain
              </th>
              <th className="p-3 font-semibold">Era</th>
              <th className="p-3 font-semibold">Deskripsi Singkat</th>
            </tr>
          </thead>
          <tbody>
            {legendaryPlayers.slice(0, visibleCount).map((player) => (
              <tr key={player.rank} className="border-b last:border-b-0">
                <td className="p-3 font-extrabold text-2xl text-center text-gray-700">{player.rank}</td>
                <td className="p-3 w-16">
                  <img src={player.photoUrl} alt={player.name} className="h-12 w-12 rounded-full object-cover" />
                </td>
                <td className="p-3">
                  <p className="font-bold text-base text-gray-800">{player.name}</p>
                  <p className="text-gray-500">{player.country}</p>
                </td>
                <td className="p-3 font-medium text-gray-600">{player.era}</td>
                <td className="p-3 text-gray-600 max-w-xs">{player.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visibleCount < legendaryPlayers.length && (
        <div className="mt-4 text-center">
          <button onClick={showMorePlayers} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors duration-200">
            <PlusCircle size={20} />
            <span>Lihat Selengkapnya</span>
          </button>
        </div>
      )}
    </div>
  );
}
