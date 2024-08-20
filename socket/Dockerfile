FROM node:21-alpine3.18

COPY . /socket-svc

WORKDIR /socket-svc

EXPOSE 5555

RUN npm install

CMD ["npm","start"]