FROM node:buster

#first we install all the dependencies 
#,aka the stuff which changes the least
COPY package*.json ./

RUN npm install


#then we build our application
COPY . /app/

WORKDIR /app/

RUN npm run build


#exposing the port and run the server
EXPOSE 8080

CMD [ "npm", "run", "serve"]