# Backup y restauración: MongoDB y volúmenes Docker

## Alcance y reglas de seguridad

Este procedimiento se define para una futura ejecución autorizada. No se ejecutó ningún backup ni restauración durante Fase 0B.

- Los backups contienen datos personales, pedidos, pagos y posiblemente información operativa; deben cifrarse y almacenarse fuera del repositorio.
- Nunca versionar archivos de backup, exports, secretos o archivos `.env`.
- Antes de restaurar, confirmar entorno objetivo, ventana de mantenimiento, responsable y backup de reversión.
- Una restauración con reemplazo de datos es destructiva. Debe probarse primero en un entorno aislado.

## Inventario actual

Docker Compose declara dos volúmenes persistentes:

- `mongo-data`, resuelto actualmente por Compose como `cauchosmcshop_mongo-data`.
- `rabbitmq-data`, resuelto actualmente por Compose como `cauchosmcshop_rabbitmq-data`.

Los nombres resueltos dependen del nombre del proyecto Compose. Antes de operar, confirmar los nombres reales con `docker volume ls`; no asumirlos en scripts automatizados.

## Backup lógico de MongoDB

1. Confirmar la cadena de conexión y permisos de solo lectura para backup.
2. Crear un directorio seguro, cifrado y fuera del repositorio para el artefacto.
3. Ejecutar un dump lógico mediante `mongodump` con autenticación y TLS según el entorno.
4. Registrar fecha, entorno, versión de MongoDB, tamaño, checksum y responsable.
5. Probar el dump restaurándolo en una base aislada y comparar colecciones/documentos esperados.

Ejemplo de forma de ejecución, sujeto a credenciales y entorno aprobados:

```text
mongodump --uri "$MONGODB_URI" --archive=<archivo-seguro>.archive.gz --gzip
```

No colocar la URI real, el archivo resultante ni su contraseña en terminales compartidas, commits o documentación.

## Restauración lógica de MongoDB

1. Detener escrituras de la aplicación o dirigirlas a mantenimiento.
2. Crear un backup nuevo del estado que se va a reemplazar.
3. Restaurar primero en un entorno aislado.
4. Verificar integridad, colecciones, índices y un muestreo de pedidos/pagos antes de producción.
5. Solo con autorización explícita, restaurar el entorno objetivo.

Ejemplo de forma de ejecución:

```text
mongorestore --uri "$MONGODB_URI" --archive=<archivo-seguro>.archive.gz --gzip
```

La opción de reemplazo o borrado de colecciones no debe usarse sin una aprobación explícita y una prueba previa de restauración.

## Backup de volúmenes Docker

Los volúmenes sirven como respaldo complementario, no como sustituto del dump lógico de MongoDB.

- Para MongoDB, preferir el backup lógico consistente.
- Para RabbitMQ, detener o poner en mantenimiento el servicio antes de copiar su volumen para reducir riesgo de snapshot inconsistente.
- Para cada backup de volumen, registrar versión de imagen, nombre real del volumen, fecha, checksum y procedimiento de restauración.
- No ejecutar `docker compose down -v` sobre un entorno con datos sin confirmar que existe un backup validado.

### Forma de archivar un volumen

1. Confirmar el nombre real del volumen y crear un directorio seguro fuera del repositorio.
2. Para RabbitMQ, detener o poner en mantenimiento el servicio antes del snapshot.
3. Ejecutar un contenedor temporal que monte el volumen como solo lectura y escriba el archivo fuera del repositorio.

Ejemplo de forma de ejecución, con nombres de marcador y sin ejecutarlo sobre producción sin autorización:

```text
docker run --rm --mount type=volume,src=<volumen>,dst=/source,readonly --mount type=bind,src=<directorio-seguro>,dst=/backup alpine:3.20 sh -c "tar -C /source -czf /backup/<artefacto>.volume.tar.gz ."
```

### Restauración de un volumen

La restauración de un volumen existente puede sobrescribir datos. La ruta segura es restaurar primero en un volumen nuevo y validar el servicio en un entorno aislado. Solo después de una aprobación explícita puede sustituirse un volumen operativo.

Antes de cualquier restauración, documentar el volumen origen, destino, checksum del artefacto, ventana de mantenimiento y backup de reversión.

## Retención y prueba

- Definir retención por entorno antes de automatizar backups.
- Mantener al menos una copia fuera del host de producción.
- Probar restauración periódicamente; un backup sin restauración verificada no se considera recuperable.
- Registrar toda restauración, incluso las realizadas en entornos de prueba.
