- [x] EditContext
  - [x] BundleContext
  - [x] NodeContext
  - [x] UserCapabilities
  - [x] WorkspaceContext
  - [x] Layout(Render)
- [x] Share/Invitation
- [x] Release
- [x] 重新定义模版
- [ ] CollaboratorBlock
 - [x] Collaborator DnD 交互优化
 - [ ] collaborators 数据更新处理
- [x] Workspace Rendering
  - [x] NodeEdit
  - [x] ChapterCreationRender
  - [x] CoverCreationRender
- [x] ChapterCreation
  - [x] EditorToolbar
- [ ] CoverCreation
  - [ ] EditorToolbar
- [ ] 在章节转跳时，取消 NProgress 动画
- [x] ImageDropzone 的 修改
- [x] Bundle转跳时的数据加载
- [x] CoverNodeRender
- [ ] Rewording 修改 Dirty check，爬取数据的样式
- [ ] 自动审核的消息推送？
- [ ] 处理翻译出版
- [x] 整合组件 components + containers --> components
- [x] Delete bundle error handle
- [x] 章节排序修复
- [x] 缓存清理 
- [x] 创建章节后，更新 Bundle 信息
- [ ] userCapabilites 整理
- [x] bundle edit info 出版标记
- [x] 用户访问一篇新的Dimzou时，左侧应及时添加文章信息
- [ ] 移出章节的响应区域调整
- [x] Fix cache may be null
- [ ] Appending key 处理，单独使用 nodeId
- [x] Fix Dimzou Like
- [x] Cache 处理，单独使用 nodeId
- [ ] Fix Version Label Appending
- [x] Node Outline
- [ ] 将 Components 中的 utils 分离到 utils 中
- [ ] UserDraftsPanel pagination
- [ ] 再一次明确草稿规则，以及 AutoMarkdown 的功能修复
- [x] 在更新参与者为管理员时，重新拉取编辑信息
- [ ] 清理SAGA
- [x] 封面修改记录的 CommentBundle
- [ ] 优化评论组件的打开与隐藏

Data Flow

1. open page
2. Workspace context
   1. SidebarRegion
   2. MainRegion
   3. Template 
3. if no bundleId and no nodeId, render Creation


如何处理页面模板

1. 默认使用 TemplateI
2. 当切换页面后， 使用 nodeState.Template --> 并设置

```jsx
<Workspace data={{ isCreatingChapter: false, isCreatingCover: false }}> // fallback template
    <BundleState>
        <NodeState>
            <UserCapabilitiesProvider>
                <DimzouRender />
            </UserCapabilitiesProvider>
        </NodeState>
    </BundleState>
</Workspace>
```

```jsx
<NodeRender 
    title={<TitleSection />}
    summary={<SummarySection />}
    cover={<CoverSection />}
    content={<ContentSection />}
    drafts={this.renderSidebarFirst()}
    collaborators={this.renderSidebarSecond()}
    settings={this.renderSidebarSecond()}
    docker={this.renderDocker()}
/>
```

```js
function DimzouRender(props) {
    const workspace = useContext(WorkspaceContext);
    const nodeState = useContext(NodeContext);
    if (workspace.isCreatingChapter) {
        return (
            <ChapterCreation 
                defaultTemplat={getTemplate(nodeState)}
            />
        )
    }
    if (workspace.isCreatingCover) {
        return (
            <CoverCreation />
        )
    }
    return <NodeRender />
}
 

## 创建独立章节／创建章节／创建封面

创建草稿完成后，需要进行的动作是：
1. 转跳到新创建的章节
2. 更新UserDrafts数据

对应的数据要求：

1. 返回章节节本信息
2. 推送 UserDrafts 列表更新消息，参考 Diff patch 设计事件 payload
  ```
  {
      op: 'new_node',
      data: nodeInfo
  }
  ```


## 调整章节层级

场景一：将章节移入封面
场景二：将章节移出封面

可以移动的前提条件：

- 章节未出版
- 封面未出版
- 章节拥有者是当前用户
- 封面拥有者为当前用户

数据处理：

- 前端路由调整
- 已加载的数据重置
- 更新用户UserDraftsPanel

### 章节移出封面
- 前端更新 UserDraftsPanel
- 前端更新 BundleState
- 前端路由调整

## 临时章节的处理

用户访问一篇新的Dimzou时，左侧应及时添加文章信息

## 章节出版

- 更新（publish_time）UserDraftsPanel 以及 出版按钮


## 消息推送处理

合并bundle时的消息推送处理

- 参与者的消息推送，以及列表同步

