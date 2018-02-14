FROM node:carbon

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install && npm i -g webpack

COPY . .

RUN webpack

EXPOSE 3331

CMD ["npm", "start"]