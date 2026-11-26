import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOAH — Full-stack developer",
  description: "Portfolio of Noah, a full-stack developer crafting digital products with Next.js and NestJS.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
