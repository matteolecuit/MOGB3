# MOGB3 rust authentication server
`A Rust authentication server with GraphQL API, Diesel, PostgreSQL session authentication and JWT`

This repository contains boilerplate rust code for getting a GraphQL prototype with JWT up and running quickly.
 
It uses [actix-web](https://actix.rs/), [Juniper](https://graphql-rust.github.io/juniper/current/), 
[Diesel](http://diesel.rs/) and [jsonwebtoken](https://docs.rs/jsonwebtoken)

## Collection of major crates used in MOGB3
* actix - [link](https://actix.rs/)
* actix-web - [link](https://docs.rs/actix-web/)
* diesel - [link](http://diesel.rs/)
* juniper - [link](https://graphql-rust.github.io/juniper/current/)
* chrono - [link](https://docs.rs/chrono/)
* serde_json - [link](https://docs.serde.rs/serde_json/)
* argon2rs - [link](https://github.com/bryant/argon2rs)
* jsonwebtoken - [link](https://docs.rs/jsonwebtoken)

## Required
* [Rustup](https://rustup.rs/)
* Stable Toolchain: `rustup default stable`
* Diesel cli with postgres `cargo install diesel_cli --no-default-features --features "postgres"`
* PostgreSQL database server or use our docker-compose.yml (require docker)

## Getting Started
```sh
diesel setup --database-url='postgres://postgres:MOGB3@localhost/MOGB3'
diesel migration run
cargo run
```
```

## Build release
```sh 
cargo build --release
cd target/release
./MOGB3
```

### Generate RSA keys for JWT
In development mode you can keep the one in `/keys` folder.

```shell script
// private key
$ openssl genrsa -out rs256-4096-private.rsa 4096
$ openssl rsa -in rs256-4096-private.rsa -outform DER -out private_rsa_key.der

// public key
$ openssl rsa -in rs256-4096-private.rsa -pubout > rs256-4096-public.pem
$ openssl rsa -in private_rsa_key.der -inform DER -RSAPublicKey_out -outform DER -out public_rsa_key.der
```