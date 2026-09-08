# ===== Stage 1: Build de Vue con yarn =====
FROM node:18 AS build-stage

WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json yarn.lock* ./

# Instala dependencias con yarn (ignora engines por Node 18)
RUN yarn install --ignore-engines

# Copia el resto del proyecto
COPY . .

# Compila para producción con yarn
RUN yarn build

# ===== Stage 2: Sirve con Nginx =====
FROM nginx:alpine

# Elimina la configuración por defecto de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia el archivo de configuración personalizado
COPY nginx.conf /etc/nginx/conf.d

# Copia la carpeta dist compilada desde el build-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expone el puerto por defecto de Nginx
EXPOSE 80

# Inicia Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
