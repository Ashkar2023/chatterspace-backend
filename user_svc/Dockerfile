FROM node:21-alpine3.18

COPY . /user-svc

WORKDIR /user-svc

EXPOSE 3000

RUN npm install

CMD ["npm","start"]