# Usa una imagen oficial de Node como base
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Actualiza repositorios e instala netcat
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Copia los archivos de dependencias
COPY package*.json yarn.lock* ./

# Instala las dependencias con yarn (ignora engines p.ej. brace-expansion que pide Node 20, tenemos Node 18)
RUN yarn install --ignore-engines

# Copia el resto de tu aplicación
COPY . .

# Da permisos de ejecución a los scripts
RUN chmod +x ./wait-for-it.sh ./start.sh

EXPOSE 3000

# Usa un script personalizado para iniciar (con bash explícito para evitar que node lo interprete como módulo)
CMD ["bash", "./start.sh"]

# Expone el puerto en el que corre tu app (ajusta según tu app)
#EXPOSE 3000

# Comando para iniciar el backend con nodemon (npm run dev)
#CMD ["npm", "run", "dev"]

