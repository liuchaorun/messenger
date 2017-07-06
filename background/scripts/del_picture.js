/**
 * Created by 31641 on 2017-7-6.
 */
/**自适应高度**/
$(function ()
{
    autoHeight('del_picture_panel_body', 90);
});

/**checkbox切换效果**/
$(function ()
{
    const $checkbox = $('.checkbox');
    $checkbox.click(function ()
    {
        if ($(this).is(':checked'))
        {
            $(this).parent().parent().css('backgroundImage', 'url("../images/selected.png")');
            $(this).parent().css('opacity', 0.25);
        }
        else
        {
            $(this).parent().removeAttr('style');
            $(this).parent().parent().removeAttr('style');
        }
    });
});

/**拉取图片**/
/**DOM结构
 * <div class="del_picture_row">
 <div class="del_picture_div">
 <label class="del_picture_label"><img src="../images/Test.png" alt="test"
 class="del_picture image img-responsive">
 <input type="checkbox" class="checkbox"></label>
 </div>
 </div>
 * **/
$(function ()
{

});