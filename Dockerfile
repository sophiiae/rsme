FROM node:lts-alpine

WORKDIR /usr/src/app

COPY . . 

RUN npm install --production

EXPOSE 4000

CMD ["node", "app"]

