/**
 * Created by 31641 on 2017-6-25.
 */
function AJAX(action, data, success_function, error_function)
{
    $.ajax(
        {
            xhrFields: {
                withCredentials: true
            },
            contentType: 'application/json',
            timeout: 10000,
            dataType: 'json',
            //url: `http://118.89.197.156:3000/action=${action}`,
            //
            url: `http://http://172.6.2.123:3000/action=${action}`,
            method: 'post',
            data: JSON.stringify(data),
            success: success_function,
            error: error_function,
        })
}

function clearCookie()
{
    let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys)
    {
        for (let i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
}

/**追加警告函数**/
let last_one;
function append_warning(modal_body_id, alert_type, icon_class, warn_text, className)
{
    if (className === undefined)
        className = '';
    /**如果上一个还存在就删除它**/
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
    }, 3000);
}

function prepend_warning(modal_body_id, alert_type, icon_class, warn_text, className)
{
    if (className === undefined)
        className = '';
    /**如果上一个还存在就删除它**/
    if (last_one !== undefined && $(`#${last_one}`).length)
    {
        $(`#${last_one}`).remove();
    }
    let id = new Date().getTime();
    last_one = id;

    $(`#${modal_body_id}`).prepend(`<div class="alert alert-${alert_type} alert-dismissible fade in ${className}" role="alert" id=${id}>
 <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><span class="glyphicon ${icon_class}"></span><span> ${warn_text}</span></div>`);
    setTimeout(function ()
    {
        $(`#${id}`).alert('close');
    }, 3000);
}

/**把时间串解析为中文**/
function parseTimeString(rawTimeString)
{
    let date = new Date(rawTimeString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日${date.getHours()}时${date.getMinutes()}分`
}

/**重置输入框**/
$(function ()
{
    const $input = $('input');
    const $modal = $('.modal');
    $input.focus(function ()
    {
        $(this).removeAttr('style');
    });
    $modal.on('hidden.bs.modal', function ()
    {
        $(this).find("input").val('').removeAttr('style');
    })
});

/**自动贴边**/
function resizeToScreenHeight(id, offset)
{
    $(`#${id}`).css('height', $(window).height() - offset);
    $(window).resize(function ()
    {
        $(`#${id}`).css('height', $(window).height() - offset);
    })
}

/**Tip**/
function tip(id, content, position)
{
    if (position === undefined)
        position = 'left';
    $(`#${id}`).tooltip(
        {
            container: 'body',
            placement: `${position}`,
            trigger: 'focus hover',
            title: `${content}`
        }
    );
}