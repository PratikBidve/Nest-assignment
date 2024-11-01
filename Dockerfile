FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

ENV JWT_SECRET=your_jwt_secret_key

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run" , "start:dev" ]