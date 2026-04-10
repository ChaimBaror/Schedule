import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from '@/components/SessionProvider';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/utils/authOptions";

export const metadata: Metadata = {
  title: "Timetable",
  description: "Hebrew Jewish Prayer Timetable",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="he">
      <SessionProvider session={session}>
        <body>{children}</body>
      </SessionProvider>
    </html>
  );
}
