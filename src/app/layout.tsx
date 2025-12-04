import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "@/components/providers/ThirdwebProvider";
import { AppProvider } from "@/context/AppContext";
import { MainNavigation } from "@/components/navigation/MainNavigation";
import { ErrorSuppression } from "@/components/providers/ErrorSuppression";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Water Pipeline Governance",
  description: "Decentralized governance platform for water pipeline management",
  keywords: ["blockchain", "governance", "water", "pipeline", "web3"],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: "Water Pipeline Governance",
    description: "Decentralized governance platform for water pipeline management",
    type: "website",
  },
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
      <head>
        {/* Early error suppression script - runs before React initializes */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;
                
                // Suppress Talisman extension errors immediately
                const suppressTalismanErrors = () => {
                  const originalError = console.error;
                  const originalWarn = console.warn;
                  
                  console.error = function(...args) {
                    const msg = args.join(' ').toLowerCase();
                    if (msg.includes('talisman') || msg.includes('fijngjgcjhjmmpcmkeiomlglpeiijkld') || msg.includes('extension has not been configured')) {
                      return;
                    }
                    originalError.apply(console, args);
                  };
                  
                  console.warn = function(...args) {
                    const msg = args.join(' ').toLowerCase();
                    if (msg.includes('talisman') || msg.includes('fijngjgcjhjmmpcmkeiomlglpeiijkld')) {
                      return;
                    }
                    originalWarn.apply(console, args);
                  };
                  
                  // Suppress unhandled errors
                  window.addEventListener('error', function(e) {
                    const msg = (e.message || '').toLowerCase();
                    const source = (e.filename || '').toLowerCase();
                    if (msg.includes('talisman') || source.includes('fijngjgcjhjmmpcmkeiomlglpeiijkld') || msg.includes('extension has not been configured')) {
                      e.preventDefault();
                      return false;
                    }
                  }, true);
                  
                  // Suppress unhandled promise rejections
                  window.addEventListener('unhandledrejection', function(e) {
                    const msg = String(e.reason || '').toLowerCase();
                    if (msg.includes('talisman') || msg.includes('fijngjgcjhjmmpcmkeiomlglpeiijkld')) {
                      e.preventDefault();
                    }
                  }, true);
                };
                
                // Run immediately
                suppressTalismanErrors();
                
                // Also run when DOM is ready
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', suppressTalismanErrors);
                } else {
                  suppressTalismanErrors();
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} antialiased bg-white dark:bg-black min-h-screen`}
      >
        <ErrorSuppression />
        <ThirdwebProvider>
          <NotificationProvider>
            <div className="min-h-screen flex flex-col">
              <MainNavigation />
              <main className="flex-1 w-full flex flex-col items-center">
                {children}
              </main>
            </div>
          </NotificationProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
