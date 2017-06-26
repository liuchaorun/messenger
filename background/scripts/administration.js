/**
 * Created by 31641 on 2017-6-25.
 */
/**边栏高度自动设定**/
$(function ()
{
    const $sidebar = $('#sidebar');
    const $frame_div = $('#frame_div');
    const $frame = $('#frame');
    $sidebar.css('height', $(window).height());
    $frame_div.css('height', $(window).height());
    $frame.css('height', $(window).height() * 0.99);
    $(window).resize(function ()
    {
        $sidebar.css('height', $(window).height());
        $frame_div.css('height', $(window).height());
        $frame.css('height', $(window).height() * 0.99);
    })
});

/**退出按钮**/
$(function ()
{
    const $logout = $('#logout');
    $logout.click(function ()
    {
        localStorage.clear();
        sessionStorage.clear();
        clearCookie();
    })
});

/**标签切换**/
$(function ()
{
    const $frame = $('#frame');
    const $user_info = $('#user_info');
    const $screen_info = $('#screen_info');
    const $resource_management = $('#resource_management');
    const $resource_management_icon = $('#resource_management_icon');
    const $collapse = $('#collapse');
    const $upload = $('#upload');
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
    $resource_management.click(function ()
    {
        if (!$collapse.hasClass('collapsing'))
            if ($collapse.hasClass('in'))
                $resource_management_icon.removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');

            else
                $resource_management_icon.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
    });
    $upload.click(function (event)
    {
        event.preventDefault();
        $('.active').removeClass('active');
        $resource_management.addClass('active');
        $upload.addClass('active');
        $frame.attr('src', 'frames/upload.html');
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