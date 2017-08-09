/**
 * Created by 31641 on 2017-6-25.
 */
/**Public constants**/
const [USERNAME_REG, EMAIL_REG, PASSWORD_REG] =
	[/^[A-z0-9\u4e00-\u9fa5]{1,16}$/, /^[A-z0-9]+@([A-z0-9]+\.[a-z]+)+$/, /^[A-z0-9_]{1,32}$/];

function AJAX(action, data_object, success_function, error_function, async = true)
{
	$.ajax(
		{
			xhrFields: {
				withCredentials: true
			},
			contentType: 'application/json',
			timeout: 2000,
			async: async,
			dataType: 'json',
			//url: `http://118.89.197.156:3000/action=${action}`,
			url: `http://127.0.0.1:3000/action=${action}`,
			method: 'post',
			data: JSON.stringify(data_object),
			success: success_function,
			error: error_function,
		})
}

let last_one;//Remember the id of the last tip

function modal_append_warning(modal_body_id, alert_type, icon_class, warn_text, className = '')
{
	/**Delete last tip**/
	if (last_one !== undefined && $(`#${last_one}`).length)
	{
		$(`#${last_one}`).remove();
	}
	let id = new Date().getTime();
	last_one = id;

	$(`#${modal_body_id}`).append(`<div class="alert alert-${alert_type} alert-dismissible fade in ${className}" role="alert" id=${id}>
 <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><span class="glyphicon ${icon_class}"></span><span> ${warn_text}</span></div>`);
	setTimeout(function ()
	{
		$(`#${id}`).alert('close');
	}, 2000);
}

function modal_prepend_warning(modal_footer_id, alert_type, icon_class, warn_text, className = '')
{
	/**Delete last tip**/
	if (last_one !== undefined && $(`#${last_one}`).length)
	{
		$(`#${last_one}`).remove();
	}
	let id = new Date().getTime();
	last_one = id;

	$(`#${modal_footer_id}`).prepend(`<div class="alert alert-${alert_type} alert-dismissible fade in ${className}" role="alert" id=${id}>
 <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><span class="glyphicon ${icon_class}"></span><span> ${warn_text}</span></div>`);
	setTimeout(function ()
	{
		$(`#${id}`).alert('close');
	}, 2000);
}

/**Parse time string**/
function parse_time_string(raw_time_string)
{
	const date = new Date(raw_time_string);
	return date.getTime() === 0 ? '这是第一次登陆' : `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日${date.getHours()}时${date.getMinutes()}分`;
}

/**Clear inputs**/
$(function ()
{
	const $input = $('input');
	const $modal = $('.modal');
	$input.focus(function (event)
	{
		$(event.target).removeAttr('style');
	});
	$modal.on('hidden.bs.modal', function (event)
	{
		$(event.target).find("input").val('').removeAttr('style');
	})
});

/**Automatically set height**/
function auto_height(id, offset)
{
	$(`#${id}`).css('height', $(window).height() - offset);
	$(window).resize(function ()
	{
		$(`#${id}`).css('height', $(window).height() - offset);
	})
}

function auto_max_height(id, offset)
{
	$(`#${id}`).css('maxHeight', $(window).height() - offset);
	$(window).resize(function ()
	{
		$(`#${id}`).css('maxHeight', $(window).height() - offset);
	})
}

/**Add tip**/
function tip_by_id(id, content, position = 'left')
{
	$(`#${id}`).tooltip(
		{
			container: 'body',
			placement: `${position}`,
			trigger: 'focus hover',
			title: `${content}`
		}
	);
}

function tip_by_className(className, content, position = 'left')
{
	$(`.${className}`).tooltip(
		{
			container: 'body',
			placement: `${position}`,
			trigger: 'focus hover',
			title: `${content}`
		}
	);
}

/**change border-color**/
function border_color_by_id(id, color = 'red')
{
	$(`#${id}`).css('borderColor', color);
}