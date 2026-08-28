FROM node

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY ./services/payment/package*.json ./services/payment/
RUN cd services/payment && npm install

COPY services/payment ./services/payment
COPY shared ./shared

WORKDIR /app/services/payment/

EXPOSE 8004

CMD [ "npm", "start" ]