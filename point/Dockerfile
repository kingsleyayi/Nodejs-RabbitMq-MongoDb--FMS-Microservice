FROM node

WORKDIR /point
COPY package*.json ./
RUN npm install
COPY . ./
EXPOSE 9005
CMD npm run start:dev