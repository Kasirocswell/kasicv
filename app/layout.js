import "./globals.css";
import { Inter } from "next/font/google";
import { Patrick_Hand } from "next/font/google";
import { VT323 } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const pat = Patrick_Hand({ subsets: ["latin"], weight: "400" });
const vt = VT323({ subsets: ["latin"], weight: "400" });

export const metadata = {
  title: "3D Portfolio",
  description: "Kasi Reeves Software Engineer Portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${vt.className}`}>{children}</body>
    </html>
  );
}
