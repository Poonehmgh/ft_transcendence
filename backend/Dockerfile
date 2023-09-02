FROM node:18-alpine
RUN npm install -g typescript
WORKDIR /backend

COPY package*.json ./
RUN npm install
COPY . .

RUN npx prisma generate
RUN chmod 777 start.sh

#RUN npm run build

EXPOSE 5500
CMD ["./start.sh"]
#CMD ["npm", "run", "start"]