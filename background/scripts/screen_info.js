/**
 * Created by 31641 on 2017-6-27.
 */
/**TODO:删除设备页面设备名列举，单选可修改屏幕名，多选不可修改**/

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
                let info = response.data;
                for (let i = 0; i < info.length; i++)
                {
                    $screen_table.append(
                        `<tr id=${info[i].uuid}>
                            <td>${i + 1}</td>
                            <td>${info[i].status}</td>
                            <td>${info[i].name}</td>
                            <td>${info[i].update_time}</td>
                            <td>${info[i].freq}</td>
                            <td>${info[i].pack}</td>
                            <td>${info[i].note}</td>
                            <td>${info[i].uuid}</td>
                            <td><input type="checkbox" aria-label="checkbox" class="checkbox-inline"></td>
                        </tr>
                   `)
                }
            }
        },
        function (error)
        {
            console.log(error);
            //$error_modal.modal('show');
        })
});

/**增加屏幕部分**/
/**如果成功就刷新页面**/
$(function ()
{
    const $uuid = $('#uuid');
    const $add_modal_btn = $('#add_modal_btn');
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

});