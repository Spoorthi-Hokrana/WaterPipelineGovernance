import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "@/components/providers/ThirdwebProvider";
import { AppProvider } from "@/context/AppContext";
import { MainNavigation } from "@/components/navigation/MainNavigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Water Pipeline Governance",
  description: "Decentralized governance platform for water pipeline management and decision-making",
  keywords: ["blockchain", "governance", "water", "pipeline", "decentralized", "web3"],
};

function NotificationProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      {children}
    </AppProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 min-h-screen`}
      >
        <ThirdwebProvider>
          <NotificationProvider>
            <div className="min-h-screen flex flex-col">
              <MainNavigation />
              <main className="flex-1">
                {children}
              </main>
            </div>
          </NotificationProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
