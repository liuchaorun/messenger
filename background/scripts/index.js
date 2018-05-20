/**
 * Created by 31641 on 2017-6-4.
 */

const $register_username = $('#register_username');
const $register_email = $('#register_email');
const $register_password = $('#register_password');
const $register_password_again = $('#register_password_again');
const $verification_code = $('#verification_code');

const $login_email = $('#login_email');
const $login_password = $('#login_password');


//const $remember_me_checkbox = $('#remember_me_checkbox');

/**检测IE**/
$(function ()
{
    const parser = new UAParser();
    const $ie9_warning = $('#ie9_warning');
    if (parser.getBrowser().name === 'IE')
    {
        if (parseInt(parser.getBrowser().version) === 9)
        {
            $ie9_warning.fadeIn(500);
        }
        else if (parseInt(parser.getBrowser().version) < 9)
        {
            window.location = 'ieReject.html';
        }
    }
});

/**输入提示**/
$(function ()
{
    addTooltipById('register_username', '请输入你的用户名。16个字符以内');
    addTooltipById('register_email', '请输入你的邮箱。邮箱将用于接收验证码以及登录');
    addTooltipById('register_password', '请输入你的密码。32个字符以内，允许字母、数字、下划线');
    addTooltipById('register_password_again', '请再次输入你的密码');
    addTooltipById('verification_code', '请输入接收到的验证码');
    addTooltipById('forget_username', '请输入最后使用的用户名');
    addTooltipById('forget_email', '请输入注册时使用的邮箱');
    addTooltipById('login_email', '请输入邮箱');
    addTooltipById('login_password', '请输入密码');
});

/**得到验证码**/
$(function ()
{
    const $verification_code_btn = $('#verification_code_btn');

    $verification_code_btn.click(
        function (event)
        {
            event.preventDefault();
            let status = true;
            if (!USERNAME_REG.test($register_username.val()))
            {
                $register_username.css('borderColor', 'red');
                status = false;
            }
            if (!EMAIL_REG.test($register_email.val()))
            {
                $register_email.css('borderColor', 'red');
                status = false;
            }
            if (!PASSWORD_REG.test($register_password.val()))
            {
                $register_password.css('borderColor', 'red');
                status = false;
            }
            else if ($register_password.val() !== $register_password_again.val())
            {
                $register_password_again.css('borderColor', 'red');
                status = false;
            }
            if (status === false)
            {
                //modal_append_warning('register_modal_body', 'danger', 'glyphicon-remove', '填写信息有误');
                showNotification('填写信息有误', FAILURE);
                return false;
            }

            $verification_code_btn.attr('disabled', 'disabled');
            const WAIT_TIME = 60;//(秒) 两次获得间隔时间;
            let sec = WAIT_TIME;
            let interval = setInterval(function ()
            {
                sec--;
                $verification_code_btn.text(`${sec}秒后再获取`);
            }, 1000);
            let timeout = setTimeout(function ()
            {
                clearInterval(interval);
                $verification_code_btn.removeAttr('disabled');
                $verification_code_btn.text('获取验证码');
                sec = WAIT_TIME;
            }, WAIT_TIME * 1000);

            let data = {};
            data.email = $register_email.val();

            AJAX('/signup', data,
                function (response)
                {
                    if (response.status.code !== SUCC)
                    {
                        //modal_append_warning('register_modal_body', 'danger', 'glyphicon-remove', response.status.msg);
                        showNotification(response.status.msg, FAILURE);
                        clearTimeout(timeout);
                        clearInterval(interval);
                        $verification_code_btn.removeAttr('disabled');
                        $verification_code_btn.text('获取验证码');
                    }
                },
                function (error)
                {
                    console.log(error);
                    showNotification('出现错误，请重试', FAILURE);
                    //modal_append_warning('register_modal_body', 'danger', 'glyphicon-remove', '出现错误，请重试');
                    clearTimeout(timeout);
                    clearInterval(interval);
                    $verification_code_btn.removeAttr('disabled');
                    $verification_code_btn.text('获取验证码');
                })
        }
    )
});

/**验证注册信息并提交**/
$(function ()
{
    const $register_modal = $('#register_modal');
    const $register_btn = $('#register_btn');
    const $login_modal = $('#login_modal');
    let status = true;
    $register_btn.click(function (event)
    {
        event.preventDefault();
        if (!USERNAME_REG.test($register_username.val()))
        {
            $register_username.css('borderColor', 'red');
            status = false;
        }
        if (!EMAIL_REG.test($register_email.val()))
        {
            $register_email.css('borderColor', 'red');
            status = false;
        }
        if (!PASSWORD_REG.test($register_password.val()))
        {
            $register_password.css('borderColor', 'red');
            status = false;
        }
        else if ($register_password.val() !== $register_password_again.val())
        {
            $register_password_again.css('borderColor', 'red');
            status = false;
        }
        if (!$verification_code.val())
        {
            $verification_code.css('borderColor', 'red');
            status = false;
        }
        if (status === false)
        {
            //modal_append_warning('register_modal_body', 'danger', 'glyphicon-remove', '填写信息有误');
            showNotification('填写信息有误', FAILURE);
            status = true;
            return false;
        }

        /**AJAX**/
        let data = {};
        [data.username, data.email, data.password, data.verify] =
            [$register_username.val(), $register_email.val(), md5($register_password.val()), $verification_code.val()];
        AJAX('/verify', data,
            function (response)
            {
                if (response.status.code !== SUCC)
                {
                    //modal_append_warning('register_modal_body', 'danger', 'glyphicon-remove', response.status.msg);
                    showNotification(response.status.msg, FAILURE);
                }
                else
                {
                    //modal_append_warning('register_modal_body', 'success', 'glyphicon-ok', response.status.msg);
                    showNotification(response.status.msg);
                    setTimeout(function ()
                    {
                        $register_modal.modal('hide');
                        $login_modal.modal('show');
                    }, 3000);
                }
            },
            function (error)
            {
                console.log(error);
                //modal_append_warning('register_modal_body', 'danger', 'glyphicon-remove', '出现错误，请重试');
                showNotification('出现错误，请重试', FAILURE);
            })
    });
});

