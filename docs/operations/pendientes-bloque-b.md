# Pendientes técnicos tras el Bloque B (B1–B4)

Estado a la integración de `ec75c34` en `main`. Este documento no describe
trabajo realizado, sino lo que queda abierto: acciones manuales, decisiones de
configuración y defectos localizados que se corrigen en bloques posteriores.

## 1. Validación de firma del webhook: pendiente de activación

### Estado verificado

El mecanismo está implementado y comprobado en sus tres escenarios:

| Escenario | Comportamiento verificado |
|---|---|
| `MERCADOPAGO_WEBHOOK_SECRET` con valor | Validación **activa**: sin firma 401, firma inválida 401, firma válida 200. No se emite aviso al arrancar. |
| Variable ausente | Compatibilidad: el webhook responde 200 como antes. Aviso al arrancar y un aviso por cada notificación recibida. |
| Variable presente pero vacía o solo espacios | Se trata como ausente. `config.js` aplica `.trim()`, de modo que un valor en blanco no activa una validación que rechazaría todo. |

Puntos de código:

- `ShopCauchosMC/src/config.js` — lectura, normalización y aviso de arranque.
- `ShopCauchosMC/src/middlewares/mercadoPagoSignature.js` — decisión de validar o dejar pasar.
- `ShopCauchosMC/src/services/mercadopago/verifySignature.js` — algoritmo HMAC.
- `ShopCauchosMC/src/routes/payment.routes.js` — el middleware se antepone solo a `/api/webhook`.

### Acción manual requerida

`MERCADOPAGO_WEBHOOK_SECRET` **no está presente en `ShopCauchosMC/.env`**, por lo
que hoy la validación está inactiva y el endpoint acepta cualquier notificación.

Para activarla:

1. Obtener la clave en el panel de Mercado Pago: *Tus integraciones → la
   aplicación → Webhooks → Clave secreta*.
2. Añadir `MERCADOPAGO_WEBHOOK_SECRET=<valor>` a `ShopCauchosMC/.env`, y a los
   secretos del entorno de despliegue.
3. Reiniciar el backend y confirmar que **no** aparece el aviso
   `MERCADOPAGO_WEBHOOK_SECRET no configurado`.

Dos advertencias:

- La clave es **distinta por aplicación y por modo**. Mientras siga sin
  aclararse si `MERCADOPAGO_KEY` y `MERCADOPAGO_KEY_TEST` pertenecen a la misma
  cuenta, el secreto correcto depende de con cuál se esté operando.
- No se genera ni se inventa ningún valor: la clave la emite Mercado Pago.

## 2. HOST: separación entre desarrollo local y producción

### Uso actual

`HOST` se consume en un único punto, `ShopCauchosMC/src/services/create-order.js`,
para construir cuatro URLs:

```
back_urls.success   ${HOST}/success        -> ruta de la SPA
back_urls.failure   ${HOST}/failure        -> ruta de la SPA
back_urls.pending   ${HOST}/pending        -> ruta de la SPA
notification_url    ${HOST}/api/webhook    -> backend, a través del proxy
```

### El problema de fondo

`HOST` vale hoy `http://localhost:3000`, que es **el backend**. Pero tres de las
cuatro URLs son rutas de la SPA, servidas por Nginx, y la cuarta llega al backend
precisamente a través de Nginx (`location /api/`). Es decir:

- `HOST` debe apuntar al **punto de entrada público (Nginx)**, nunca al backend.
- Con el valor actual, `${HOST}/success` cae en el backend, que no tiene esa
  ruta, y `auto_return: 'approved'` hace que Mercado Pago rechace la creación de
  la preferencia con `auto_return invalid. back_url.success must be defined`,
  porque además no admite `localhost`.

En producción el problema no se manifiesta si `HOST` es el dominio real que
sirve Nginx, ya que ahí la SPA y `/api` conviven bajo el mismo origen.

### Solución propuesta

**No desactivar `auto_return`.** La separación se resuelve solo con configuración:

| Entorno | Valor de `HOST` |
|---|---|
| Producción | El dominio público que sirve Nginx, por ejemplo `https://shopcauchosmc.com`. Un único valor cubre las cuatro URLs. |
| Desarrollo local | La URL pública de un **túnel apuntando al puerto 8080 (Nginx)**, no al 3000. |

Para desarrollo, cualquier túnel HTTPS sirve y **no requiere ninguna dependencia
nueva en el proyecto**: son herramientas externas al repositorio. El bloque
comentado de `cauchosmc/vue.config.js` ya apunta a los dev tunnels de VS Code, lo
que sugiere que es la vía que se venía usando.

Procedimiento en desarrollo:

1. Levantar el stack: `docker compose -f docker-compose.dev.yml up -d`.
2. Abrir un túnel público hacia el puerto **8080** y marcarlo como público.
3. Fijar `HOST=<url-del-tunel>` en `ShopCauchosMC/.env` y reiniciar el backend.
4. Dejar `VUE_APP_API_URL` **vacío** en `cauchosmc/.env` y reconstruir el
   frontend, para que la SPA use `/api` relativo a través de Nginx. Con el valor
   actual (`http://localhost:3000`) la SPA solo funciona desde la máquina de
   desarrollo, lo que rompe el retorno desde Mercado Pago en cualquier otro
   dispositivo. Esta recomendación coincide con la ya recogida en
   `compose-environments.md`.

La URL del túnel cambia en cada sesión salvo que se reserve, así que `HOST` debe
actualizarse en consecuencia. Es una limitación operativa aceptada, no un
defecto del código.

