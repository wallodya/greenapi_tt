FROM node:18-alpine as m1
WORKDIR /var/www
LABEL com.docker.compose.container-number="1"
COPY package*.json .
RUN npm install
COPY . .
CMD ["npm", "run", "start"]
EXPOSE 3000