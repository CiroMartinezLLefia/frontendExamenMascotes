import NewVarietatForm from "@/components/NewVarietatForm";

export const metadata = {
  title: "Nova varietat | BacaLab",
};

export default function NewVarietatPage() {
  return (
    <section>
      <div className="hero hero--compact">
        <p className="eyebrow">Alta de producte</p>
        <h1>Afegir una nova varietat de bacalla</h1>
        <p>
          Omple el formulari i envia-lo amb fetch cap al endpoint POST de la API.
        </p>
      </div>

      <NewVarietatForm />
    </section>
  );
}