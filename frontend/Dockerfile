FROM node:18-alpine3.16
WORKDIR  /frontend

COPY package*.json ./

RUN npm install --no-audit

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
