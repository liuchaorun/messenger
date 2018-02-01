/**
 * Created by 31641 on 2017-6-27.
 */
/*关闭错误对话框的时候刷新页面*/
const $error_modal = $('#error_modal');
$(function ()
{
    $error_modal.on('hidden.bs.modal', function ()
    {
        location.reload(true);
    })
});