import "@/styles/globals.css";
import "katex/dist/katex.min.css";
import React from 'react';
import { GeistMono } from 'geist/font/mono';

export const metadata = {
  title: "Praneel Seth",
  description: "My blog and projects",
  icons: {
    icon: "/assets/icon.jpg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistMono.className}>
      <body className="bg-base text-black">
        {children}
      </body>
    </html>
  );
}
