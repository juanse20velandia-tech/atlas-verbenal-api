function position(value) {
  return Array.isArray(value) && value.length === 2 &&
    value.every(Number.isFinite) && Math.abs(value[0]) <= 180 && Math.abs(value[1]) <= 90;
}

function line(value) {
  return Array.isArray(value) && value.length >= 2 && value.every(position);
}

function ring(value) {
  return line(value) && value.length >= 4 &&
    value[0].every((coordinate, index) => coordinate === value.at(-1)[index]);
}

function polygon(value) {
  return Array.isArray(value) && value.length > 0 && value.every(ring);
}

const validators = {
  Point: position,
  LineString: line,
  Polygon: polygon,
  MultiPolygon: value => Array.isArray(value) && value.length > 0 && value.every(polygon)
};

const allowed = {
  point: ['Point'], line: ['LineString', 'Polygon', 'MultiPolygon'], area: ['Polygon', 'MultiPolygon', 'Point'], none: []
};

export function validGeometry(geometry, shape, id) {
  if (geometry === null) return true;
  const types = id === 'barrio' ? ['Polygon', 'MultiPolygon'] : allowed[shape];
  return types.includes(geometry?.type) && validators[geometry.type](geometry.coordinates);
}
