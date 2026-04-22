import Link from "next/link";

export default function NotFound() {
  return (
    <section className="detail-panel">
      <p className="eyebrow">404</p>
      <h1>Varietat no trobada</h1>
      <p>
        L identificador que has demanat no existeix al backend o ja no esta
        disponible.
      </p>

      <Link href="/" className="button-link button-link--solid">
        Tornar al llistat
      </Link>
    </section>
  );
}