/**
 * Created by 31641 on 2017-6-27.
 */
/**Get packages' info and fill the table**/

/**DOM structure
 * <tr id=${pack.id}>
 <td>${i+1}</td>
 <td>${pack.name}</td>
 <td>${pack.note}</td>
 <td>
 <button class="plus_screen btn btn-primary btn-sm">+</button>
 <span class="screens">${pack.screen}</span>
 <button class="minus_screen btn btn-primary btn-sm">-</button>
 </td>
 <td><input type="checkbox" class="checkbox-inline screen_checkbox"></td>
 </tr>
 * **/

/**
 * data
 * [
 *      {id,name,note,screen},
 *      {id,name,note,screen},
 *      {id,name,note,screen},
 *      {id,name,note,screen},
 *
 * ]
 * screen is the string that stitched by screens' names
 * **/
$(function ()
{
	const $package_management_table = $('#package_management_table');
	const $error_modal = $('#error_modal');
	AJAX('get_pack', {},
		function (response)
		{
			if (response.status.code === 0)
				$error_modal.modal('show');
			else
			{
				let packs = response.data.resources;
				for (let i = 0; i < packs.length; i++)
				{
					$package_management_table.append(`<tr id=${packs[i].resource_id}> 
 <td>${i + 1}</td>
 <td>${packs[i].name}</td>
 <td>${packs[i].note === '' ? '无' : packs[i].note}</td>
 <td>
 <button class="plus_screen btn btn-primary btn-sm">+</button>
 <span class="screens">${packs[i].screen.length > 1 ? packs[i].screen[0].name + '……' : packs[i].screen.length === 0 ? '无' : packs[i].screen[0].name}</span>
 <button class="minus_screen btn btn-primary btn-sm">-</button>
 </td>
 <td><input type="checkbox" class="checkbox-inline screen_checkbox"></td>
 </tr>`)
				}
			}
			activate_button();
		},
		function (error)
		{
			console.log(error);
			$error_modal.modal('show');
		});
});

/**Add button**/
$(function ()
{
	const $add_btn = $('#add_btn');
	$add_btn.click(function ()
	{
		modal_prepend_warning('add_modal_footer', 'info', 'glyphicon-refresh', '加载中……', 'tip');
		image_AJAX('add', 'add_modal_table', 'add_modal_btn', 'add_modal_footer');
	});

});

/**Add submit button**/
$(function ()
{
	const $add_modal_btn = $('#add_modal_btn');
	$add_modal_btn.click(function ()
	{
		package_AJAX('add_modal_table', 'pack_name_input', 'pack_note_input', 'add_modal_footer', 'add_pack');
	});
});

