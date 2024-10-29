# C:\Users\Hp\Desktop\apps\dos\dosproject\front-end\Dockerfile
FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "front-end.js"]
