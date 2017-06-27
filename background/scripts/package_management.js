/**
 * Created by 31641 on 2017-6-27.
 */
/**checkbox特效**/
$(function ()
{
    const $add_checkbox = $('.add_checkbox');
    $add_checkbox.click(function ()
    {
        if ($(this).is(':checked'))
        {
            $(this).prev().css('opacity', 0.25);
            $(this).parent().css('backgroundImage', 'url("../images/selected.png")');
        }
        else
        {
            $(this).prev().removeAttr('style');
            $(this).parent().removeAttr('style');
        }
    })
});