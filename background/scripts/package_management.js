/**
 * Created by 31641 on 2017-6-27.
 */
/**自适应高度**/
$(function ()
{
    resizeToScreenHeight('package_management_panel_body', 90);
    resizeToScreenHeight('add_modal_body', 225);
    resizeToScreenHeight('modify_modal_body', 225);
});

/**
 *
 <div class="add_modal_row">
 <div class="add_modal_cell">
 <label id=`${pictures[i].id}`><img src=`${pictures[i].src}` alt="test" class="image img-responsive"><input type="checkbox"        class="add_checkbox"></label>
 </div>
 </div>
 </div>
 * **/

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
$(function ()
{
    const $modify_btn = $('#modify_btn');
    $modify_btn.click(function ()
    {
        prepend_warning('modify_modal_footer', 'info', 'glyphicon-refresh', '加载中……', 'tip');
        image_AJAX('modify_modal_table', 'modify_modal_btn', 'modify_modal_footer');
    });
});

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
    if ($(`#${table_id}`).children('.add_modal_row').length)
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
 <label id=${pictures[row * 5 + i].id}><div class="picture_div"><img src=${pictures[row * 5 + i].src} alt=${pictures[row * 5 + i].id} class="image img-responsive"></div><input type="checkbox"        class="add_checkbox"><input type="text" class="form-control  picture_time_input" id=${pictures[row * 5 + i].id}_time maxlength="6"></label>
 </div>
 </div>`);
                        }
                    }
                    if (pictures.length - row * 5 > 0)
                    {
                        $(`#${table_id}`).append(`<div class="add_modal_row" id="${table_id}_last_row"></div>`);
                        for (let i = 0; i < pictures.length - row * 5; i++)
                        {
                            $(`#${table_id}_last_row`).append(`<div class="add_modal_cell"><label id=${pictures[row * 5 + i].id}><div class="picture_div"><img src=${pictures[row * 5 + i].src} alt=${pictures[row * 5 + i].id} class="image img-responsive"></div><input type="checkbox" class="add_checkbox"><input type="text" class="form-control  picture_time_input" id=${pictures[row * 5 + i].id}_time maxlength="6"></label></div></div>`)
                        }
                    }
                    activate_checkbox();
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
        }
        else
        {
            $(this).prev().removeAttr('style');
            $(this).prev().children().removeAttr('style');
        }
    });
}