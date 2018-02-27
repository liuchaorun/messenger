/**
 * Created by 31641 on 2017-7-6.
 */

/*自动高度设置*/
$(function ()
{
    auto_height('image_management_panel_body', 80);
    auto_height('del_error_2_modal_body', 225);
});


/*拉取图片列表，初始化标签表格*/
/**
 * data:
 * {
 *      id1:{name:XXX,src:XXX,target:XXX,pack:[XXX,XXX],position:'1'},
 *      id2:{name:XXX,src:XXX,target:XXX,pack:[XXX,XXX],position:'1'},
 *      id3:{name:XXX,src:XXX,target:XXX,pack:[XXX,XXX],position:'1'}
 * }
 * **/
$(function ()
{
    sessionStorage.clear();
    get_server_adTypeArr();

    const $error_modal = $('#error_modal');

    AJAX('get_images', {}, function (res)
    {
        if (res.status.code === FAIL)
        {
            showNotification(res.status.msg, FAILURE);
            $error_modal.modal('show');
        }
        else
        {
            sessionStorage.setItem('imagesObj', JSON.stringify(res.data));
            refresh_image_table();
        }
    }, function (err)
    {

        $error_modal.modal('show');
        console.log(err);
    });

});


/*修改按钮行为*/
/*多选报错，单选读取ID信息填充*/
$(function ()
{
    const $modify_image_btn = $('#modify_image_btn');
    const $modify_image_modal = $('#modify_image_modal');
    const $new_name = $('#new_name');
    const $new_target = $('#new_target');
    const $file_preview_table_wrapper = $('#file_preview_table_wrapper');

    $modify_image_btn.click(function (e)
    {
        e.preventDefault();
        const $selected = $('.table_image.selected');
        if ($selected.length === 0)
        {
            showNotification('请选择要修改的图片', FAILURE);
        }
        else if ($selected.length !== 1)
        {
            showNotification('只能修改一幅图片', FAILURE);
        }
        else
        {
            /*预先填充信息*/
            let imagesObj = JSON.parse(sessionStorage.getItem('imagesObj'));
            const imageID = parseInt($selected.attr('id').toString());
            const adTypeArr = imagesObj[imageID].adType;
            const $adType = $('.adType');
            const $file_preview_table_cell = $('.file_preview_table_cell');

            $file_preview_table_wrapper.css('background-image', `url(${imagesObj[imageID].src})`);
            $file_preview_table_wrapper.attr('alt', imageID);//记录修改图片的ID
            $file_preview_table_cell.removeClass('selected');
            $(`#${imagesObj[imageID].position}`).addClass('selected');
            $new_name.val(imagesObj[imageID].name);
            $new_target.val(imagesObj[imageID].target);

            $adType.removeClass('selected');
            for (let adType of $adType)
            {
                if (adTypeArr.indexOf($(adType).text()) !== -1)
                {
                    $(adType).addClass('selected');
                }
            }
            $modify_image_modal.modal('show');
        }
    });
});

/*二维码部分变色*/
$(function ()
{
    const $file_preview_table_cell = $('.file_preview_table_cell');
    $file_preview_table_cell.click(function (e)
    {
        e.preventDefault();
        $file_preview_table_cell.removeClass('selected');
        $(this).addClass('selected');
    });
});

/*提交图片修改信息*/
$(function ()
{
    const $modify_image_modal = $('#modify_image_modal');
    const $file_preview_table_wrapper = $('#file_preview_table_wrapper');
    const $modify_image_modal_submit_btn = $('#modify_image_modal_submit_btn');
    const $new_name = $('#new_name');
    const $new_target = $('#new_target');

    $modify_image_modal_submit_btn.click(function (e)
    {
        e.preventDefault();

        let imagesObj = JSON.parse(sessionStorage.getItem('imagesObj'));

        const new_name = $new_name.val();
        const new_target = $new_target.val();
        const $selected_position = $('.file_preview_table_cell.selected');
        const $selected_adType = $('.adType.selected');
        if (!IMAGE_NAME_REG.test(new_name))
        {
            $new_name.css('border-color', 'red');
            showNotification('新图片名不合法', FAILURE);
        }
        else if (!IMAGE_TARGET_REG.test(new_target))
        {
            $new_target.css('border-color', 'red');
            showNotification('新网址不合法', FAILURE);
        }
        else if ($selected_position.length !== 1)
        {
            showNotification('二维码位置选择非法', FAILURE);
        }
        else if ($selected_adType.length === 0)
        {
            showNotification('至少选择一个标签', FAILURE);
        }
        else
        {
            let data = {};
            data.id = $file_preview_table_wrapper.attr('alt');
            data.new_name = new_name;
            data.new_target = new_target;
            data.new_position = $selected_position.attr('id');
            data.new_adType = [];

            for (const adType of $selected_adType)
            {
                data.new_adType.push($(adType).text());
            }

            AJAX('modify_image_info', data, function (res)
            {
                if (res.status.code === FAIL)
                {
                    showNotification(res.status.msg, FAILURE);
                }
                else
                {
                    imagesObj[data.id].name = new_name;
                    imagesObj[data.id].target = new_target;
                    imagesObj[data.id].position = data.new_position;
                    imagesObj[data.id].adType = data.new_adType;
                    sessionStorage.setItem('imagesObj', JSON.stringify(imagesObj));
                    refresh_image_table();
                    showNotification(res.status.msg);
                    $modify_image_modal.modal('hide');
                }
            }, function (err)
            {
                showNotification('修改失败，请重试', FAILURE);
                console.log(err);
            });
        }
    });
});

