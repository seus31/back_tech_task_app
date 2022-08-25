FROM node:10.12

ENV NODE_ENV="development"

WORKDIR /src

COPY ./app /src

RUN npm install

CMD npm run start
