# 说明

这是一个毕业设计，与2019年3月6日开始编写，由于前几天没有使用git所以没有记录；目前打算使用koa+Vue完成，尽量做到每天写一点，实习还是挺累的。

# API

## 返回格式说明

|  参数  | 返回时机 |             解释              |
| :----: | :------: | :---------------------------: |
|  msg   |   ALL    |      此次操作结果的说明       |
| status |   ALL    | 状态码；“-1”为错误，”0为正确“ |
|  data  |  NO ALL  |       返回时携带的数据        |



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

### Response

```json
{
    "msg": "提交成功",
    "status": "0"
}
```



## 查询文章(总)

### Request

- Method： **GET**
- URL： ```/articles/listarticles/lists/?limit=10&page=1```
- Headers:**authorization:you_token**

| 参数  |        说明        | 是否必须 |
| :---: | :----------------: | :------: |
| limit | 每次查询的文章数量 |    是    |
| page  |  查询的页码(>=1)   |    是    |



### Response

```json
{
    "msg": "查询成功",
    "totalCount": "文章总数量",
    "count": "查询结果的数量",
    "page": "当前页码",
    "data": "文章数据",
    "status": "0"
}
```

