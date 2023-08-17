FROM node:latest
WORKDIR  /frontend

COPY frontend/package*.json ./

RUN npm install -g npm@latest

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
