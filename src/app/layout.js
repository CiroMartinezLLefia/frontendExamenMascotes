import Link from "next/link";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const headingFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata = {
  title: "BacaLab Frontend",
  description: "Cataleg de varietats i presentacions de bacalla",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ca" className={`${bodyFont.variable} ${headingFont.variable}`}>
      <body>
        <div className="background-shape background-shape--one" aria-hidden="true" />
        <div className="background-shape background-shape--two" aria-hidden="true" />

        <div className="site-shell">
          {/* Navegacio global per canviar entre consulta i alta de dades. */}
          <header className="top-nav">
            <Link href="/" className="brand">
              BacaLab
            </Link>

            <nav className="nav-links" aria-label="Navegacio principal">
              <Link href="/">Varietats</Link>
              <Link href="/nou">Afegir nova</Link>
            </nav>
          </header>

          <main className="page-wrap">{children}</main>
        </div>
      </body>
    </html>
  );
}
