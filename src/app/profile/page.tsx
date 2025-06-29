import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import ProfileClient from "./ProfileClient";
import { getProfileData } from "../../../lib/data";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/api/auth/signin?callbackUrl=/profile");
  }

  const { favoriteTeams, favoritePlayers } = await getProfileData(session.user.id);

  const profileData = {
    user: session.user,
    favoriteTeams,
    favoritePlayers,
  };

  return (
    <main className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
      <ProfileClient data={profileData} />
    </main>
  );
}
