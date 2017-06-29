/**
 * Created by 31641 on 2017-6-27.
 */
/**获取并填充信息**/
$(function ()
{
    const $username = $('#username');
    const $work_place = $('#work_place');
    AJAX('get_info', {},
        function (response)
        {
            if (response.status.code === 0)
                $error_modal.modal('show');
            else
            {
                let info = response.data;
                $username.text(info.username);
                $work_place.text(info.work_place);
            }
        },
        function (error)
        {
            console.log(error);
            $error_modal.modal('show');
        })
});

/**修改信息弹框**/
$(function ()
{
    tip_by_id('new_username', '输入新用户名，16个字符以内');
    tip_by_id('new_work_place', '输入新工作地点，16个字符以内');
});

/**修改用户名**/
$(function ()
{
    const $new_username = $('#new_username');
    const $modify_username_modal_btn = $('#modify_username_modal_btn');
    $modify_username_modal_btn.click(function (event)
    {
        event.preventDefault();
        if (!/^[A-z0-9\u4e00-\u9fa5]{1,16}$/.test($new_username.val()))
        {
            $new_username.css('borderColor', 'red');
            append_warning('modify_username_modal_body', 'danger', 'glyphicon-remove', '用户名不合法');
            return false;
        }
        let data = {};
        data.new_username = $new_username.val();
        modify_AJAX(data, 'modify_username_modal_body');
    })
});

/**修改工作地点**/
$(function ()
{
    const $new_work_place = $('#new_work_place');
    const $modify_work_place_modal_btn = $('#modify_work_place_modal_btn');
    $modify_work_place_modal_btn.click(function (event)
    {
        event.preventDefault();
        if (!/^[A-z0-9\u4e00-\u9fa5]{1,16}$/.test($new_work_place.val()))
        {
            $new_work_place.css('borderColor', 'red');
            append_warning('modify_work_place_modal_body', 'danger', 'glyphicon-remove', '工作地点不合法');
            return false;
        }
        let data = {};
        data.new_work_place = $new_work_place.val();
        modify_AJAX(data, 'modify_work_place_modal_body');
    })
});

/**提交函数**/
function modify_AJAX(data, modal_body_id)
{
    AJAX('modify_user', data,
        function (response)
        {
            if (response.status.code === 0)
                append_warning(`${modal_body_id}`, 'danger', 'glyphicon-remove', response.status.msg);
            else
            {
                append_warning(`${modal_body_id}`, 'success', 'glyphicon-ok', response.status.msg);
                setTimeout(function ()
                {
                    location.reload(true);
                }, 3000);
            }
        },
        function (error)
        {
            console.log(error);
            append_warning(`${modal_body_id}`, 'danger', 'glyphicon-remove', '出现错误，请重试');
        })
}