import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Tanvir Portfolio",
  description: "This is a portfolio website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={` overflow-x-hidden ${geistSans.variable} ${geistMono.variable} antialiased bg-[#111] text-[rgb(248,248,255)]`}
      >
        <Sidebar />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
