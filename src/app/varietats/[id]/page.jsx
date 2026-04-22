import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteVarietatButton from "@/components/DeleteVarietatButton";
import { getVarietatById } from "@/services/bacallaService";

export async function generateMetadata({ params }) {
  const { id } = await params;

  return {
    title: `Detall ${id} | BacaLab`,
  };
}

export default async function VarietatDetailPage({ params }) {
  const { id } = await params;
  let item;

  try {
    // El backend marca com 404 quan no existeix la varietat demanada.
    item = await getVarietatById(id);
  } catch (error) {
    if (error.status === 404) {
      notFound();
    }

    return (
      <section className="detail-panel">
        <h1>Error carregant la varietat</h1>
        <p>{error.message}</p>
        <Link href="/" className="button-link button-link--solid">
          Tornar al llistat
        </Link>
      </section>
    );
  }

  return (
    <section className="detail-panel">
      <p className="eyebrow">Fitxa detallada</p>
      <h1>{item.nombre}</h1>
      <p className="detail-description">{item.tipo}</p>

      <div className="detail-grid">
        <div className="detail-block">
          <h2>Raza</h2>
          <p>{item.raza}</p>
        </div>

        <div className="detail-block">
          <img src="item.foto" alt="foto" />
        </div>

        <div className="detail-block">
          <h2>Identificador</h2>
          <p>{item.id}</p>
        </div>
      </div>

      <div className="hero-actions">
        <Link href="/" className="button-link button-link--solid">
          Tornar al llistat
        </Link>
        <Link href={`/varietats/${item.id}/editar`} className="button-link button-link--ghost">
          Editar fitxa
        </Link>
        <DeleteVarietatButton varietatId={item.id} />
        <Link href="/nou" className="button-link button-link--ghost">
          Afegir una altra varietat
        </Link>
      </div>
    </section>
  );
}