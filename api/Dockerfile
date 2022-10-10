FROM node:14

# Add the docker-ce-cli tools to the container
RUN apt-get update \
  # configure npm and install some tools \
  && npm config --global set fund false \
  && npm config --global set update-notifier false \
  && npm install --global nodemon

WORKDIR /opt/api

COPY ./api/package.json .
COPY ./api/package-lock.json .
RUN npm install

COPY ./api/public ./public
COPY ./api/src ./src
COPY ./api/bin ./bin

ENV PATH="/opt/api/bin:${PATH}"

CMD [ "node", "./bin/api-service" ]
