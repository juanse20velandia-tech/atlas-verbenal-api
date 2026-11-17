export const categories = [
  ['catastro', 'Datos catastrales', 'Código, unidad territorial y vigencia', 'area'],
  ['barrio', 'Polígono del barrio', 'Nombre, origen y vigencia del límite', 'area'],
].map(([id, label, hint, shape]) => ({ id, label, hint, shape }));

export const category = id => categories.find(item => item.id === id);
