/**
 * Created by 31641 on 2017-6-4.
 */
const $username = $('#username');
const $email = $('#email');
const $password = $('#password');
const $password_again = $('#password_again');
const $verification_code = $('#verification_code');

const $input = $('input');

/**输入框弹框**/
$(function ()
{
    $username.tooltip(
        {
            container: 'body',
            placement: 'left',
            trigger: 'focus hover',
            title: '请输入你的用户名。16个字符以内'
        }
    );

    $email.tooltip(
        {
            container: 'body',
            placement: 'left',
            trigger: 'focus hover',
            title: '请输入你的邮箱。邮箱将用于接收验证码以及登录'
        }
    );

    $password.tooltip(
        {
            container: 'body',
            placement: 'left',
            trigger: 'focus hover',
            title: '请输入你的密码。32个字符以内，允许字母、数字、下划线'
        }
    );

    $password_again.tooltip(
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
           /**TODO:提交AJAX获取验证码**/
       }
   )
});

/**输入验证以及提交**/
$(function ()
{
    const $register_btn = $('#register_btn');
    const $register_error = $('#register_error');
    $register_btn.click(function ()
    {
        if (!/^[A-z0-9\u4e00-\u9fa5]{1,16}$/.test($username.val()))
        {
            $username.css('borderColor', 'red');
            $register_error.css('opacity', 1);
            return false;
        }
        if (!/^[A-z0-9]+@([A-z0-9]+\.[a-z]+)+$/.test($email.val()))
        {
            $email.css('borderColor', 'red');
            $register_error.css('opacity', 1);
            return false;
        }
        if (!/^[A-z0-9_]{1,32}$/.test($password.val()))
        {
            $password.css('borderColor', 'red');
            $register_error.css('opacity', 1);
            return false;
        }
        else if (!$password.val() === $password_again.val())
        {
            $password_again.css('borderColor', 'red');
            $register_error.css('opacity', 1);
            return false;
        }
        if (!$verification_code.val())
        {
            $verification_code.css('borderColor', 'red');
            $register_error.css('opacity', 1);
            return false;
        }
    });
    $input.click(function ()
    {
        $(this).removeAttr('style');
    });
});