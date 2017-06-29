/**
 * Created by 31641 on 2017-6-27.
 */
/**自适应高度**/
$(function ()
{
    resizeToScreenHeight('package_management_panel_body', 90);
    resizeToScreenHeight('add_modal_body', 275);
    resizeToScreenHeight('modify_modal_body', 275);
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
        image_AJAX('add_modal_table', 'add_modal_btn', 'add_modal_footer');
    });

});

/**修改按钮**/
$(function ()
{
    const $modify_btn = $('#modify_btn');
    $modify_btn.click(function ()
    {
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
                    let row;
                    for (row = 0; row < Math.floor(pictures.length / 5); row++)
                    {
                        $(`#${table_id}`).append(` <div class="add_modal_row">
 <div class="add_modal_cell">
 <label id=${pictures[row * 5].id}><img src=${pictures[row * 5].src} alt=${pictures[row * 5].id} class="image img-responsive"><input type="checkbox"        class="add_checkbox"></label>
 </div>
 </div>
 <div class="add_modal_cell">
 <label id=${pictures[row * 5 + 1].id}><img src=${pictures[row * 5 + 1].src} alt=${pictures[row * 5 + 1].id} class="image img-responsive"><input type="checkbox"        class="add_checkbox"></label>
 </div>
 </div>
 <div class="add_modal_cell">
 <label id=${pictures[row * 5 + 2].id}><img src=${pictures[row * 5 + 2].src} alt=${pictures[row * 5 + 2].id} class="image img-responsive"><input type="checkbox"        class="add_checkbox"></label>
 </div>
 </div>
 <div class="add_modal_cell">
 <label id=${pictures[row * 5 + 3].id}><img src=${pictures[row * 5 + 3].src} alt=${pictures[row * 5 + 3].id} class="image img-responsive"><input type="checkbox"        class="add_checkbox"></label>
 </div>
 </div>
 <div class="add_modal_cell">
 <label id=${pictures[row * 5 + 4].id}><img src=${pictures[row * 5 + 4].src} alt=${pictures[row * 5 + 4].id} class="image img-responsive"><input type="checkbox"        class="add_checkbox"></label>
 </div>
 </div>
 </div>`)
                    }

                    if (pictures.length - row * 5 > 0)
                    {
                        $(`#${table_id}`).append(`<div class="add_modal_row" id="last_row"></div>`);
                        for (let i = 0; i < pictures.length - row * 5; i++)
                        {
                            $('#last_row').append(`<div class="add_modal_cell"><label id=${pictures[row * 5 + i].id}><img src=${pictures[row * 5 + i].src} alt=${pictures[row * 5 + i].id} class="image img-responsive"><input type="checkbox" class="add_checkbox"></label></div></div>`)
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
    $add_checkbox.click(function (event)
    {
        event.preventDefault();
        if ($(this).is(':checked'))
        {
            $(this).prev().css('opacity', 0.25);
            $(this).parent().css('backgroundImage', 'url("../images/selected.png")');
        }
        else
        {
            $(this).prev().removeAttr('style');
            $(this).parent().removeAttr('style');
        }
    });
}