# CI Flow

1. 测试 -- `job:test`
2. 构建 -- `job:build`
3. sentry release -- `job:sentry_release`
4. cdn sync -- `job:sync_cdn`
5. server端代码打包并上传 -- `deploy/deploy.sh`
6. 服务器上解压并覆盖上一版本代码，重启nodejs服务 -- `deploy/update.sh`