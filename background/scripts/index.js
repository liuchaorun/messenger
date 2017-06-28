/**
 * Created by 31641 on 2017-6-4.
 */
const $register_username = $('#register_username');
const $register_email = $('#register_email');
const $register_password = $('#register_password');
const $register_password_again = $('#register_password_again');
const $verification_code = $('#verification_code');

const $register_error = $('#register_error');

const $login_email = $('#login_email');
const $login_password = $('#login_password');
const $login_error = $('#login_error');

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
                        $register_error.text(response.status.msg);
                        $register_error.css('opacity', 1);
                        clearTimeout(timeout);
                        clearInterval(interval);
                        $verification_code_btn.removeAttr('disabled');
                        $verification_code_btn.text('获取验证码');
                    }
                },
                function (error)
                {
                    console.log(error);
                    $register_error.text('出现错误。请重试');
                    $register_error.css('opacity', 1);
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
    const $alert = $('.alert');
    const $register_modal = $('#register_modal');
    const $register_btn = $('#register_btn');
    let status = true;
    $register_btn.click(function ()
    {
        if (!/^[A-z0-9\u4e00-\u9fa5]{1,16}$/.test($register_username.val()))
        {
            $register_username.css('borderColor', 'red');
            $register_error.text('用户名非法');
            $register_error.css('opacity', 1);
            status = false;
        }
        if (!/^[A-z0-9]+@([A-z0-9]+\.[a-z]+)+$/.test($register_email.val()))
        {
            $register_email.css('borderColor', 'red');
            $register_error.text('邮箱非法');
            $register_error.css('opacity', 1);
            status = false;
        }
        if (!/^[A-z0-9_]{1,32}$/.test($register_password.val()))
        {
            $register_password.css('borderColor', 'red');
            $register_error.text('密码非法');
            $register_error.css('opacity', 1);
            status = false;
        }
        else if ($register_password.val() !== $register_password_again.val())
        {
            $register_password_again.css('borderColor', 'red');
            $register_error.text('两次密码不一致');
            $register_error.css('opacity', 1);
            status = false;
        }
        if (!$verification_code.val())
        {
            $verification_code.css('borderColor', 'red');
            $register_error.text('验证码非法');
            $register_error.css('opacity', 1);
            status = false;
        }
        if (status === false)
            return false;

        /**AJAX**/
        let data = {};
        data.username = $register_username.val();
        data.email = $register_email.val();
        data.password = $register_password.val();
        data.vertify= $verification_code.val();
        AJAX('vertify', data,
            function (response)
            {
                if (response.status.code === 0)
                {
                    $register_error.text(response.status.msg);
                    $register_error.css('opacity', 1);
                }
                else
                {
                    $register_error.text(response.status.msg);
                    $register_error.removeClass('alert-danger').addClass('alert-success');
                    $register_error.css('opacity', 1);
                    setTimeout(function ()
                    {
                        $register_modal.modal(`hide`);
                        $register_error.removeClass('alert-success').addClass('alert-danger');
                        $register_error.css('opacity', 0);
                    }, 3000);
                }
            },
            function (error)
            {
                console.log(error);
                $register_error.text('出现错误。请重试');
                $register_error.css('opacity', 1);
            })
    });


    $input.click(function ()
    {
        $(this).removeAttr('style');
    });
    $button.click(function ()
    {
        $alert.removeAttr('style');
        $input.removeAttr('style');
        $input.val('');
    })
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
           $login_error.text('邮箱非法');
           $login_error.css('opacity', 1);
           status = false;
       }
       if (!/^[A-z0-9_]{1,32}$/.test($login_password.val()))
       {
           $login_password.css('borderColor', 'red');
           $login_error.text('密码非法');
           $login_error.css('opacity', 1);
           status = false;
       }
       if (status === false)
           return false;

       /**AJAX**/
       let data = {};
       data.email = $login_email.val();
       data.password = $login_password.val();
       AJAX('login', data,
           function (response)
           {
               if (response.status.code === 0)
               {
                   $login_error.text(response.status.msg);
                   $login_error.css('opacity', 1);
               }
               else
               {
                   $login_error.text(response.status.msg);
                   $login_error.removeClass('alert-danger').addClass('alert-success');
                   $login_error.css('opacity', 1);
                   setTimeout(function ()
                   {
                       location.href = 'administration.html';
                   }, 1000);
               }
           },
           function (error)
           {
               console.log(error);
               $login_error.text('出现错误。请重试');
               $login_error.css('opacity', 1);
           })
   })
});