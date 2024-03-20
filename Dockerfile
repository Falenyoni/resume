From node:18-alpine

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm install

COPY . /usr/src/app/

EXPOSE 5173

CMD ["npm", "run","dev"]