/**
 * ============================================================
 * UTILIDADES DE API — Cliente HTTP del Frontend
 * ============================================================
 *
 * Este archivo centraliza TODAS las llamadas HTTP al backend.
 * Cada función corresponde a un método HTTP (GET, POST, PUT, DELETE).
 *
 * ¿POR QUÉ CENTRALIZAR?
 *   1. Evita repetir la URL base en cada componente
 *   2. Maneja el formato de respuesta en un solo lugar
 *   3. Facilita extender (ej: agregar headers comunes)
 *
 * FORMATO DE RESPUESTA DEL BACKEND:
 *   El backend SIEMPRE retorna: { statusCode, message, data }
 *   Estas funciones extraen solo el campo `data` (json.data)
 *   para que los componentes trabajen directamente con los datos.
 *
 * MANEJO DE ERRORES:
 *   Si el backend retorna error (4xx, 5xx), el helper extrae el `message`
 *   del JSON `{ statusCode, message, error, ... }` y lanza un Error con
 *   ese mensaje legible para mostrarlo en la UI.
 *
 * VARIABLE DE ENTORNO:
 *   NEXT_PUBLIC_API_URL = http://localhost:3001  (definida en docker-compose.yml)
 */

// URL base del backend (sin /api/v1, se agrega en cada función)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/** Extrae mensaje legible del error del backend */
async function extractErrorMessage(res: Response): Promise<string> {
  try {
    const json = await res.json();
    if (Array.isArray(json.message)) return json.message.join(', ');
    return json.message || `Error ${res.status}`;
  } catch {
    return `Error ${res.status}`;
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}/api/v1${path}`);
  if (!res.ok) throw new Error(await extractErrorMessage(res));
  const json = await res.json();
  return json.data as T;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}/api/v1${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await extractErrorMessage(res));
  const json = await res.json();
  return json.data as T;
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}/api/v1${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await extractErrorMessage(res));
  const json = await res.json();
  return json.data as T;
}

export async function apiDelete<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}/api/v1${path}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await extractErrorMessage(res));
  const json = await res.json();
  return json.data as T;
}
