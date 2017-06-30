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
 <button class="plus_screen btn btn-primary btn-sm" id=${pack.id}_plus_btn>+</button>
 ${pack.screen}
 <button class="minus_screen btn btn-primary btn-sm" id=${pack.id}_minus_btn>-</button>
 </td>
 <td><input type="checkbox" class="checkbox-inline screen_checkbox"></td>
 </tr>
 * **/
/**
 * data数据格式
 * {id,name,note,screen}
 * screen是屏幕名拼接之后的字符串
 * **/
$(function ()
{
    activate_button();
});

/**增加按钮**/
$(function ()
{
    const $add_btn = $('#add_btn');
    $add_btn.click(function ()
    {
        prepend_warning('add_modal_footer', 'info', 'glyphicon-refresh', '加载中……', 'tip');
        image_AJAX('add_modal_table', 'add_modal_btn', 'add_modal_footer');
    });

});

/**修改按钮**/
/**TODO:根据选择数量修改修改、删除框的内容**/
$(function ()
{
    const $modify_btn = $('#modify_btn');
    $modify_btn.click(function ()
    {
        prepend_warning('modify_modal_footer', 'info', 'glyphicon-refresh', '加载中……', 'tip');
        image_AJAX('modify_modal_table', 'modify_modal_btn', 'modify_modal_footer');
    });
});

/**增加modal按钮**/
$(function ()
{
    const $add_modal_btn = $('#add_modal_btn');
    $add_modal_btn.click(function ()
    {
        package_AJAX('add_modal_table', 'pack_name_input', 'add_modal_footer', 'add_pack');
    });
});

/**自适应高度**/
$(function ()
{
    resizeToScreenHeight('package_management_panel_body', 90);
    resizeToScreenHeight('add_modal_body', 225);
    resizeToScreenHeight('modify_modal_body', 225);
});

/**输入弹框**/
$(function ()
{
    tip_by_id('pack_name_input', '16位以内字母、数字与汉字', 'top');
    tip_by_id('new_pack_name_input', '16位以内字母、数字与汉字', 'top');
});

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
function image_AJAX(table_id, button_id, footer_id)
{
    if ($(`#${table_id}`).find('.add_modal_row').length)
    {
        activate_checkbox();
        return false;
    }
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
                        for (let i = 0; i < 5; i++)
                        {
                            $(`#${table_id}`).append(` <div class="add_modal_row">
 <div class="add_modal_cell">
 <label class=${pictures[row * 5 + i].id}><div class="picture_div"><img src=${pictures[row * 5 + i].src} alt=${pictures[row * 5 + i].id} class="image img-responsive"></div><input type="checkbox"        class="add_checkbox"><input type="text" class="form-control  picture_time_input" id=${table_id}_${pictures[row * 5 + i].id}_time maxlength="6" disabled placeholder="10"></label>
 </div>
 </div>`);
                        }
                    }
                    if (pictures.length - row * 5 > 0)
                    {
                        $(`#${table_id}`).append(`<div class="add_modal_row" id="${table_id}_last_row"></div>`);
                        for (let i = 0; i < pictures.length - row * 5; i++)
                        {
                            $(`#${table_id}_last_row`).append(`<div class="add_modal_cell"><label class=${pictures[row * 5 + i].id}><div class="picture_div"><img src=${pictures[row * 5 + i].src} alt=${pictures[row * 5 + i].id} class="image img-responsive"></div><input type="checkbox" class="add_checkbox"><input type="text" class="form-control  picture_time_input" id=${table_id}_${pictures[row * 5 + i].id}_time maxlength="6" disabled placeholder="10"></label></div></div>`)
                        }
                    }
                    activate_checkbox();
                    tip_by_className('picture_time_input', '该图片的播放时间(秒)', 'bottom');
                }
            },
            function (error)
            {
                console.log(error);
                prepend_warning(`${footer_id}`, 'danger', 'glyphicon-remove', '出现错误，请重试', 'tip');
                $(`#${button_id}`).attr('disabled', 'disabled');
            })
    }
}

/**
 * data格式
 * {
 *      pack_name:"",
 *      picture:
 *      [
 *          {id,time},
 *          {id,time},
 *          {id,time}
 *      ]
 * }
 *
 * 增加包：add_pack
 * 编辑包：modify_pack
 * **/
function package_AJAX(table_id, name_input_id, footer_id, action)
{
    let checkboxes = $(`#${table_id}`).find(':checked');
    let data = {};
    let picture = {};
    data.pack_name = $(`#${name_input_id}`).val();
    data.picture = [];
    if (!/^[0-9A-z\u4e00-\u9fa5]]{1,16}$/.test(data.pack_name))
    {
        prepend_warning(`${footer_id}`, 'danger', 'glyphicon-remove', '包名不合法', 'tip');
        border_color_by_id(name_input_id);
        return false;
    }
    if (checkboxes.length === 0)
    {
        prepend_warning(`${footer_id}`, 'danger', 'glyphicon-remove', '至少选择一个图片', 'tip');
        return false;
    }
    for (let checkbox of checkboxes)
    {
        picture.id = $(checkbox).parent().attr('class');
        picture.time = ($(checkbox).next().val() === '' ? 10 : $(checkbox).next().val());
        if (!/^[\d]+$/.test(picture.time) || picture.time === 0)
        {
            prepend_warning(`${footer_id}`, 'danger', 'glyphicon-remove', '时间必须为正整数', 'tip');
            border_color_by_id($(checkbox).next().attr('id'));
            return false;
        }
        data.picture.push(picture);
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
                }, 3000);
            }
        },
        function (error)
        {
            console.log(error);
            prepend_warning(`${footer_id}`, 'danger', 'glyphicon-remove', '出现错误，请重试', 'tip');
        })

}

/**checkbox特效**/
function activate_checkbox()
{
    const $add_checkbox = $('.add_checkbox');
    $add_checkbox.attr('checked', false);
    $add_checkbox.click(function ()
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

/**按钮自动显示**/
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
        })
}