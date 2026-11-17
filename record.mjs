import { validGeometry } from './geometry.mjs';

const scopes = ['Barrio', 'Entorno', 'Localidad', 'Distrital'];
const limits = { title: 140, detail: 1800, source: 700, period: 100, facts: 600 };

export function validRecord(input, category) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return;
  const value = {};
  for (const [field, limit] of Object.entries(limits)) {
    const text = input[field] ?? '';
    if (typeof text !== 'string' || text.length > limit) return;
    value[field] = text.trim();
  }
  if (!value.title || !value.detail || !scopes.includes(input.scope)) return;
  try {
    if (!['https:', 'http:'].includes(new URL(value.source).protocol)) return;
  } catch {
    return;
  }
  value.scope = input.scope;
  value.geometry = input.geometry ?? null;
  if (!validGeometry(value.geometry, category.shape, category.id)) return;
  return value;
}
