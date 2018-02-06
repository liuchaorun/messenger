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


function AJAX(action, data_object, success_function, error_function, async = true)
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
            //url: `http://118.89.197.156:3000/action=${action}`,
            url: `http://127.0.0.1:3000/action=${action}`,
            method: 'post',
            data: JSON.stringify(data_object),
            success: success_function,
            error: error_function,
        })
}

let last_one;//Remember the id of the last tip

function modal_append_warning(modal_body_id, alert_type, icon_class, warn_text, className = '')
{
    /**删除上一个TIP**/
    if (last_one !== undefined && $(`#${last_one}`).length)
    {
        $(`#${last_one}`).remove();
    }
    let id = new Date().getTime();
    last_one = id;

    $(`#${modal_body_id}`).append(`<div class="alert alert-${alert_type} alert-dismissible fade in ${className}" role="alert" id=${id}>
 <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><span class="glyphicon ${icon_class}"></span><span> ${warn_text}</span></div>`);
    setTimeout(function ()
    {
        $(`#${id}`).alert('close');
    }, 2000);
}

function modal_prepend_warning(modal_footer_id, alert_type, icon_class, warn_text, className = '')
{
    /**删除上一个TIP**/
    if (last_one !== undefined && $(`#${last_one}`).length)
    {
        $(`#${last_one}`).remove();
    }
    let id = new Date().getTime();
    last_one = id;

    $(`#${modal_footer_id}`).prepend(`<div class="alert alert-${alert_type} alert-dismissible fade in ${className}" role="alert" id=${id}>
 <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><span class="glyphicon ${icon_class}"></span><span> ${warn_text}</span></div>`);
    setTimeout(function ()
    {
        $(`#${id}`).alert('close');
    }, 2000);
}

/**上次登录时间裸字符串解析**/
function parse_time_string(raw_time_string)
{
    const date = new Date(raw_time_string);
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
function auto_height(id, offset)
{
    $(`#${id}`).css('height', $(window).height() - offset);
    $(window).resize(function ()
    {
        $(`#${id}`).css('height', $(window).height() - offset);
    })
}

function auto_max_height(id, offset)
{
    $(`#${id}`).css('maxHeight', $(window).height() - offset);
    $(window).resize(function ()
    {
        $(`#${id}`).css('maxHeight', $(window).height() - offset);
    })
}

/**为指定的元素添加tooltip**/
function tip_by_id(id, content, position = 'left')
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

function tip_by_className(className, content, position = 'left')
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
function border_color_by_id(id, color = 'red')
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
    for(const item of items)
    {
        separatedItem = item.split('=');
        object[separatedItem[0]] = decodeURI(separatedItem[1]);
    }
    return object;
}

$(function ()
{
    const $body = $('body');
    $body.hide().fadeIn(500);
});
