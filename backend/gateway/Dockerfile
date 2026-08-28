FROM node

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY ./gateway/package*.json ./gateway/
RUN cd gateway && npm install

COPY gateway ./gateway
COPY shared ./shared

WORKDIR /app/gateway

EXPOSE 8000

CMD [ "npm", "start" ]