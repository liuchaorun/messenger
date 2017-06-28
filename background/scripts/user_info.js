/**
 * Created by 31641 on 2017-6-25.
 */
/**
 <p><span class="glyphicon glyphicon-user"></span> 用户名：<span id="username"></span></p>
 <p><span class="glyphicon glyphicon-envelope"></span> 邮箱：<span id="email"></span></p>
 <p><span class="glyphicon glyphicon-phone"></span> 屏幕数：<span id="screen_num"></span></p>
 <p><span class="glyphicon glyphicon-picture"></span> 图片数：<span id="picture_num"></span></p>
 <p><span class="glyphicon glyphicon-log-in"></span> 上次登录时间：<span id="last_login_time"></span></p>
 **/

/**获取并填充信息**/
$(function ()
{
    const $username = $('#username');
    const $email = $('#email');
    const $screen_num = $('#screen_num');
    const $picture_num = $('#picture_num');
    const $last_login_time = $('#last_login_time');
    AJAX('get_info', {},
        function (response)
        {
            if (response.status.code === 0)
                $error_modal.modal('show');
            else
            {
                let info = response.data;
                let last_login_time = new Date(info.last_login_time);
                $username.text(info.username);
                $email.text(info.email);
                $screen_num.text(info.screen_num);
                $picture_num.text(info.picture_num);
                $last_login_time.text(`${last_login_time.getFullYear()}年${last_login_time.getMonth() + 1}月${last_login_time.getDate()}日${last_login_time.getHours()}时${last_login_time.getMinutes()}分`)
            }
        },
        function (error)
        {
            console.log(error);
            $error_modal.modal('show');
        })
});