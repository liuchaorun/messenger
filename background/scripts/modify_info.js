/**
 * Created by 31641 on 2017-6-27.
 */
/**Get and fill user's info**/
$(function ()
{
	const $username = $('#username');
	const $work_place = $('#work_place');
	AJAX('get_info', {},
		function (response)
		{
			if (response.status.code === 0)
				$error_modal.modal('show');
			else
			{
				let info = response.data;
				$username.text(info.username);
				$work_place.text(info.work_place);
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
	tip_by_id('new_username', '输入新用户名，16个字符以内');
	tip_by_id('new_work_place', '输入新工作地点，16个字符以内');
	tip_by_id('old_password', '输入旧密码');
	tip_by_id('new_password', '输入新密码，32个字符以内，允许数字、字母、下划线');
	tip_by_id('new_password_again', '重复输入新密码');
});

/**Modify username**/
$(function ()
{
	const $new_username = $('#new_username');
	const $modify_username_modal_btn = $('#modify_username_modal_btn');
	$modify_username_modal_btn.click(function (event)
	{
		event.preventDefault();
		if (!/^[A-z0-9\u4e00-\u9fa5]{1,16}$/.test($new_username.val()))
		{
			$new_username.css('borderColor', 'red');
			append_warning('modify_username_modal_body', 'danger', 'glyphicon-remove', '用户名不合法');
			return false;
		}
		let data = {};
		data.new_username = $new_username.val();
		modify_AJAX(data, 'modify_username_modal_body');
	})
});

/**modify workplace**/
$(function ()
{
	const $new_work_place = $('#new_work_place');
	const $modify_work_place_modal_btn = $('#modify_work_place_modal_btn');
	$modify_work_place_modal_btn.click(function (event)
	{
		event.preventDefault();
		if (!/^[A-z0-9\u4e00-\u9fa5]{1,16}$/.test($new_work_place.val()))
		{
			$new_work_place.css('borderColor', 'red');
			append_warning('modify_work_place_modal_body', 'danger', 'glyphicon-remove', '工作地点不合法');
			return false;
		}
		let data = {};
		data.new_work_place = $new_work_place.val();
		modify_AJAX(data, 'modify_work_place_modal_body');
	})
});

/**Modify Password**/
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
		else if (!/^[A-z0-9_]{1,32}$/.test($new_password.val()))
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
			append_warning('modify_password_modal_body', 'danger', 'glyphicon-remove', '信息填写非法');
			return false;
		}
		else
		{
			let data = {};
			data.old_password = $old_password.val();
			data.new_password = $new_password.val();
			AJAX('modify_password', data,
				function (response)
				{
					if (response.status.code === 0)
						append_warning('modify_password_modal_body', 'danger', 'glyphicon-remove', response.status.msg);
					else
					{
						append_warning('modify_password_modal_body', 'success', 'glyphicon-ok', response.status.msg);
						setTimeout(function ()
						{
							location.reload(true);
						}, 1000);
					}
				},
				function (error)
				{
					console.log(error);
					append_warning('modify_password_modal_body', 'danger', 'glyphicon-remove', '出现错误，请重试');
				});
		}
	});
});

function modify_AJAX(data, modal_body_id)
{
	AJAX('modify_user', data,
		function (response)
		{
			if (response.status.code === 0)
				append_warning(modal_body_id, 'danger', 'glyphicon-remove', response.status.msg);
			else
			{
				append_warning(modal_body_id, 'success', 'glyphicon-ok', response.status.msg);
				setTimeout(function ()
				{
					location.reload(true);
				}, 1000);
			}
		},
		function (error)
		{
			console.log(error);
			append_warning(modal_body_id, 'danger', 'glyphicon-remove', '出现错误，请重试');
		});
}