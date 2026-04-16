import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { CartProvider } from "@/lib/CartContext";
import { WishlistProvider } from "@/lib/WishlistContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Flipkart — India's Best Online Shopping Marketplace",
  description: "Shop online for Electronics, Fashion, Mobiles, Home & Kitchen, Sports, Books and more. Get great deals and fast delivery.",
  keywords: "flipkart, online shopping, electronics, fashion, mobile phones, india",
  openGraph: {
    title: "Flipkart — India's Best Online Shopping Marketplace",
    description: "Shop online for Electronics, Fashion, Mobiles, Home & Kitchen, Sports, Books and more.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Suspense fallback={null}>
                <Navbar />
              </Suspense>
              <main className="pb-20 md:pb-0">{children}</main>
              <Footer />
              <BottomNav />
              <Toaster
                position="bottom-center"
                toastOptions={{
                  duration: 3000,
                  style: { fontFamily: "Inter, sans-serif", fontSize: "14px" },
                  success: { style: { background: "#388e3c", color: "#fff" } },
                  error: { style: { background: "#c62828", color: "#fff" } },
                }}
              />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
