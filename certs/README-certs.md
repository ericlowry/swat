
This directory may contain local development certs created by `mkcert`

To generate your own local dev certs do the following:

```bash
mkcert -install
mkcert -cert-file ./cert.crt -key-file ./key.key localhost 127.0.0.1 ::1
```

See https://github.com/FiloSottile/mkcert for more details
