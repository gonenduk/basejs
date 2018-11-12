FROM node:10.13-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json /app
RUN cd /app; npm install
COPY . /app

# Set enviroment variables
ENV NODE_ENV=development
ENV DATABASE=mongodb://mongodb:27017
ENV PORT=3000

CMD [ "npm", "run", "db", "all"]
CMD [ "npm", "start" ]
EXPOSE 3000