# Dimzou Web

The application of Open source Dimzou.

Using React, Redux and Next.js to build while taking advantage of the Feat Open Project API.

> The Feat.com project is both a social and an open project. We welcome all kinds of contributions including PR, questions, feedbacks, comments, donations, and even just by sharing your opinion about the project will be regarded as a very valuable part of assistance and contribution to the project.

Please read the "FEAT Social Project Participant Guide" before making a pull request.

Fundraising for the Feat.com project development is conducted in a full and transparent manner in terms of accepting, spending, funds management, and it is also subject to social supervision throughout the process.

## System requirements

* Node.js 10.13 or later
* Redis 2.8 or later

## Project startup

1. Pull the git repostiroy:
   
    ```bash
    git clone https://github.com/feat/dimzou-next.git
    ```
2. Install dependency packages:

    ```
    npm install
    ```

3. Create an environment configuration file through the environment configuration template and editing the environment configuration file. Fill in `.env` with FEAT_CLIENT_ID and FEAT_CLIENT_SECRET.  Contact us to obtain detailed contents.

  ```bash
  cp .env.example .env
  ```

  ```
  ## API proxy
  # ==========
  API_ENDPOINT=https://www.featapi.com
  SOCKET_ENDPOINT=
  STORAGE_ENDPOINT=
  # 需要在 feat.com 上创建 Application。https://www.feat.com/application
  FEAT_CLIENT_ID=
  FEAT_CLIENT_SECRET=

  PORT=3100

  ## APP config
  # ==========
  # HTTPS=true
  # NEXT_ASSET_PREFIX=
  # SENTRY_DSN=
  SESSION_SECRET=random_string
  # seconds, 86400 --> 24h
  SESSION_TTL=86400

  REDIS_HOST=127.0.0.1
  REDIS_PASSWORD=
  REDIS_PORT=6379
  REDIS_DB=0
  REDIS_PREFIX=feat_web_

  # Services
  # ==========
  FACEBOOK_APP_ID=
  WEIBO_APP_KEY=

  # 开发用
  DEBUG=feat-web:*
  # 生产用
  # DEBUG=feat-web:request,feat-web:server,proxy:*


  ## Dev related
  # ==========
  # GOOGLE_API_KEY=
  # SENTRY_AUTH_TOKEN=
  # SENTRY_ORG=
  # SENTRY_PROJECT=
  # SENTRY_URL=

  ```


4. Placing the development certificate in server/cert: see the README.md in the directory for naming conventions. This step may be skipped if `HTTPS` is not set in `.env`.  

### Development

Make sure that the redis-server allocated to the environment configuration has started if Redis is required in the development environment. Try to start local services by using redis-server in the terminal.
Start the development serve.

    ``bash
    $ redis-server
    ```

1. Start Dev Server

    ```bash
    $ npm start
    ```


### Production deployment

1.Build

2. Starting the production server.


## Technology Stack
- [Express](https://expressjs.com/en/api.html): NodeJS Server
- [Next.js](https://nextjs.org/): SSR and Async Routing System
- [React](https://reactjs.org/): Component organization, and data rendering
- [React-Intl](https://formatjs.io/docs/react-intl/): Multi-language
- [React-DnD](https://react-dnd.github.io/react-dnd/): Drag-and-drop Feature
- [Redux](https://redux.js.org/): Global Data Management
- [Redux-thunk](https://github.com/reduxjs/redux-thunk): asynchronous requests
- [Redux-saga](https://redux-saga.js.org/): Redux Action side effect handling
- [Socket.io](https://socket.io/): Message Push
- [sass](https://sass-lang.com/): Styling

## SiteMap

```
├── Homepage (Square)[/]
├── Category preview [/category/:id]
├────── Dimzou Edit ──────
├── Draft [/draft/new]
├── Draft [/draft/:bundleId/:nodeId?]
├── Article page [/dimzou-Publication/:bundleId/:nodeId]
├── My Dimzou [/profile/:currentUserId]
├── Other Dimzou users [/profile/:userId]
├────── Dimzou View ──────
├── Article page [/dimzou/:bundleId/:nodeId]
```