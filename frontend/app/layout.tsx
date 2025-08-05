import "@/styles/globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Personal Portfolio",
  description: "My résumé and projects"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-base font-sans text-black">
        <header className="mx-auto max-w-[90vw] lg:max-w-[48rem] xl:max-w-4xl px-4 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-2xl font-bold tracking-tight text-gray-900">Paul Seth</div>
          <nav className="flex gap-6 items-center">
            <Link href="/" className="text-sm font-medium text-gray-800 hover:text-black transition">Home</Link>
            <Link href="/experience" className="text-sm font-medium text-gray-800 hover:text-black transition">Experience</Link>
            <Link href="/projects" className="text-sm font-medium text-gray-800 hover:text-black transition">Projects</Link>
            <Link href="/achievements" className="text-sm font-medium text-gray-800 hover:text-black transition">Achievements</Link>
            <Link href="/contact" className="text-sm font-medium text-gray-800 hover:text-black transition">Contact</Link>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 border border-black px-3 py-1 rounded font-semibold text-sm hover:bg-black hover:text-white transition"
            >
              Résumé
            </a>
          </nav>
        </header>
        <div>{children}</div>
      </body>
    </html>
  );
}