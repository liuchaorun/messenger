/**
 * Created by 31641 on 2017-6-27.
 */
/**填充表格**/
/**DOM结构
 * <tr id=${pack.id}>
 <td>${i+1}</td>
 <td>${pack.name}</td>
 <td>${pack.note}</td>
 <td>
 <button class="plus_screen btn btn-primary btn-sm">+</button>
 <span class="screens">${pack.screen}</span>
 <button class="minus_screen btn btn-primary btn-sm">-</button>
 </td>
 <td><input type="checkbox" class="checkbox-inline screen_checkbox"></td>
 </tr>
 * **/

/**
 * data数据格式
 * [
 *      {id,name,note,screen},
 *      {id,name,note,screen},
 *      {id,name,note,screen},
 *      {id,name,note,screen},
 *
 * ]
 * screen是屏幕名拼接之后的字符串
 * **/
$(function ()
{
    const $package_management_table = $('#package_management_table');
    const $error_modal = $('#error_modal');
    AJAX('get_pack', {},
        function (response)
        {
            if (response.status.code === 0)
                $error_modal.modal('show');
            else
            {
                let packs = response.data.resources;
                for (let i = 0; i < packs.length; i++)
                {
                    $package_management_table.append(`<tr id=${packs[i].resource_id}>
 <td>${i + 1}</td>
 <td>${packs[i].name}</td>
 <td>${packs[i].note}</td>
 <td>
 <button class="plus_screen btn btn-primary btn-sm">+</button>
 <span class="screens">${packs[i].screen.length > 1 ? packs[i].screen[0].name + '……' : packs[i].screen.length === 0 ? '无' : packs[i].screen[0].name}</span>
 <button class="minus_screen btn btn-primary btn-sm">-</button>
 </td>
 <td><input type="checkbox" class="checkbox-inline screen_checkbox"></td>
 </tr>`)
                }
            }
            activate_button();
        },
        function (error)
        {
            console.log(error);
            $error_modal.modal('show');
        });
});

/**增加按钮**/
$(function ()
{
    const $add_btn = $('#add_btn');
    $add_btn.click(function ()
    {
        prepend_warning('add_modal_footer', 'info', 'glyphicon-refresh', '加载中……', 'tip');
        image_AJAX('add', 'add_modal_table', 'add_modal_btn', 'add_modal_footer');
    });

});

/**增加提交按钮**/
$(function ()
{
    const $add_modal_btn = $('#add_modal_btn');
    $add_modal_btn.click(function ()
    {
        package_AJAX('add_modal_table', 'pack_name_input', 'pack_note_input', 'add_modal_footer', 'add_pack');
    });
});