/**Modify and modify submit button**/
$(function ()
{
	const $modify_btn = $('#modify_btn');
	const $modify_error_modal = $('#modify_error_modal');
	const [$modify_modal, $modify_modal_table, $modify_modal_btn, $new_pack_name_input, $new_pack_note_input] =
		[$('#modify_modal'), $('#modify_modal_table'), $('#modify_modal_btn'), $('#new_pack_name_input'), $('#new_pack_note_input')];
	const [$modify_multiple_modal, $modify_multiple_modal_btn, $multiple_new_pack_note_input] =
		[$('#modify_multiple_modal'), $('#modify_multiple_modal_btn'), $('#multiple_new_pack_note_input')];
	let data = {};
	$modify_btn.click(function (event)
	{
		event.preventDefault();
		let checked_pack = [];
		let checked_checkboxes = $('.screen_checkbox:checked');
		if (checked_checkboxes.length === 0)
		{
			$modify_error_modal.modal('show');
			return false;
		}
		else if (checked_checkboxes.length === 1)
		{
			$modify_modal.modal('show');
			modal_prepend_warning('modify_modal_footer', 'info', 'glyphicon-refresh', '加载中……', 'tip');
			AJAX('get_pack_info', {pack_id: $(checked_checkboxes[0]).parent().parent().attr('id')},
				function (response)
				{
					if (response.status.code === 0)
					{
						modal_prepend_warning('modify_modal_footer', 'danger', 'glyphicon-remove', response.status.msg, 'tip');
						$modify_modal_btn.attr('disabled', 'disabled');
					}
					else
					{
						image_AJAX('modify', 'modify_modal_table', 'modify_modal_btn', 'modify_modal_footer');
						$modify_modal_btn.removeAttr('disabled');
						let pack_info = response.data;
						$new_pack_name_input.val(pack_info.name);
						$new_pack_note_input.val(pack_info.note);
						let checked_pictures = pack_info.used_pictures;
						let checked_picture;
						for (let picture_id in checked_pictures)
						{
							if (checked_pictures.hasOwnProperty(picture_id) && !/.+\..+/.test(picture_id))
							{
								checked_picture = $modify_modal_table.find(`label[class=${picture_id}]`);
								$(checked_picture).children().first().css('backgroundImage', 'url("../images/selected.png")');
								$(checked_picture).children().first().children().css('opacity', 0.25);
								$(checked_picture).find('input[type=text]')
									.css('opacity', 1)
									.removeAttr('disabled')
									.val(checked_pictures[picture_id]);
								$(checked_picture).find('input[type=checkbox]').attr('checked', true);
							}
						}
					}
				},
				function (error)
				{
					console.log(error);
					modal_prepend_warning('modify_modal_footer', 'danger', 'glyphicon-remove', '出现错误，请重试', 'tip');
					$modify_modal_btn.attr('disabled', 'disabled');
				})
		}
		else
			$modify_multiple_modal.modal('show');
		for (let checkbox of checked_checkboxes)
			checked_pack.push($(checkbox).parent().parent().attr('id'));
		data.pack = checked_pack;

		$modify_modal_btn.click(function (event)
		{
			event.preventDefault();
			let picture_id = [], picture_time = [];
			let picture_checked_checkboxes = $modify_modal_table.find('input:checked');
			if (picture_checked_checkboxes.length === 0)
			{
				modal_prepend_warning('modify_modal_footer', 'danger', 'glyphicon-remove', '至少选择一幅图片', 'tip');
				return false;
			}
			for (const checkbox of picture_checked_checkboxes)
			{
				picture_id.push($(checkbox).parent().attr('class'));
				if (!/^[\d]*$/.test($(checkbox).next().val()) || $(checkbox).next().val() === 0)
				{
					modal_prepend_warning('modify_modal_footer', 'danger', 'glyphicon-remove', '时间必须为正整数', 'tip');
					border_color_by_id($(checkbox).next().attr('id'));
					return false;
				}
				picture_time.push($(checkbox).next().val() === '' ? 10 : $(checkbox).next().val());
			}
			if (!PACK_NAME_REG.test($new_pack_name_input.val()))
			{
				modal_prepend_warning('modify_modal_footer', 'danger', 'glyphicon-remove', '包名不合法', 'tip');
				border_color_by_id('new_pack_name_input');
				return false;
			}
			if (!PACK_NOTE_REG.test($new_pack_note_input.val()))
			{
				modal_prepend_warning('modify_modal_footer', 'danger', 'glyphicon-remove', '备注不合法', 'tip');
				border_color_by_id('new_pack_note_input');
				return false;
			}
			[data.picture_id, data.picture_time, data.new_pack_name, data.new_pack_note, data.mutiple] =
				[picture_id, picture_time, $new_pack_name_input.val(), $new_pack_note_input.val(), false];
			modify_AJAX(false, data);
		});

		$modify_multiple_modal_btn.click(function (event)
		{
			event.preventDefault();
			if (!/^[A-z0-9\u4e00-\u9fa5]{1,32}$/.test($multiple_new_pack_note_input.val()))
			{
				modal_prepend_warning('modify_multiple_modal_footer', 'danger', 'glyphicon-remove', '备注不合法', 'tip');
				border_color_by_id('multiple_new_pack_note_input');
				return false;
			}
			[data.new_pack_note, data.mutiple] = [$multiple_new_pack_note_input.val(), true];
			modify_AJAX(true, data);
		});
	});
});

/**Delete button**/
$(function ()
{
	const [$del_btn, $del_modal, $del_modal_btn, $del_error_modal] =
		[$('#del_btn'), $('#del_modal'), $('#del_modal_btn'), $('#del_error_modal')];

	$del_btn.click(function ()
	{
		event.preventDefault();
		let checked_pack = [];
		let checked_checkboxes = $('input:checked');
		if (checked_checkboxes.length === 0)
		{
			$del_error_modal.modal('show');
			return false;
		}
		else
		{
			let data = {};
			$del_modal.modal('show');
			for (const checkbox of checked_checkboxes)
				checked_pack.push($(checkbox).parent().parent().attr('id'));
			data.pack = checked_pack;
			$del_modal_btn.click(function (event)
			{
				event.preventDefault();
				AJAX('del_pack', data,
					function (response)
					{
						if (response.status.code === 0)
							modal_prepend_warning('del_modal_footer', 'danger', 'glyphicon-remove', response.status.msg, 'tip');
						else
						{
							modal_prepend_warning('del_modal_footer', 'success', 'glyphicon-ok', response.status.msg, 'tip');
							setTimeout(function ()
							{
								location.reload(true);
							}, 3000);
						}
					},
					function (error)
					{
						console.log(error);
						modal_prepend_warning('del_modal_footer', 'danger', 'glyphicon-remove', '出现错误，请重试', 'tip');
					})
			});
		}
	})
});

