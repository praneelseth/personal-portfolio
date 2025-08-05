import "@/styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Personal Portfolio",
  description: "My résumé and projects"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-base font-sans text-black">
        <nav className="fixed top-0 left-0 w-full z-10 bg-base/80 border-b border-gray-200 backdrop-blur-sm">
          <div className="mx-auto max-w-[90vw] lg:max-w-[33vw] flex justify-between items-center px-4 py-3">
            <div className="flex gap-6">
              <a href="#intro" className="text-sm font-medium text-gray-800 hover:text-black transition">Intro</a>
              <a href="#experience" className="text-sm font-medium text-gray-800 hover:text-black transition">Experience</a>
              <a href="#projects" className="text-sm font-medium text-gray-800 hover:text-black transition">Projects</a>
              <a href="#achievements" className="text-sm font-medium text-gray-800 hover:text-black transition">Achievements</a>
              <a href="#contact" className="text-sm font-medium text-gray-800 hover:text-black transition">Contact</a>
            </div>
            <a
              href="/resume.pdf"
              download
              className="ml-6 border border-black px-3 py-1 rounded font-semibold text-sm hover:bg-black hover:text-white transition"
            >
              Export as résumé
            </a>
          </div>
        </nav>
        <div className="pt-20">{children}</div>
      </body>
    </html>
  );
}