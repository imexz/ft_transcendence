FROM node:18

COPY package*.json ./

RUN npm install

COPY . /home/data/

WORKDIR /home/data/
# RUN npm run build



# RUN npm install @nestjs/cli
# RUN npm install --save @nestjs/typeorm typeorm postgresql
# RUN npm install pg --save
# RUN npm install --save @nestjs/passport passport passport-42
# RUN npm install --save @nestjs/config
# RUN npm install --save passport-oauth2
# RUN npm isntall --save @nestjs/jwt passport-jwt
# RUN npm install --save -D @types/multer
# RUN npm install --save @nestjs/axios
# RUN npm install --save cookie
# RUN npm install cookie-parser
# RUN npm install -D @types/cookie-parser
# RUN npm install -D @types/multer
# RUN npm install  @nestjs/websockets @nestjs/platform-socket.io
# RUN npm install class-transformer --save
# RUN npm install reflect-metadata --save



CMD [ "npm", "run", "start:dev"]
# CMD [ "bash" ]
