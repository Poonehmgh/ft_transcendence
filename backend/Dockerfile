FROM node:latest
RUN npm install -g typescript
WORKDIR /backend

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 5500

CMD ["npm", "run", "start"]