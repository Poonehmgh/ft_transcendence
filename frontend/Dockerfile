FROM node:18-alpine3.16
WORKDIR  /frontend

COPY package*.json ./

COPY . .
RUN npm install --no-audit

RUN npm install


EXPOSE 3000

CMD ["npm", "start"]