/**修改以及修改提交按钮**/
$(function ()
{
    const $modify_btn = $('#modify_btn');
    const $modify_modal = $('#modify_modal');
    const $modify_modal_table = $('#modify_modal_table');
    const $modify_multiple_modal = $('#modify_multiple_modal');
    const $modify_error_modal = $('#modify_error_modal');
    const $modify_modal_btn = $('#modify_modal_btn');
    const $new_pack_name_input = $('#new_pack_name_input');
    const $new_pack_note_input = $('#new_pack_note_input');
    const $modify_multiple_modal_btn = $('#modify_multiple_modal_btn');
    const $multiple_new_pack_note_input = $('#multiple_new_pack_note_input');
    let data = {};
    $modify_btn.click(function (event)
    {
        event.preventDefault();
        let checked_pack = [];
        let checked_checkboxes = $('.screen_checkbox:checked');
        if (checked_checkboxes.length === 0)
        {
            $modify_error_modal.modal('show');
            return false;
        }
        else if (checked_checkboxes.length === 1)
        {
            $modify_modal.modal('show');
            prepend_warning('modify_modal_footer', 'info', 'glyphicon-refresh', '加载中……', 'tip');
            AJAX('get_pack_info', {pack_id: $(checked_checkboxes[0]).parent().parent().attr('id')},
                function (response)
                {
                    if (response.status.code === 0)
                    {
                        prepend_warning('modify_modal_footer', 'danger', 'glyphicon-remove', response.status.msg, 'tip');
                        $modify_modal_btn.attr('disabled', 'disabled');
                    }
                    else
                    {
                        image_AJAX('modify', 'modify_modal_table', 'modify_modal_btn', 'modify_modal_footer');
                        $modify_modal_btn.removeAttr('disabled');
                        let pack_info = response.data;
                        $new_pack_name_input.val(pack_info.name);
                        $new_pack_note_input.val(pack_info.note);
                        let checked_pictures = pack_info.used_pictures;
                        let checked_picture;
                        for (let picture_id in checked_pictures)
                        {
                            if (!/.+\..+/.test(picture_id))
                            {
                                checked_picture = $modify_modal_table.find(`label[class=${picture_id}]`);
                                $(checked_picture).children().first().css('backgroundImage', 'url("../images/selected.png")');
                                $(checked_picture).children().first().children().css('opacity', 0.25);
                                $(checked_picture).find('input[type=text]')
                                    .css('opacity', 1)
                                    .removeAttr('disabled')
                                    .val(checked_pictures[picture_id]);
                                $(checked_picture).find('input[type=checkbox]').attr('checked', true);
                            }
                        }
                    }
                },
                function (error)
                {
                    console.log(error);
                    prepend_warning('modify_modal_footer', 'danger', 'glyphicon-remove', '出现错误，请重试', 'tip');
                    $modify_modal_btn.attr('disabled', 'disabled');
                })
        }
        else
            $modify_multiple_modal.modal('show');
        for (let checkbox of checked_checkboxes)
            checked_pack.push($(checkbox).parent().parent().attr('id'));
        data.pack = checked_pack;

        $modify_modal_btn.click(function (event)
        {
            event.preventDefault();
            let picture_id = [], picture_time = [];
            let picture_checked_checkboxes = $modify_modal_table.find('input:checked');
            if (picture_checked_checkboxes.length === 0)
            {
                prepend_warning('modify_modal_footer', 'danger', 'glyphicon-remove', '至少选择一幅图片', 'tip');
                return false;
            }
            for (let checkbox of picture_checked_checkboxes)
            {
                picture_id.push($(checkbox).parent().attr('class'));
                if (!/^[\d]*$/.test($(checkbox).next().val()) || $(checkbox).next().val() === 0)
                {
                    prepend_warning('modify_modal_footer', 'danger', 'glyphicon-remove', '时间必须为正整数', 'tip');
                    border_color_by_id($(checkbox).next().attr('id'));
                    return false;
                }
                picture_time.push($(checkbox).next().val() === '' ? 10 : $(checkbox).next().val());
            }
            if (!/^[A-z0-9\u4e00-\u9fa5]{1,16}$/.test($new_pack_name_input.val()))
            {
                prepend_warning('modify_modal_footer', 'danger', 'glyphicon-remove', '包名不合法', 'tip');
                border_color_by_id('new_pack_name_input');
                return false;
            }
            if (!/^[A-z0-9\u4e00-\u9fa5]{1,32}$/.test($new_pack_note_input.val()))
            {
                prepend_warning('modify_modal_footer', 'danger', 'glyphicon-remove', '备注不合法', 'tip');
                border_color_by_id('new_pack_note_input');
                return false;
            }
            data.picture_id = picture_id;
            data.picture_time = picture_time;
            data.new_pack_name = $new_pack_name_input.val();
            data.new_pack_note = $new_pack_note_input.val();
            data.mutiple = false;
            modify_AJAX(false, data);
        });

        $modify_multiple_modal_btn.click(function (event)
        {
            event.preventDefault();
            if (!/^[A-z0-9\u4e00-\u9fa5]{1,32}$/.test($multiple_new_pack_note_input.val()))
            {
                prepend_warning('modify_multiple_modal_footer', 'danger', 'glyphicon-remove', '备注不合法', 'tip');
                border_color_by_id('multiple_new_pack_note_input');
                return false;
            }
            data.new_pack_note = $multiple_new_pack_note_input.val();
            data.mutiple = true;
            modify_AJAX(true, data);
        });
    });
});

