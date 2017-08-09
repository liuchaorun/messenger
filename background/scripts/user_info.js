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

/**Get and fill info**/
$(function ()
{
	const $username = $('#username');
	const $email = $('#email');
	const $work_place = $('#work_place');
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
				$username.text(info.username);
				$email.text(info.email);
				$work_place.text(info.work_place);
				$screen_num.text(info.screen_num);
				$picture_num.text(info.picture_num);
				$last_login_time.text(parse_time_string(info.last_login_time));
			}
		},
		function (error)
		{
			console.log(error);
			$error_modal.modal('show');
		})
});