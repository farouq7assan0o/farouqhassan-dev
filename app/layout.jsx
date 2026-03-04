import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DevToolbar from "./components/DevToolbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Farouq Hassan",
  description: "Cybersecurity Engineer Portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

        <DevToolbar />
      </body>
    </html>
  );
}