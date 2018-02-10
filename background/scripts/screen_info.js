/**
 * Created by 31641 on 2017-6-27.
 */
/**得到屏幕信息并填充**/

/**
 * data
 * [
 *      {status,name,update_time,freq,pack,note,UUID}
 *      {status,name,update_time,freq,pack,note,UUID}
 *      {status,name,update_time,freq,pack,note,UUID}
 *      {status,name,update_time,freq,pack,note,UUID}
 * ]
 *
 * **/

/**All info sent is an array of uuid**/

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
                screen_info = response.data.info;
                let update_time = '';
                for (let i = 0; i < screen_info.length; i++)
                {
                    update_time = parse_time_string(screen_info[i].update_time);
                    $screen_table.append(
                        `<tr id=${screen_info[i].uuid} class="screen">
                            <td class="seq">${i + 1}</td>
                            <td class="status">${screen_info[i].status === true ? '在线' : '离线'}</td>
                            <td class="name">${screen_info[i].name}</td>
                            <td class="update_time">${update_time}</td>
                            <td class="freq">${screen_info[i].freq}</td>
                            <td class="pack">${screen_info[i].pack === undefined ? '无' : screen_info[i].pack}</td>
                            <td class="note">${screen_info[i].note === null ? '无' : screen_info[i].note}</td>
                            <td class="screen_uuid">${screen_info[i].uuid}</td>
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

/*点击表头对表格排序*/
/*$screen[0].getElementsByClassName('name')[0].innerText*/
$(function ()
{
    const $screen_table = $('#screen_table');
    const $sortable_th = $('.sortable_th');
    let $screen = null;
    let clickedTh = '';


    $sortable_th.click(function (e)
    {
        e.preventDefault();
        $screen = $('.screen');
        clickedTh = $(this).attr('id');

        if ($(this).hasClass('random') || $(this).hasClass('down'))
        {
            $sortable_th.removeClass('up').removeClass('down').addClass('random');
            $(this).removeClass('random').removeClass('down').addClass('up');
            $screen.sort(function (node_1, node_2)
            {
                return (node_1.getElementsByClassName(`${clickedTh}`)[0].innerText).localeCompare(node_2.getElementsByClassName(`${clickedTh}`)[0].innerText, 'zh');
            });
        }
        else
        {
            $sortable_th.removeClass('up').removeClass('down').addClass('random');
            $(this).removeClass('random').removeClass('up').addClass('down');
            $screen.sort(function (node_1, node_2)
            {
                return -((node_1.getElementsByClassName(`${clickedTh}`)[0].innerText).localeCompare(node_2.getElementsByClassName(`${clickedTh}`)[0].innerText, 'zh'));
            });
        }
        $screen.remove();
        $screen_table.append($screen);
    })
});

/**添加屏幕**/
/**成功后会刷新**/
$(function ()
{
    const $uuid = $('#uuid');
    const $add_modal_btn = $('#add_modal_btn');

    tip_by_id('uuid', '8位字母、数字');

    $add_modal_btn.click(function (event)
    {
        event.preventDefault();
        if ((/^[0-9A-z]{8}$/.test($uuid.val())))//符合要求
        {
            let data = {};
            data.uuid = $uuid.val();
            AJAX('add_screen', data,
                function (response)
                {
                    if (response.status.code === 0)
                        showNotification(response.status.msg, FAILURE);
                    else
                    {
                        showNotification(response.status.msg);
                        setTimeout(function ()
                        {
                            location.reload(true);
                        }, 3000)
                    }
                },
                function (error)
                {
                    console.log(error);
                    showNotification('出现错误，请重试', FAILURE);
                });
        }
        else//不合要求
        {
            showNotification('UUID 非法', FAILURE);
        }
    })
});

/**修改屏幕**/
/**只有单选的时候允许修改名字**/
$(function ()
{
    const $new_screen_name = $('#new_screen_name');
    const $new_freq = $('#new_freq');
    const $new_note = $('#new_note');

    const $modify_modal = $('#modify_modal');
    const $modify_btn = $('#modify_btn');
    const $modify_modal_btn = $('#modify_modal_btn');

    let checked_screen_uuid = [];//存储被选屏幕的UUID
    $modify_btn.click(function (event)
    {
        event.preventDefault();
        checked_screen_uuid = [];
        let screen_checkbox = $('.screen_checkbox');
        for (let checkbox of screen_checkbox)
            if ($(checkbox).is(':checked'))
                checked_screen_uuid.push($(checkbox).parent().parent().attr('id'));
        if (checked_screen_uuid.length > 1)
        {
            $new_screen_name.removeAttr('disabled').val('');
            $new_freq.removeAttr('disabled').val('');
            $new_note.removeAttr('disabled').val('');
            $modify_modal_btn.removeAttr('disabled').val('');
            $new_screen_name.attr('disabled', 'disabled');
        }
        else if (checked_screen_uuid.length === 0)
        {
            $modify_modal.modal('hide');
            $new_screen_name.attr('disabled', 'disabled');
            $new_freq.attr('disabled', 'disabled');
            $new_note.attr('disabled', 'disabled');
            $modify_modal_btn.attr('disabled', 'disabled');
            showNotification('至少选择一个屏幕', FAILURE);
        }
        else
        {
            $new_screen_name.removeAttr('disabled').val('');
            $new_freq.removeAttr('disabled').val('');
            $new_note.removeAttr('disabled').val('');
            $modify_modal_btn.removeAttr('disabled').val('');
        }
    });

    $modify_modal_btn.click(function (event)
    {
        event.preventDefault();
        let status = true;
        let data = {};
        data.uuid = checked_screen_uuid;
        if ($new_screen_name.val())
        {
            if (!SCREEN_NAME_REG.test($new_screen_name.val()))
            {
                $new_screen_name.css('borderColor', 'red');
                status = false;
            }
            else
                data.new_name = $new_screen_name.val();
        }
        if ($new_freq.val())
        {
            if (!/^\d+$/.test($new_freq.val()) || parseInt($new_freq) <= 0)
            {
                $new_freq.css('borderColor', 'red');
                status = false;
            }
            else
                data.new_freq = parseInt($new_freq.val());
        }
        if ($new_note.val())
        {
            if (!SCREEN_NOTE_REG.test($new_note.val()))
            {
                $new_note.css('borderColor', 'red');
                status = false;
            }
            else
                data.new_note = $new_note.val();
        }
        if (status === false)
        {
            showNotification('信息填写有误', FAILURE);
            return false;
        }
        if (!data)
        {
            showNotification('至少修改一项', FAILURE);
            return false;
        }
        AJAX('modify_screen', data,
            function (response)
            {
                if (response.status.code === 0)
                    showNotification(response.status.msg, FAILURE);
                else
                {
                    showNotification(response.status.msg);
                    setTimeout(function ()
                    {
                        location.reload(true);
                    }, 3000);
                }
            },
            function (error)
            {
                console.log(error);
                showNotification('出现错误，请重试', FAILURE);
            })
    });
});

/**显示对应的删除modal**/
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
            if ($(checkbox).is(':checked'))
                checked_screen_uuid.push($(checkbox).parent().parent().attr('id'));
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

    $del_modal_btn.click(function (event)
    {
        event.preventDefault();
        let data = {};
        data.uuid = checked_screen_uuid;

        AJAX('del_screen', data,
            function (response)
            {
                if (response.status.code === 0)
                    showNotification(response.status.msg, FAILURE);
                else
                {
                    showNotification(response.status.msg);
                    setTimeout(function ()
                    {
                        location.reload(true);
                    }, 3000);
                }
            },
            function (error)
            {
                console.log(error);
                showNotification('出现错误，请重试', FAILURE);
            })
    })
});

/**自动设置高度**/
$(function ()
{
    auto_height('screen_info_panel_body', 90);
});

/**Tips**/
$(function ()
{
    tip_by_id('new_screen_name', '16位以内字母、数字或汉字');
    tip_by_id('new_freq', '正整数，单位为分钟');
    tip_by_id('new_note', '32位以内字母、数字或汉字');
});
