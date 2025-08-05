import "@/styles/globals.css";
import { Cantarell } from "next/font/google";

const cantarell = Cantarell({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "Personal Portfolio",
  description: "My résumé and projects"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.className}>
      <body className="bg-base font-sans text-black">
        {children}
      </body>
    </html>
  );
}