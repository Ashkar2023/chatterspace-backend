FROM node:21-alpine3.18

COPY . /chat-svc

WORKDIR /chat-svc

EXPOSE 7000

RUN npm install

CMD ["npm","start"]