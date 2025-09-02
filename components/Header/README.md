# Header 组件使用说明

## 概述

`Header` 是一个公共的头部组件，支持动态背景颜色和可控制的搜索控件。它可以根据不同页面的需求进行灵活配置。

## 特性

- 🎨 **动态背景** - 支持透明背景或半透明背景
- 🔍 **可控制搜索** - 可选择是否显示搜索控件
- ⬅️ **返回按钮** - 支持返回按钮和自定义返回路径
- 📱 **响应式设计** - 移动端友好的布局
- 🌐 **国际化支持** - 支持多语言文本
- 🎯 **灵活配置** - 支持自定义右侧操作按钮

## 基本用法

### 1. 首页头部（Logo + 用户图标）

```tsx
import { Header } from '../components/Header';

// 首页使用透明背景
<Header transparent />
```

### 2. 带返回按钮的页面头部

```tsx
// 基本返回按钮
<Header 
  showBackButton 
  backUrl="/"
  title="页面标题"
/>

// 带自定义右侧操作的返回按钮
<Header 
  showBackButton 
  backUrl="/"
  title="页面标题"
  rightAction={<CustomButton />}
/>
```

### 3. 带搜索功能的头部

```tsx
// 启用搜索功能
<Header 
  showBackButton 
  backUrl="/"
  title="页面标题"
  showSearch
  rightAction={<FilterButton />}
/>
```

## 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `showSearch` | `boolean` | `false` | 是否显示搜索控件 |
| `showBackButton` | `boolean` | `false` | 是否显示返回按钮 |
| `backUrl` | `string` | `'/'` | 返回按钮的目标路径 |
| `title` | `string` | `undefined` | 页面标题 |
| `rightAction` | `ReactNode` | `undefined` | 右侧自定义操作按钮 |
| `className` | `string` | `''` | 额外的 CSS 类名 |
| `transparent` | `boolean` | `false` | 是否使用透明背景 |

## 使用场景示例

### 1. 首页头部
```tsx
<Header transparent />
```
- 显示 Logo 和应用名称
- 右侧显示用户图标
- 透明背景，不遮挡内容

### 2. 列表页面头部
```tsx
<Header 
  showBackButton 
  backUrl="/"
  title="探索"
  showSearch
  rightAction={<FilterIcon />}
/>
```
- 左侧显示返回按钮和页面标题
- 中间显示搜索控件
- 右侧显示筛选按钮

### 3. 详情页面头部
```tsx
<Header 
  showBackButton 
  backUrl="/list"
  title="详情"
  rightAction={<ShareButton />}
/>
```
- 左侧显示返回按钮和页面标题
- 右侧显示分享按钮
- 不显示搜索控件

### 4. 设置页面头部
```tsx
<Header 
  showBackButton 
  backUrl="/"
  title="设置"
  rightAction={<SettingsIcon />}
/>
```
- 左侧显示返回按钮和页面标题
- 右侧显示设置图标
- 简洁的头部设计

## 样式定制

### 背景样式
- `transparent={true}` - 完全透明背景
- `transparent={false}` - 半透明背景 + 毛玻璃效果

### 自定义样式
```tsx
<Header 
  className="border-b border-border"
  transparent={false}
/>
```

## 注意事项

1. **搜索控件** - 当 `showSearch={true}` 时，搜索框会占据中间区域
2. **返回按钮** - 当 `showBackButton={true}` 时，Logo 会被替换为返回按钮
3. **右侧操作** - `rightAction` 可以传入任何 React 组件
4. **响应式** - 组件会自动适配不同屏幕尺寸
5. **国际化** - 搜索占位符文本支持多语言

## 最佳实践

1. **保持一致性** - 在同一应用中保持头部样式的一致性
2. **合理使用搜索** - 只在需要搜索功能的页面启用搜索控件
3. **清晰的导航** - 确保返回按钮指向正确的页面
4. **适当的操作** - 右侧操作按钮应该与页面功能相关
5. **性能优化** - 避免在 `rightAction` 中传入过于复杂的组件
