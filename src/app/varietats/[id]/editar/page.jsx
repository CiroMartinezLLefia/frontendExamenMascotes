import Link from "next/link";
import { notFound } from "next/navigation";
import NewVarietatForm from "@/components/NewVarietatForm";
import { getVarietatById } from "@/services/bacallaService";

export async function generateMetadata({ params }) {
  const { id } = await params;

  return {
    title: `Editar ${id} | BacaLab`,
  };
}

export default async function EditVarietatPage({ params }) {
  const { id } = await params;
  let item;

  try {
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
    <section>
      <div className="hero hero--compact">
        <p className="eyebrow">Edicio de producte</p>
        <h1>Editar varietat de bacalla</h1>
        <p>Actualitza la fitxa i envia-la al backend amb el metode d actualitzacio.</p>
      </div>

      <NewVarietatForm mode="edit" varietatId={item.id} initialData={item} />

      <div className="hero-actions">
        <Link href={`/varietats/${item.id}`} className="button-link button-link--ghost">
          Tornar al detall
        </Link>
      </div>
    </section>
  );
}
