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
const $remember_me_checkbox = $('#remember_me_checkbox');

/**输入框弹框**/
$(function ()
{
    $register_username.tooltip(
        {
            container: 'body',
            placement: 'left',
            trigger: 'focus hover',
            title: '请输入你的用户名。16个字符以内'
        }
    );

    $register_email.tooltip(
        {
            container: 'body',
            placement: 'left',
            trigger: 'focus hover',
            title: '请输入你的邮箱。邮箱将用于接收验证码以及登录'
        }
    );

    $register_password.tooltip(
        {
            container: 'body',
            placement: 'left',
            trigger: 'focus hover',
            title: '请输入你的密码。32个字符以内，允许字母、数字、下划线'
        }
    );

    $register_password_again.tooltip(
        {
            container: 'body',
            placement: 'left',
            trigger: 'focus hover',
            title: '请再次输入你的密码'
        }
    );

    $verification_code.tooltip(
        {
            container: 'body',
            placement: 'left',
            trigger: 'focus hover',
            title: '请输入接收到的验证码'
        }
    );
});

/**获取验证码**/
$(function ()
{
    const $verification_code_btn = $('#verification_code_btn');
    $verification_code_btn.click(
        function ()
        {
            let status = true;
            if (!/^[A-z0-9\u4e00-\u9fa5]{1,16}$/.test($register_username.val()))
            {
                $register_username.css('borderColor', 'red');
                status = false;
            }
            if (!/^[A-z0-9]+@([A-z0-9]+\.[a-z]+)+$/.test($register_email.val()))
            {
                $register_email.css('borderColor', 'red');
                status = false;
            }
            if (!/^[A-z0-9_]{1,32}$/.test($register_password.val()))
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
                append_warning('register_modal_body', 'danger', 'glyphicon-remove', '填写信息有误');
                return false;
            }

            $verification_code_btn.attr('disabled', 'disabled');
            let sec = 60;
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
                sec = 60;
            }, 60000);

            let data = {};
            data.email = $register_email.val();

            AJAX('signup', data,
                function (response)
                {
                    if (response.status.code === 0)
                    {
                        append_warning('register_modal_body', 'danger', 'glyphicon-remove', response.status.msg);
                        clearTimeout(timeout);
                        clearInterval(interval);
                        $verification_code_btn.removeAttr('disabled');
                        $verification_code_btn.text('获取验证码');
                    }
                },
                function (error)
                {
                    console.log(error);
                    append_warning('register_modal_body', 'danger', 'glyphicon-remove', '出现错误，请重试');
                    clearTimeout(timeout);
                    clearInterval(interval);
                    $verification_code_btn.removeAttr('disabled');
                    $verification_code_btn.text('获取验证码');
                })
        }
    )
});

/**输入验证以及提交**/
$(function ()
{
    const $input = $('input');
    const $button = $('.container .btn');
    const $register_modal = $('#register_modal');
    const $register_btn = $('#register_btn');
    let status = true;
    $register_btn.click(function ()
    {
        if (!/^[A-z0-9\u4e00-\u9fa5]{1,16}$/.test($register_username.val()))
        {
            $register_username.css('borderColor', 'red');
            status = false;
        }
        if (!/^[A-z0-9]+@([A-z0-9]+\.[a-z]+)+$/.test($register_email.val()))
        {
            $register_email.css('borderColor', 'red');
            status = false;
        }
        if (!/^[A-z0-9_]{1,32}$/.test($register_password.val()))
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
            append_warning('register_modal_body', 'danger', 'glyphicon-remove', '填写信息有误');
            return false;
        }

        /**AJAX**/
        let data = {};
        data.username = $register_username.val();
        data.email = $register_email.val();
        data.password = $register_password.val();
        data.verify = $verification_code.val();
        AJAX('verify', data,
            function (response)
            {
                if (response.status.code === 0)
                {
                    append_warning('register_modal_body', 'danger', 'glyphicon-remove', response.status.msg);
                }
                else
                {
                    append_warning('register_modal_body', 'danger', 'glyphicon-remove', response.status.msg);
                    setTimeout(function ()
                    {
                        $register_modal.modal('hide');
                    }, 3000);
                }
            },
            function (error)
            {
                console.log(error);
                append_warning('register_modal_body', 'danger', 'glyphicon-remove', '出现错误，请重试');
            })
    });
});

