export const categories = [
  ['calles', 'Estado de las calles', 'Pavimento, tramo y fecha de inspección', 'line'],
  ['veterinarias', 'Veterinarias', 'Dirección, servicios y horario', 'point'],
  ['camaras', 'Cámaras de seguridad', 'Sistema, cobertura general y corte', 'none'],
  ['comida', 'Sitios de comida', 'Dirección, tipo de cocina y horario', 'point'],
  ['catastro', 'Datos catastrales', 'Código, unidad territorial y vigencia', 'area'],
  ['barrio', 'Polígono del barrio', 'Nombre, origen y vigencia del límite', 'area'],
  ['transporte', 'Estaciones de transporte', 'Estación, sistema y ubicación', 'point'],
  ['deportes', 'Escenarios deportivos', 'Modalidad, dirección y acceso', 'point'],
  ['hurtos', 'Datos sobre hurto', 'Modalidad, periodo, territorio y total agregado', 'none'],
  ['localidad', 'Datos de la localidad', 'Nombre, código y descripción', 'area'],
  ['verde', 'Áreas verdes', 'Parque, código y equipamiento', 'area'],
  ['educacion', 'Instituciones educativas', 'Institución, sede y dirección', 'point'],
  ['librerias', 'Librerías', 'Nombre, dirección y tipo de establecimiento', 'point'],
  ['policia', 'Centros de atención de policía', 'Unidad, dirección y contacto público', 'point']
].map(([id, label, hint, shape]) => ({ id, label, hint, shape }));

export const category = id => categories.find(item => item.id === id);
