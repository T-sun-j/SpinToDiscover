# 字体应用示例

## 在现有页面中的应用示例

### 搜索页面应用示例
```tsx
// 页面标题 - 使用 Poppins
<h1 className="text-xl font-semibold text-[#093966] font-poppins">
  {t('search.title')}
</h1>

// 历史记录标题 - 使用 Poppins
<h2 className="text-base font-medium text-gray-900 font-poppins">
  {t('search.history')}
</h2>

// 搜索输入框 - 使用 Inter
<input
  className="flex-1 px-3 py-2 bg-gray-100 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-10 font-inter"
  placeholder={t('search.searchPlaceholder')}
/>

// 历史记录项 - 使用 Nunito
<button className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors text-sm font-nunito">
  {item}
</button>
```

### Square 页面应用示例
```tsx
// 标签按钮 - 使用 Poppins (已应用)
<button className={`text-sm font-medium px-4 py-2 rounded-full transition-all font-poppins ${
  activeTab === 'recommend' 
    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-sm' 
    : 'text-gray-600 hover:text-gray-800'
}`}>
  {t('square.recommend')}
</button>

// 文章标题 - 使用 Poppins
<h3 className="font-semibold text-gray-900 mb-2 text-sm font-poppins">
  {post.title}
</h3>

// 文章描述 - 使用 Inter
<p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed font-inter">
  {post.description}
</p>

// 发布者信息 - 使用 Nunito
<span className="text-sm text-gray-600 font-nunito">
  {post.publisher}
</span>
```

### 通用组件应用示例
```tsx
// 按钮组件
<Button className="font-poppins font-semibold">
  点击按钮
</Button>

// 表单标签
<label className="font-nunito text-sm text-gray-700">
  邮箱地址
</label>

// 输入框
<input className="font-inter px-3 py-2 border rounded-md" />

// 提示文本
<p className="font-nunito text-xs text-gray-500">
  请输入有效的邮箱地址
</p>

// 重要提示
<div className="font-poppins text-sm font-semibold text-red-600">
  重要提示信息
</div>
```

## 实际应用建议

### 1. 页面标题层级
```tsx
// H1 - 页面主标题
<h1 className="text-2xl font-poppins font-semibold text-gray-900">
  页面标题
</h1>

// H2 - 章节标题
<h2 className="text-xl font-poppins font-medium text-gray-800">
  章节标题
</h2>

// H3 - 小节标题
<h3 className="text-lg font-poppins text-gray-700">
  小节标题
</h3>
```

### 2. 正文内容
```tsx
// 主要正文
<p className="text-base font-inter leading-relaxed text-gray-700">
  这是主要的正文内容，使用 Inter 字体确保最佳可读性。
</p>

// 次要文本
<p className="text-sm font-inter text-gray-600">
  这是次要的文本内容。
</p>
```

### 3. 界面元素
```tsx
// 按钮
<button className="px-4 py-2 bg-blue-600 text-white rounded-md font-poppins font-semibold">
  主要按钮
</button>

// 链接
<a className="text-blue-600 hover:text-blue-800 font-inter">
  链接文本
</a>

// 标签
<span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-nunito">
  标签文本
</span>
```

### 4. 表单元素
```tsx
// 表单组
<div className="space-y-2">
  <label className="block text-sm font-nunito text-gray-700">
    用户名
  </label>
  <input 
    className="w-full px-3 py-2 border border-gray-300 rounded-md font-inter focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="请输入用户名"
  />
  <p className="text-xs font-nunito text-gray-500">
    用户名长度应在3-20个字符之间
  </p>
</div>
```
