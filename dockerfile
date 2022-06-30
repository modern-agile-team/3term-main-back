FROM node:16.14.2


LABEL email="suhyung.lee9810@gmail.com"
LABEL name="leesuhyung"
LABEL description="mohae Application"

WORKDIR /home/app

COPY ./mohae .

RUN npm ci 
RUN npm i joi
RUN npm i mysql
RUN npm i -g nest


CMD ["npm", "run", "start:prod"]