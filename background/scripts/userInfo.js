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

/**得到信息并填充**/
$(function ()
{
    const $username = $('#username');
    const $email = $('#email');
    const $work_place = $('#work_place');
    const $screen_num = $('#screen_num');
    const $picture_num = $('#picture_num');
    const $last_login_time = $('#last_login_time');

    AJAX('/user/getInfo', {},
        function (response)
        {
            if (response.status.code !== SUCC)
                $error_modal.modal('show');
            else
            {
                let info = response.data;
                $username.text(info.username);
                $email.text(info.email);
                $work_place.text(info.workPlace === '' ? '无' : info.workPlace);
                $screen_num.text(info.screenNum);
                $picture_num.text(info.adNum);
                $last_login_time.text(parseTimeString(info.lastLoginTime));
            }
        },
        function (error)
        {
            console.log(error);
            $error_modal.modal('show');
        })
});