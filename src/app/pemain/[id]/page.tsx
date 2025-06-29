import PemainDetailClient from "./PemainDetailClient";

async function getPlayerDetails(playerId: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/pemain-detail?id=${playerId}`, {
    next: { revalidate: 86400 }, // Cache data selama 1 hari
  });
  if (!response.ok) throw new Error("Gagal mengambil detail pemain");
  return response.json();
}

export default async function PemainDetailPage({ params }: { params: { id: string } }) {
  const details = await getPlayerDetails(params.id);

  return (
    <main className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <PemainDetailClient details={details} />
      </div>
    </main>
  );
}
