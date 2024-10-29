# C:\Users\Hp\Desktop\apps\dos\dosproject\catalog-server\Dockerfile
FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["node", "catalog-server.js"]
