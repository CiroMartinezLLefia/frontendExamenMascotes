import Link from "next/link";
import { getVarietats } from "@/services/bacallaService";

export default async function HomePage() {
  let varietats = [];
  let errorText = "";

  try {
    // La pagina principal consumeix el llistat del backend en temps real.
    varietats = await getVarietats();
  } catch (error) {
    errorText = error.message;
  }

  return (
    <section>
      <div className="hero">
        <p className="eyebrow">Cataleg de bacalla</p>
        <h1>Varietats i presentacions comercials</h1>
        <p>
          Consulta llistat, detall i afegeix noves fitxes connectant amb la teva
          API Express.
        </p>

        <div className="hero-actions">
          <Link href="/nou" className="button-link button-link--solid">
            Afegir nova varietat
          </Link>
        </div>
      </div>

      {errorText && (
        <div className="error-box" role="alert">
          <strong>No s ha pogut carregar el llistat.</strong>
          <p>{errorText}</p>
        </div>
      )}

      {!errorText && (
        <div className="cards-grid">
          {varietats.map((item) => (
            <article className="card" key={item.id}>
              <span className="pill">{item.tipus}</span>
              <h2>{item.nom}</h2>
              <p>{item.descripcio}</p>
              <footer>
                <span>{item.origen}</span>
                <Link href={`/varietats/${item.id}`}>Veure detall</Link>
              </footer>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
