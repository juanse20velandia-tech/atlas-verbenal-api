import { categories, category } from './categories.mjs';
import { validRecord } from './record.mjs';

const json = (value, status = 200) => Response.json(value, {
  status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
});
const error = (status, message) => json({ message }, status);
const missing = () => error(404, 'Registro no encontrado.');
const conflict = () => error(409, 'El registro cambió. Vuelve a cargarlo.');
const unauthorized = () => error(401, 'Se requiere una clave de edición válida.');

async function sameSecret(provided, expected) {
  if (!expected || !provided || provided.length > 512) return false;
  const hash = async text => new Uint8Array(await crypto.subtle.digest(
    'SHA-256', new TextEncoder().encode(text)));
  const [a, b] = await Promise.all([hash(provided), hash(expected)]);
  return a.reduce((delta, byte, index) => delta | (byte ^ b[index]), 0) === 0;
}

async function body(request, type) {
  const reader = request.body?.getReader();
  if (!reader) return;
  let raw = '';
  let bytes = 0;
  const decoder = new TextDecoder();
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.length;
      if (bytes > 100_000) { await reader.cancel(); return; }
      raw += decoder.decode(chunk.value, { stream: true });
    }
    return validRecord(JSON.parse(raw + decoder.decode()), type);
  } catch {
    return;
  }
}

export async function route(request, repo, secret) {
  const { pathname } = new URL(request.url);
  const { method } = request;
  if (pathname === '/api/health' && method === 'GET') return json({ status: 'ok' });
  if (pathname === '/api/categories' && method === 'GET') return json(categories);
  if (pathname === '/api/editor' && method === 'POST') {
    return await sameSecret(request.headers.get('Authorization'), secret)
      ? json({ editor: true }) : unauthorized();
  }
  const match = /^\/api\/records\/([a-z]+)(?:\/([a-z0-9-]{1,80}))?$/.exec(pathname);
  const type = match && category(match[1]);
  if (!type) return error(404, 'Ruta o categoría desconocida.');
  const id = match[2];
  if (method === 'GET') {
    if (!id) return json(await repo.list(type.id));
    const item = await repo.get(type.id, id);
    return item ? json(item) : missing();
  }
  if (!(id ? ['PUT', 'DELETE'] : ['POST']).includes(method)) {
    return error(405, 'Método no disponible en esta ruta.');
  }
  if (!await sameSecret(request.headers.get('Authorization'), secret)) return unauthorized();
  const revision = Number(request.headers.get('If-Match'));
  if (id && (!Number.isSafeInteger(revision) || revision < 1)) {
    return error(428, 'Envía la revisión vigente en If-Match.');
  }
  if (method === 'DELETE') {
    return await repo.remove(type.id, id, revision) ? new Response(null, { status: 204 })
      : await repo.get(type.id, id) ? conflict() : missing();
  }
  const value = await body(request, type);
  if (!value) return error(422, 'Completa la ficha y revisa el enlace y el GeoJSON.');
  if (method === 'POST') return json(await repo.create(type.id, value), 201);
  const item = await repo.update(type.id, id, revision, value);
  return item ? json(item) : await repo.get(type.id, id) ? conflict() : missing();
}