/**Set height**/
$(function ()
{
	auto_height('package_management_panel_body', 90);
	auto_height('add_modal_table_div', 300);
	auto_height('modify_modal_table_div', 300);
	auto_max_height('screen_modal_body', 225);
	auto_height('plus_modal_body', 225);
	auto_height('minus_modal_body', 225);

});

/**Tips**/
$(function ()
{
	tip_by_className('pack_name_input', '16位以内字母、数字与汉字', 'top');
	tip_by_className('pack_note_input', '32位以内字母、数字与汉字', 'top');
});

/**plus/minus_modal button**/
$(function ()
{
	const [$plus_modal_btn, $minus_modal_btn] = [$('#plus_modal_btn'), $('#minus_modal_btn')];
	$plus_modal_btn.click(function (event)
	{
		event.preventDefault();
		screen_AJAX('plus', 'add_pack_screen');
	});
	$minus_modal_btn.click(function (event)
	{
		event.preventDefault();
		screen_AJAX('minus', 'del_pack_screen');
	})
});

function screen_AJAX(type, action)
{
	let data = {};
	data.screen = [];
	data.resource_id = $(`#${type}_head_row`).attr('class');
	let checked_checkboxes = $(`#${type}_modal_table`).find('input:checked');
	if (checked_checkboxes.length === 0)
	{
		modal_prepend_warning(`${type}_modal_footer`, 'danger', 'glyphicon-remove', '至少选择一个屏幕', 'tip');
		return false;
	}
	for (let checkbox of checked_checkboxes)
		data.screen.push(parseInt($(checkbox).parent().parent().attr('class')));
	AJAX(action, data,
		function (response)
		{
			if (response.status.code === 0)
				modal_prepend_warning(`${type}_modal_footer`, 'danger', 'glyphicon-remove', response.status.msg, 'tip');
			else
			{
				modal_prepend_warning(`${type}_modal_footer`, 'success', 'glyphicon-ok', response.status.msg, 'tip');
				setTimeout(function ()
				{
					location.reload(true);
				}, 1000);
			}
		},
		function (error)
		{

			console.log(error);
			modal_prepend_warning(`${type}_modal_footer`, 'danger', 'glyphicon-remove', '出现错误，请重试', 'tip');
		})
}

/**
 *DOM structure
 <div class="add_modal_row">
 <div class="add_modal_cell">
 <label id=`${pictures[i].id}`><img src=`${pictures[i].src}` alt="test" class="image img-responsive"><input type="checkbox"        class="add_checkbox"></label>
 </div>
 </div>
 </div>
 * **/
/**
 * data：
 * [
 *      {id,url},
 *      {id,url},
 *      {id,url},
 *      {id,url}
 * ]
 *
 * <input type="text" class="form-control" id=${}.id_time>
 * **/
function image_AJAX(type, table_id, button_id, footer_id)
{
	const PICTURES_PER_ROW = 5;
	if ($(`#${table_id}`).find('.modal_cell').length)
		activate_checkbox(type);
	else
	{
		AJAX('get_picture', {},
			function (response)
			{
				if (response.status.code === 0)
				{
					modal_prepend_warning(`${footer_id}`, 'danger', 'glyphicon-remove', response.status.msg, 'tip');
					$(`#${button_id}`).attr('disabled', 'disabled');
				}
				else
				{
					$(`#${button_id}`).removeAttr('disabled');
					let pictures = response.data.pictures;
					let row = 0;
					let $row_node = $(`<div class="modal_row"></div>`);
					for (; row < Math.floor(pictures.length / PICTURES_PER_ROW); row++)
					{
						for (let i = 0; i < PICTURES_PER_ROW; i++)
						{
							$row_node.append(`<div class="modal_cell"><label class=${pictures[row * PICTURES_PER_ROW + i].id}><div class="picture_div"><img src=${pictures[row * PICTURES_PER_ROW + i].src} alt=${pictures[row * PICTURES_PER_ROW + i].id} class="image img-responsive"></div><input type="checkbox" class="${type}_checkbox"><input type="text" class="form-control  picture_time_input" id=${table_id}_${pictures[row * PICTURES_PER_ROW + i].id}_time maxlength="6" disabled placeholder="10"></label></div>`)
						}
						$(`#${table_id}`).append($row_node);
						$row_node = $(`<div class="modal_row"></div>`);
					}
					if (pictures.length - row * PICTURES_PER_ROW > 0 && !$('#modify_modal_table_last_row').length)
					{
						$(`#${table_id}`).append(`<div class="modal_row" id="${table_id}_last_row"></div>`);
						for (let i = 0; i < pictures.length - row * 5; i++)
						{
							$(`#${table_id}_last_row`).append(`<div class="modal_cell"><label class=${pictures[row * 5 + i].id}><div class="picture_div"><img src=${pictures[row * 5 + i].src} alt=${pictures[row * 5 + i].id} class="image img-responsive"></div><input type="checkbox" class="${type}_checkbox"><input type="text" class="form-control  picture_time_input" id=${table_id}_${pictures[row * 5 + i].id}_time maxlength="6" disabled placeholder="10"></label></div></div>`)
						}
					}
					activate_checkbox(type);
					tip_by_className('picture_time_input', '该图片的播放时间(秒)', 'bottom');
				}
			},
			function (error)
			{
				console.log(error);
				modal_prepend_warning(`${footer_id}`, 'danger', 'glyphicon-remove', '出现错误，请重试', 'tip');
				$(`#${button_id}`).attr('disabled', 'disabled');
			}, false)
	}
}

