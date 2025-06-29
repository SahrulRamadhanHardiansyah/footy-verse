import KlubDetailClient from "./KlubDetailClient";

async function getClubDetails(teamId: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/klub-detail?id=${teamId}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil detail klub");
  }

  return response.json();
}

export default async function KlubDetailPage({ params }: { params: { id: string } }) {
  const details = await getClubDetails(params.id);

  return (
    <main className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <KlubDetailClient details={details} />
      </div>
    </main>
  );
}
