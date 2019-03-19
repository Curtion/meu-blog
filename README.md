# 说明

这是一个毕业设计，与2019年3月6日开始编写，由于前几天没有使用git所以没有记录；目前打算使用koa+Vue完成，尽量做到每天写一点，实习还是挺累的。

# API

## 返回格式说明

|  参数  | 返回时机 |             解释              |
| :----: | :------: | :---------------------------: |
|  msg   |   ALL    |      此次操作结果的说明       |
| status |   ALL    | 状态码；“-1”为错误，”0为正确“ |
|  info  |  NO ALL  |       返回时携带的信息        |



## 登陆

### Request

- Method:  **POST**

- URL: ```/user/login```

- headers: **Content-Type:application/json;charset=utf-8**

- Body: 

  ```json
  {
      "user": "You name",
      "password": "You password"
  }
  ```

### Response

```json
{
    "msg": "授权成功！",
    "data": {
        "user": "You name",
        "token": "You token",
    },
    "status": "0",
}
```



## 发表文章

### Request

- Method： **POST**

- URL： ```/articles/add```

- Headers:**authorization:you_token**

- Body:

  ```json
  {
      "title": "文章标题",
      "content": "文章内容",
      "tag": "文章标签,逗号分隔",
      "kind": "文章分类,逗号分隔"
  }
  ```



## 查询文章列表

### Request

- Method： **GET**
- URL： ```/articles/lists/?limit=10&page=1```

| 参数  |        说明        | 是否必须 |
| :---: | :----------------: | :------: |
| limit | 每次查询的文章数量 |    是    |
| page  |  查询的页码(>=1)   |    是    |



### Response

```json
{
    "msg": "查询成功",
    "info": {
        "totalCount": "文章总数量",
        "count": "查询结果的数量",
        "page": "当前页码",
        "data": "查询结果"
    },
    "status": "0"
}
```



## 根据ID查询文章

### Request

- Method：**GET**

- URL：```/articles/lists/:id```

  | 参数 |   说明   |
  | :--: | :------: |
  | :id  | 帖子的ID |

- eg：```/articles/lists/1```



### Response

```json
{
    "msg": "查询成功",
    "info": {
        "data": "文章数据"
    },
    "status": "0"
}
```



## 提交留言

### Request

- Method：**POST**

- URL：```/comments/add```

  |  参数  |      说明      | 是否必须 |
  | :----: | :------------: | :------: |
  |  cid   | 留言所属文章id |    是    |
  |  post  |    留言内容    |    是    |
  |  name  |   留言者称呼   |    是    |
  | email  |   留言者邮箱   |    否    |
  |  url   |   留言者主页   |    否    |
  | parent |   父级留言ID   |    是    |