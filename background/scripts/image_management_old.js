/**
 * Created by 31641 on 2017-7-6.
 */
let picture_pack_info = {};//存储每个图片的资源包信息

/**Set height**/
$(function ()
{
    auto_height('image_management_panel_body', 90);
    auto_height('del_error_2_modal_body', 225);
});

/**Pull images**/
/**DOM Structure
 * <div class="image_management_table_row">
 <div class="image_management_table_cell">
 <label id="del_picture_label"><img src="../images/Test.png" alt="test"
 class="table_image image img-responsive">
 <input type="checkbox" class="checkbox"></label>
 </div>
 </div>
 * **/

/**
 * data:
 * {
 *      pictures: [
 *                  {id=XXX,src=XXX,pack=[XXX,XXX]},
 *                 ]
 * }
 * **/
$(function ()
{
    const $error_modal = $('#error_modal');
    const $del_picture_table = $('#image_management_table');
    const PICTURES_PER_ROW = 5;
    AJAX('get_picture_for_del', {},
        function (response)
        {
            if (response.status.code === 0)
                $error_modal.modal('show');
            else
            {
                for (const picture of response.data.pictures)
                {
                    picture_pack_info[picture.id] = {};
                    picture_pack_info[picture.id].src = picture.src;
                    picture_pack_info[picture.id].pack = picture.pack;
                }
                const pictures = response.data.pictures;
                let row = 0;
                let $row_node = $(`<div class="image_management_table_row"></div>`);
                for (; row < Math.floor(pictures.length / PICTURES_PER_ROW); row++)
                {
                    for (let i = 0; i < PICTURES_PER_ROW; i++)
                    {
                        $row_node.append(`<div class="image_management_table_cell"><label id=${pictures[row * PICTURES_PER_ROW + i].id}  class='del_picture_label'><img src=${pictures[row * PICTURES_PER_ROW + i].src} alt=${pictures[row * PICTURES_PER_ROW + i].id} class="image img-responsive table_image"><input type="checkbox" class="checkbox"></label></div>`);
                    }
                    $del_picture_table.append($row_node);
                    $row_node = $(`<div class="image_management_table_row"></div>`);
                }
                if (pictures.length - row * PICTURES_PER_ROW > 0 && !$('#modify_modal_table_last_row').length)
                {
                    $del_picture_table.append(`<div class="image_management_table_row" id="del_picture_table_last_row"></div>`);
                    for (let i = 0; i < pictures.length - row * PICTURES_PER_ROW; i++)
                    {
                        $(`#del_picture_table_last_row`).append(`<div class="image_management_table_cell"><label id=${pictures[row * PICTURES_PER_ROW + i].id} class='del_picture_label'><img src=${pictures[row * PICTURES_PER_ROW + i].src} alt=${pictures[row * PICTURES_PER_ROW + i].id} class="image img-responsive table_image"><input type="checkbox" class="checkbox"></label></div></div>`)
                    }
                }
                activate();
            }
        },
        function (error)
        {
            console.log(error);
            $error_modal.modal('show');
        })
});


/**Load click event**/
/**
 * <table class="table table-responsive" id="del_image_with_pack_table">
 <tr>
 <th class="preview">预览</th>
 <th>资源包</th>
 </tr>
 <tr>
 <td><img class="preview" src="../images/Test.png" alt=""></td>
 <td>aaaaa,bbbbb,ccccc</td>
 </tr>
 </table>
 * **/
function activate()
{
    const [$del_picture_btn, $del_picture_modal_btn] = [$('#del_picture_btn'), $('#del_picture_modal_btn')];
    const [$del_error_modal, $del_error_2_modal, $del_picture_modal] =
        [$('#del_error_modal'), $('#del_error_2_modal'), $('#del_picture_modal')];
    const $del_picture_with_pack_table = $('#del_image_with_pack_table');
    const $checkbox = $('.checkbox');

    /**checkbox effect**/
    $checkbox.click(function (event)
    {
        if ($(event.target).is(':checked'))
        {
            $(event.target).parent().parent().css('backgroundImage', 'url("../images/admin/selected.png")');
            $(event.target).parent().css('opacity', 0.25);
        }
        else
        {
            $(event.target).parent().removeAttr('style');
            $(event.target).parent().parent().removeAttr('style');
        }
    });

    $del_picture_btn.click(function (event)
    {
        event.preventDefault();
        const checked_checkboxes = $('input:checked');
        let picture_with_pack = [];
        if (checked_checkboxes.length === 0)
        {
            $del_error_modal.modal('show');
            return false;
        }
        let data = {};
        data.picture_id = [];
        for (let checkbox of checked_checkboxes)
        {
            data.picture_id.push(parseInt($(checkbox).parent().attr('id')));
            if (picture_pack_info[$(checkbox).parent().attr('id')].pack.length !== 0)
                picture_with_pack.push(parseInt($(checkbox).parent().attr('id')))
        }
        if (picture_with_pack.length === 0)
        {
            $del_picture_modal.modal('show');

            $del_picture_modal_btn.click(function ()
            {
                AJAX('table_image', data,
                    function (response)
                    {
                        if (response.status.code === 0)
                        //modal_prepend_warning('del_picture_modal_footer', 'danger', 'glyphicon-remove', response.status.msg, 'tip');
                            showNotification(response.status.msg, FAILURE);
                        else
                        {
                            //modal_prepend_warning('del_picture_modal_footer', 'success', 'glyphicon-ok', response.status.msg, 'tip');
                            showNotification(response.status.msg);
                            setTimeout(function ()
                            {
                                location.reload(true);
                            }, 2000)
                        }
                    },
                    function (error)
                    {
                        console.log(error);
                        //modal_prepend_warning('del_picture_modal_footer', 'danger', 'glyphicon-remove', '出现错误，请重试', 'tip');
                        showNotification('出现错误，请重试', FAILURE);
                    })
            });

        }
        else
        {
            $del_picture_with_pack_table.html(`<table class="table table-responsive" id="del_image_with_pack_table"><tbody><tr><th class="preview">预览</th><th>资源包</th></tr></tbody></table>`);

            for (let id of picture_with_pack)
            {
                let packs = '';
                for (const pack of picture_pack_info[id].pack)
                {
                    packs += (pack + ',');
                }
                $del_picture_with_pack_table.append(`<tr><td><img class="preview" src=${picture_pack_info[id].src} alt=${id}></td><td>${packs.slice(0, packs.length - 1)}</td></tr>`)
            }
            $del_error_2_modal.modal('show');
        }
    });
}