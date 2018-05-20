/**
 * Created by 31641 on 2017-6-25.
 */

/*自动设定高度*/
$(function ()
{
    setHeight('sidebar', 0);
    setHeight('frame_div', 0);
    setHeight('frame', 0);
});

/*退出按钮设定*/
$(function ()
{
    const $exit_btn = $('#exit_btn');
    $exit_btn.click(function (event)
    {
        event.preventDefault();
        location.href = 'index.html';
    })
});

/*边栏按钮切换脚本*/
$(function ()
{
    const $frame = $('#frame');

    const $user_info = $('#user_info');
    const $screen_info = $('#screen_info');
    const $resource_management = $('#resource_management');
    const $upload = $('#upload');
    const $image_management = $('#image_management');
    const $package_management = $('#package_management');
    const $modify_info = $('#modify_info');

    const $resource_management_icon_front = $('#resource_management_icon_front');
    const $resource_management_icon = $('#resource_management_icon');
    const $collapse = $('#collapse');

    $user_info.click(function (event)
    {
        event.preventDefault();
        $('.active').removeClass('active');
        $user_info.addClass('active');
        $frame.attr('src', 'frames/userInfo.html');
    });
    $screen_info.click(function (event)
    {
        event.preventDefault();
        $('.active').removeClass('active');
        $screen_info.addClass('active');
        $frame.attr('src', 'frames/screenManagement.html');
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
    $image_management.click(function (event)
    {
        event.preventDefault();
        $('.active').removeClass('active');
        $resource_management.addClass('active');
        $image_management.addClass('active');
        $frame.attr('src', 'frames/adManagement.html');
    });
    $package_management.click(function (event)
    {
        event.preventDefault();
        $('.active').removeClass('active');
        $resource_management.addClass('active');
        $package_management.addClass('active');
        $frame.attr('src', 'frames/packageManagement.html');
    });
    $modify_info.click(function (event)
    {
        event.preventDefault();
        $('.active').removeClass('active');
        $modify_info.addClass('active');
        $frame.attr('src', 'frames/modifyInfo.html');
    })
});

/*边栏宽度自动切换以及锁定按钮*/
$(function ()
{
    const $sidebar = $('#sidebar');
    const $icon_div = $('#icon_div');
    const $sidebar_label = $('.sidebar_label');
    const $frame_div = $('#frame_div');
    const $lockIcon = $('#lockIcon');

    let isLocked = false;
    $lockIcon.click(function (e)
    {
        e.preventDefault();
        if (isLocked === false)
        {
            $lockIcon.css({backgroundColor: '#337ab7', color: '#FFF'});
            isLocked = true;
        }
        else
        {
            $lockIcon.removeAttr('style');
            $lockIcon.css('display', 'inline');//修正默认状态下会消失的问题
            isLocked = false;
        }
    });


    let fadeOut;

    $sidebar.hover(
        function ()
        {
            $sidebar.removeClass('sidebar_small').addClass('sidebar_big');
            $icon_div.removeClass('icon_div_small').addClass('icon_div_big');
            $frame_div.removeClass('frame_div_big').addClass('frame_div_small');
            fadeOut = setTimeout(function ()
            {
                $sidebar_label.fadeIn(500);
            }, 200);

        },
        function ()
        {
            if (isLocked === false)
            {
                clearTimeout(fadeOut);
                $sidebar.removeClass('sidebar_big').addClass('sidebar_small');
                $icon_div.removeClass('icon_div_big').addClass('icon_div_small');
                $frame_div.removeClass('frame_div_small').addClass('frame_div_big');
                $sidebar_label.hide();
            }
        })
});


/*添加工具提示*/
$(function ()
{
    addTooltipById('lockIcon', '锁定侧边栏', 'right');
});