**No se propone cambiar producción.** El comportamiento actual es correcto
siempre que `HOST` sea el dominio público; conviene confirmarlo en el entorno de
despliegue.

## 3. Frontend: respuestas de error no comprobadas

**No corregir todavía.** Queda registrado para una fase de frontend.

### Punto exacto

`cauchosmc/src/views/scripts/Home.js`, líneas 102–109:

```js
const response = await fetch(`${this.apiURL}/api/payment`, opciones);
const data = await response.json();
this.seePaneles.seeLoader = false;
//window.location.href = data.url;
window.open(data.url, "_blank");
```

### Qué debería corregirse

1. Comprobar `response.ok` antes de interpretar el cuerpo. Desde B3, el backend
   responde `502 {"error": "..."}` cuando Mercado Pago falla; el código actual lo
   trata como éxito.
2. No invocar `window.open(data.url)` sin verificar que `data.url` existe. Con
   `undefined` el navegador abre una pestaña en blanco: el usuario percibe un
   fallo silencioso, sin mensaje de error.
3. Mostrar un mensaje de error al usuario y ocultar el loader en el camino de
   fallo, no solo en el de éxito.

Antes de B3 este defecto quedaba enmascarado: la petición se colgaba
indefinidamente y el síntoma era un loader girando para siempre. Ahora el fallo
es rápido y explícito por parte del backend, pero el frontend sigue sin
comunicarlo.

### Alcance real del problema

El patrón se repite en siete llamadas. Solo `store/index.js` comprueba `res.ok`:

| Archivo | Línea | Comprueba `ok` |
|---|---|---|
| `cauchosmc/src/store/index.js` | 26 | sí |
| `cauchosmc/src/views/scripts/Home.js` | 58 (`/api/time`) | no |
| `cauchosmc/src/views/scripts/Home.js` | 102 (`/api/payment`) | no |
| `cauchosmc/src/views/scripts/Home.js` | 126 (`/api/contacto`) | no |
| `cauchosmc/src/components/Messagues.vue` | 81 (`/api/pickTime`) | no |
| `cauchosmc/src/views/scripts/Manage.js` | 56, 183, 231 | no |

Conviene abordarlo como un criterio único de manejo de errores HTTP en el
frontend, no como un parche aislado en `Home.js`.

## 4. RegistrarPayment: fallo silencioso tras el encolado

**No corregir todavía: corresponde al Bloque D.**

### Punto exacto

`ShopCauchosMC/src/services/ready-payments.js`, líneas 7–17:

```js
export const RegistrarPayment = async (req) => {
    console.log('En Proceso');
    const paymentHecho = await insertPayment(req);   // devuelve undefined si falla
    const delependg = await deletePending(req.id);   // se ejecuta igualmente
    const pedido = await RegistrarPedido(req);       // se ejecuta igualmente
    return 'Pago Registrado';                        // siempre, haya fallado o no
}
```

Y el consumidor que la invoca, `ShopCauchosMC/src/colas/conexionRabbit.js`,
líneas 56–61, que hace `ack` incondicional al terminar.

### El riesgo

`insertPayment` captura cualquier error y devuelve `undefined`, incluida la clave
duplicada. `RegistrarPayment` ignora ese valor, continúa con los pasos siguientes
y devuelve siempre `'Pago Registrado'`. El consumidor confirma el mensaje a
continuación. Resultado: **un registro fallido se confirma como exitoso y el
mensaje se descarta de forma definitiva.**

La interacción con la idempotencia de B2 es lo que agrava el problema. B2 marca
el evento como `procesado` en cuanto se encola, de modo que:

1. El pago se encola y el evento queda marcado como procesado.
2. El worker falla en silencio y el mensaje se confirma igualmente.
3. Mercado Pago reintenta la notificación, pero B2 la descarta por duplicada.

**La ventana de idempotencia termina en el encolado**, así que un fallo del
worker no es recuperable mediante los reintentos de Mercado Pago. El pago queda
sin pedido asociado y sin ninguna señal de error.

Existe un segundo modo de fallo: si algo sí lanza (por ejemplo
`RegistrarPedido` al leer `req.additional_info.items` en un payload inesperado),
no hay `ack` ni `nack`, y el mensaje queda sin confirmar indefinidamente.

### Qué deberá corregirse en el Bloque D

- Propagar el fallo de `insertPayment` en lugar de continuar la cadena.
- `ack` únicamente tras un procesamiento correcto; `nack` explícito hacia una
  dead-letter queue en caso de fallo permanente, con reintentos acotados.
- Marcar el evento de `payment_events` como `fallido` cuando el worker no logre
  completar el registro, para que el reintento vuelva a tomarlo. El mecanismo ya
  existe (`marcarFallido`), pero hoy solo se usa si falla la publicación.

## Resumen de acciones manuales

| # | Acción | Responsable |
|---|---|---|
| 1 | Obtener `MERCADOPAGO_WEBHOOK_SECRET` del panel de Mercado Pago y añadirlo a `.env` y a los secretos de despliegue | manual |
| 2 | Confirmar si `MERCADOPAGO_KEY` y `MERCADOPAGO_KEY_TEST` pertenecen a la misma cuenta | manual |
| 3 | Fijar `HOST` a la URL de un túnel hacia el puerto 8080 para probar pagos en local | manual |
| 4 | Confirmar que `HOST` en producción es el dominio público servido por Nginx | manual |
