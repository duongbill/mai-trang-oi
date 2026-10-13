import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cuối tuần này đi trốn deadline nhé? 🌸",
  description: "Một chút bất ngờ nhỏ cho cuối tuần ✨",
  openGraph: {
    title: "Cuối tuần này đi trốn deadline nhé? 🌸",
    description: "Bấm vào để lên kèo nào~",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