/**
 * data
 * {
 *     picture_id = [],
 *     picture_time = [],
 *     pack_name = '',
 *     pack_note = '',
 * }
 *
 * add's action：add_pack
 * **/
function package_AJAX(table_id, name_input_id, note_input_id, footer_id, action)
{
	let checkboxes = $(`#${table_id}`).find(':checked');
	let data = {};
	let picture_id = [];
	let picture_time = [];
	[data.pack_name, data.pack_note] = [$(`#${name_input_id}`).val(), $(`#${note_input_id}`).val()];
	if (!PACK_NAME_REG.test(data.pack_name))
	{
		modal_prepend_warning(`${footer_id}`, 'danger', 'glyphicon-remove', '包名不合法', 'tip');
		border_color_by_id(name_input_id);
		return false;
	}
	if (!PACK_NOTE_REG.test(data.pack_note))
	{
		modal_prepend_warning('modify_modal_footer', 'danger', 'glyphicon-remove', '备注不合法', 'tip');
		border_color_by_id(note_input_id);
		return false;
	}
	if (checkboxes.length === 0)
	{
		modal_prepend_warning(`${footer_id}`, 'danger', 'glyphicon-remove', '至少选择一个图片', 'tip');
		return false;
	}
	for (let checkbox of checkboxes)
	{
		picture_id.push($(checkbox).parent().attr('class'));
		picture_time.push($(checkbox).next().val() === '' ? 10 : parseInt($(checkbox).next().val()));
		if (!/^[\d]*$/.test($(checkbox).next().val()) || $(checkbox).next().val() === 0)
		{
			modal_prepend_warning(`${footer_id}`, 'danger', 'glyphicon-remove', '时间必须为正整数', 'tip');
			border_color_by_id($(checkbox).next().attr('id'));
			return false;
		}
		[data.picture_id, data.picture_time] = [picture_id, picture_time];
	}

	AJAX(action, data,
		function (response)
		{
			if (response.status.code === 0)
				modal_prepend_warning(`${footer_id}`, 'danger', 'glyphicon-remove', response.status.msg, 'tip');
			else
			{
				modal_prepend_warning(`${footer_id}`, 'success', 'glyphicon-ok', response.status.msg, 'tip');
				setTimeout(function ()
				{
					location.reload(true);
				}, 1000);
			}
		},
		function (error)
		{
			console.log(error);
			modal_prepend_warning(`${footer_id}`, 'danger', 'glyphicon-remove', '出现错误，请重试', 'tip');
		})
}

/**modify ajax**/
/**
 * data
 * single
 * {
 *      pack:[],
  *     picture_id = [],
  *     picture_time = [],
  *     new_pack_name = '',
  *     new_pack_note = '',
  *     multiple:false
 * }
 *
 * multiple
 * {
 *      pack:[],
  *     new_pack_note = '',
  *     multiple:true
 * }
 * **/
function modify_AJAX(multiple_bool, data)
{
	let type = multiple_bool === false ? 'modify_modal' : 'modify_multiple_modal';
	AJAX('modify_pack', data,
		function (response)
		{
			if (response.status.code === 0)
				modal_prepend_warning(`${type}_footer`, 'danger', 'glyphicon-remove', response.status.msg, 'tip');
			else
			{
				modal_prepend_warning(`${type}_footer`, 'success', 'glyphicon-ok', response.status.msg, 'tip');
				setTimeout(function ()
				{
					location.reload(true);
				}, 1000);
			}
		},
		function (error)
		{
			console.log(error);
			modal_prepend_warning(`${type}_footer`, 'danger', 'glyphicon-remove', '出现错误，请重试', 'tip');
		})
}

