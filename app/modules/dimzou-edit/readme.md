# TODO

- [x] fix appending block (create, remove) trigger rerender.
- [x] fix userCapabilities trigger block render
- [x] remove dimzou action meta, pass all value in payload(`bundleId`, `nodeId`, `rewordingId`)

## Collaborator Block
- [x] Render
- [x] change permission
- [x] addCollaborator
- [x] updateCollaborator
- [x] handle broadcasting
- [ ] 更新UI后，进行reset(UI 前置)

## Media Dropzone

- [x] Update Dropzone hint.
- [ ] 重写ContentDropzone

## Content Block

- [x] commit rewroding
- [x] submit rewording
- [x] elect rewording
- [x] reject rewording
- [x] can-invite button
- [x] Block Footer toggle Expanded
- [ ] rewording list section title
- [x] render rejected block.
- [x] 更改注册机制，加载数据时初始化
- [ ] 缓存blockUserMeta
- [x] fix remove block
- [x] Fix Media Block.
- [x] Cover Section
  - [x] commit rewording
  - [x] init edit
  - [x] exit edit
  - [x] submit rewording
  - [x] update rewording
  - [x] Cover Preview
    - [x] Elect Rewording
    - [x] Reject Rewording

## Append Block

- [x] commit block
- [x] submit block
- [x] add media block
- [x] Tailing append block
- [ ] style

## Rewording Block

- [x] submit rewording
- [x] commit rewording
- [x] update rewording
- [x] reject rewording
- [x] elect rewording
- [x] elect block
- [x] reject block
- [ ] can't edit message

## Invitation Widget

- [x] open invitation
- [x] create invitation if not exists
- [ ] creating invitation hint
- [ ] create invatation error hint
- [x] close invitation

## Like Widget

- [x] init like widget
- [x] like rewording
- [x] unlike rewording
- [ ] handle rewordings trigger, by operations,
- [ ] initial like widget when loading edit info?

## Comment Block / Comment Widget

- [x] update comments count
- [x] render comment bundle
- [x] init comment bundle
- [x] fetch rewording comment tree
- [x] create rewording comment
- [x] update rewording comment
- [x] comment toggle button
- [ ] initial comment bundle when loading edit info?
- [ ] cache comment broadcasting delta info ?


## Release Flow

- [x] init release
 - [x] post release validation
 - [x] select category
 - [x] post release
- [x] cancel release
- [ ] translation release

## Create Chapter Flow

- [x] show create panel
- [x] create chapter
- [x] handle cover node initialize (forceEditMode)


## Handle Broadcasting

- [ ] bundle broadcasting
  - [x] new-collaborator
  - [x] collaborator-updated
  - [x] node-created
  - [x] node-desc-updated

- [ ] node broadcasting
  - [x] content patch
  - [x] comment signal
    - [x] created
    - [x] updated
    - [x] deleted
  - [x] like signal
    - [x] like
    - [x] unlike

## Docker Widget

- [x] current editorState
- [x] change template
- [x] create chapter
- [x] init release

### Chapter Switch

- [x] nodelist swtich node
- [ ] optimize animation


## Reducer structure


```
{
  storage: {
    bundles: {},
    nodes: {},
  },
  bundles: {
    [id]: {
      _common_: {},
      nodes: {
        [id]: {
          _common_: {}
          blocks: {},
          rewordings: {},
          appendings: {},
          likes: {},
        }
      },
    }
  }
}
```
