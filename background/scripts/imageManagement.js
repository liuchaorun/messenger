/**
 * Created by 31641 on 2017-7-6.
 */

/*自动高度设置*/
$(function ()
{
    setHeight('image_management_panel_body', 80);
    setHeight('del_error_2_modal_body', 225);
});


/*拉取图片列表，初始化标签表格*/
/*
response.data:{
  "ads":{
    "ad_id":{
    "name":"string",
    "src":"string",
    "target":"string",
    "position":"int",
    "pack":["string"],
    "adLabel":["string"]
    }
  }
}
*/
$(function ()
{
    sessionStorage.clear();
    getServerAdLabelArr();

    const $error_modal = $('#error_modal');

    AJAX('/ad/get', {}, function (res)
    {
        if (res.status.code !== SUCC)
        {
            showNotification(res.status.msg, FAILURE);
            $error_modal.modal('show');
        }
        else
        {
            sessionStorage.setItem('imagesObj', JSON.stringify(res.data));
            refreshImageTable();
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
            const adLabelArr = imagesObj[imageID].adLabel;
            const $adLabel = $('.adLabel');
            const $file_preview_table_cell = $('.file_preview_table_cell');

            $file_preview_table_wrapper.css('background-image', `url(${imagesObj[imageID].src})`);
            $file_preview_table_wrapper.attr('alt', imageID);//记录修改图片的ID
            $file_preview_table_cell.removeClass('selected');
            $(`#${imagesObj[imageID].position}`).addClass('selected');
            $new_name.val(imagesObj[imageID].name);
            $new_target.val(imagesObj[imageID].target);

            $adLabel.removeClass('selected');
            for (let adLabel of $adLabel)
            {
                if (adLabelArr.indexOf($(adLabel).text()) !== -1)
                {
                    $(adLabel).addClass('selected');
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

        const newName = $new_name.val();
        const newTarget = $new_target.val();
        const $selected_position = $('.file_preview_table_cell.selected');
        const $selected_adLabel = $('.adLabel.selected');
        if (!IMAGE_NAME_REG.test(newName))
        {
            $new_name.css('border-color', 'red');
            showNotification('新图片名不合法', FAILURE);
        }
        else if (!IMAGE_TARGET_REG.test(newTarget))
        {
            $new_target.css('border-color', 'red');
            showNotification('新网址不合法', FAILURE);
        }
        else if ($selected_position.length !== 1)
        {
            showNotification('二维码位置选择非法', FAILURE);
        }
        else if ($selected_adLabel.length === 0)
        {
            showNotification('至少选择一个标签', FAILURE);
        }
        else
        {
            let data = {};
            data.id = $file_preview_table_wrapper.attr('alt');
            data.newName = newName;
            data.newTarget = newTarget;
            data.newPosition = $selected_position.attr('id');
            data.newAdLabel = [];

            for (const adLabel of $selected_adLabel)
            {
                data.newAdLabel.push($(adLabel).text());
            }

            AJAX('/ad/modify', data, function (res)
            {
                if (res.status.code !== SUCC)
                {
                    showNotification(res.status.msg, FAILURE);
                }
                else
                {
                    imagesObj[data.id].name = newName;
                    imagesObj[data.id].target = newTarget;
                    imagesObj[data.id].position = data.newPosition;
                    imagesObj[data.id].adLabel = data.newAdLabel;
                    sessionStorage.setItem('imagesObj', JSON.stringify(imagesObj));
                    refreshImageTable();
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
                    AJAX('/ad/del', data, function (res)
                    {
                        if (res.status.code !== SUCC)
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
                            refreshImageTable();
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
    addTooltipById('new_name', '8字符以内字母、数字及汉字', 'bottom');
    addTooltipById('new_target', 'http:// 或 https:// 开头网址', 'bottom');
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
function refreshImageTable()
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
    refreshImageClickEvent();
}

/*图片点击事件*/
function refreshImageClickEvent()
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
function getLocalAdLabelArr()
{
    let adLabelArr = JSON.parse(sessionStorage.getItem('adLabelArr'));
    if (adLabelArr === null)
    {
        getServerAdLabelArr();
        adLabelArr = JSON.parse(sessionStorage.getItem('adLabelArr'));
    }
    return adLabelArr;
}

/*从服务器获取标签名数组，并放在本地缓存中*/
function getServerAdLabelArr()
{
    const $err_modal = $('#error_modal');
    AJAX('/label/get', {},
        function (res)
        {
            if (res.status.code !== SUCC)
            {
                showNotification(res.status.msg, FAILURE);
                $err_modal.modal('show');
            }
            else
            {
                const adLabelArr = res.data.adLabel;
                sessionStorage.setItem('adLabelArr', JSON.stringify(adLabelArr));
                refreshAdLabelTable();
            }
        },
        function (err)
        {
            console.log(err);
            $err_modal.modal('show');
        });
}

/*刷新标签表格*/
function refreshAdLabelTable()
{
    const $adLabel_table = $('#adLabel_table');
    const adLabelArr = getLocalAdLabelArr();
    $adLabel_table.text('');
    const completeRowNum = Math.floor(adLabelArr.length / 5);
    const restItemNum = adLabelArr.length % 5;
    for (let i = 0; i < completeRowNum; i++)
    {
        $adLabel_table.append(`<div class="adLabel_table_row">
      <span class="label label-default adLabel_table_cell adLabel">${adLabelArr[5 * i]}</span>
      <span class="label label-default adLabel_table_cell adLabel">${adLabelArr[5 * i + 1]}</span>
      <span class="label label-default adLabel_table_cell adLabel">${adLabelArr[5 * i + 2]}</span>
      <span class="label label-default adLabel_table_cell adLabel">${adLabelArr[5 * i + 3]}</span>
      <span class="label label-default adLabel_table_cell adLabel">${adLabelArr[5 * i + 4]}</span>
  </div>`);
    }
    let $lastRow = $(`<div class="adLabel_table_row"></div>`);
    for (let i = 0; i < restItemNum; i++)
    {
        $lastRow.append(`<span class="label label-default adLabel_table_cell adLabel">${adLabelArr[5 * completeRowNum + i]}</span>`);
    }
    for (let i = 0; i < 5 - restItemNum; i++)
    {
        $lastRow.append(`<span class="adLabel_table_cell"></span>`);
    }
    $adLabel_table.append($lastRow);
    refreshAdLabelClickEvent();
}

/*点击标签后选中并变色*/
function refreshAdLabelClickEvent()
{
    const $adLabel = $('.adLabel');
    $adLabel.click(function (e)
    {
        e.preventDefault();
        if ($(this).hasClass('selected'))
            $(this).removeClass('selected');
        else
            $(this).addClass('selected');
    });
}