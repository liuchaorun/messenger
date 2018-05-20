# 云展网页端新版api
说明，网页端api的ip为118.89.197.156 port为3000
所有请求添加前缀/cloudExhibition

## 统一返回格式
```json
{
  "data":{

  },
  "msg":{
    "code":"int",
    "msg":"string",
  }
}
```
说明：code为状态码约定见下文，
     msg为返回提示信息
     data为返回数据
### code约定值
```JavaScript
  1:请求成功
  2:用户已存在，请求验证码失败
  3:验证码错误
  4:密码错误
  5:该用户不存在
  6:该屏幕不存在
  7:广告删除失败
  8:标签重复
  9:标签与图片绑定无法删除
  10:标签不存在
  500:服务器错误
```

## 注册

### 请求验证码
url:'/signup'
```json
request:{
  "email": "string"
}
```
```json
response.data:{
  "null"
}
```

### 验证并注册
url:'/verify'
```json
request:{
  "username":"string",
  "email":"string",
  "password":"string"
}
```
```json
request.data:{
  "null"
}
```

## 登陆
url:'/login'
```json
request:{
  "email":"string",
  "password":"string"
}
```
```json
request.data:{
  "null"
}
```

## 账号相关
以下所有请求增加前缀/user

### 忘记密码验证
url:'/forget'
```json
request:{
  "null"
}
```
```json
response.data{
  "null"
}
```

### 忘记密码重置密码
url:'/newPassword'
```json
request:{
  "newPassword":"string"
}
```
```json
response.data:{
  "null"
}
```

### 获取用户信息
url:'/getInfo'
```json
request:{
  "null"
}
```
```json
request.data:{
  "username":"string",
  "email":"string",
  "workPlace":"string",
  "lastLoginTime":"timestamp with time zone",
  "adNum":"int",
  "screenNum":"int"
}
```

### 修改用户密码
url:'/modifyPassword'
```json
request:{
  "oldPassword":"string",
  "newPassword":"string"
}
```
```json
response.data:{
  "null"
}
```

### 修改用户信息
url:'/modifyUser'
```json
request:{
  "newUsername":"string or undeifned",
  "newWorkPlace":"string or undefined"
}
```
```json
response.data:{
  "null"
}
```

## 广告屏幕相关
所有请求增加前缀'/screen'

### 获取所有屏幕
url:'/getAll'
```json
request:{
  "null"
}
```
```json
response.data:{
  "info":[
    {
      "uuid":"string",
      "status":"bool",
      "name":"string",
      "updatedTime":"timestamp",
      "freq":"int",
      "pack":"null or string",
      "note":"string",
      "screenResolution":"string"
      },{}
  ]
}
```

### 添加屏幕
url:"/add"
```json
request:{
  "uuid":"string"
}
```
```json
response.data:{
  "null"
}
```

### 修改屏幕信息
url:'/modify'
```json
request:{
  "uuid":["int"],
  "newName":"string",
  "newFreq":"int",
  "newNote":"string"
}
```
```json
response.data:{
  "null"
}
```

### 删除屏幕
url:'/del'
```json
request:{
  "uuid":["int"]
}
```
```json
response.data:{
  "null"
}
```

## 广告相关
所有请求增加前缀'/ad'
ad_type字段代表广告类型 0:图片 1:视频

### 上传广告
url:'/upload'
```json
request:{
  "file":"file",
  "type":"广告标签",
  "adType":"int"
}
```
```json
response.data:{
  "null"
}
```

### 获取所有广告和其标签
url:'/get'
```json
request:{
  "null"
}
```
```json
response.data:{
  "ads":{
    "adId":{
    "name":"string",
    "src":"string",
    "target":"string",
    "position":"int",
    "pack":["string"],
    "adLabel":["string"]
    }
  }
}
```

### 修改广告信息
url:'/modify'
```json
request:{
  "id":"int",
  "newName":"string",
  "newTarget":"string",
  "newPosition":"int",
  "newAdLabel":["string"]
}
```
```json
response.data:{
  "null"
}
```

### 删除图片
url:'/del'
```json
request:{
  "adId":["int"]
}
```
```json
response.data:{
  "null"
}
```

## 资源包相关
所有请求增加前缀'/resource'

### 增加一个资源包
url:'/add'
```json
request:{
  "adId":["int"],
  "adTime":["int"],
  "packName":"string",
  "packNote":"string"
}
```
```json
response.data:{
  "null"
}
```

### 获取资源包
url:'/get'
```json
request:{
  "null"
}
```
```json
response.data:{
  "resources":[{
    "screen":[{
      "name":"string",
      "screenId":"int"
      }],
    "name":"string",
    "note":"string",
    "resourceId":"int"
    }]
}
```

### 获取资源包绑定的屏幕
url:'/getPackScreen'
```json
request:{
  "resourceId":"int"
}
```
```json
response.data:{
  "screen":[{
    "name":"string",
    "screenId":"int",
    "note":"string"
    }]
}]
```

### 获取该资源包未绑定的屏幕
url:'/getPackNoScreen'
```json
request:{
  "resourceId":"int"
}
```
```json
response.data:{
  "screen":[{
    "name":"string",
    "screenId":"int",
    "note":"string"
    }]
}]
```

### 添加关联屏幕
url:'/addPackScreen'
```json
request:{
  "resourceId":"int",
  "screen":["int"]
}
```
```json
response.data:{
  "null"
}
```

### 删除关联屏幕
url:'/delPackScreen'
```json
request:{
  "resourceId":"int",
  "screen":["int"]
}
```
```json
response.data:{
  "null"
}
```

### 获取资源包信息
url:'/getPackInfo'
```json
request:{
  "resourceId":"int"
}
```
```json
response.data:{
  "usedAds":[{
    "adName":"string",
		"adMd5":"string",
		"adTime":"int",
		"adUrl":"string",
		"adId":"int",
		"adTarget":"string",
		"adQrcodePosition":"int"
    }],
  "name":"string",
  "note":"string"
}
```

### 修改资源包信息
url:'/modify'
```JavaScript
if(mutiple === true){
  request:{
    "pack":["int"],
    "newPackNote":"string",
    "mutiple":"bool"
  }
}
else{
  request:{
    "pack":["int"] //only one
    "newPackName":"string",
    "newPackNote":"string",
    "adId":["int"],
    "adTime":["int"]
  }
}
```
```json
response.data:{
  "null"
}
```

### 删除资源包
url:'/del'
```json
request:{
  "pack":["int"]
}
```
```json
response.data:{
  "null"
}
```

## 广告标签相关
所有请求增加前缀'/label'

### 增加一个标签
url:'/add'
```json
request:{
  "newAdLabel":"string"
}
```
```json
response.data:{
  "null"
}
```

### 获取标签
url:'/get'
```json
request:{
  "null"
}
```
```json
response.data:{
  "adLabel":["string"]
}
```

### 删除标签
url:'/del'
```json
request:{
  "adLabel":["string"]
}
```
```json
response.data:{
  "null"
}
```

## 二维码相关
url:'/getQrcodeInfo'
```json
request:{
  "browser":"string",
  "deviceType":"string",
  "device":"string",
  "os":"string",
  "uuid":"string",
  "position":"psoition",
  "adLabel":"string",
  "adId":"int",
  "scanTime":"Date"
}
```
```json
response redirect
```
