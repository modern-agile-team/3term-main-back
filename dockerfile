FROM node:16.14.2


LABEL email="suhyung.lee9810@gmail.com"
LABEL name="leesuhyung"
LABEL description="mohae Application"

WORKDIR /home/app

COPY ./mohae .

RUN npm ci 
RUN npm i joi
RUN npm i mysql2 
RUN npm i -g @nestjs/cli@8.2.5
RUN npm run build

CMD ["npm", "run", "start:prod"]