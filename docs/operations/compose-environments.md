# Separación de Docker Compose por entorno

## Archivos propuestos

- `docker-compose.dev.yml`: desarrollo local. Expone puertos de frontend, backend, MongoDB y RabbitMQ, y conserva bind mount del backend para el ciclo de desarrollo actual.
- `docker-compose.prod.yml`: propuesta de producción. Expone solo el frontend; backend, MongoDB y RabbitMQ permanecen en la red Docker interna y no usan bind mounts.
- `docker-compose.prod.env.example`: inventario de variables que Compose interpola para inicializar MongoDB y RabbitMQ en producción.
- `docker-compose.yml`: archivo legacy actual. No fue modificado durante Fase 0B para evitar alterar el flujo existente.

## Uso previsto

Desarrollo local, después de preparar variables seguras:

```text
docker compose -f docker-compose.dev.yml up --build
```

Producción, únicamente desde un entorno con secretos inyectados de forma segura:

```text
docker compose --env-file .env.prod.local -f docker-compose.prod.yml up -d --build
```

Los comandos anteriores son instrucciones operativas futuras; no se ejecutaron durante Fase 0B.

## Requisitos antes de adoptar producción

- Provisionar `ShopCauchosMC/.env` fuera de Git usando `ShopCauchosMC/.env.example` como inventario de nombres.
- Provisionar `.env.prod.local` fuera de Git usando `docker-compose.prod.env.example`, o inyectar esas variables desde el entorno de despliegue. El `env_file` del backend no sirve para interpolar las variables `${...}` de Docker Compose.
- Provisionar `cauchosmc/.env` antes del build. Con el código actual, dejar `VUE_APP_API_URL` vacío para usar el proxy Nginx; el frontend añade `/api` a esa variable. El Dockerfile actual copia ese archivo desde el contexto de build porque no hay `.dockerignore`.
- Mantener coherentes las credenciales de `MONGODB_URI` y `RABBITMQ_URI` del backend con las credenciales inyectadas para MongoDB y RabbitMQ.
- Validar conectividad, backup/restauración y acceso al panel RabbitMQ antes de recibir tráfico real.
- Definir terminación TLS delante del puerto publicado por Nginx.

## Diferencias principales

| Aspecto | Desarrollo | Producción propuesta |
|---|---|---|
| Código backend | Bind mount | Imagen construida |
| Ejecución backend | Flujo actual con `nodemon` | Proceso Node sin `nodemon` |
| Puertos de datos | Publicados para desarrollo | No publicados al host |
| Credenciales Mongo/RabbitMQ | Configuración local controlada | Obligatoria y entregada por entorno |
| Reinicio | Conveniencia local | `unless-stopped` |
| Health checks | Básicos para servicios de datos | Requeridos antes de iniciar API |

Estos archivos no sustituyen una política de despliegue, TLS, monitoreo o backups; preparan una separación explícita para las fases posteriores.
