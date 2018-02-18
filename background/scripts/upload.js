/**
 * Created by 31641 on 2017-6-27.
 */
/*获取用户标签并在本地进行存储*/
/*
* <div class="adType_table_row">
      <span class="label label-default adType_table_cell adType">Default</span>
      <span class="label label-default adType_table_cell adType">Default</span>
      <span class="label label-default adType_table_cell adType">Default</span>
      <span class="label label-default adType_table_cell adType">Default</span>
      <span class="label label-default adType_table_cell adType">Default</span>
  </div>
* */
/*返回数组*/
$(function ()
{
    const $err_modal = $('#error_modal');
    AJAX('get_adType', {},
        function (res)
        {
            if (res.status.code === 0)
            {
                showNotification(res.status.msg, FAILURE);
                $err_modal.modal('show');
            }
            else
            {
                const adTypeArr = res.data;
                sessionStorage.setItem('adTypeArr', JSON.stringify(adTypeArr));
                refresh_adType_table();
            }
        },
        function (err)
        {
            console.log(err);
            $err_modal.modal('show');
        });
});


/**上传**/
$(function ()
{
    const $upload_input = $('#upload_input');
    const $upload_btn = $('#upload_btn');
    const $upload_progress_bar = $('#upload_progress_bar');
    $upload_btn.click(function (event)
    {
        event.preventDefault();
        if ($upload_input[0].files.length === 0)
        {
            showNotification('请选择图片', FAILURE);
            return false;
        }
        else
        {
            showNotification('上传中，请稍等', WARNING);
        }
        let formData = new FormData;

        const image_name_and_target = get_image_name_and_target();
        if (image_name_and_target === false)
            return false;

        const adType = get_adType();
        if (adType === false)
            return false;

        const qrcode_position = get_qrcode_position();
        if (qrcode_position === false)
            return false;
        formData.append('name', image_name_and_target);
        formData.append('type', adType);
        formData.append('position', qrcode_position);

        for (let i = 0; i < $upload_input[0].files.length; i++)
        {
            formData.append("file", $upload_input[0].files[i]);
        }
        $.ajax(
            {
                xhrFields: {
                    withCredentials: true
                },
                url: 'http://118.89.197.156:3000/action=upload',
                method: 'post',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response)
                {
                    if (response.status.code === 0)
                        showNotification(response.status.msg, FAILURE);
                    else
                        showNotification(response.status.msg);
                },
                error: function (error)
                {
                    console.log(error);
                    showNotification('出现错误，请重试', FAILURE);
                },
                xhr: function ()
                { //获取ajaxSettings中的xhr对象，为它的upload属性绑定progress事件的处理函数
                    let myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload)
                    { //检查upload属性是否存在
                        myXhr.upload.addEventListener('progress', function (event)//绑定progress事件的回调函数
                        {
                            if (event.lengthComputable)
                            {
                                let percent = event.loaded / event.total * 100;
                                $upload_progress_bar.css('width', percent + '%');
                                if (percent === 100)
                                {
                                    setTimeout(clear_progress_bar, 2000);
                                }
                            }
                        }, false);
                    }
                    return myXhr; //xhr对象返回给jQuery使用
                }
            });
    });
});


/**Set height and activate form changing listener**/
$(function ()
{
    auto_height('file_info_panel_body', 250);
});

/*添加工具提示*/
$(function ()
{
    add_tooltip_by_id('file_name', '16字符以内字母、数字及汉字', 'right');
    add_tooltip_by_id('file_target', 'http:// 或 https:// 开头网址', 'right');
    add_tooltip_by_id('add_adType_input', '8字符以内字母、数字及汉字', 'top');
});

function clear_progress_bar()
{
    const $upload_progress_bar = $('#upload_progress_bar');
    $upload_progress_bar.css('width', 0 + '%');
}

/*选择文件后显示文件个数以及大小*/
$(function ()
{
    const $upload_input = $('#upload_input');
    const $upload_info = $('#upload_info');
    $upload_input.change(function ()
    {
        let files = $upload_input[0].files;
        let file_size = 0;
        for (let i = 0; i < files.length; i++)
            file_size += files[i].size;
        $upload_info.text(`共${files.length}个图片，${(file_size / 1024 / 1024).toFixed(2)}MB`);
    });
});

