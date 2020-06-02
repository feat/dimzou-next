# 关于样式

1. 项目使用 `sass` 编写样式， 遵循 BEM 规范
2. 由于 `dynamic-import`， `loader` 以及项目需要 inline-svg  之间的配合问题, `.scss` 文件中引入`.svg`都需要自定义 loader。示例: `background-image: url('~!url-loader!@/images/marker.svg');`

## 模块命名空间分配

- `p` -- (page) 页面
- `ft` -- （feat） 基本UI组件
- `typo` -- 文章内容样式
- `t` -- 文字样式（元素）
- `c` -- Components
- `app` -- 应用模块组件

---

- `cm` -- Comment 评论
- `fx` -- File-X
- `dz` -- Dimzou
- `exc` -- Expertise Commerce
- `IM` -- Party
- `cat` -- Category
- `lng` -- Language
- `mn` -- Menu
- `pub` -- Publication
- `sh` -- Search
- `usr` -- User
- `oa` -- Oauth related
- `auth` -- Auth module
---

无命名空间的为项目组件
