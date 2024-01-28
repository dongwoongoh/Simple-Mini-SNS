#!/bin/zsh

echo "Enter database name:"
read DB_NAME

echo "Enter database user password:"
read DB_PASS

INIT_SQL="/tmp/init.sql"
DOT_ENV="./.env"

rm -rf $INIT_SQL

if [ ! -f "$INIT_SQL" ]; then
    echo "Creating init.sql..."
    echo "CREATE DATABASE $DB_NAME;" >$INIT_SQL
    echo "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_NAME;" >>$INIT_SQL
else
    echo "init.sql already exists."
fi

if [[ "$(docker images -q postgres 2>/dev/null)" == "" ]]; then
    echo "Postgres image not found. Pulling from Docker Hub..."
    docker pull postgres:14.10-alpine3.18
else
    echo "Postgres image found."
fi

docker run -itd \
    -e POSTGRES_USER=$DB_NAME \
    -e POSTGRES_PASSWORD=$DB_PASS \
    -e POSTGRES_DB=$DB_NAME \
    -p 5432:5432 \
    --name $DB_NAME \
    postgres:14.10-alpine3.18

echo "DATABASE_URL="postgresql://$DB_NAME:$DB_PASS@localhost:5432/$DB_NAME"" >$DOT_ENV

npm ci
npx prisma migrate dev --name init
npm run test
npm run test:e2e
npm run start:dev
