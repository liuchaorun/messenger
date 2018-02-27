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
    get_server_adTypeArr();
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
        formData.append('name', image_name_and_target.fileName);
        formData.append('target',image_name_and_target.fileTarget);
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
                //url: 'http://127.0.0.1:3000/action=upload',
                method: 'post',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response)
                {
                    if (response.status.code === FAIL)
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
    add_tooltip_by_id('file_name', '8字符以内字母、数字及汉字', 'right');
    add_tooltip_by_id('file_target', 'http:// 或 https:// 开头网址', 'right');
    add_tooltip_by_id('add_adType_input', '8字符以内字母、数字及汉字', 'top');
});

/*选择文件后显示文件个数以及大小*/
$(function ()
{
    const $upload_input = $('#upload_input');
    const $upload_info = $('#upload_info');
    const $upload_progress_bar = $('#upload_progress_bar');
    $upload_input.change(function ()
    {
        $upload_progress_bar.css('width','0');
        let files = $upload_input[0].files;
        let file_size = 0;
        for (let i = 0; i < files.length; i++)
            file_size += files[i].size;
        $upload_info.text(`共${files.length}个图片，${(file_size / 1024 / 1024).toFixed(2)}MB`);
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
            AJAX('add_adType', {new_adType: new_adType},
                function (res)
                {
                    if (res.status.code === FAIL)
                    {
                        showNotification(res.status.msg, FAILURE);
                    }
                    else
                    {
                        let adTypeArr = get_local_adTypeArr();
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
        const $selected = $('.manage_adType_modal_table_cell.selected');
        if ($selected.length === 0)
        {
            showNotification('请选择要删除的标签', FAILURE);
        }
        else
        {
            let selectedAdTypeArr = [];
            for (const adType of $selected)
            {
                selectedAdTypeArr.push($(adType).text());
            }
            AJAX('delete_adType', selectedAdTypeArr, function (res)
            {
                if (res.status.code === FAIL)
                {
                    showNotification(res.status.msg, FAILURE);
                }
                else
                {
                    let index;
                    let adTypeArr = get_local_adTypeArr();
                    for (const adType of selectedAdTypeArr)
                    {
                        index = adTypeArr.indexOf(adType);
                        if (index !== -1)
                        {
                            adTypeArr.splice(index, 1);
                        }
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

/*从本地缓存解析出对象并返回，如果本地缓存不存在则重新获取*/
function get_local_adTypeArr()
{
    let adTypeArr = JSON.parse(sessionStorage.getItem('adTypeArr'));
    if(adTypeArr === null)
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
    const $manage_adType_modal_table = $('#manage_adType_modal_table');
    const adTypeArr = get_local_adTypeArr();
    if (adTypeArr.length === 0)
    {
        $adType_table.html(`Oops，你没有任何标签。<br>准确的标签选择可增加图片投放准确度。<br>点击下方按钮来创建标签吧！`);
        $manage_adType_modal_table.html(`Oops，你没有任何标签。<br>准确的标签选择可增加图片投放准确度。<br>点击下方按钮来创建标签吧！`);
    }
    else
    {
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
      <span class="label label-default manage_adType_modal_table_cell adType">${adTypeArr[5 * i]}</span>
      <span class="label label-default manage_adType_modal_table_cell adType">${adTypeArr[5 * i + 1]}</span>
      <span class="label label-default manage_adType_modal_table_cell adType">${adTypeArr[5 * i + 2]}</span>
      <span class="label label-default manage_adType_modal_table_cell adType">${adTypeArr[5 * i + 3]}</span>
      <span class="label label-default manage_adType_modal_table_cell adType">${adTypeArr[5 * i + 4]}</span>
  </div>`);
        }
        let $lastRow = $(`<div class="adType_table_row"></div>`);
        let $lastRowCopy = $(`<div class="adType_table_row"></div>`);
        for (let i = 0; i < restItemNum; i++)
        {
            $lastRow.append(`<span class="label label-default adType_table_cell adType">${adTypeArr[5 * completeRowNum + i]}</span>`);
            $lastRowCopy.append(`<span class="label label-default manage_adType_modal_table_cell  adType">${adTypeArr[5 * completeRowNum + i]}</span>`);
        }
        for (let i = 0; i < 5 - restItemNum; i++)
        {
            $lastRow.append(`<span class="adType_table_cell"></span>`);
            $lastRowCopy.append(`<span class="adType_table_cell"></span>`);
        }
        $adType_table.append($lastRow);
        $manage_adType_modal_table.append($lastRowCopy);
    }
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
        for (const adType of $selected)
        {
            selectedAdTypeArr.push($(adType).text());
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