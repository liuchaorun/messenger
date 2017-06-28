/**
 * Created by 31641 on 2017-6-27.
 */
/**获取屏幕信息并填充**/

/**数据结构应当是
 * 在data下
 * [
 *      {status,name,update_time,freq,pack,note,UUID}
 *      {status,name,update_time,freq,pack,note,UUID}
 *      {status,name,update_time,freq,pack,note,UUID}
 *      {status,name,update_time,freq,pack,note,UUID}
 * ]
 * freq频率，pack资源包，note备注
 * **/

/**发送的所有屏幕信息均发送uuid数组**/


/**
 *
 <tr id=${info.uuid}>
 <td>${serial_num}</td>
 <td>${info.status}</td>
 <td>${info.name}</td>
 <td>${info.update_time}</td>
 <td>${info.freq}</td>
 <td>${info.pack}</td>
 <td>${info.note}</td>
 <td>${info.uuid}</td>
 <td><input type="checkbox" aria-label="checkbox" class="checkbox-inline"></td>
 </tr>
 * **/
let screen_info = [];

$(function ()
{
    const $screen_table = $('#screen_table');
    AJAX('get_screen', {},
        function (response)
        {
            if (response.status.code === 0)
                $error_modal.modal('show');
            else
            {
                screen_info = response.data;
                let update_time = '';
                for (let i = 0; i < screen_info.length; i++)
                {
                    update_time = parseTimeString(screen_info[i].update_time);
                    $screen_table.append(
                        `<tr id=${screen_info[i].uuid} class="screen">
                            <td>${i + 1}</td>
                            <td>${screen_info[i].status}</td>
                            <td>${screen_info[i].name}</td>
                            <td>${update_time}</td>
                            <td>${screen_info[i].freq}</td>
                            <td>${screen_info[i].pack}</td>
                            <td>${screen_info[i].note}</td>
                            <td>${screen_info[i].uuid}</td>
                            <td><input type="checkbox" aria-label="checkbox" class="checkbox-inline screen_checkbox"></td>
                        </tr>
                   `)
                }
            }
        },
        function (error)
        {
            console.log(error);
            $error_modal.modal('show');
        })
});

/**增加屏幕部分**/
/**如果成功就刷新页面**/
$(function ()
{
    const $uuid = $('#uuid');
    const $add_modal_btn = $('#add_modal_btn');

    $uuid.tooltip(
        {
            container: 'body',
            placement: 'left',
            trigger: 'focus hover',
            title: '8位字母、数字'
        });

    $add_modal_btn.click(function (event)
    {
        event.preventDefault();
        if ((/^[0-9A-z]{6}$/.test($uuid.val())))//符合要求
        {
            let data = {};
            data.uuid = $uuid.val();
            AJAX('add_screen', data,
                function (response)
                {
                    if (response.status.code === 0)
                        append_warning('add_modal_body', 'danger', 'glyphicon-remove', response.status.msg);
                    else
                    {
                        append_warning('add_modal_body', 'success', 'glyphicon-ok', response.status.msg);
                        setTimeout(function ()
                        {
                            location.reload(true);
                        }, 3000)
                    }
                },
                function (error)
                {
                    console.log(error);
                    append_warning('add_modal_body', 'danger', 'glyphicon-remove', '出现错误，请重试');
                });
        }
        else//不合要求
        {
            append_warning('add_modal_body', 'danger', 'glyphicon-remove', 'UUID非法');
        }
    })
});

