# Estrategia de ramas y protección de `main`

## Estado de partida

La línea base corresponde al commit `1e40e63` en la rama `main`. No se debe modificar `main` directamente durante la modernización.

## Política propuesta

- Proteger `main`: sin pushes directos ni force-pushes.
- Todo cambio entra mediante pull request revisado.
- Hasta que exista CI, cada pull request requiere revisión manual y una lista explícita de verificaciones realizadas.
- Cuando exista CI, exigir build, pruebas aplicables y revisión antes de fusionar.
- Crear una etiqueta inmutable del estado anterior a cada despliegue relevante.
- Un pull request debe cubrir una sola intención: seguridad, catálogo, interfaz, infraestructura o documentación; no mezclar pagos con rediseño visual.

## Convención de ramas

| Tipo | Formato | Ejemplo |
|---|---|---|
| Preparación/documentación | `chore/<tema>` | `chore/phase-0-environment` |
| Corrección | `fix/<tema>` | `fix/payment-webhook-idempotency` |
| Backend/API | `backend/<tema>` | `backend/catalog-read-api` |
| Frontend/UI | `frontend/<tema>` | `frontend/public-layout` |
| Infraestructura | `infra/<tema>` | `infra/production-compose` |

## Inicio de una unidad de trabajo

1. Confirmar que no hay cambios inesperados con `git status --short`.
2. Actualizar la referencia local de `main` mediante el flujo aprobado por el equipo.
3. Crear una rama con la convención anterior desde el commit aprobado.
4. Registrar en el pull request el alcance, riesgos, verificaciones y rollback.
5. No fusionar si el árbol contiene archivos de entorno, backups o cambios ajenos al objetivo.

## Commits y reversión

- Los commits deben ser pequeños, autocontenidos y describir el resultado observable.
- No incluir secretos, dumps de bases de datos, `node_modules`, builds accidentales ni archivos `.env`.
- Las migraciones de datos deben ser aditivas y tener una ruta de lectura legacy o feature flag antes de cambiar tráfico.
- Un rollback de código debe revertir un commit o una versión desplegada; no debe borrar datos nuevos automáticamente.
- Antes de cambios de pagos, MongoDB o RabbitMQ, debe existir un backup validado y una versión desplegable anterior.
