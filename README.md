# swat

Simple Web Application Template

### Prerequisites

```bash
docker --version # 27.2 or higher
node --version # 22.2 or higher
npm --version # 10.9 or higher
```

### Initial Configuration

Step 1: Copy `sample.env` to `.env` and make your application specific changes.
```bash
cp sample.env .env
nano .env
npm install
```

Step 2: Generate development SSL certs 
(https://github.com/FiloSottile/mkcert).
```bash
mkcert -cert-file ./certs/cert.crt -key-file ./certs/key.key localhost 127.0.0.1 ::1
```

Step 3: Check the .env for common errors.
```bash
./bin/validate-env
```

Step 4: Build the images.
```bash
docker compose build
```

Step 5: Bring up the app.
```bash
docker compose up
```

Step 6: Initialize the DB.
```bash
./bin/schema create
./bin/schema seed
```

Step 7: Access the environment
* [Client](https://localhost)
* [DB](https://localhost/db/_utils/) / [Alt](http://localhost:5984/_utils)
* [Router](https://localhost:8090)

