# 云展
## 计划中功能
* 图片标签
    * 获取所有标签   
        * action=get_adType
        * data 部分是一个数组，写入所有的标签
    * 上传图片
        * 提交信息
            * name 图片名（字符串）
            * type 标签（数组）
            * position 位置（数字，对应九宫格从左到右从上到下九个位置）
    * 添加标签
        * action=add_adType
        * 数据为新标签名，字符串形式
    * 删除标签
        * action=delete_adType
        * 数据为数组，数组内容为要删除的标签名字
* 图片管理、屏幕管理可采用多种视图列举
* 信息获取(**action=get_qrcode_info**)
    * 所有内容
        1. 浏览器(browser)
        2. 访问设备类型(deviceType) 
        3. 访问设备型号(device)
        4. 操作系统(os)
        5. IP(ip)
        6. 设备UUID(uuid) 
        7. 精确位置(position)(待定)
        8. 广告标签(adType)
        9. 广告ID(adId)
        10. 扫描时间(scanTime)
        11. 真实地址(target)
   * 前端提交对象结构示例
   <pre>
   {
       browser : 'Chrome',
       deviceType : 'mobile',
       device : 'Xiaomi',
       os : 'Windows 10',
       uuid : '123456',
       adType : '%E6%9C%8D%E8%A3%85',//URI编码
       adId : '123456',
       scanTime : 'Wed Feb 07 2018 17:15:19 GMT+0800 (CST)',//使用Date对象的toString得到
       target : 'https://www.example.com'//要跳转到的真实地址
   }
   </pre>
   * 后端根据请求获得信息
       1. IP
       
* 机器学习

* 图片管理功能
    * 图片列表获取
        * action=get_images
        * 服务器返回信息
        <pre>
        data:
        {
            id1:{name:XXX,src:XXX,target:XXX,pack:[XXX,XXX]},
            id2:{name:XXX,src:XXX,target:XXX,pack:[XXX,XXX]},
            id3:{name:XXX,src:XXX,target:XXX,pack:[XXX,XXX]}
        }
        </pre>
        * 图片编辑
            * action=modify_image_info
            * 提交信息
            <pre>
            {
                id:XXX,//图片ID
                new_name:XXX,//新名字
                new_target:XXX,//新二维码地址
                new_position:'3'//新二维码位置
            }
            </pre>
        * 图片删除
            * action=delete_image
            * 提交信息
            <pre>
            [id_1,id_2,……]
            </pre>