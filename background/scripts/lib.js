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