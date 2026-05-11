FROM node:22-alpine

WORKDIR /app

# Parchear paquetes del OS para reducir CVEs de la imagen base
RUN apk upgrade --no-cache

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
