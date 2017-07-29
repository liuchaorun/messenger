/**
 * Created by 31641 on 2017-6-25.
 */
/**Set height**/
$(function ()
{
	autoHeight('sidebar', 0);
	autoHeight('frame_div', 0);
	autoHeight('frame', 0);
});

/**Exit button**/
$(function ()
{
	const $exit_btn = $('#exit_btn');
	$exit_btn.click(function (event)
	{
		event.preventDefault();
		localStorage.clear();
		sessionStorage.clear();
		clearCookie();
		location.href = 'index.html';
	})
});

/**Sidebar tab change**/
$(function ()
{
	const $frame = $('#frame');
	const $user_info = $('#user_info');
	const $screen_info = $('#screen_info');
	const $resource_management = $('#resource_management');
	const $resource_management_icon_front = $('#resource_management_icon_front');
	const $resource_management_icon = $('#resource_management_icon');
	const $collapse = $('#collapse');
	const $upload = $('#upload');
	const $del_picture = $('#del_picture');
	const $package_management = $('#package_management');
	const $modify_info = $('#modify_info');
	$user_info.click(function (event)
	{
		event.preventDefault();
		$('.active').removeClass('active');
		$user_info.addClass('active');
		$frame.attr('src', 'frames/user_info.html');
	});
	$screen_info.click(function (event)
	{
		event.preventDefault();
		$('.active').removeClass('active');
		$screen_info.addClass('active');
		$frame.attr('src', 'frames/screen_info.html');
	});
	$resource_management.click(function (event)
	{
		event.preventDefault();
		if (!$collapse.hasClass('collapsing'))
			if ($collapse.hasClass('in'))
			{
				$resource_management_icon.removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
				$resource_management_icon_front.removeClass('glyphicon-folder-open').addClass('glyphicon-folder-close');
			}
			else
			{
				$resource_management_icon.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
				$resource_management_icon_front.removeClass('glyphicon-folder-close').addClass('glyphicon-folder-open');
			}
	});
	$upload.click(function (event)
	{
		event.preventDefault();
		$('.active').removeClass('active');
		$resource_management.addClass('active');
		$upload.addClass('active');
		$frame.attr('src', 'frames/upload.html');
	});
	$del_picture.click(function (event)
	{
		event.preventDefault();
		$('.active').removeClass('active');
		$del_picture.addClass('active');
		$frame.attr('src', 'frames/del_picture.html');
	});
	$package_management.click(function (event)
	{
		event.preventDefault();
		$('.active').removeClass('active');
		$resource_management.addClass('active');
		$package_management.addClass('active');
		$frame.attr('src', 'frames/package_management.html');
	});
	$modify_info.click(function (event)
	{
		event.preventDefault();
		$('.active').removeClass('active');
		$modify_info.addClass('active');
		$frame.attr('src', 'frames/modify_info.html');
	})
});