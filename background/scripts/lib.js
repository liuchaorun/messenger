/**
 * Created by 31641 on 2017-6-25.
 */
/**字符串匹配使用正则表达式常量**/
const USERNAME_REG = /^[A-z0-9\u4e00-\u9fa5]{1,16}$/;
const EMAIL_REG = /^[A-z0-9]+@([A-z0-9]+\.[a-z]+)+$/;
const PASSWORD_REG = /^[A-z0-9_]{1,32}$/;
const PACK_NAME_REG = /^[A-z0-9\u4e00-\u9fa5]{1,16}$/;
const PACK_NOTE_REG = /^[A-z0-9\u4e00-\u9fa5]{0,32}$/;
const SCREEN_NAME_REG = /^[A-z0-9\u4e00-\u9fa5]{1,16}$/;
const SCREEN_NOTE_REG = /^[A-z0-9\u4e00-\u9fa5]{1,32}$/;

const IMAGE_NAME_REG = /^[A-z0-9\u4e00-\u9fa5]{1,8}$/;
const IMAGE_TARGET_REG = /^http[s]?:\/\/.+$/;
const ADTYPE_REG = /^[A-z0-9\u4e00-\u9fa5]{1,8}$/;

/*请求code*/
/*注意：后端有不止一个返回代码，目前只需要检查是否为1（成功）即可*/
const SUCC = 1;

function AJAX(suffix, dataObject, successFunction, errorFunction, async = true)
{
    $.ajax(
        {
            xhrFields: {
                withCredentials: true
            },
            contentType: 'application/json',
            timeout: 2000,
            async: async,
            dataType: 'json',
            url: `http://118.89.197.156:3000/cloudExhibition${suffix}`,
            //url: `http://127.0.0.1:3000/cloudExhibition${suffix}`,
            method: 'post',
            data: JSON.stringify(dataObject),
            success: successFunction,
            error: errorFunction,
        })
}

/**上次登录时间裸字符串解析**/
function parseTimeString(rawTimeString)
{
    const date = new Date(rawTimeString);
    if (date.getTime() === 0)
    {
        const now = new Date();
        return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日${now.getHours()}时${now.getMinutes()}分`;
    }
    else
    {
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日${date.getHours()}时${date.getMinutes()}分`;
    }
}

/**当输入框被点击时，清空之前的所有状态标志**/
$(function ()
{
    const $input = $('input');
    const $modal = $('.modal');
    $input.focus(function (event)
    {
        $(event.target).removeAttr('style');
    });
    $modal.on('hidden.bs.modal', function (event)
    {
        $(event.target).find("input").val('').removeAttr('style');
    });
});

/**随浏览器窗口大小变化自动设定id指定元素的高度**/
function setHeight(id, offset)
{
    $(`#${id}`).css('height', $(window).height() - offset);
    $(window).resize(function ()
    {
        $(`#${id}`).css('height', $(window).height() - offset);
    })
}

function setMaxHeight(id, offset)
{
    $(`#${id}`).css('maxHeight', $(window).height() - offset);
    $(window).resize(function ()
    {
        $(`#${id}`).css('maxHeight', $(window).height() - offset);
    })
}

/**为指定的元素添加tooltip**/
function addTooltipById(id, content, position = 'left')
{
    $(`#${id}`).tooltip(
        {
            container: 'body',
            placement: `${position}`,
            trigger: 'focus hover',
            title: `${content}`
        }
    );
}

function addTooltipByClassName(className, content, position = 'left')
{
    $(`.${className}`).tooltip(
        {
            container: 'body',
            placement: `${position}`,
            trigger: 'focus hover',
            title: `${content}`
        }
    );
}

/**改变id指定元素的边框颜色**/
function setBorderColorById(id, color = 'red')
{
    $(`#${id}`).css('borderColor', color);
}

function encodeSearchString(object)//根据对象生成查询字符串（包括?字符）
{
    let queryString = '?';
    for (const key in object)
    {
        if (object.hasOwnProperty(key))
            queryString += `${key}=${encodeURI(object[key])}&`;
    }
    return queryString.slice(0, -1);
}

function decodeSearchString(searchString)//根据查询字符串（包括?字符）生成对应对象
{
    const originSearchString = searchString.slice(1);//删除?字符
    const items = originSearchString.split('&');
    let object = {};
    let separatedItem;
    for (const item of items)
    {
        separatedItem = item.split('=');
        object[separatedItem[0]] = decodeURI(separatedItem[1]);
    }
    return object;
}


/*
<div class="notification top-notification notification-success">
    <span class="notification-inner">
    <span class="notification-content">修改信息成功！</span>
    </span>
</div>
*
* */


/*警告类型*/
const SUCCESS = 0;
const WARNING = 1;
const FAILURE = 2;
const DANGER = 3;
/*位置信息*/
const TOP = 0;
const BOTTOM = 1;

function showNotification(content, TYPE = SUCCESS, POSITION = TOP)//在顶部或底部放置消息
{
    if (TYPE >= SUCCESS && TYPE <= DANGER)
    {
        const $body = $('body');
        const NOTIFICATION_TYPES = ['notification-success', 'notification-warning', 'notification-failure', 'notification-danger'];
        const NOTIFICATION_POSITION = ['top-notification', 'bottom-notification'];
        const $notification = $(`<div class="notification ${NOTIFICATION_POSITION[POSITION]} ${NOTIFICATION_TYPES[TYPE]}">
    <span class="notification-inner">
    <span class="notification-content">${content}</span>
    </span>
</div>`);
        $body.append($notification);
        setTimeout(function ()
        {
            $notification.remove();
        }, 2000);
    }
}
