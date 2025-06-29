"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { UserCircle, SignOut } from "phosphor-react";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (status === "loading") {
    return <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />;
  }

  if (status === "unauthenticated") {
    return (
      <button onClick={() => signIn("github")} className="bg-gray-800 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-700">
        Login
      </button>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="relative">
        <button onClick={() => setIsOpen(!isOpen)} className="">
          <Image
            src={session.user?.image || "/default-avatar.png"}
            alt={session.user?.name || "User Avatar"}
            width={40}
            height={40}
            className="rounded-full border border-gray-300 hover:scale-110 hover:border-blue-400 hover:shadow-lg transition-all duration-400 ease-in-out ring-1 ring-white dark:ring-gray-700"
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center rounded-md gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:shadow-md hover:scale-102 ease-in-out duration-300 transition-all">
              <UserCircle size={18} />
              Profile
            </Link>
            <button onClick={() => signOut()} className="w-full flex items-center rounded-md gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-gray-100 hover:shadow-md hover:scale-102 ease-in-out duration-300 transition-all">
              <SignOut size={18} />
              Logout
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
}