/**登录**/
$(function ()
{
    const $login_btn = $('#login_btn');
    let status = true;
    $login_btn.click(function ()
    {
        if (!/^[A-z0-9]+@([A-z0-9]+\.[a-z]+)+$/.test($login_email.val()))
        {
            $login_email.css('borderColor', 'red');
            status = false;
        }
        if (!/^[A-z0-9_]{1,32}$/.test($login_password.val()))
        {
            $login_password.css('borderColor', 'red');
            status = false;
        }
        if (status === false)
        {
            append_warning('login_modal_body', 'danger', 'glyphicon-remove', '填写信息有误');
            return false;
        }

        let data = {};
        data.email = $login_email.val();
        data.password = $login_password.val();
        data.remember_me = $remember_me_checkbox.is(':checked');
        AJAX('login', data,
            function (response)
            {
                if (response.status.code === 0)
                {
                    append_warning('login_modal_body', 'danger', 'glyphicon-remove', response.status.msg);
                }
                else
                {
                    append_warning('login_modal_body', 'success', 'glyphicon-remove', response.status.msg);
                    setTimeout(function ()
                    {
                        location.href = 'administration.html';
                    }, 1000);
                }
            },
            function (error)
            {
                console.log(error);
                append_warning('login_modal_body', 'danger', 'glyphicon-remove', '出现错误，请重试');
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
    const $forget = $('#forget');
    let status;
    $forget.click(function (event)
    {
        event.preventDefault();
        $login_modal.modal('hide');
        $forget_modal.modal('show');
    });

    $forget_btn.click(function ()
    {
        status = true;
        if (!/^[A-z0-9\u4e00-\u9fa5]{1,16}$/.test($forget_username.val()))
        {
            $forget_username.css('borderColor', 'red');
            status = false;
        }
        if (!/^[A-z0-9]+@([A-z0-9]+\.[a-z]+)+$/.test($forget_email.val()))
        {
            $forget_email.css('borderColor', 'red');
            status = false;
        }
        if (status === false)
        {
            append_warning('forget_modal_body', 'danger', 'glyphicon-remove', '填写信息有误');
            return false;
        }

        let data = {};
        data.username = $forget_username.val();
        data.email = $forget_email.val();
        AJAX('forget', data,
            function (response)
            {
                if (response.status.code === 0)
                {
                    append_warning('forget_modal_body', 'danger', 'glyphicon-remove', response.status.msg);
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
                append_warning('forget_modal_body', 'danger', 'glyphicon-remove', '出现错误，请重试');
            })
    });

    $new_password_modal_btn.click(function ()
    {
        status = true;
        if (!/^[A-z0-9_]{1,32}$/.test($new_password.val()))
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
            append_warning('new_password_modal_body', 'danger', 'glyphicon-remove', '填写信息有误');
            return false;
        }

        let data = {};
        data.new_password = $new_password.val();
        AJAX('new_password', data,
            function (response)
            {
                if (response.status.code === 0)
                {
                    append_warning('new_password_modal_body', 'danger', 'glyphicon-remove', response.status.msg);
                }
                else
                {
                    append_warning('new_password_modal_body', 'success', 'glyphicon-ok', response.status.msg);
                    setTimeout(function ()
                    {
                        $new_password_modal.modal('hide');
                    }, 3000)
                }
            },
            function (error)
            {
                console.log(error);
                append_warning('new_password_modal_body', 'danger', 'glyphicon-remove', '出现错误，请重试');
            })

    })
});