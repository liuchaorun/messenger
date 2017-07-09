/**
 * Created by 31641 on 2017-7-6.
 */
let picture_pack_info = {};//存储每个图片的资源包信息

/**自适应高度**/
$(function ()
{
    autoHeight('del_picture_panel_body', 90);
    autoHeight('del_error_2_modal_body', 225);
});

/**拉取图片**/
/**DOM结构
 * <div class="del_picture_row">
 <div class="del_picture_div">
 <label id="del_picture_label"><img src="../images/Test.png" alt="test"
 class="del_picture image img-responsive">
 <input type="checkbox" class="checkbox"></label>
 </div>
 </div>
 * **/

/**
 * data结构
 * {
 *      pictures: [
 *                  {id=XXX,src=XXX,pack=[XXX,XXX]},
 *                 ]
 * }
 * **/
$(function ()
{
    const $error_modal = $('#error_modal');
    const $del_picture_table = $('#del_picture_table');
    AJAX('get_picture_for_del', {},
        function (response)
        {
            if (response.status.code === 0)
                $error_modal.modal('show');
            else
            {
                for (let picture of response.data.pictures)
                {
                    picture_pack_info[picture.id] = {};
                    picture_pack_info[picture.id].url = picture.url;
                    picture_pack_info[picture.id].pack = picture.pack;
                }
                let pictures = response.data.pictures;
                let row = 0;
                for (; row < Math.floor(pictures.length / 5); row++)
                {

                    $del_picture_table.append(` <div class="del_picture_row">
 <div class="del_picture_div">
 <label id=${pictures[row * 5].id}  class='del_picture_label'><img src=${pictures[row * 5].src} alt=${pictures[row * 5].id} class="image img-responsive del_picture"><input type="checkbox"        class="checkbox"></label>
 </div><div class="del_picture_div">
 <label id=${pictures[row * 5 + 1].id} class='del_picture_label'><img src=${pictures[row * 5 + 1].src} alt=${pictures[row * 5 + 1].id} class="image img-responsive del_picture"><input type="checkbox"        class="checkbox"></label>
 </div><div class="del_picture_div">
 <label id=${pictures[row * 5 + 2].id} class='del_picture_label'><img src=${pictures[row * 5 + 2].src} alt=${pictures[row * 5 + 2].id} class="image img-responsive del_picture"><input type="checkbox"        class="checkbox"></label>
 </div><div class="del_picture_div">
 <label id=${pictures[row * 5 + 3].id} class='del_picture_label'><img src=${pictures[row * 5 + 3].src} alt=${pictures[row * 5 + 3].id} class="image img-responsive del_picture"><input type="checkbox"        class="checkbox"></label>
 </div><div class="del_picture_div">
 <label id=${pictures[row * 5 + 4].id} class='del_picture_label'><img src=${pictures[row * 5 + 4].src} alt=${pictures[row * 5 + 4].id} class="image img-responsive del_picture"><input type="checkbox"        class="checkbox"></label>
 </div>
 </div>`);
                }
                if (pictures.length - row * 5 > 0 && !$('#modify_modal_table_last_row').length)
                {
                    $del_picture_table.append(`<div class="del_picture_row" id="del_picture_table_last_row"></div>`);
                    for (let i = 0; i < pictures.length - row * 5; i++)
                    {
                        $(`#del_picture_table_last_row`).append(`<div class="del_picture_div"><label id=${pictures[row * 5 + i].id} class='del_picture_label'><img src=${pictures[row * 5 + i].src} alt=${pictures[row * 5 + i].id} class="image img-responsive del_picture"><input type="checkbox" class="checkbox"></label></div></div>`)
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


/**挂载click事件，点击删除按钮操作**/
/**
 * <table class="table table-responsive" id="del_picture_with_pack_table">
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
    const $del_picture_btn = $('#del_picture_btn');
    const $del_error_modal = $('#del_error_modal');
    const $del_error_2_modal = $('#del_error_2_modal');
    const $del_picture_with_pack_table = $('#del_picture_with_pack_table');

    const $checkbox = $('.checkbox');

    /**checkbox效果**/
    $checkbox.click(function ()
    {
        if ($(this).is(':checked'))
        {
            $(this).parent().parent().css('backgroundImage', 'url("../images/selected.png")');
            $(this).parent().css('opacity', 0.25);
        }
        else
        {
            $(this).parent().removeAttr('style');
            $(this).parent().parent().removeAttr('style');
        }
    });

    $del_picture_btn.click(function (event)
    {
        event.preventDefault();
        let checked_checkboxes = $('input:checked');
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
            AJAX('del_picture', data,
                function (response)
                {
                    if (response.status.code === 0)
                        prepend_warning('del_picture_modal_footer', 'danger', 'glyphicon-remove', response.status.msg, 'tip');
                    else
                    {
                        prepend_warning('del_picture_modal_footer', 'success', 'glyphicon-ok', response.status.msg, 'tip');
                        setTimeout(function ()
                        {
                            location.reload(true);
                        }, 2000)
                    }
                },
                function (error)
                {
                    console.log(error);
                    prepend_warning('del_picture_modal_footer', 'danger', 'glyphicon-remove', '出现错误，请重试', 'tip');
                })
        }
        else
        {
            $del_picture_with_pack_table.html(`<table class="table table-responsive" id="del_picture_with_pack_table"><tbody><tr><th class="preview">预览</th><th>资源包</th></tr></tbody></table>`);
            for (let id of picture_with_pack)
            {
                let packs = "";
                for (let pack of picture_pack_info[id].pack)
                    packs = pack + ' pack';
                $del_picture_with_pack_table.append(`<tr><td><img class="preview" src=${picture_pack_info[id].url} alt=${id}></td><td>${packs}</td></tr>`)
            }
            $del_error_2_modal.modal('show');
        }
    });
}