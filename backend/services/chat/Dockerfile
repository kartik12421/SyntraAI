FROM node

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY ./services/chat/package*.json ./services/chat/
RUN cd services/chat && npm install

COPY services/chat ./services/chat
COPY shared ./shared

WORKDIR /app/services/chat/

EXPOSE 8002

CMD [ "npm", "start" ]