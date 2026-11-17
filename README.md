# API de Atlas Verbenal

Enrutador HTTP en módulos ES con Request y Response. El ensamblaje le
inyecta un repositorio con list, get, create, update y remove. Para cada
categoría el recurso es /api/records/{categoria}. GET lista y lee el id.
POST crea, PUT sustituye, DELETE elimina. Los cambios requieren Authorization
con la clave de edición. PUT y DELETE requieren la revisión en If-Match.