/**Activate checkbox**/
function activate_checkbox(type)
{
	const $checkbox = $(`.${type}_checkbox`);
	$checkbox.attr('checked', false);
	$checkbox.click(function (event)
	{
		if ($(event.target).is(':checked'))
		{
			$(event.target).prev().css('backgroundImage', 'url("../images/selected.png")');
			$(event.target).prev().children().css('opacity', 0.25);
			$(event.target).next().removeAttr('disabled').css('opacity', 1);
			$(event.target).next().val('');
		}
		else
		{
			$(event.target).prev().removeAttr('style');
			$(event.target).prev().children().removeAttr('style');
			$(event.target).next().attr('disabled', 'disabled').css('opacity', 0);
		}
	});
}

/**Show +,- button，tips**/
function activate_button()
{
	$('tr').hover(
		function (event)
		{
			$(event.target).find('button').css('opacity', 1);
		},
		function (event)
		{
			$(event.target).find('button').removeAttr('style');
		});
	$('.screens').click(function (event)
	{
		event.preventDefault();
		get_screen_modal(event.target);
	});

	$('.plus_screen').click(function (event)
	{
		event.preventDefault();
		table_btn_AJAX(event.target, 'plus', 'get_pack_no_screen');
	});
	$('.minus_screen').click(function (event)
	{
		event.preventDefault();
		table_btn_AJAX(event.target, 'minus', 'get_pack_screen');
	});
	tip_by_className('plus_screen', '增加屏幕', 'left');
	tip_by_className('minus_screen', '减少屏幕', 'right');
	tip_by_className('screens', '点击查看完整屏幕列表', 'bottom');
}

/**Screen list modal**/
/**
 * data
 * [name,name,name……]
 * **/
function get_screen_modal(pack_dom_obj)
{
	let pack_id = $(pack_dom_obj).parent().parent().attr('id');
	const [$screen_modal, $screen_modal_body] = [$('#screen_modal'), $('#screen_modal_body')];
	$screen_modal.modal('show');
	let data = {};
	data.resource_id = pack_id;
	AJAX('get_pack_screen', data,
		function (response)
		{
			if (response.status.code === 0)
				modal_append_warning('screen_modal_body', 'danger', 'glyphicon-remove', response.status.msg);
			else
			{
				$screen_modal_body.html('');
				if (response.data.screen.length === 0)
					modal_append_warning('screen_modal_body', 'danger', 'glyphicon-remove', '该包没有关联屏幕');
				for (let screen of response.data.screen)
					$screen_modal_body.append(`<div class="screen_list_row">${screen.name}</div>`);
			}
		},
		function (error)
		{
			console.log(error);
			modal_append_warning('screen_modal_body', 'danger', 'glyphicon-remove', '出现错误，请重试');
		});
}

/**AJAX for + and - buttons in table**/
function table_btn_AJAX(btn_html_obj, type, action)
{
	$(`#${type}_modal_table`).html(`<tbody><tr id=${type}_head_row>
                        <th>序号</th>
                        <th>屏幕名</th>
                        <th>备注</th>
                        <th></th>
                    </tr>
                   </tbody>`);
	$(`#${type}_modal`).modal('show');
	let data = {};
	data.resource_id = $(btn_html_obj).parent().parent().attr('id');
	$(`#${type}_head_row`).attr('class', data.resource_id);
	AJAX(action, data,
		function (response)
		{
			if (response.status.code === 0)
				modal_prepend_warning(`${type}_modal_footer`, 'danger', 'glyphicon-remove', response.status.msg, 'tip');
			else
			{
				modal_prepend_warning(`${type}_modal_footer`, 'info', 'glyphicon-refresh', '加载中', 'tip');
				let screens = response.data.screen;
				for (let i = 0; i < screens.length; i++)
				{
					$(`#${type}_modal_table`).append(`<tr class=${screens[i].screen_id}>
                        <td>${i + 1}</td>
                        <td>${screens[i].name}</td>
                        <td>${screens[i].note === null ? '无' : screens[i].note}</td>
                        <td><input type="checkbox"></td>
                    </tr>`)
				}
			}
		},
		function (error)
		{
			console.log(error);
			modal_append_warning('screen_modal_body', 'danger', 'glyphicon-remove', '出现错误，请重试');
		})

}
