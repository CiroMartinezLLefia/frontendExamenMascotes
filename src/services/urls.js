// Centralitza l'arrel de l'API i els paths per evitar URLs en dur al codi.
export const API_PATHS = {
  bacalla: "/api/bacalla",
};

export function getApiBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error(
      "Falta NEXT_PUBLIC_API_BASE_URL. Configura-la a .env.local o al panell de Vercel."
    );
  }

  return baseUrl.replace(/\/+$/, "");
}

export function buildApiUrl(path) {
  return `${getApiBaseUrl()}${path}`;
}
