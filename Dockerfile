FROM node:15

WORKDIR /usr/src/app

COPY /app/package*.json ./
RUN npm install

COPY ./app/ .

EXPOSE 3001
CMD [ "node", "index.js" ]
