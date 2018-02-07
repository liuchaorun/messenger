$(function ()
{
    const ERROR_STRING = '参数错误，请通过扫码访问';
    const searchString = location.search;
    const $body = $('body');
    if (searchString === '')//搜索字符串为空，那么提示错误
    {
        $body.text(ERROR_STRING);
        return;
    }

    const searchObj = decodeSearchString(searchString);
    if (!searchObj.hasOwnProperty('uuid') || !searchObj.hasOwnProperty('adType') || !searchObj.hasOwnProperty('adId') || !searchObj.hasOwnProperty('target'))//这三个二维码内置信息如果有缺失则报错
    {
        $body.text(ERROR_STRING);
        return;
    }

    const UA = new UAParser();
    searchObj.broswer = UA.getBrowser().name;
    searchObj.deviceType = UA.getDevice().type === undefined ? 'PC' : UA.getDevice().type;
    searchObj.device = UA.getDevice().vendor === undefined ? 'PC' : UA.getDevice().vendor;
    searchObj.os = UA.getOS().name;

    const nowTime = new Date();
    searchObj.scanTime = nowTime.toString();

    AJAX('get_qrcode_info', searchObj,
        function (res)
        {
            console.log(res);
        },
        function (err)
        {
            console.log(err);
            location.href = searchObj.target;
        });
});
