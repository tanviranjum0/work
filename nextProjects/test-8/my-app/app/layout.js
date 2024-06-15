import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Watch Ecommerce",
  description: "Watch store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0e0e0c]`}>
        <nav>
          <Navbar />
        </nav>
        {children}
      </body>
    </html>
  );
}
