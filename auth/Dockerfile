FROM node:14

RUN npm config --global set fund false
RUN npm config --global set update-notifier false
RUN npm install --global nodemon

WORKDIR /opt/auth
COPY ./auth/package.json .
COPY ./auth/package-lock.json .
RUN npm install
COPY ./auth/public ./public
COPY ./auth/src ./src
COPY ./auth/bin ./bin
ENV PATH="/opt/auth/bin:${PATH}"

CMD [ "node", "./bin/auth-service" ]
