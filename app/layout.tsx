// app/layout.tsx (gunakan layout Anda yang sudah ada)

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { Providers } from "@/components/providers/Providers";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TOKO OXI - Rental & Printing",
  description: "Sewa alat dan jasa printing terpercaya",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <div className="min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-grow pt-20"> 
            {children}
          </main>
          
          <Footer />
        </Providers>
        </div>
      </body>
    </html>
  );
}