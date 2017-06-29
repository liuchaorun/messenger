/**
 * Created by 31641 on 2017-6-27.
 */
/**错误提示框确定刷新页面**/
const $error_modal = $('#error_modal');
$(function ()
{
    $error_modal.on('hidden.bs.modal', function (e)
    {
        location.reload(true);
    })
});