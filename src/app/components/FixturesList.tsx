"use client";

import { useEffect, useState } from "react";

interface Team {
  id: number;
  name: string;
  logo: string;
}
interface Goals {
  home: number | null;
  away: number | null;
}
interface FixtureStatus {
  long: string;
  short: string;
  elapsed: number | null;
}
interface FixtureInfo {
  id: number;
  date: string;
  venue: { name: string; city: string };
  status: FixtureStatus;
}
interface Fixture {
  fixture: FixtureInfo;
  teams: { home: Team; away: Team };
  goals: Goals;
}

type GroupedFixtures = { [date: string]: Fixture[] };

const StatusBadge = ({ status, date }: { status: FixtureStatus; date: string }) => {
  const kickOffTime = new Date(date).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  let text = kickOffTime,
    bgColor = "bg-gray-500",
    textColor = "text-white";
  switch (status.short) {
    case "FT":
      text = "FT";
      bgColor = "bg-gray-800";
      break;
    case "HT":
      text = "HT";
      bgColor = "bg-yellow-500";
      textColor = "text-black";
      break;
    case "NS":
      text = kickOffTime;
      bgColor = "bg-blue-600";
      break;
    case "PST":
      text = "Ditunda";
      bgColor = "bg-red-500";
      break;
    case "CANC":
      text = "Dibatalkan";
      bgColor = "bg-red-700";
      break;
    default:
      if (status.elapsed) {
        text = `${status.elapsed}'`;
        bgColor = "bg-green-600";
      }
      break;
  }
  return <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded ${bgColor} ${textColor}`}>{text}</span>;
};

export default function FixturesList() {
  const [groupedFixtures, setGroupedFixtures] = useState<GroupedFixtures>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndGroupFixtures = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/matches");
        if (!res.ok) throw new Error("Gagal mengambil data dari server");

        const data: Fixture[] = await res.json();
        const grouped = data.reduce<GroupedFixtures>((acc, fixture) => {
          const dateKey = new Date(fixture.fixture.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push(fixture);
          return acc;
        }, {});
        setGroupedFixtures(grouped);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui");
      } finally {
        setLoading(false);
      }
    };
    fetchAndGroupFixtures();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-700 mb-4">Jadwal & Hasil Pertandingan</h2>

      {loading && <p className="text-center py-10 text-lg">Memuat data pertandingan...</p>}
      {error && <p className="text-center py-10 text-red-600 bg-red-100 p-4 rounded-md">{error}</p>}

      {!loading && !error && Object.keys(groupedFixtures).length === 0 && <p className="text-center text-gray-600 py-10">Tidak ada data pertandingan untuk ditampilkan.</p>}

      {Object.entries(groupedFixtures).map(([date, fixturesOnDate]) => (
        <div key={date} className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-blue-600">{date}</h3>
          <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-hide">
            {fixturesOnDate.map((item) => (
              <div key={item.fixture.id} className="relative flex-shrink-0 w-80 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border">
                <StatusBadge status={item.fixture.status} date={item.fixture.date} />
                <div className="p-4 pt-8">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center w-2/5 text-center">
                      <img src={item.teams.home.logo} alt={item.teams.home.name} className="h-14 w-14 object-contain mb-2" />
                      <p className="font-semibold text-sm leading-tight">{item.teams.home.name}</p>
                    </div>
                    <div className="text-3xl font-bold font-mono text-gray-800 w-1/5 text-center">
                      {item.fixture.status.short === "NS" || item.fixture.status.short === "PST" ? (
                        <span className="text-2xl">vs</span>
                      ) : (
                        <>
                          <span>{item.goals.home ?? "-"}</span>
                          <span className="mx-1">:</span>
                          <span>{item.goals.away ?? "-"}</span>
                        </>
                      )}
                    </div>
                    <div className="flex flex-col items-center w-2/5 text-center">
                      <img src={item.teams.away.logo} alt={item.teams.away.name} className="h-14 w-14 object-contain mb-2" />
                      <p className="font-semibold text-sm leading-tight">{item.teams.away.name}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-2 text-xs text-gray-600 text-center border-t truncate">{item.fixture.venue.name}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
