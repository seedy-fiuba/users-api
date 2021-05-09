FROM node:14-alpine

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install -g eslint
RUN npm install --save-dev @babel/core @babel/cli @babel/preset-env
RUN npm install eslint @babel/core @babel/eslint-parser --save-dev

# Bundle app source
COPY . .

# Bare in mind, expose is not supported by heroku. This is only for local testing.
EXPOSE 8080
CMD ["npm", "start"]