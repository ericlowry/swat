
# latest as of 2024-10-05
FROM couchdb:3.3.3

# install nodejs 14.x
RUN apt-get update && apt-get install -y curl gnupg gcc g++ make
RUN curl -sL https://deb.nodesource.com/setup_14.x  | bash -
RUN apt-get -y install nodejs
RUN npm config --global set fund false
RUN npm config --global set update-notifier false

# add some extra tools to the container...
RUN apt-get install -y jq iputils-ping gettext-base

WORKDIR /opt/db

ARG APPLICATION_ID
ARG AUTH_SECRET

# generate an "application developer" cluster (of 1 node - couchdb is funny)
COPY ./db/dev.ini.template ./dev.ini.template
RUN cat ./dev.ini.template |\
  AUTH_SECRET_B64=$(echo -n "$AUTH_SECRET" | openssl base64) \
  envsubst > /opt/couchdb/etc/local.d/dev.ini && \
  rm ./dev.ini.template

COPY ./db/package.json .
COPY ./db/package-lock.json .
RUN npm install

ENV PATH="/opt/db/bin:${PATH}"
