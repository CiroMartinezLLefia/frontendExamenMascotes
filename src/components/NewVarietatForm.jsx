"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createVarietat, updateVarietat } from "@/services/bacallaService";

const initialForm = {
  nombre: "",
  tipo: "",
  raza: "",
  foto: "",
};

function normalizeFormData(data) {
  return {
    nombre: data?.nombre ?? "",
    tipo: data?.tipo ?? "",
    raza: data?.raza ?? "",
    foto: data?.foto ?? "",
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
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={onChange}
            placeholder="Ex: Jonathan"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="raza">Raza</label>
          <input
            id="raza"
            name="raza"
            value={formData.raza}
            onChange={onChange}
            placeholder="Ex: Perraco"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="tipo">Tipo</label>
          <input
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={onChange}
            placeholder="Ex: gato, perro, gato, pollo..."
            required
          />
        </div>

        <div className="field field--full">
          <label htmlFor="descripcio">FotoURL</label>
          <textarea
            id="descripcio"
            name="descripcio"
            value={formData.foto}
            onChange={onChange}
            rows={4}
            placeholder="URL"
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
                : "Crear mascota"}
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