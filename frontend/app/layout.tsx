import "@/styles/globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

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