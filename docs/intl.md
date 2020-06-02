# About Translation Naming Pattern

## Top Level

- `app`
- `menu`
- `category`
- `form`
- `{module}`


### `App` Level

- `app.common.{message}`
- `app.{component}.{message}`
- `app.{page}.{component}.{message}`

### `Menu`

- `menu.{name}.{slug}`

### `Category`

- `category.{slug}`

### `Modules`

- `{module}.{component}.{message}`
- `{module}.{}-field.{message}` -- entity field label
- `{module}.{}-info.{message}` -- entity value label
- `{module}.{}-option.{message}`
- `{module}.{}-type.{message}`


Module List:

- `dimzou`: `dz`
- `party`
- `user`
- `commerce`: `exc`
- `auth`
- `profile`
- `search`
- `settings`
- `xfile`

TODO: 尝试整合/重新划分 `profile`, `settings`, `user`
