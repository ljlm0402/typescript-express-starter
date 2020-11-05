FROM node:14.14.0-alpine3.12

COPY . ./app

WORKDIR /app

RUN npm install
 
EXPOSE 3000

CMD ["npm", "start"]
