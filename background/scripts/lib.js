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
            url: `http://127.0.0.1:3000/action=${action}`,
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
function append_warning(modal_body_id, alert_type, icon_class, warn_text, set_time)
{
    if (set_time === undefined)
        set_time = true;
    let id = new Date().getTime();
    $(`#${modal_body_id}`).append(`<div class="alert alert-${alert_type} alert-dismissible fade in" role="alert" id=${id}>
 <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><span class="glyphicon ${icon_class}"></span><span> ${warn_text}</span></div>`);
    if (set_time === true)
        setTimeout(function ()
        {
            $(`#${id}`).alert('close');
        }, 3000);
}