/*删除图片按钮*/
$(function ()
{
    const $delete_image_btn = $('#delete_image_btn');
    const $del_image_modal = $('#delete_image_modal');
    const $delete_image_modal_btn = $('#delete_image_modal_btn');
    const $del_image_with_pack_modal = $('#del_image_with_pack_modal');
    const $del_image_with_pack_table = $('#del_image_with_pack_table');

    $delete_image_btn.click(function (e)
    {
        e.preventDefault();
        let imagesObj = JSON.parse(sessionStorage.getItem('imagesObj'));
        const $selected = $('.table_image.selected');
        if ($selected.length === 0)
        {
            showNotification('请选择要删除的图片', FAILURE);
        }
        else
        {
            let hasPack = false;
            $del_image_with_pack_table.html(`<tbody><tr>
                        <th class="preview">预览</th>
                        <th>资源包</th>
                    </tr></tbody>`);
            for (const image of $selected)
            {
                if (imagesObj[$(image).attr('id')].pack.length !== 0)//有绑定的图片
                {
                    hasPack = true;
                    $del_image_with_pack_table.append(`<tr>
 <td><img class="preview" src="${imagesObj[$(image).attr('id')].src}" alt="$(image).attr('id')"></td>
 <td>${imagesObj[$(image).attr('id').toString()].pack.toString()}</td>
 </tr>`);
                }
            }

            if (hasPack === true)
                $del_image_with_pack_modal.modal('show');
            else
            {
                $del_image_modal.modal('show');

                $delete_image_modal_btn.click(function (e)
                {
                    e.preventDefault();
                    let data = [];
                    for (const image of $selected)
                    {
                        data.push($(image).attr('id'));
                    }
                    AJAX('delete_image', data, function (res)
                    {
                        if (res.status.code === FAIL)
                        {
                            showNotification(res.status.msg, FAILURE);
                        }
                        else
                        {
                            let imagesObj = JSON.parse(sessionStorage.getItem('imagesObj'));
                            for (const id of data)
                            {
                                delete imagesObj[id];
                            }
                            sessionStorage.setItem('imagesObj', JSON.stringify(imagesObj));
                            refresh_image_table();
                            $del_image_modal.modal('hide');
                            showNotification(res.status.msg);
                        }
                    }, function (err)
                    {
                        showNotification('删除失败，请重试', FAILURE);
                        console.log(err);
                    });
                });
            }
        }
    });

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

/*添加工具提示*/
$(function ()
{
    add_tooltip_by_id('new_name', '8字符以内字母、数字及汉字', 'bottom');
    add_tooltip_by_id('new_target', 'http:// 或 https:// 开头网址', 'bottom');
});

/**图片表格DOM
 <div class="image_management_table_row">
 <div class="image_management_table_cell">
 <img src="../images/temp/锁屏3.png" alt="test" class="table_image image img-responsive">
 <div class="label label-info image_name" id='1'>啊啊啊啊啊啊啊啊(1)</div>
 </div>
 <div class="image_management_table_cell">
 <img src="../images/temp/锁屏3.png" alt="test" class="table_image image img-responsive">
 <div class="label label-info image_name" id='1'>啊啊啊啊啊啊啊啊(1)</div>
 </div>
 <div class="image_management_table_cell">
 <img src="../images/temp/锁屏3.png" alt="test" class="table_image image img-responsive">
 <div class="label label-info image_name" id='1'>啊啊啊啊啊啊啊啊(1)</div>
 </div>
 <div class="image_management_table_cell">
 <img src="../images/temp/锁屏3.png" alt="test" class="table_image image img-responsive">
 <div class="label label-info image_name" id='1'>啊啊啊啊啊啊啊啊(1)</div>
 </div>
 </div>
 * **/

/*根据sessionStorage内容刷新图片表格*/
function refresh_image_table()
{
    const $image_management_table = $('#image_management_table');
    const IMAGES_PER_ROW = 4;
    const imagesObj = JSON.parse(sessionStorage.getItem('imagesObj'));

    let currentImageNum = 0;
    let $currentRow = null;
    $image_management_table.text('');
    for (const id in imagesObj)
    {
        if (imagesObj.hasOwnProperty(id))
        {
            if (currentImageNum % IMAGES_PER_ROW === 0)
            {
                if (currentImageNum !== 0)
                {
                    $image_management_table.append($currentRow);
                }
                $currentRow = $(`<div class="image_management_table_row"></div>`);
            }
            $currentRow.append(`<div class="image_management_table_cell">
 <img src="${imagesObj[id].src}" class="table_image image img-responsive" id="${id}">
 <div class="label label-info image_name">${imagesObj[id].name}</div>
 </div>`);
            currentImageNum++;
        }
    }
    if ($currentRow !== null)
    {
        $image_management_table.append($currentRow);
    }
    refresh_image_click_event();
}

/*图片点击事件*/
function refresh_image_click_event()
{
    const $table_image = $('.table_image');
    $table_image.click(function (e)
    {
        e.preventDefault();
        if ($(this).hasClass('selected'))
        {
            $(this).parent().removeAttr('style');
            $(this).removeClass('selected');
        }
        else
        {
            $(this).parent().css({backgroundImage: 'url("../images/admin/selected.png")'});
            $(this).addClass('selected');
        }
    });
}

/*从本地缓存解析出对象并返回，如果本地缓存不存在则重新获取*/
function get_local_adTypeArr()
{
    let adTypeArr = JSON.parse(sessionStorage.getItem('adTypeArr'));
    if (adTypeArr === null)
    {
        get_server_adTypeArr();
        adTypeArr = JSON.parse(sessionStorage.getItem('adTypeArr'));
    }
    return adTypeArr;
}

/*从服务器获取标签名数组，并放在本地缓存中*/
function get_server_adTypeArr()
{
    const $err_modal = $('#error_modal');
    AJAX('get_adType', {},
        function (res)
        {
            if (res.status.code === FAIL)
            {
                showNotification(res.status.msg, FAILURE);
                $err_modal.modal('show');
            }
            else
            {
                const adTypeArr = res.data.adType;
                sessionStorage.setItem('adTypeArr', JSON.stringify(adTypeArr));
                refresh_adType_table();
            }
        },
        function (err)
        {
            console.log(err);
            $err_modal.modal('show');
        });
}

/*刷新标签表格*/
function refresh_adType_table()
{
    const $adType_table = $('#adType_table');
    const adTypeArr = get_local_adTypeArr();
    $adType_table.text('');
    const completeRowNum = Math.floor(adTypeArr.length / 5);
    const restItemNum = adTypeArr.length % 5;
    for (let i = 0; i < completeRowNum; i++)
    {
        $adType_table.append(`<div class="adType_table_row">
      <span class="label label-default adType_table_cell adType">${adTypeArr[5 * i]}</span>
      <span class="label label-default adType_table_cell adType">${adTypeArr[5 * i + 1]}</span>
      <span class="label label-default adType_table_cell adType">${adTypeArr[5 * i + 2]}</span>
      <span class="label label-default adType_table_cell adType">${adTypeArr[5 * i + 3]}</span>
      <span class="label label-default adType_table_cell adType">${adTypeArr[5 * i + 4]}</span>
  </div>`);
    }
    let $lastRow = $(`<div class="adType_table_row"></div>`);
    for (let i = 0; i < restItemNum; i++)
    {
        $lastRow.append(`<span class="label label-default adType_table_cell adType">${adTypeArr[5 * completeRowNum + i]}</span>`);
    }
    for (let i = 0; i < 5 - restItemNum; i++)
    {
        $lastRow.append(`<span class="adType_table_cell"></span>`);
    }
    $adType_table.append($lastRow);
    refresh_adType_click_event();
}

/*点击标签后选中并变色*/
function refresh_adType_click_event()
{
    const $adType = $('.adType');
    $adType.click(function (e)
    {
        e.preventDefault();
        if ($(this).hasClass('selected'))
            $(this).removeClass('selected');
        else
            $(this).addClass('selected');
    });
}