/**修改屏幕部分**/
/**单选允许修改名称，多选将不允许**/
$(function ()
{
    const $new_screen_name = $('#new_screen_name');
    const $new_freq = $('#new_freq');
    const $new_note = $('#new_note');
    const $modify_btn = $('#modify_btn');
    const $modify_modal_btn = $('#modify_modal_btn');
    let checked_screen_uuid = [];//存储被选屏幕的UUID

    /**输入框弹框**/
    $new_screen_name.tooltip(
        {
            container: 'body',
            placement: 'left',
            trigger: 'focus hover',
            title: '16位以内字母、数字或汉字'
        });
    $new_freq.tooltip(
        {
            container: 'body',
            placement: 'left',
            trigger: 'focus hover',
            title: '数字，单位为分钟'
        });
    $new_note.tooltip(
        {
            container: 'body',
            placement: 'left',
            trigger: 'focus hover',
            title: '32位以内字母、数字或汉字'
        });


    $modify_btn.click(function ()
    {
        checked_screen_uuid = [];
        let screen_checkbox = $('.screen_checkbox');
        for (let checkbox of screen_checkbox)
        {
            if ($(checkbox).is(':checked'))
            {
                checked_screen_uuid.push($(checkbox).parent().parent().attr('id'));
            }
        }
        if (checked_screen_uuid.length === 1)
        {
            $new_screen_name.removeAttr('disabled').val('');
            $new_freq.removeAttr('disabled').val('');
            $new_note.removeAttr('disabled').val('');
            $modify_modal_btn.removeAttr('disabled').val('');
            $new_screen_name.attr('disabled', 'disabled');
        }
        else if (checked_screen_uuid.length === 0)
        {
            $new_screen_name.attr('disabled', 'disabled');
            $new_freq.attr('disabled', 'disabled');
            $new_note.attr('disabled', 'disabled');
            $modify_modal_btn.attr('disabled', 'disabled');
            append_warning('modify_modal_body', 'danger', 'glyphicon-remove', '至少选择一个屏幕');
        }
        else
        {
            $new_screen_name.removeAttr('disabled').val('');
            $new_freq.removeAttr('disabled').val('');
            $new_note.removeAttr('disabled').val('');
            $modify_modal_btn.removeAttr('disabled').val('');
        }
    });

    $modify_modal_btn.click(function ()
    {
        let status = true;
        let data = {};
        data.uuid = checked_screen_uuid;
        if (!$new_screen_name.val())
        {
            if (!/^[0-9A-z\u4e00-\u9fa5]{1,16}$/.test($new_screen_name.val()))
            {
                $new_screen_name.css('border', 'red');
                status = false;
            }
            else
                data.new_name = $new_screen_name.val();
        }
        if (!$new_freq.val())
        {
            if (!/^[0-9]+$/.test($new_freq.val()))
            {
                $new_freq.css('border', 'red');
                status = false;
            }
            else
                data.new_freq = $new_freq.val();
        }
        if (!$new_note.val())
        {
            if (!/^[0-9A-z\u4e00-\u9fa5]{1,32}$/.test($new_note.val()))
            {
                $new_note.css('border', 'red');
                status = false;
            }
            else
                data.new_note = $new_note.val();
        }
        if (status === false)
        {
            append_warning('modify_modal_body', 'danger', 'glyphicon-remove', '信息填写有误');
            return false;
        }
        if (!data)
        {
            append_warning('modify_modal_body', 'danger', 'glyphicon-remove', '至少修改一项');
            return false;
        }
        AJAX('modify_screen', data,
            function (response)
            {
                if (response.status.code === 0)
                    append_warning('modify_modal_body', 'danger', 'glyphicon-remove', response.status.msg);
                else
                {
                    append_warning('modify_modal_body', 'success', 'glyphicon-ok', response.status.msg);
                    setTimeout(function ()
                    {
                        location.reload(true);
                    }, 3000);
                }
            },
            function (error)
            {
                console.log(error);
                append_warning('modify_modal_body', 'danger', 'glyphicon-remove', '出现错误，请重试');
            })
    });
});

/**判断弹出哪一个删除框**/
$(function ()
{
    const $del_btn = $('#del_btn');
    const $del_modal = $('#del_modal');
    const $del_modal_btn = $('#del_modal_btn');
    const $del_error_modal = $('#del_error_modal');
    const $del_screen = $('#del_screen');
    let checked_screen_uuid = [];
    $del_btn.click(function (event)
    {
        checked_screen_uuid = [];
        event.preventDefault();
        let screen_checkbox = $('.screen_checkbox');
        for (let checkbox of screen_checkbox)
            if (checkbox.is(':checked'))
                checked_screen_uuid.push(checkbox.parent().parent().attr('id'));
        if (checked_screen_uuid.length === 0)
        {
            $del_error_modal.modal('show');
        }
        else
        {
            $del_modal.modal('show');
            let del_screen_name = ' ';
            for (let i = 0; i < checked_screen_uuid.length; i++)
                for (let j = 0; j < screen_info.length; j++)
                    if (screen_info[j].uuid === checked_screen_uuid[i])
                        del_screen_name += screen_info[j].name;
            $del_screen.text(del_screen_name);
        }
    });

    $del_modal_btn.click(function ()
    {
        let data = {};
        data.uuid = checked_screen_uuid;

        AJAX('del_screen', data,
            function (response)
            {
                if (response.status.code === 0)
                    append_warning('del_modal_body', 'danger', 'glyphicon-remove', response.status.msg);
                else
                {
                    append_warning('del_modal_body', 'success', 'glyphicon-remove', response.status.msg);
                    setTimeout(function ()
                    {
                        location.reload(true);
                    }, 3000);
                }
            },
            function (error)
            {
                console.log(error);
                append_warning('del_modal_body', 'danger', 'glyphicon-remove', '出现错误，请重试');
            })
    })
});
