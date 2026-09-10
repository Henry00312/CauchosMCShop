# Línea base del repositorio

Fecha de inspección: 2026-09-09  
Alcance: Fase 0A. Este documento describe el estado observado sin modificar código, configuración funcional, dependencias, datos ni secretos.

## Estado de Git

- Repositorio en la rama `main`.
- HEAD: `1e40e63` (`Initial commit`), que también corresponde a `origin/main`.
- Remoto configurado: `origin`.
- El árbol de trabajo estaba limpio al inicio de la inspección de Fase 0A.
- No se detectaron ramas de trabajo, pruebas automatizadas ni flujos de CI versionados.
- El frontend contiene artefactos compilados versionados bajo `cauchosmc/dist/`; el patrón `/dist` del `.gitignore` solo cubre una carpeta `dist` en la raíz, no esa carpeta anidada.

## Estructura observada

```text
.
├── cauchosmc/                 # Frontend Vue 3
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── router/
│   │   ├── store/
│   │   └── views/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── yarn.lock
├── ShopCauchosMC/             # Backend Express
│   ├── src/
│   │   ├── colas/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── presentacion/      # Presentación HTML/JS legacy no servida actualmente
│   │   ├── routes/
│   │   └── services/
│   ├── Dockerfile
│   ├── package.json
│   └── yarn.lock
├── docker-compose.yml
└── .gitignore
```

El frontend usa Vue 3, Vue Router y Vuex. El backend usa Express, Mongoose, RabbitMQ y Mercado Pago. Docker Compose define frontend, backend, MongoDB y RabbitMQ.

## Archivos de entorno y secretos

### Estado actual

- `cauchosmc/.env` existe localmente y está ignorado por Git.
- `ShopCauchosMC/.env` no existe en este checkout.
- No existe ningún archivo `.env.example` versionado.
- No hay archivos de entorno versionados por Git.
- No se registraron ni se muestran valores de variables en este documento.

### Variables detectadas por nombre

Frontend:

- `VUE_APP_API_URL`

Backend, según `ShopCauchosMC/src/config.js`:

- `PORT`
- `HOST`
- `MONGODB_URI`
- `RABBITMQ_URI`
- `MERCADOPAGO_KEY`
- `MERCADOPAGO_KEY_TEST`
- `TOKEN_KEY`
- `OwA`
- `AM`
- `ENTMANG`

Servicio de correo, según `ShopCauchosMC/src/services/emailContact.js`:

- `GMAIL_USER`
- `GMAIL_PASS`

### Problemas identificados

- El backend no puede recibir sus variables requeridas desde el archivo esperado por Compose en este checkout.
- No existe una plantilla segura que indique qué variables debe completar un nuevo entorno.
- La configuración mezcla credenciales de Mercado Pago de pruebas y producción; debe documentarse y separarse en una fase posterior.
- Los secretos deben permanecer fuera del repositorio, de los commits, de la documentación y de salidas de terminal.

## Docker Compose y reproducibilidad

### Composición actual

`docker-compose.yml` declara estos servicios:

| Servicio | Rol | Puerto publicado | Persistencia |
|---|---|---:|---|
| `frontend` | Vue compilado y servido por Nginx | `8080:80` | No |
| `backend` | Express/Node | `3000:3000` | Bind mount del código y volumen de `node_modules` |
| `mongo` | MongoDB | `27017:27017` | Volumen `mongo-data` |
| `rabbitmq` | RabbitMQ con management | `5672:5672`, `15672:15672` | Volumen `rabbitmq-data` |

La validación de sintaxis con `docker compose config --no-interpolate` terminó correctamente. Docker informó que la propiedad Compose `version` es obsoleta y será ignorada.

### Dockerfiles

- Backend: usa `node:18`, instala dependencias con Yarn y `--ignore-engines`, instala `netcat-openbsd`, y ejecuta `yarn dev` mediante `start.sh`; por tanto usa `nodemon` en el contenedor.
- Frontend: usa una etapa de build con `node:18`, compila Vue con Yarn y publica el resultado con `nginx:alpine`.
- No existen `.dockerignore` detectados.

### Nginx

- Sirve la SPA desde `/usr/share/nginx/html`.
- Usa `try_files` para fallback de Vue Router.
- Reenvía `/api/` al servicio Docker `backend:3000`.

### Estado de reproducibilidad

El proyecto no es reproducible ni debe intentarse levantar desde este checkout sin preparar antes el entorno backend:

1. Compose declara `ShopCauchosMC/.env` como requerido.
2. Ese archivo no existe en el checkout inspeccionado.
3. No existe plantilla de entorno backend.
4. No hay pruebas ni CI para confirmar build, conexión a MongoDB, RabbitMQ o Mercado Pago.
5. La validación de configuración Compose no equivale a haber iniciado los servicios ni comprobado dependencias externas.

## Problemas de línea base

1. Falta el archivo de entorno backend requerido por Compose y falta una plantilla segura de variables.
2. No hay separación versionada entre configuración de desarrollo y producción.
3. Backend usa bind mount y `nodemon`, configuración apropiada para desarrollo pero no para producción.
4. MongoDB, backend, AMQP y la consola RabbitMQ publican puertos al host.
5. No existen health checks en Compose.
6. `mongo:latest` no fija una versión reproducible.
7. No hay pruebas automatizadas ni integración continua.
8. Artefactos compilados del frontend están versionados y pueden divergir del código fuente.
9. No existe `.dockerignore`, por lo que el contexto de build puede incluir archivos innecesarios.
10. La presentación legacy permanece en el backend aunque las rutas que la servirían están comentadas; no se debe retirar sin confirmar consumidores externos.
11. La revisión Fase 0C detectó literales sensibles históricos en comentarios de `ShopCauchosMC/src/index.js`. Sus valores se omiten deliberadamente; deben revocarse/rotarse si continúan vigentes y eliminarse en una fase de seguridad, sin intentar tratarlos como secretos activos dentro de Git.

## Límites de esta línea base

- No se inició Docker Compose.
- No se construyeron imágenes.
- No se instalaron dependencias.
- No se conectó a MongoDB, RabbitMQ, Gmail ni Mercado Pago.
- No se inspeccionaron valores de secretos.
- No se hicieron backups ni cambios de configuración.

## Pendiente para Fase 0B

- Aprobar estrategia de ramas y protección de `main`.
- Crear plantillas de entorno sin secretos.
- Definir procedimiento de backup y restauración para MongoDB y volúmenes Docker.
- Separar Compose de desarrollo y producción.
- Definir health checks y política de versiones de imágenes.
- Documentar el procedimiento reproducible de arranque antes de intentar levantar el proyecto.
