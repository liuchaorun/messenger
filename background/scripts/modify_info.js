/**
 * Created by 31641 on 2017-6-27.
 */
/**Get and fill user's info**/
$(function ()
{
	const [$username, $work_place] = [$('#username'), $('#work_place')];
	AJAX('get_info', {},
		function (response)
		{
			if (response.status.code === 0)
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
		if (!USERNAME_REG.test($new_username.val()))
		{
			$new_username.css('borderColor', 'red');
			modal_append_warning('modify_username_modal_body', 'danger', 'glyphicon-remove', '用户名不合法');
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
		if (!USERNAME_REG.test($new_work_place.val()))
		{
			$new_work_place.css('borderColor', 'red');
			modal_append_warning('modify_work_place_modal_body', 'danger', 'glyphicon-remove', '工作地点不合法');
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
	const [$old_password, $new_password, $new_password_again] =
		[$('#old_password'), $('#new_password'), $('#new_password_again')];
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
			modal_append_warning('modify_password_modal_body', 'danger', 'glyphicon-remove', '信息填写非法');
			return false;
		}
		else
		{
			let data = {};
			[data.old_password, data.new_password] = [md5($old_password.val()), md5($new_password.val())];
			AJAX('modify_password', data,
				function (response)
				{
					if (response.status.code === 0)
						modal_append_warning('modify_password_modal_body', 'danger', 'glyphicon-remove', response.status.msg);
					else
					{
						modal_append_warning('modify_password_modal_body', 'success', 'glyphicon-ok', response.status.msg);
						setTimeout(function ()
						{
							location.reload(true);
						}, 1000);
					}
				},
				function (error)
				{
					console.log(error);
					modal_append_warning('modify_password_modal_body', 'danger', 'glyphicon-remove', '出现错误，请重试');
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
				modal_append_warning(modal_body_id, 'danger', 'glyphicon-remove', response.status.msg);
			else
			{
				modal_append_warning(modal_body_id, 'success', 'glyphicon-ok', response.status.msg);
				setTimeout(function ()
				{
					location.reload(true);
				}, 1000);
			}
		},
		function (error)
		{
			console.log(error);
			modal_append_warning(modal_body_id, 'danger', 'glyphicon-remove', '出现错误，请重试');
		});
}