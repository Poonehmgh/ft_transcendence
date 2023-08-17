FROM node:latest

RUN npm install -g typescript

WORKDIR /backend

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]