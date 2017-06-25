/**
 * Created by 31641 on 2017-6-25.
 */
$(function ()
{
    const $sidebar = $('#sidebar');
    const $frame_div = $('#frame_div');
    const $frame = $('#frame');
    $sidebar.css('height', $(window).height());
    $frame_div.css('height', $(window).height());
    $frame.css('height', $(window).height());
    $(window).resize(function ()
    {
        $sidebar.css('height', $(window).height());
        $frame_div.css('height', $(window).height());
        $frame.css('height', $(window).height());
    })
});

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