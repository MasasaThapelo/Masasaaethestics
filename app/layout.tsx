import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Masasa Aesthetics - Custom Phone Cases",
  description: "Shop beautiful custom phone cases with personalized designs from Masasa Aesthetics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

