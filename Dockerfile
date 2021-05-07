FROM node:14-alpine

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Bare in mind, expose is not supported by heroku. This is only for local testing.
EXPOSE 8080
CMD ["npm", "start"]