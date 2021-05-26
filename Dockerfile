FROM node:14-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Bare in mind, expose is not supported by heroku. This is only for local testing.
EXPOSE 8080
CMD ["npm", "start"]