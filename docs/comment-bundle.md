# Comment Bundle 

## 缓存机制设计

- 定时保存
- 用户+bundle+parentId 进行缓存
- 当评论发表之后清理相关缓存

### Cache data structure

cache_key: comment_bundle:{userId},{bundleKey}

```typescript
{
    [parentId]: RawData
}
```

### 缓存处理流程

1. Comment Bundle init
2. initilize mutable cache object with storage
3. modify cache and write to storage

