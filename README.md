# RollBank 🎲

This a personal project for players of bets
(this project is being developed)

You can see the project up in this link : (https://fintech-bet.vercel.app/)


Key Features:
-  Create Accounts
-  See your metrics
-  Authentication with clerk
-  Forgot password functionality
-  Manage configurations account
-  See your transactions
-  See the taxes for plataform



### Prerequisites

**Node version 18.7.x**

### Cloning the repository

```shell
git clone https://github.com/rafaelmedeirosjob/influe.git
```

### Install packages

```shell
npm i
```

### Setup .env file


```js
DATABASE_URL=
DIRECT_URL=

AUTH_SECRET=

TIKTOK_CLIENT_ID=
TIKTOK_CLIENT_SECRET=

INSTAGRAM_CLIENT_ID=
INSTAGRAM_CLIENT_SECRET=

RESEND_API_KEY=

NEXT_PUBLIC_APP_URL=
```

### Setup Prisma
```shell
npx prisma generate
npx prisma db push
```

### Start the app

```shell
npm run dev
```

## Available commands

Running commands with npm `npm run [command]`

| command         | description                              |
| :-------------- | :--------------------------------------- |
| `dev`           | Starts a development instance of the app |
