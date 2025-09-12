# 字体使用指南

本项目已配置了三种自定义字体，以下是详细的使用方法：

## 📝 已配置的字体

### 1. **Poppins-SemiBold** (600)
- **文件**: `Poppins-SemiBold.ttf`
- **用途**: 标题、重要文本、按钮文字
- **特点**: 现代、简洁、易读性强

### 2. **Inter-Regular** (400)
- **文件**: `Inter-Regular-9.otf`
- **用途**: 正文、描述文本、界面文字
- **特点**: 专为屏幕显示优化，可读性极佳

### 3. **Nunito-Regular** (400)
- **文件**: `Nunito-Regular.ttf`
- **用途**: 友好文本、说明文字、辅助信息
- **特点**: 圆润、友好、亲和力强

## 🎨 使用方法

### Tailwind CSS 类名
```html
<!-- Poppins 字体 (标题) -->
<h1 className="font-poppins">主标题</h1>
<h2 className="font-poppins font-semibold">副标题</h2>

<!-- Inter 字体 (正文) -->
<p className="font-inter">正文内容</p>
<div className="font-inter text-sm">小字说明</div>

<!-- Nunito 字体 (友好文本) -->
<span className="font-nunito">友好提示</span>
<label className="font-nunito">表单标签</label>
```

### 推荐使用场景

#### 🎯 **Poppins** - 用于重要元素
- 页面标题
- 按钮文字
- 导航菜单
- 重要提示
- 品牌名称

```html
<h1 className="text-2xl font-poppins font-semibold">页面标题</h1>
<button className="font-poppins">点击按钮</button>
```

#### 📖 **Inter** - 用于正文内容
- 文章正文
- 描述文本
- 表单输入
- 列表内容
- 数据展示

```html
<p className="font-inter text-base leading-relaxed">正文内容</p>
<input className="font-inter" placeholder="输入内容" />
```

#### 💬 **Nunito** - 用于友好文本
- 提示信息
- 帮助文本
- 标签文字
- 辅助说明
- 用户引导

```html
<span className="font-nunito text-sm text-gray-600">提示信息</span>
<label className="font-nunito">表单标签</label>
```

## 🔧 技术配置

### CSS 变量
```css
--font-poppins: 'Poppins', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
--font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
--font-nunito: 'Nunito', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
```

### Tailwind 配置
```typescript
fontFamily: {
  'poppins': ['var(--font-poppins)'],
  'inter': ['var(--font-inter)'],
  'nunito': ['var(--font-nunito)'],
}
```

## 📱 响应式字体大小

结合字体使用时，建议的字体大小搭配：

```html
<!-- 大标题 -->
<h1 className="text-3xl md:text-4xl font-poppins font-semibold">主标题</h1>

<!-- 中标题 -->
<h2 className="text-xl md:text-2xl font-poppins">副标题</h2>

<!-- 正文 -->
<p className="text-base md:text-lg font-inter">正文内容</p>

<!-- 小字 -->
<span className="text-sm font-nunito">辅助信息</span>
```

## 🎨 设计建议

1. **层次感**: 使用 Poppins 建立视觉层次
2. **可读性**: 正文使用 Inter 确保最佳可读性
3. **亲和力**: 友好提示使用 Nunito 增加亲和力
4. **一致性**: 同类型内容使用相同字体
5. **对比度**: 重要信息使用 Poppins 突出显示

## ⚡ 性能优化

- 所有字体都配置了 `font-display: swap`
- 字体文件已优化压缩
- 支持后备字体，确保加载失败时的显示效果
