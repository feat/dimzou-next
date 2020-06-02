# Dimzou Web

Dimzou Feature related pages

## 项目启动

1. 拉取仓库

2. 安装依赖包

  ```
  npm install
  ```

3. 将开发证书放到 `server/cert`，证书命名规则，详见目录中的 `README.md`

4. 通过环境配置模版创建环境配置文件，并编辑环境配置文件

  ```bash
  cp .env.example .env
  ```

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