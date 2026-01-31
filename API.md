# Smart Campus API 文档

**Base URL**: `http://127.0.0.1:8069` (开发环境/Mock)

---

## 1. 获取用户个人信息

获取当前登录用户的基本资料，用于首页头部展示及“我的”页面。

- **接口地址**: `/api/user/profile`
- **请求方式**: `GET`
- **认证方式**: Bearer Token (假设)

### 响应参数说明

| 参数名 | 类型 | 说明 | 示例 |
| :--- | :--- | :--- | :--- |
| name | string | 用户姓名 | "张三" |
| studentId | string | 学号/工号 | "2023010123" |
| department | string | 所属学院或部门 | "计算机科学与技术学院" |
| avatar | string | 头像 URL 地址 | "https://example.com/avatar.jpg" |

### 响应示例 (JSON)

```json
{
  "name": "张三",
  "studentId": "2023010123",
  "department": "计算机科学与技术学院",
  "avatar": "https://lh3.googleusercontent.com/..."
}
```

---

## 2. 获取常用服务

获取首页显示的“常用服务”列表（通常是用户自定义或系统推荐的前 8 个应用）。

- **接口地址**: `/api/services/common`
- **请求方式**: `GET`

### 响应参数说明 (Array)

返回一个对象数组，每个对象包含以下字段：

| 参数名 | 类型 | 说明 | 示例 |
| :--- | :--- | :--- | :--- |
| id | string | 服务唯一标识 | "1" |
| name | string | 服务名称 | "图书馆" |
| icon | string | 图标名称 (Material Symbols) | "local_library" |
| color | string | 图标颜色 (Tailwind class) | "text-primary" |
| bgColor | string | 背景颜色 (Tailwind class) | "bg-white" |

### 响应示例 (JSON)

```json
[
  {
    "id": "1",
    "name": "图书馆",
    "icon": "local_library",
    "color": "text-primary",
    "bgColor": "bg-white"
  },
  {
    "id": "2",
    "name": "餐厅",
    "icon": "restaurant",
    "color": "text-orange-500",
    "bgColor": "bg-white"
  },
  {
    "id": "3",
    "name": "宿舍门禁",
    "icon": "meeting_room",
    "color": "text-blue-500",
    "bgColor": "bg-white"
  }
]
```

---

## 3. 获取新闻/公告评论列表

获取指定新闻公告下的所有评论数据，支持嵌套回复（楼中楼结构）。

- **接口地址**: `/api/news/comments`
- **请求方式**: `GET`

### 请求参数 (Query)

| 参数名 | 类型 | 必填 | 说明 | 示例 |
| :--- | :--- | :--- | :--- | :--- |
| newsId | string | 是 | 新闻/公告的唯一 ID | "1" |

### 响应参数说明

返回结构通常为 `{ code: 200, data: [...] }`，`data` 为评论对象数组：

| 参数名 | 类型 | 说明 |
| :--- | :--- | :--- |
| id | string | 评论 ID |
| userName | string | 评论者姓名 (或使用 `createBy`) |
| content | string | 评论内容 |
| createTime | string | 评论时间 (如: "2小时前" 或 "2024-02-01 12:00") |
| likes | number | 点赞数 |
| children | Array | 子评论列表 (结构同父级) |
| replyToUser | string | (子评论字段) 回复的目标用户姓名 |

### 响应示例 (JSON)

```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "id": "101",
      "userName": "李明",
      "content": "终于等到通知了！",
      "createTime": "2小时前",
      "likes": 24,
      "children": [
        {
          "id": "101-1",
          "userName": "张伟",
          "content": "记得提前买票。",
          "createTime": "1小时前",
          "likes": 5,
          "replyToUser": "李明"
        }
      ]
    }
  ]
}
```

---

## 4. 获取动态(Feed)评论列表

获取校园圈子动态（Feed）下的评论数据。

- **接口地址**: `/api/post/comments`
- **请求方式**: `GET`

### 请求参数 (Query)

| 参数名 | 类型 | 必填 | 说明 | 示例 |
| :--- | :--- | :--- | :--- | :--- |
| postId | string | 是 | 动态 Post 的唯一 ID | "p_1001" |

### 响应参数说明

结构与新闻评论一致。

### 响应示例 (JSON)

```json
{
  "code": 200,
  "data": [
    {
      "id": "202",
      "createBy": "王老师",
      "content": "这门课非常有意义。",
      "createTime": "5分钟前",
      "likes": 2,
      "children": []
    }
  ]
}
```

---

## 5. 发布动态 (Create Post)

发布一条新的校园圈子动态。

- **接口地址**: `/api/posts`
- **请求方式**: `POST`

### 请求参数 (Body - JSON)

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| content | string | 是 | 动态文本内容 |
| image | string | 否 | 图片地址或 Base64 (可选) |

### 响应参数说明

返回创建成功的动态对象。

### 响应示例 (JSON)

```json
{
  "code": 200,
  "data": {
    "id": "105",
    "content": "今天天气真好！",
    "createTime": "刚刚",
    "userName": "张三",
    "userAvatar": "...",
    "userRole": "学生"
  }
}
```

---

## 6. 发布评论 (Add Comment)

发布新闻公告或动态的评论。

- **接口地址**:
  - 新闻公告: `/api/news/comments`
  - 动态: `/api/post/comments`
- **请求方式**: `POST`

### 请求参数 (Body - JSON)

| 参数名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| newsId / postId | string | 是 | 目标ID |
| content | string | 是 | 评论内容 |
| parentId | string | 否 | 父级评论ID (若是回复楼中楼) |
| replyToUser | string | 否 | 被回复人姓名 (用于展示) |

### 响应参数说明

返回创建成功的评论对象 (结构同获取列表中的单个对象)。
