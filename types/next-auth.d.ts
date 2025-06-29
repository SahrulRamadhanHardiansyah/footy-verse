import NextAuth from "next-auth";

// Augment (perluas) tipe bawaan dari NextAuth
declare module "next-auth" {
  /**
   * Mengembalikan nilai saat menggunakan `useSession`, `getSession` atau `getServerSession`
   */
  interface Session {
    user: {
      /** Properti `id` sekarang ada di sini */
      id: string;
    } & DefaultSession["user"]; // & gabungkan dengan tipe user default (name, email, image)
  }
}
