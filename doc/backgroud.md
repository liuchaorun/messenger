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
url:'verify'
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
url:'login'
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
url:'/new_password'
```json
request:{
  "new_password":"string"
}
```
```json
response.data:{
  "null"
}
```

### 获取用户信息
url:'/get_info'
```json
request:{
  "null"
}
```
```json
request.data:{
  "username":"string",
  "email":"string",
  "work_place":"string",
  "last_login_time":"timestamp with time zone",
  "ad_num":"int",
  "screen_num":"int"
}
```

### 修改用户密码
url:'/modify_password'
```json
request:{
  "old_password":"string",
  "new_password":"string"
}
```
```json
response.data:{
  "null"
}
```

### 修改用户信息
url:'/modify_user'
```json
request:{
  "new_username":"string or undeifned",
  "new_work_place":"string or undefined"
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
url:'/get_all'
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
      "updated_time":"timestamp",
      "freq":"int",
      "pack":"null or string",
      "note":"string",
      "screen_resolution":"string"
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
  "new_name":"string",
  "new_freq":"int",
  "new_note":"string"
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
  "ad_type":"int"
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
    "ad_id":{
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
  "new_name":"string",
  "new_target":"string",
  "new_position":"int",
  "new_adLabel":["string"]
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
  "ad_id":["int"]
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
  "ad_id":["int"],
  "ad_time":["int"],
  "pack_name":"string",
  "pack_note":"string"
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
      "screen_id":"int"
      }],
    "name":"string",
    "note":"string",
    "resource_id":"int"
    }]
}
```

### 获取资源包绑定的屏幕
url:'/get_pac_screen'
```json
request:{
  "resource_id":"int"
}
```
```json
response.data:{
  "screen":[{
    "name":"string",
    "screen_id":"int",
    "note":"string"
    }]
}]
```

### 获取该资源包未绑定的屏幕
url:'/get_pack_no_screen'
```json
request:{
  "resource_id":"int"
}
```
```json
response.data:{
  "screen":[{
    "name":"string",
    "screen_id":"int",
    "note":"string"
    }]
}]
```

### 添加关联屏幕
url:'/add_pack_screen'
```json
request:{
  "resource_id":"int",
  "screen":["int"]
}
```
```json
response.data:{
  "null"
}
```

### 删除关联屏幕
url:'/del_pack_screen'
```json
request:{
  "resource_id":"int",
  "screen":["int"]
}
```
```json
response.data:{
  "null"
}
```

### 获取资源包信息
url:'/get_pack_info'
```json
request:{
  "resource_id":"int"
}
```
```json
response.data:{
  "used_ads":[{
    "ad_name":"string",
		"ad_md5":"string",
		"ad_time":"int",
		"ad_url":"string",
		"ad_id":"int",
		"ad_target":"string",
		"ad_qrcode_position":"int"
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
    "new_pack_note":"string",
    "mutiple":"bool"
  }
}
else{
  request:{
    "pack":["int"] //only one
    "new_pack_name":"string",
    "new_pack_note":"string",
    "ad_id":["int"],
    "ad_time":["int"]
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
  "new_ad_label":"string"
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
  "ad_label":["string"]
}
```

### 删除标签
url:'/del'
```json
request:{
  "ad_label":["string"]
}
```
```json
response.data:{
  "null"
}
```

## 二维码相关
url:'/get_qrcode_info'
```json
request:{
  "browser":"string",
  "deviceType":"string",
  "device":"string",
  "os":"string",
  "uuid":"string",
  "position":"psoition",
  "adType":"string",
  "adId":"int",
  "scanTime":"Date"
}
```
```json
response redirect
```
