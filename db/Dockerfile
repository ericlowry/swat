#syntax=docker/dockerfile:1

# latest as of 2024-10-05
FROM couchdb:3.3.3

ARG APPLICATION_ID

WORKDIR /opt/couchdb/etc/local.d/

# generate an "application developer" cluster (of 1 node - couchdb is funny)
COPY ./db/dev.ini ./dev.ini

RUN \
  --mount=type=secret,id=COUCHDB_USER,env=COUCHDB_USER,required=true \
  --mount=type=secret,id=COUCHDB_PASSWORD,env=COUCHDB_PASSWORD,required=true \
  --mount=type=secret,id=AUTH_SECRET,env=AUTH_SECRET,required=true \
<<EOF
  echo "[admins]" > ./docker.ini
  echo "$COUCHDB_USER = $COUCHDB_PASSWORD" >> ./docker.ini
  echo "[jwt_keys]" >> ./docker.ini
  echo "hmac:$APPLICATION_ID = $(echo -n $AUTH_SECRET | openssl base64)" >> ./docker.ini
EOF

WORKDIR /opt/db
