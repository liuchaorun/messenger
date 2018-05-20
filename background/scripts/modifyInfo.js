/**
 * Created by 31641 on 2017-6-27.
 */
/**获取信息并填写到页面上**/
$(function ()
{
    const $username = $('#username');
    const $work_place = $('#work_place');

    AJAX('/user/get_info', {},
        function (response)
        {
            if (response.status.code !== SUCC)
                $error_modal.modal('show');
            else
            {
                let info = response.data;
                $username.text(info.username);
                $work_place.text(info.work_place === null ? '无' : info.work_place);
            }
        },
        function (error)
        {
            console.log(error);
            $error_modal.modal('show');
        })
});

/**Tips**/
$(function ()
{
    addTooltipById('new_username', '输入新用户名，16个字符以内');
    addTooltipById('new_work_place', '输入新工作地点，16个字符以内');
    addTooltipById('old_password', '输入旧密码');
    addTooltipById('new_password', '输入新密码，32个字符以内，允许数字、字母、下划线');
    addTooltipById('new_password_again', '重复输入新密码');
});

/**用户名修改**/
$(function ()
{
    const $new_username = $('#new_username');
    const $modify_username_modal_btn = $('#modify_username_modal_btn');
    $modify_username_modal_btn.click(function (event)
    {
        event.preventDefault();
        if (!USERNAME_REG.test($new_username.val()))
        {
            $new_username.css('borderColor', 'red');
            showNotification('用户名不合法', FAILURE);
            return false;
        }
        let data = {};
        data.newUsername = $new_username.val();
        modifyAJAX(data);
    })
});

/**工作地点修改**/
$(function ()
{
    const $new_work_place = $('#new_work_place');
    const $modify_work_place_modal_btn = $('#modify_work_place_modal_btn');
    $modify_work_place_modal_btn.click(function (event)
    {
        event.preventDefault();
        if (!USERNAME_REG.test($new_work_place.val()))
        {
            $new_work_place.css('borderColor', 'red');
            showNotification('工作地点不合法', FAILURE);
            return false;
        }
        let data = {};
        data.newWorkPlace = $new_work_place.val();
        modifyAJAX(data);
    })
});

/**密码修改**/
/**action=modify_password
 * data={old_password,new_password}
 * **/
$(function ()
{
    const $old_password = $('#old_password');
    const $new_password = $('#new_password');
    const $new_password_again = $('#new_password_again');

    const $modify_password_modal_btn = $('#modify_password_modal_btn');

    $modify_password_modal_btn.click(function (event)
    {
        event.preventDefault();
        let status = true;
        if (!$old_password.val())
        {
            $old_password.css('borderColor', 'red');
            status = false;
        }
        else if (!PASSWORD_REG.test($new_password.val()))
        {
            $new_password.css('borderColor', 'red');
            status = false;
        }
        else if ($new_password.val() !== $new_password_again.val())
        {
            $new_password_again.css('borderColor', 'red');
            status = false;
        }

        if (status === false)
        {
            showNotification('信息填写不合法', FAILURE);
            return false;
        }
        else
        {
            let data = {};
            data.oldPassword = md5($old_password.val());
            data.newPassword = md5($new_password.val());

            AJAX('/user/modifyPassword', data,
                function (response)
                {
                    if (response.status.code !== SUCC)
                        showNotification(response.status.msg, FAILURE);
                    else
                    {
                        showNotification(response.status.msg);
                        setTimeout(function ()
                        {
                            location.reload(true);
                        }, 1000);
                    }
                },
                function (error)
                {
                    console.log(error);
                    showNotification('出现错误，请重试', FAILURE);
                });
        }
    });
});

function modifyAJAX(data)
{
    AJAX('/user/modifyUser', data,
        function (response)
        {
            if (response.status.code !== SUCC)
                showNotification(response.status.msg, FAILURE);
            else
            {
                showNotification(response.status.msg);
                setTimeout(function ()
                {
                    location.reload(true);
                }, 1000);
            }
        },
        function (error)
        {
            console.log(error);
            showNotification('出现错误，请重试', FAILURE);
        });
}