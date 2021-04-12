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
  NODE_TLS_REJECT_UNAUTHORIZED=0

  # API
  API_ENDPOINT=https://www.featapi.com
  STORAGE_ENDPOINT=https://www.feat.com
  SOCKET_ENDPOINT=http://www.featapi.com
  # SOCKET_TOKEN=

  # OAUTH
  # 需要在 feat.com 上创建 Application。https://www.feat.com/application
  # 建议替换下方的 FEAT_CLIENT_ID, FEAT_CLIENT_SECRET
  FEAT_SCOPE=all
  FEAT_CLIENT_ID=n5CGTssKj6aBzmeYPfi94y3GxVPS67qMSKfliQzC
  FEAT_CLIENT_SECRET=lQaIOjyIo2n06r1WNr2Z0Ewzd4YULHSWV0Eigk9gLjqJlH1FLXrBJJfWm2galtcZHyCkcuve2vJdNPI6d2ZpkQM1YmUN2U9QExACXm6Y6dm7kq3163hetamfccWn72KM
  FEAT_AUTHORIZATION_URL=https://www.feat.com/authorize
  FEAT_ACCESS_TOKEN_URL=https://www.feat.com/api/o/token/

  APP_URL=http://localhost:3400
  PORT=3400

  REDIS_HOST=127.0.0.1
  REDIS_PASSWORD=
  REDIS_PORT=6379
  REDIS_DB=3
  REDIS_PREFIX=dimzou_next_

  DEBUG=dimzou-next:*
  ```


4. Placing the development certificate in server/cert: see the README.md in the directory for naming conventions. You may skip this step if not setting `HTTPS=true` in `.env` file.  

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