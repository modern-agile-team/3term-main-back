FROM node:14.5.0

WORKDIR /home/app

COPY ./mohae .

RUN npm ci --production
RUN npm i joi
RUN npm i mysql
RUN npm i -g nest

CMD ["npm", "run", "start:prod"]