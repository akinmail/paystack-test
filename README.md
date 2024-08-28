# paystack-test

My submission for paystack interview take home

## Usage

1. install packages

```
yarn
```

2. prisma init

```
yarn prisma:init
```

3. setting values for .env. Create a file named .env and copy values form .env.sample

```
DATABASE_URL=****************
```

4. prisma migrate

```
yarn prisma:migrate
```

5. start redis and mysql databases

```
docker run --name redis-server -d \
  -p 6379:6379 \
  -e REDIS_PASSWORD=mysecretpassword \
  redis:latest redis-server --requirepass mysecretpassword

docker run --name mysql-server -d \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_USER=myuser \
  -e MYSQL_PASSWORD=mypassword \
  -e MYSQL_DATABASE=mydatabase \
  mysql:latest


```

6. start server (development)

```
yarn dev
```

7. test

```
yarn test
```

7. build

```
yarn build
```

8. start server

```
yarn start
```

IMPROVEMENTS
Handle rate limits in call to binlist
