"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteVarietat } from "@/services/bacallaService";

export default function DeleteVarietatButton({ varietatId }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorText, setErrorText] = useState("");

  async function onDeleteClick() {
    const confirmed = window.confirm(
      "Vols eliminar aquesta varietat? Aquesta accio no es pot desfer."
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setErrorText("");

    try {
      await deleteVarietat(varietatId);
      router.push("/");
      router.refresh();
    } catch (error) {
      setErrorText(error.message ?? "No s ha pogut eliminar la varietat.");
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="button-link button-link-button button-link--danger"
        disabled={isDeleting}
        onClick={onDeleteClick}
      >
        {isDeleting ? "Eliminant..." : "Eliminar varietat"}
      </button>

      {errorText && (
        <p className="inline-error" role="alert">
          {errorText}
        </p>
      )}
    </>
  );
}