/**登录**/
$(function ()
{
    const $login_btn = $('#login_btn');
    let status = true;
    $login_btn.click(function (event)
    {
        event.preventDefault();
        if (!EMAIL_REG.test($login_email.val()))
        {
            $login_email.css('borderColor', 'red');
            status = false;
        }
        if (!PASSWORD_REG.test($login_password.val()))
        {
            $login_password.css('borderColor', 'red');
            status = false;
        }
        if (status === false)
        {
            //modal_append_warning('login_modal_body', 'danger', 'glyphicon-remove', '填写信息有误');
            showNotification('账户名或密码不正确', FAILURE);
            return false;
        }

        let data = {};
        [data.email, data.password, data.remember_me] = [$login_email.val(), md5($login_password.val()), true];
        //data.remember_me = $remember_me_checkbox.is(':checked');
        AJAX('/login', data,
            function (response)
            {
                if (response.status.code !== SUCC)
                {
                    //modal_append_warning('login_modal_body', 'danger', 'glyphicon-remove', response.status.msg);
                    showNotification(response.status.msg, FAILURE);
                }
                else
                {
                    //modal_append_warning('login_modal_body', 'success', 'glyphicon-ok', response.status.msg);
                    showNotification(response.status.msg);
                    setTimeout(function ()
                    {
                        location.href = 'administration.html';
                    }, 1000);
                }
            },
            function (error)
            {
                console.log(error);
                //modal_append_warning('login_modal_body', 'danger', 'glyphicon-remove', '出现错误，请重试');
                showNotification('出现错误，请重试', FAILURE);
            })
    })
});

/**忘记密码**/
$(function ()
{
    const $login_modal = $('#login_modal');
    const $forget_modal = $('#forget_modal');
    const $forget_btn = $('#forget_btn');
    const $forget_email = $('#forget_email');
    const $forget_username = $('#forget_username');

    const $new_password_modal = $('#new_password_modal');
    const $new_password = $('#new_password');
    const $new_password_again = $('#new_password_again');
    const $new_password_modal_btn = $('#new_password_modal_btn');


    const $forget_link = $('#forget_link');

    $forget_link.click(function (event)
    {
        event.preventDefault();
        $login_modal.modal('hide');
        $forget_modal.modal('show');
    });

    let status = false;

    $forget_btn.click(function (event)
    {
        event.preventDefault();
        //modal_append_warning('forget_modal_body', 'info', 'glyphicon-send', "处理中，请稍后");
        showNotification('处理中，请稍后', WARNING);
        status = true;
        if (!USERNAME_REG.test($forget_username.val()))
        {
            $forget_username.css('borderColor', 'red');
            status = false;
        }
        if (!EMAIL_REG.test($forget_email.val()))
        {
            $forget_email.css('borderColor', 'red');
            status = false;
        }
        if (status === false)
        {
            //modal_append_warning('forget_modal_body', 'danger', 'glyphicon-remove', '填写信息有误');
            showNotification('填写信息有误', FAILURE);
            status = true;
            return false;
        }

        let data = {};
        data.username = $forget_username.val();
        data.email = $forget_email.val();

        AJAX('/user/forget', data,
            function (response)
            {
                if (response.status.code !== SUCC)
                {
                    //modal_append_warning('forget_modal_body', 'danger', 'glyphicon-remove', response.status.msg);
                    showNotification(response.status.msg, FAILURE);
                }
                else
                {
                    $forget_modal.modal('hide');
                    $new_password_modal.modal('show');
                }
            },
            function (error)
            {
                console.log(error);
                //modal_append_warning('forget_modal_body', 'danger', 'glyphicon-remove', '出现错误，请重试');
                showNotification('出现错误，请重试', FAILURE);
            })
    });

    $new_password_modal_btn.click(function (event)
    {
        event.preventDefault();
        status = true;
        if (!PASSWORD_REG.test($new_password.val()))
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
            //modal_append_warning('new_password_modal_body', 'danger', 'glyphicon-remove', '填写信息有误');
            showNotification('填写信息有误', FAILURE);
            status = true;
            return false;
        }

        let data = {};
        data.new_password = md5($new_password.val());
        AJAX('/user/new_password', data,
            function (response)
            {
                if (response.status.code !== SUCC)
                {
                    //modal_append_warning('new_password_modal_body', 'danger', 'glyphicon-remove', response.status.msg);
                    showNotification(response.status.msg, FAILURE);
                }
                else
                {
                    //modal_append_warning('new_password_modal_body', 'success', 'glyphicon-ok', response.status.msg);
                    showNotification(response.status.msg);
                    setTimeout(function ()
                    {
                        $new_password_modal.modal('hide');
                    }, 3000)
                }
            },
            function (error)
            {
                console.log(error);
                //modal_append_warning('new_password_modal_body', 'danger', 'glyphicon-remove', '出现错误，请重试');
                showNotification('出现错误，请重试', FAILURE);
            })

    })
});