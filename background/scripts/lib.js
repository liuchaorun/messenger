/**
 * Created by 31641 on 2017-6-25.
 */
function AJAX(action,data,success_function,error_function)
{
    $.ajax(
        {
            xhrFields: {
                withCredentials: true
            },
            contentType: 'application/json',
            timeout: 10000,
            dataType: 'json',
            url: `http://118.89.197.156:3000/action=${action}`,
            method: 'post',
            data: JSON.stringify(data),
            success: success_function,
            error: error_function,
        })
}
