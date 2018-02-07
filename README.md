# 云展
## 计划中功能
* 图片标签
* 图片管理、屏幕管理可采用多种视图列举
* 信息获取(**action=get_qrcode_info**)
    * 所有内容
        1. 浏览器(browser)
        2. 访问设备类型(deviceType) 
        3. 访问设备型号(device)
        4. 操作系统(os)
        5. IP(ip)
        6. 设备UUID(uuid) 
        7. 精确位置(position)
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
       /*注意设备相关两项在电脑上访问的时候得到的均是'PC'*/
       os : 'Windows',
       uuid : '123456',
       adType : '%E6%9C%8D%E8%A3%85',//URI编码
       adId : '123456',
       scanTime : 'Wed Feb 07 2018 17:15:19 GMT+0800 (CST)',//使用Date对象的toString得到
       target : 'https://www.example.com'//要跳转到的真实地址
   }
   </pre>