/*点击标签后选中并变色*/
$(function ()
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

/*二维码图片预览*/
$(function ()
{
    const $upload_input = $('#upload_input');
    const $file_preview_table_wrapper = $('#file_preview_table_wrapper');
    $upload_input.change(function ()
    {
        const fileReader = new FileReader();
        fileReader.readAsDataURL($upload_input[0].files[0]);
        fileReader.onload = function (event)
        {
            console.log(event.target.result);
            $file_preview_table_wrapper.css('background-image', `url(${event.target.result})`);
        }
    });
});


/*添加标签*/
$(function ()
{
    const $add_adType_input = $('#add_adType_input');
    const $add_adType_modal_btn = $('#add_adType_modal_btn');

    $add_adType_modal_btn.click(function (e)
    {
        e.preventDefault();
        const new_adType = $add_adType_input.val();
        if (!ADTYPE_REG.test(new_adType))
        {
            showNotification('新标签名不合法', FAILURE);
            $add_adType_input.css('border-color', 'red');
        }
        else
        {
            AJAX('add_adType', new_adType,
                function (res)
                {
                    if (res.status.code === 0)
                    {
                        showNotification(res.status.msg, FAILURE);
                    }
                    else
                    {
                        let adTypeArr = JSON.parse(sessionStorage.getItem('adTypeArr'));
                        adTypeArr = [new_adType].concat(adTypeArr);
                        sessionStorage.setItem('adTypeArr', JSON.stringify(adTypeArr));
                        refresh_adType_table();
                        $add_adType_input.val('');
                        showNotification(res.status.msg);
                    }
                },
                function (err)
                {
                    console.log(err);
                    showNotification('添加失败，请重试', FAILURE);
                });
        }
    });
});

/*删除标签*/
$(function ()
{
    const $delete_adType_modal_btn = $('#delete_adType_modal_btn');
    $delete_adType_modal_btn.click(function (e)
    {
        e.preventDefault();
        const $selected = $('.manage_adType_modal_table.selected');
        if ($selected.length === 0)
        {
            showNotification('请选择要删除的标签', FAILURE);
        }
        else
        {
            let selectedAdTypeArr = [];
            for (const $adType of $selected)
            {
                selectedAdTypeArr.push($adType.text());
            }
            AJAX('delete_adType', selectedAdTypeArr, function (res)
            {
                if (res.status.code === 0)
                {
                    showNotification(res.status.msg, FAILURE);
                }
                else
                {
                    let index;
                    let adTypeArr = JSON.parse(sessionStorage.getItem('adTypeArr'));
                    for (const adType of selectedAdTypeArr)
                    {
                        index = adTypeArr.indexOf(adType);
                        if (index !== -1)
                            adTypeArr.slice(index, 1);
                    }
                    sessionStorage.setItem('adTypeArr', JSON.stringify(adTypeArr));
                    refresh_adType_table();
                    showNotification(res.status.msg);
                }
            }, function (err)
            {
                showNotification('删除失败，请重试', FAILURE);
                console.log(err);
            });
        }
    });
});

/*刷新标签表格*/
function refresh_adType_table()
{
    const $adType_table = $('#adType_table');
    const $manage_adType_modal_table = $('#manage_adType_modal_table');
    const adTypeArr = JSON.parse(sessionStorage.getItem('adTypeArr'));
    $adType_table.text('');
    $manage_adType_modal_table.text('');
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
        $manage_adType_modal_table.append(`<div class="adType_table_row">
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
    $adType_table.append($lastRow);
    $manage_adType_modal_table.append($lastRow);
}

/*上传之前各部分信息获取的函数*/
function get_image_name_and_target()
{
    const $file_name = $('#file_name');
    const $file_target = $('#file_target');
    const fileName = $file_name.val();
    const fileTarget = $file_target.val();
    if (!IMAGE_NAME_REG.test(fileName))
    {
        showNotification('图片名不合法', FAILURE);
        $file_name.css('border-color', 'red');
        return false;
    }
    else if (!IMAGE_TARGET_REG.test(fileTarget))
    {
        showNotification('网址不合法', FAILURE);
        $file_target.css('border-color', 'red');
        return false;
    }
    else
        return {fileName: fileName, fileTarget: fileTarget};
}

function get_adType()
{
    const $selected = $('.adType_table_cell.selected');
    if ($selected.length === 0)
    {
        showNotification('请选择标签', FAILURE);
        return false;
    }
    else
    {
        let selectedAdTypeArr = [];
        for (const $adType of $selected)
        {
            selectedAdTypeArr.push($adType.text());
        }
        return selectedAdTypeArr;
    }
}

function get_qrcode_position()
{
    const $selected = $('.file_preview_table_cell.selected');
    if ($selected.length === 0)
    {
        showNotification('二维码位置选择异常', FAILURE);
        return false;
    }
    else
        return parseInt($selected.attr('id'));
}