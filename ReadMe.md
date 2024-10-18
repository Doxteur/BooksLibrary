# Installation

## Prérequis

- NodeJS 20 [Installation](https://nodejs.org/en/download/)
- Yarn [Installation](https://yarnpkg.com/getting-started/install)
- MySQL

## Client

1. Clone the repository
2. Run `cd client`
3. Run `yarn install`
4. Run `yarn dev`

## Serveur

1. Clone the repository
2. Run `cd server`
3. Run `yarn install`
4. Run `yarn dev`

## Configuration Serveur

1. Run `cd server`
2. Run `cp .env.example .env`
3. Modifier le .env avec les valeurs de votre base de données

DB_CONNECTION=mysql
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DB_NAME=ynovLivres

## Migration Serveur

1. Run `cd server`
2. Run `node ace migration:run --seed`
