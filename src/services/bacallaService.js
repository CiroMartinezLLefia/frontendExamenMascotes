import { API_PATHS, buildApiUrl } from "./urls";

function toResourceId(id) {
  const normalizedId = String(id ?? "").trim();

  if (!normalizedId) {
    throw new Error("Cal un identificador valid de varietat.");
  }

  return normalizedId;
}

function getVarietatPath(id) {
  return `${API_PATHS.mascotes}/${encodeURIComponent(toResourceId(id))}`;
}

function normalizeVarietat(item) {
  return {
    id: String(item?.id ?? ""),
    nombre: item?.nombre ?? "Sense nom",
    tipo: item?.nombre ?? "Sense tipo",
    raza: item?.nombre ?? "Sense raza",
    foto: item?.nombre ?? "Sense foto",
  };
}

function extractList(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.dades)) {
    return payload.dades;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}

function extractItem(payload) {
  if (!payload || Array.isArray(payload)) {
    return payload;
  }

  // Alguns backends retornen l'element dins d'un objecte contenidor.
  return payload.dada ?? payload.data ?? payload.item ?? payload;
}

async function parseJsonSafely(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function createHttpError(response, payload) {
  const message =
    payload?.message ?? payload?.error ?? `Error HTTP ${response.status}`;
  const error = new Error(message);

  error.status = response.status;
  error.payload = payload;

  return error;
}

export async function getVarietats() {
  // Fem no-store per veure al moment les altes noves que arriben del backend.
  const response = await fetch(buildApiUrl(API_PATHS.mascotes), {
    cache: "no-store",
  });
  const payload = await parseJsonSafely(response);

  if (!response.ok) {
    throw createHttpError(response, payload);
  }

  return extractList(payload)
    .map(normalizeVarietat)
    .filter((item) => item.id.length > 0);
}

export async function getVarietatById(id) {
  const response = await fetch(buildApiUrl(getVarietatPath(id)), {
    cache: "no-store",
  });
  const payload = await parseJsonSafely(response);

  if (!response.ok) {
    throw createHttpError(response, payload);
  }

  return normalizeVarietat(extractItem(payload));
}

async function sendUpdateRequest(path, body, method) {
  const response = await fetch(buildApiUrl(path), {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return {
    response,
    payload: await parseJsonSafely(response),
  };
}

export async function updateVarietat(id, updatedVarietat) {
  const path = getVarietatPath(id);
  let attempt = await sendUpdateRequest(path, updatedVarietat, "PUT");

  // Alguns backends exposen PATCH en lloc de PUT per actualitzacions.
  if (!attempt.response.ok && [405, 501].includes(attempt.response.status)) {
    attempt = await sendUpdateRequest(path, updatedVarietat, "PATCH");
  }

  if (!attempt.response.ok) {
    throw createHttpError(attempt.response, attempt.payload);
  }

  const maybeItem = extractItem(attempt.payload);

  return normalizeVarietat(
    maybeItem ?? {
      ...updatedVarietat,
      id: toResourceId(id),
    }
  );
}

export async function deleteVarietat(id) {
  const response = await fetch(buildApiUrl(getVarietatPath(id)), {
    method: "DELETE",
  });
  const payload = await parseJsonSafely(response);

  if (!response.ok) {
    throw createHttpError(response, payload);
  }

  return payload ?? { deleted: true, id: toResourceId(id) };
}

export async function createVarietat(newVarietat) {
  const response = await fetch(buildApiUrl(API_PATHS.mascotesvarietats), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newVarietat),
  });
  const payload = await parseJsonSafely(response);

  if (!response.ok) {
    throw createHttpError(response, payload);
  }

  return normalizeVarietat(extractItem(payload));
}