import "@/styles/globals.css";
import { Cantarell } from "next/font/google";

const cantarell = Cantarell({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "Personal Portfolio",
  description: "My résumé and projects"
};

import ChatWidget from "@/components/ChatWidget";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cantarell.className}>
      <body className="bg-base font-sans text-black">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}