/**删除按钮**/
$(function ()
{
    const $del_btn = $('#del_btn');
    const $del_modal = $('#del_modal');
    const $del_modal_btn = $('#del_modal_btn');
    const $del_error_modal = $('#del_error_modal');
    $del_btn.click(function ()
    {
        event.preventDefault();
        let checked_pack = [];
        let checked_checkboxes = $('input:checked');
        if (checked_checkboxes.length === 0)
        {
            $del_error_modal.modal('show');
            return false;
        }
        else
        {
            let data = {};
            $del_modal.modal('show');
            for (let checkbox of checked_checkboxes)
                checked_pack.push($(checkbox).parent().parent().attr('id'));
            data.pack = checked_pack;
            $del_modal_btn.click(function (event)
            {
                event.preventDefault();
                AJAX('del_pack', data,
                    function (response)
                    {
                        if (response.status.code === 0)
                            prepend_warning('del_modal_footer', 'danger', 'glyphicon-remove', response.status.msg, 'tip');
                        else
                        {
                            prepend_warning('del_modal_footer', 'success', 'glyphicon-ok', response.status.msg, 'tip');
                            setTimeout(function ()
                            {
                                location.reload(true);
                            }, 3000);
                        }
                    },
                    function (error)
                    {
                        console.log(error);
                        prepend_warning('del_modal_footer', 'danger', 'glyphicon-remove', '出现错误，请重试', 'tip');
                    })
            });
        }
    })
});

/**自适应高度**/
$(function ()
{
    autoHeight('package_management_panel_body', 90);
    autoHeight('add_modal_table_div', 300);
    autoHeight('modify_modal_table_div', 300);
    autoMaxHeight('screen_modal_body', 225);
    autoHeight('plus_modal_body', 225);
    autoHeight('minus_modal_body', 225);

});

/**输入tip**/
$(function ()
{
    tip_by_className('pack_name_input', '16位以内字母、数字与汉字', 'top');
    tip_by_className('pack_note_input', '32位以内字母、数字与汉字', 'top');
});

/**plus/minus_modal按钮**/
$(function ()
{
    const $plus_modal_btn = $('#plus_modal_btn');
    const $minus_modal_btn = $('#minus_modal_btn');
    $plus_modal_btn.click(function (event)
    {
        event.preventDefault();
        screen_AJAX('plus', 'add_pack_screen');
    });
    $minus_modal_btn.click(function (event)
    {
        event.preventDefault();
        screen_AJAX('minus', 'del_pack_screen');
    })
});

/**修改屏幕AJAX**/
function screen_AJAX(type, action)
{
    let data = {};
    data.screen = [];
    data.resource_id = $(`#${type}_head_row`).attr('class');
    let checked_checkboxes = $(`#${type}_modal_table`).find('input:checked');
    if (checked_checkboxes.length === 0)
    {
        prepend_warning(`${type}_modal_footer`, 'danger', 'glyphicon-remove', '至少选择一个屏幕', 'tip');
        return false;
    }
    for (let checkbox of checked_checkboxes)
        data.screen.push(parseInt($(checkbox).parent().parent().attr('class')));
    AJAX(action, data,
        function (response)
        {
            if (response.status.code === 0)
                prepend_warning(`${type}_modal_footer`, 'danger', 'glyphicon-remove', response.status.msg, 'tip');
            else
            {
                prepend_warning(`${type}_modal_footer`, 'success', 'glyphicon-ok', response.status.msg, 'tip');
                setTimeout(function ()
                {
                    location.reload(true);
                }, 1000);
            }
        },
        function (error)
        {

            console.log(error);
            prepend_warning(`${type}_modal_footer`, 'danger', 'glyphicon-remove', '出现错误，请重试', 'tip');
        })
}

/**
 *DOM结构
 <div class="add_modal_row">
 <div class="add_modal_cell">
 <label id=`${pictures[i].id}`><img src=`${pictures[i].src}` alt="test" class="image img-responsive"><input type="checkbox"        class="add_checkbox"></label>
 </div>
 </div>
 </div>
 * **/
