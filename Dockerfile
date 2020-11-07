FROM alpine:latest

RUN apk add npm

WORKDIR /EPOC
COPY . /EPOC
RUN npm install

EXPOSE 3001

CMD [ "npm", "run", "develop" ]
