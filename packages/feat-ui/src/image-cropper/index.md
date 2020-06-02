---
category: Component
subtitle: image cropper
type: Data Entry
title: 图片裁剪器
---

图片裁剪器。
使用了[react-image-crop](https://github.com/DominicTobias/react-image-crop)

## 何时使用

- 需要截取头像或编辑图片时使用；

## API

### Image Cropper

可输入div所有的参数


| 参数      | 说明             | 类型      | 默认值  |
|----------|------------------|----------|--------|
| src | 图片的url | string  | - |
| submitPic | 截取图片后的回调函数 | Function(blob)  | - |
| defaultCrop | 初始时裁剪器的位置(x,y)，大小(width, height)，参数均为相对图片的百分比。比例(aspect), 宽高比。 | { x: number, y: number, width: number, height: number, aspect: number}  | { x: 0, y: 0, width: 50, height: 50, aspect: 1} |
| cropSize | 裁剪出来的图片大小，单位为像素(px).(optional) | { width: number, height: number }  | { width: 50, height: 50 } |