/**
 * data格式：
 * [
 *      {id,url},
 *      {id,url},
 *      {id,url},
 *      {id,url}
 * ]
 *
 * <input type="text" class="form-control" id=${}.id_time>
 * **/
function image_AJAX(type, table_id, button_id, footer_id)
{
    if ($(`#${table_id}`).find('.modal_cell').length)
        activate_checkbox(type);
    else
    {
        AJAX('get_picture', {},
            function (response)
            {
                if (response.status.code === 0)
                {
                    prepend_warning(`${footer_id}`, 'danger', 'glyphicon-remove', response.status.msg, 'tip');
                    $(`#${button_id}`).attr('disabled', 'disabled');
                }
                else
                {
                    $(`#${button_id}`).removeAttr('disabled');
                    let pictures = response.data.pictures;
                    let row = 0;
                    for (; row < Math.floor(pictures.length / 5); row++)
                    {

                        $(`#${table_id}`).append(` <div class="modal_row">
 <div class="modal_cell">
 <label class=${pictures[row * 5].id}><div class="picture_div"><img src=${pictures[row * 5].src} alt=${pictures[row * 5].id} class="image img-responsive"></div><input type="checkbox"        class="${type}_checkbox"><input type="text" class="form-control  picture_time_input" id=${table_id}_${pictures[row * 5].id}_time maxlength="6" disabled placeholder="10"></label>
 </div><div class="modal_cell">
 <label class=${pictures[row * 5 + 1].id}><div class="picture_div"><img src=${pictures[row * 5 + 1].src} alt=${pictures[row * 5 + 1].id} class="image img-responsive"></div><input type="checkbox"        class="${type}_checkbox"><input type="text" class="form-control  picture_time_input" id=${table_id}_${pictures[row * 5 + 1].id}_time maxlength="6" disabled placeholder="10"></label>
 </div><div class="modal_cell">
 <label class=${pictures[row * 5 + 2].id}><div class="picture_div"><img src=${pictures[row * 5 + 2].src} alt=${pictures[row * 5 + 2].id} class="image img-responsive"></div><input type="checkbox"        class="${type}_checkbox"><input type="text" class="form-control  picture_time_input" id=${table_id}_${pictures[row * 5 + 2].id}_time maxlength="6" disabled placeholder="10"></label>
 </div><div class="modal_cell">
 <label class=${pictures[row * 5 + 3].id}><div class="picture_div"><img src=${pictures[row * 5 + 3].src} alt=${pictures[row * 5 + 3].id} class="image img-responsive"></div><input type="checkbox"        class="${type}_checkbox"><input type="text" class="form-control  picture_time_input" id=${table_id}_${pictures[row * 5 + 3].id}_time maxlength="6" disabled placeholder="10"></label>
 </div><div class="modal_cell">
 <label class=${pictures[row * 5 + 4].id}><div class="picture_div"><img src=${pictures[row * 5 + 4].src} alt=${pictures[row * 5 + 4].id} class="image img-responsive"></div><input type="checkbox"        class="${type}_checkbox"><input type="text" class="form-control  picture_time_input" id=${table_id}_${pictures[row * 5 + 4].id}_time maxlength="6" disabled placeholder="10"></label>
 </div>
 </div>`);
                    }
                    if (pictures.length - row * 5 > 0 && !$('#modify_modal_table_last_row').length)
                    {
                        $(`#${table_id}`).append(`<div class="modal_row" id="${table_id}_last_row"></div>`);
                        for (let i = 0; i < pictures.length - row * 5; i++)
                        {
                            $(`#${table_id}_last_row`).append(`<div class="modal_cell"><label class=${pictures[row * 5 + i].id}><div class="picture_div"><img src=${pictures[row * 5 + i].src} alt=${pictures[row * 5 + i].id} class="image img-responsive"></div><input type="checkbox" class="${type}_checkbox"><input type="text" class="form-control  picture_time_input" id=${table_id}_${pictures[row * 5 + i].id}_time maxlength="6" disabled placeholder="10"></label></div></div>`)
                        }
                    }
                    activate_checkbox(type);
                    tip_by_className('picture_time_input', '该图片的播放时间(秒)', 'bottom');
                }
            },
            function (error)
            {
                console.log(error);
                prepend_warning(`${footer_id}`, 'danger', 'glyphicon-remove', '出现错误，请重试', 'tip');
                $(`#${button_id}`).attr('disabled', 'disabled');
            }, false)
    }
}

