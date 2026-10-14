import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { PwaRegister } from "@/components/common/PwaRegister";
import { InstallPwaBanner } from "@/components/common/InstallPwaBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vibesparfum.vercel.app"),
  title: "Vibes Parfum | Perfumería de Lujo & Decants de Autor en Bolivia",
  description:
    "Perfumería exclusiva en Bolivia. Fragancias nicho y de diseñador en frasco completo y decants originales de 5ml y 10ml. Envíos asegurados a los 9 departamentos. Pedidos WhatsApp 65947174 / 65867500.",
  authors: [{ name: "ToshiFPrime", url: "https://github.com/ToshiFPrime" }],
  creator: "ToshiFPrime",
  keywords: [
    "perfumes bolivia",
    "decants bolivia",
    "vibes parfum",
    "perfumeria la paz",
    "perfumes santa cruz",
    "perfumes originales cochabamba",
    "creed aventus bolivia",
    "baccarat rouge bolivia",
  ],
  openGraph: {
    title: "Vibes Parfum | Alta Perfumería & Decants Originales",
    description:
      "Explora las fragancias más deseadas del mundo en presentaciones completas o decants de 5ml y 10ml con envíos a toda Bolivia.",
    url: "https://vibesparfum.vercel.app",
    siteName: "Vibes Parfum",
    images: [
      {
        url: "/images/logo-clean.jpg",
        width: 800,
        height: 800,
        alt: "Vibes Parfum Logo",
      },
    ],
    locale: "es_BO",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Vibes Parfum",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-zinc-700 selection:text-white">
        <CartProvider>
          {/* PWA Service Worker Registration */}
          <PwaRegister />

          {/* Top Announcement Alert */}
          <AnnouncementBar />

          {/* Main Navigation Header */}
          <Header />

          {/* Dynamic Page Content */}
          <main className="flex-1">{children}</main>

          {/* Global Cart Slide-over Drawer & Checkout Modal */}
          <CartDrawer />

          {/* PWA Install Prompt Banner */}
          <InstallPwaBanner />

          {/* Footer with Store Seals & Credits */}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
