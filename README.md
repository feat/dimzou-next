# Dimzou Web

[English README.md](./README-en.md)

开源的 Dimzou 应用。

使用 React 和 Redux 以及 Next.js 构建， 同时利用 Feat Open Project 的API。

> Feat.com 项目是一个社会化工程，也是一个公开的工程。我们欢迎各种形式的贡献：比如PR、提出问题、对问题的反馈、提供评论、捐款，甚至只是将你认为工程上的一些事情分享出去，都是一种对工程发展很有价值的贡献和帮助。

在提出拉取请求之前，请记得阅读我们的 [《FEAT 社会化工程参与者开发指南》](http://new.featapi.com/category/guides/)

Feat.com的工程开发所需的资金筹款在接收、开销、管理等整个过程都以完全透明的方式进行， 并接受社会监管。 

我们非常感谢哪些已经为我们作出了筹款的捐献者。

## 关于 Dimzou

Dimzou 是一个多人写作工具，允许用户聚集在一起开始创作。有别于实时的编辑方案（Operational Transformation 等方案)，这里采用的方式更接近 `revision control`。每一个参与者提交的内容会出去“待审核”状态，知道管理人员对段落进行审核。这种方案更加符合“分工合作”的自然场景。

产品说明可查阅: 

- [Dimzou 产品说明](https://www.openwriter.com/dimzou-publication/246/269)
- [Dimzou 需求整理](https://www.feat.com/draft/108309/108657)

## 核心编辑模型

```typescript
interface Node {
  title: RewordableSection
  summary: RewordableSection
  content: Array<RewordableSection>
}

interface RewordableSection {
  rewordings: Array<RewordingRecord>
}

interface RewordingRecord {
  widget_type: string,
  widget_data: string,
  exported_html: string, 
}
```

## 系统要求
* Node.js 10.13 or later
* Redis 2.8 or later

## 项目启动

1. 拉取仓库

  ```bash
  git clone https://github.com/feat/dimzou-next.git
  ```

2. 安装依赖包

  ```
  npm install
  ```

3. 通过环境配置模版创建环境配置文件，并编辑环境配置文件。`.env` 中需要填入 FEAT_CLIENT_ID 以及 FEAT_CLIENT_SECRET。具体内容可联系我们获取。

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

4. 将开发证书放到 `server/cert`，证书命名规则，详见目录中的 `README.md`。当`.env` 中未设置 `HTTPS` 时，可忽略这个步骤

### 开发

开发环境中需要使用redis，请确保环境配置中指向的 `redis-server` 已启动。本地服务可以尝试在终端中使用 `redis-server` 启动服务

```bash
$ redis-server
```

1. 启动开发服务器

  ```bash
  $ npm start
  ```

### 生产部署

1. 构建

  ```bash
  $ npm run build
  ```

2. 启动生产服务器

  ```bash
  $ npm run start:prod
  ```

## 技术栈

- [Express](https://expressjs.com/en/api.html): NodeJS 服务器
- [Next.js](https://nextjs.org/): SSR 以及 Async 路由系统
- [React](https://reactjs.org/): 组件组织，及数据渲染
- [React-Intl](https://formatjs.io/docs/react-intl/): 多语言
- [React-DnD](https://react-dnd.github.io/react-dnd/): 拖放功能
- [Redux](https://redux.js.org/): 全局数据管理
- [Redux-thunk](https://github.com/reduxjs/redux-thunk): 异步请求
- [Redux-saga](https://redux-saga.js.org/): Redux Action 副作用处理
- [Socket.io](https://socket.io/): 消息推送
- [sass](https://sass-lang.com/): 样式

## SiteMap

```
├── 主页（广场）[/]
├── 分类预览 [/category/:id]
├────── Dimzou Edit ──────
├── 新草稿 [/draft/new]
├── 草稿 [/draft/:bundleId/:nodeId?]
├── 文章阅读页面 [/dimzou-publication/:bundleId/:nodeId]
├── 我的Dimzou [/profile/:currentUserId]
├── 其他用户的Dimzou [/profile/:userId]
├────── Dimzou View ──────
├── 文章阅读页面 [/dimzou/:bundleId/:nodeId]
```