/**
 * data格式
 * {
 *     picture_id = [],
 *     picture_time = [],
 *     pack_name = '',
 *     pack_note = '',
 * }
 *
 * 增加包：add_pack
 * **/
function package_AJAX(table_id, name_input_id, note_input_id, footer_id, action)
{
    let checkboxes = $(`#${table_id}`).find(':checked');
    let data = {};
    let picture_id = [];
    let picture_time = [];
    data.pack_name = $(`#${name_input_id}`).val();
    data.pack_note = $(`#${note_input_id}`).val();
    if (!/^[A-z0-9\u4e00-\u9fa5]{1,16}$/.test(data.pack_name))
    {
        prepend_warning(`${footer_id}`, 'danger', 'glyphicon-remove', '包名不合法', 'tip');
        border_color_by_id(name_input_id);
        return false;
    }
    if (!/^[A-z0-9\u4e00-\u9fa5]{0,32}$/.test(data.pack_note))
    {
        prepend_warning('modify_modal_footer', 'danger', 'glyphicon-remove', '备注不合法', 'tip');
        border_color_by_id(note_input_id);
        return false;
    }
    if (checkboxes.length === 0)
    {
        prepend_warning(`${footer_id}`, 'danger', 'glyphicon-remove', '至少选择一个图片', 'tip');
        return false;
    }
    for (let checkbox of checkboxes)
    {
        picture_id.push($(checkbox).parent().attr('class'));
        picture_time.push($(checkbox).next().val() === '' ? 10 : parseInt($(checkbox).next().val()));
        if (!/^[\d]*$/.test($(checkbox).next().val()) || $(checkbox).next().val() === 0)
        {
            prepend_warning(`${footer_id}`, 'danger', 'glyphicon-remove', '时间必须为正整数', 'tip');
            border_color_by_id($(checkbox).next().attr('id'));
            return false;
        }
        data.picture_id = picture_id;
        data.picture_time = picture_time;
    }

    AJAX(action, data,
        function (response)
        {
            if (response.status.code === 0)
                prepend_warning(`${footer_id}`, 'danger', 'glyphicon-remove', response.status.msg, 'tip');
            else
            {
                prepend_warning(`${footer_id}`, 'success', 'glyphicon-ok', response.status.msg, 'tip');
                setTimeout(function ()
                {
                    location.reload(true);
                }, 1000);
            }
        },
        function (error)
        {
            console.log(error);
            prepend_warning(`${footer_id}`, 'danger', 'glyphicon-remove', '出现错误，请重试', 'tip');
        })
}

/**修改ajax**/
/**
 * data格式
 * 单选情况
 * {
 *      pack:[],
  *     picture_id = [],
  *     picture_time = [],
  *     new_pack_name = '',
  *     new_pack_note = '',
  *     multiple:false
 * }
 *
 * 多选情况
 * {
 *      pack:[],
  *     new_pack_note = '',
  *     multiple:true
 * }
 * **/
function modify_AJAX(multiple_bool, data)
{
    let type = multiple_bool === false ? 'modify_modal' : 'modify_multiple_modal';
    AJAX('modify_pack', data,
        function (response)
        {
            if (response.status.code === 0)
                prepend_warning(`${type}_footer`, 'danger', 'glyphicon-remove', response.status.msg, 'tip');
            else
            {
                prepend_warning(`${type}_footer`, 'success', 'glyphicon-ok', response.status.msg, 'tip');
                setTimeout(function ()
                {
                    location.reload(true);
                }, 1000);
            }
        },
        function (error)
        {
            console.log(error);
            prepend_warning(`${type}_footer`, 'danger', 'glyphicon-remove', '出现错误，请重试', 'tip');
        })
}

