FROM node:18

WORKDIR /home/data

RUN npm install -g @nestjs/cli
RUN npm install --save @nestjs/typeorm typeorm postgresql
RUN npm install pg --save
RUN npm install --save @nestjs/passport passport
RUN npm i --save @nestjs/config

CMD [ "npm", "run", "start:dev"]
# CMD [ "bash" ]