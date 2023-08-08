FROM node:18-alpine as m1
WORKDIR /var/www
LABEL com.docker.compose.container-number="1"
COPY --chown=node:node package*.json .
# RUN npm ci
COPY --chown=node:node . .
# CMD ["npm", "run", "start"]
EXPOSE 3000