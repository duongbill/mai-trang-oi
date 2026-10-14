import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Mai Trang ơi, đi đâu? 🌸",
  description: "Buổi hẹn đầu tiên dành riêng cho Mai Trang ✨ 15/10/2026",
  openGraph: {
    title: "Mai Trang ơi, đi đâu? 🌸",
    description: "Bấm vào để lên lịch hẹn cùng Dương nào~",
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
