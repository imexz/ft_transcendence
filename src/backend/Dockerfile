FROM node:18

# COPY package*.json ./
# RUN npm install
# COPY . .



WORKDIR /home/data/

RUN npm install -g @nestjs/cli
RUN npm install -g --save @nestjs/typeorm typeorm postgresql
RUN npm install -g pg --save
RUN npm install -g --save @nestjs/passport passport passport-42
RUN npm install -g --save @nestjs/config
RUN npm install -g --save passport-oauth2
RUN npm isntall -g --save @nestjs/jwt passport-jwt
RUN npm install -g --save -D @types/multer
RUN npm install -g --save @nestjs/axios

CMD [ "npm", "run", "start:dev"]
# CMD [ "bash" ]