/**checkbox特效**/
function activate_checkbox(type)
{
    const $checkbox = $(`.${type}_checkbox`);
    $checkbox.attr('checked', false);
    $checkbox.click(function ()
    {
        if ($(this).is(':checked'))
        {
            $(this).prev().css('backgroundImage', 'url("../images/selected.png")');
            $(this).prev().children().css('opacity', 0.25);
            $(this).next().removeAttr('disabled').css('opacity', 1);
            $(this).next().val('');
        }
        else
        {
            $(this).prev().removeAttr('style');
            $(this).prev().children().removeAttr('style');
            $(this).next().attr('disabled', 'disabled').css('opacity', 0);
        }
    });
}

/**按钮自动显示、挂载click事件、为按钮增加tip**/
/**TODO:表格中+-按钮的功能**/
function activate_button()
{
    $('tr').hover(
        function ()
        {
            $(this).find('button').css('opacity', 1);
        },
        function ()
        {
            $(this).find('button').removeAttr('style');
        });
    $('.screens').click(function (event)
    {
        event.preventDefault();
        get_screen_modal(this);
    });

    $('.plus_screen').click(function (event)
    {
        event.preventDefault();
        btn_AJAX(this, 'plus', 'get_pack_no_screen');
    });
    $('.minus_screen').click(function (event)
    {
        event.preventDefault();
        btn_AJAX(this, 'minus', 'get_pack_screen');
    });
    tip_by_className('plus_screen', '增加屏幕', 'left');
    tip_by_className('minus_screen', '减少屏幕', 'right');
    tip_by_className('screens', '点击查看完整屏幕列表', 'bottom');
}

/**屏幕列表modal**/
/**
 * 返回格式data
 * [name,name,name……]
 * **/
function get_screen_modal(pack_this)
{
    let pack_id = $(pack_this).parent().parent().attr('id');
    const $screen_modal_body = $('#screen_modal_body');
    const $screen_modal = $('#screen_modal');
    $screen_modal.modal('show');
    let data = {};
    data.resource_id = pack_id;
    AJAX('get_pack_screen', data,
        function (response)
        {
            if (response.status.code === 0)
                append_warning('screen_modal_body', 'danger', 'glyphicon-remove', response.status.msg);
            else
            {
                $screen_modal_body.html('');
                if (response.data.screen.length === 0)
                    append_warning('screen_modal_body', 'danger', 'glyphicon-remove', '该包没有关联屏幕');
                for (let screen of response.data.screen)
                    $screen_modal_body.append(`<div class="screen_list_row">${screen.name}</div>`);
            }
        },
        function (error)
        {
            console.log(error);
            append_warning('screen_modal_body', 'danger', 'glyphicon-remove', '出现错误，请重试');
        });
}

/****/
function btn_AJAX(btn_this, type, action)
{
    $(`#${type}_modal_table`).html(`<tbody><tr id=${type}_head_row>
                        <th>序号</th>
                        <th>屏幕名</th>
                        <th>备注</th>
                        <th></th>
                    </tr>
                   </tbody>`);
    $(`#${type}_modal`).modal('show');
    let data = {};
    data.resource_id = $(btn_this).parent().parent().attr('id');
    $(`#${type}_head_row`).attr('class', data.resource_id);
    AJAX(action, data,
        function (response)
        {
            if (response.status.code === 0)
                prepend_warning(`${type}_modal_footer`, 'danger', 'glyphicon-remove', response.status.msg, 'tip');
            else
            {
                prepend_warning(`${type}_modal_footer`, 'info', 'glyphicon-refresh', '加载中', 'tip');
                let screens = response.data.screen;
                for (let i = 0; i < screens.length; i++)
                {
                    $(`#${type}_modal_table`).append(`<tr class=${screens[i].screen_id}>
                        <td>${i + 1}</td>
                        <td>${screens[i].name}</td>
                        <td>${screens[i].note}</td>
                        <td><input type="checkbox"></td>
                    </tr>`)
                }
            }
        },
        function (error)
        {
            console.log(error);
            append_warning('screen_modal_body', 'danger', 'glyphicon-remove', '出现错误，请重试');
        })

}
