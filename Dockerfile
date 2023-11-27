FROM node:18.10.0-alpine AS build
WORKDIR /app
COPY package*.json ./
EXPOSE 4200
RUN npm install -g @angular/cli
RUN npm install
COPY . .
CMD ["npm", "start"]
