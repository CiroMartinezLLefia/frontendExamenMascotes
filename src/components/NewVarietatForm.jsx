"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createVarietat, updateVarietat } from "@/services/bacallaService";

const initialForm = {
  nom: "",
  origen: "",
  tipus: "",
  descripcio: "",
};

function normalizeFormData(data) {
  return {
    nom: data?.nom ?? "",
    origen: data?.origen ?? "",
    tipus: data?.tipus ?? "",
    descripcio: data?.descripcio ?? "",
  };
}

export default function NewVarietatForm({
  mode = "create",
  varietatId = "",
  initialData = initialForm,
}) {
  const isEditMode = mode === "edit";
  const [formData, setFormData] = useState(() => normalizeFormData(initialData));
  const [status, setStatus] = useState({
    type: "idle",
    message: "",
    resultId: "",
  });

  useEffect(() => {
    setFormData(normalizeFormData(initialData));
    setStatus({ type: "idle", message: "", resultId: "" });
  }, [initialData]);

  function onChange(event) {
    const { name, value } = event.target;

    // Guardem l'estat local per mantenir el formulari 100% interactiu al navegador.
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function onSubmit(event) {
    event.preventDefault();

    if (isEditMode && !String(varietatId).trim()) {
      setStatus({
        type: "error",
        message: "No s ha trobat l identificador de la varietat a editar.",
        resultId: "",
      });
      return;
    }

    setStatus({
      type: "loading",
      message: isEditMode ? "Actualitzant dades..." : "Enviant dades...",
      resultId: "",
    });

    try {
      const saved = isEditMode
        ? await updateVarietat(varietatId, formData)
        : await createVarietat(formData);

      setStatus({
        type: "success",
        message: isEditMode
          ? `Varietat actualitzada correctament: ${saved.nom}`
          : `Varietat creada correctament: ${saved.nom}`,
        resultId: saved.id,
      });

      if (isEditMode) {
        setFormData(normalizeFormData(saved));
      } else {
        setFormData(initialForm);
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message,
        resultId: "",
      });
    }
  }

  return (
    <section className="form-panel">
      <form className="form-grid" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="nom">Nom</label>
          <input
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={onChange}
            placeholder="Ex: Bacalla d'Islàndia"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="origen">Origen o regio</label>
          <input
            id="origen"
            name="origen"
            value={formData.origen}
            onChange={onChange}
            placeholder="Ex: Atlantica nord"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="tipus">Tipus de presentacio</label>
          <input
            id="tipus"
            name="tipus"
            value={formData.tipus}
            onChange={onChange}
            placeholder="Ex: salat, esqueixat, fresc"
            required
          />
        </div>

        <div className="field field--full">
          <label htmlFor="descripcio">Descripcio curta</label>
          <textarea
            id="descripcio"
            name="descripcio"
            value={formData.descripcio}
            onChange={onChange}
            rows={4}
            placeholder="Una o dues frases sobre el producte."
            required
          />
        </div>

        <div className="action-row">
          <button type="submit" className="submit-btn" disabled={status.type === "loading"}>
            {status.type === "loading"
              ? isEditMode
                ? "Actualitzant..."
                : "Enviant..."
              : isEditMode
                ? "Guardar canvis"
                : "Crear varietat"}
          </button>

          <button
            type="button"
            className="secondary-btn"
            onClick={() => {
              setFormData(isEditMode ? normalizeFormData(initialData) : initialForm);
              setStatus({ type: "idle", message: "", resultId: "" });
            }}
          >
            Netejar
          </button>
        </div>
      </form>

      {status.type !== "idle" && (
        <div className={`feedback feedback--${status.type}`} role="status">
          <p>{status.message}</p>
          {status.type === "success" && status.resultId && (
            <Link href={`/varietats/${status.resultId}`}>
              {isEditMode ? "Veure fitxa actualitzada" : "Veure fitxa creada"}
            </Link>
          )}
        </div>
      )}
    </section>
  );
}