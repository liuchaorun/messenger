# android端新版api
说明，网页端api的ip为118.89.197.156 port为3000
所有请求添加前缀/android

## 统一返回格式
```json
{
  "data":{

  },
  "status":{
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
  2:该屏幕已存在
  500:服务器错误
```

## 配置文件格式说明
配置文件未json文件

### 内容
```json
"ad":[{
  "ad_name":"string",
	"ad_md5":"string",
	"ad_time":"string",
	"ad_url":"string",
	"ad_id":"int",
	"ad_target":"string",
	"ad_qrcode_position":"string",
	"ad_qrcode_update":"int"
  "ad_type":"0为图片 1为视频"
  }]
```

## 创建屏幕
url:'/create_screen'
```json
request:{
  "uuid":"string",
  "screen_resolution":"string"
}
```
```json
response.data:{
  "null"
}
```

## 验证屏幕绑定信息
url:'/check_bind'
```json
request:{
  "uuid":"string"
}
```
```json
response.data:{
  "is_user":"0 为未绑定 1 为已绑定 2 为未创建"
}
```

## 轮询
url:'/poll'
```json
request:{
  "uuid":"string"
}
```
```json
response.data:{
  "time":"int",
  "md5":"string",
  "auto_time":"int"
}
```

## 获取json文件
url:'/get_json'
```json
request:{
  "uuid":"string"
}
```
```json
response.data:{
  "time":"int",
  "json_url":"string"
}
```

## 请求二维码
url:'/get_qrcode'
```json
request:{
  "uuid":"string",
  "ad_id":"int"
}
```
```json
response.data:{
  "qr_url":"string"
}
