/**
 * Created by 31641 on 2017-6-27.
 */
/*获取用户标签并在本地进行存储*/
/*
* <div class="adLabel_table_row">
      <span class="label label-default adLabel_table_cell adLabel">Default</span>
      <span class="label label-default adLabel_table_cell adLabel">Default</span>
      <span class="label label-default adLabel_table_cell adLabel">Default</span>
      <span class="label label-default adLabel_table_cell adLabel">Default</span>
      <span class="label label-default adLabel_table_cell adLabel">Default</span>
  </div>
* */
/*返回数组*/
$(function ()
{
    sessionStorage.clear();
    getServerAdLabelArr();
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

        const imageNameAndTarget = getImageNameAndTarget();
        if (imageNameAndTarget === false)
            return false;

        const adLabel = getAdLabel();
        if (adLabel === false)
            return false;

        const qrCodePosition = getQrCodePosition();
        if (qrCodePosition === false)
            return false;
        formData.append('name', imageNameAndTarget.fileName);
        formData.append('target', imageNameAndTarget.fileTarget);
        formData.append('type', adLabel.toString());
        formData.append('position', qrCodePosition.toString());
        formData.append('adLabel', 0..toString());

        for (let i = 0; i < $upload_input[0].files.length; i++)
        {
            formData.append("file", $upload_input[0].files[i]);
        }
        $.ajax(
            {
                xhrFields: {
                    withCredentials: true
                },
                url: 'http://118.89.197.156:3000/ad/upload',
                //url: 'http://127.0.0.1:3000/action=upload',
                method: 'post',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response)
                {
                    if (response.status.code !== SUCC)
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
    setHeight('file_info_panel_body', 250);
});

/*添加工具提示*/
$(function ()
{
    addTooltipById('file_name', '8字符以内字母、数字及汉字', 'right');
    addTooltipById('file_target', 'http:// 或 https:// 开头网址', 'right');
    addTooltipById('add_adLabel_input', '8字符以内字母、数字及汉字', 'top');
});

/*选择文件后显示文件个数以及大小*/
$(function ()
{
    const $upload_input = $('#upload_input');
    const $upload_info = $('#upload_info');
    const $upload_progress_bar = $('#upload_progress_bar');
    $upload_input.change(function ()
    {
        $upload_progress_bar.css('width', '0');
        let files = $upload_input[0].files;
        let fileSize = 0;
        for (let i = 0; i < files.length; i++)
            fileSize += files[i].size;
        $upload_info.text(`共${files.length}个图片，${(fileSize / 1024 / 1024).toFixed(2)}MB`);
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
    const $add_adLabel_input = $('#add_adLabel_input');
    const $add_adLabel_modal_btn = $('#add_adLabel_modal_btn');

    $add_adLabel_modal_btn.click(function (e)
    {
        e.preventDefault();
        const newAdLabel = $add_adLabel_input.val();
        if (!ADTYPE_REG.test(newAdLabel))
        {
            showNotification('新标签名不合法', FAILURE);
            $add_adLabel_input.css('border-color', 'red');
        }
        else
        {
            AJAX('/label/add', {newAdLabel: newAdLabel},
                function (res)
                {
                    if (res.status.code !== SUCC)
                    {
                        showNotification(res.status.msg, FAILURE);
                    }
                    else
                    {
                        let adLabelArr = getLocalAdLabelArr();
                        adLabelArr = [newAdLabel].concat(adLabelArr);
                        sessionStorage.setItem('adLabelArr', JSON.stringify(adLabelArr));
                        refreshAdLabelTable();
                        $add_adLabel_input.val('');
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
    const $delete_adLabel_modal_btn = $('#delete_adLabel_modal_btn');
    $delete_adLabel_modal_btn.click(function (e)
    {
        e.preventDefault();
        const $selected = $('.manage_adLabel_modal_table_cell.selected');
        if ($selected.length === 0)
        {
            showNotification('请选择要删除的标签', FAILURE);
        }
        else
        {
            let selectedAdLabelArr = [];
            for (const adLabel of $selected)
            {
                selectedAdLabelArr.push($(adLabel).text());
            }
            AJAX('/label/del', selectedAdLabelArr, function (res)
            {
                if (res.status.code !== SUCC)
                {
                    showNotification(res.status.msg, FAILURE);
                }
                else
                {
                    let index;
                    let adLabelArr = getLocalAdLabelArr();
                    for (const adLabel of selectedAdLabelArr)
                    {
                        index = adLabelArr.indexOf(adLabel);
                        if (index !== -1)
                        {
                            adLabelArr.splice(index, 1);
                        }
                    }
                    sessionStorage.setItem('adLabelArr', JSON.stringify(adLabelArr));
                    refreshAdLabelTable();
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
    const $manage_adLabel_modal_table = $('#manage_adLabel_modal_table');
    const adLabelArr = getLocalAdLabelArr();
    if (adLabelArr.length === 0)
    {
        $adLabel_table.html(`Oops，你没有任何标签。<br>准确的标签选择可增加图片投放准确度。<br>点击下方按钮来创建标签吧！`);
        $manage_adLabel_modal_table.html(`Oops，你没有任何标签。<br>准确的标签选择可增加图片投放准确度。<br>点击下方按钮来创建标签吧！`);
    }
    else
    {
        $adLabel_table.text('');
        $manage_adLabel_modal_table.text('');
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
            $manage_adLabel_modal_table.append(`<div class="adLabel_table_row">
      <span class="label label-default manage_adLabel_modal_table_cell adLabel">${adLabelArr[5 * i]}</span>
      <span class="label label-default manage_adLabel_modal_table_cell adLabel">${adLabelArr[5 * i + 1]}</span>
      <span class="label label-default manage_adLabel_modal_table_cell adLabel">${adLabelArr[5 * i + 2]}</span>
      <span class="label label-default manage_adLabel_modal_table_cell adLabel">${adLabelArr[5 * i + 3]}</span>
      <span class="label label-default manage_adLabel_modal_table_cell adLabel">${adLabelArr[5 * i + 4]}</span>
  </div>`);
        }
        let $lastRow = $(`<div class="adLabel_table_row"></div>`);
        let $lastRowCopy = $(`<div class="adLabel_table_row"></div>`);
        for (let i = 0; i < restItemNum; i++)
        {
            $lastRow.append(`<span class="label label-default adLabel_table_cell adLabel">${adLabelArr[5 * completeRowNum + i]}</span>`);
            $lastRowCopy.append(`<span class="label label-default manage_adLabel_modal_table_cell  adLabel">${adLabelArr[5 * completeRowNum + i]}</span>`);
        }
        for (let i = 0; i < 5 - restItemNum; i++)
        {
            $lastRow.append(`<span class="adLabel_table_cell"></span>`);
            $lastRowCopy.append(`<span class="adLabel_table_cell"></span>`);
        }
        $adLabel_table.append($lastRow);
        $manage_adLabel_modal_table.append($lastRowCopy);
    }
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

/*上传之前各部分信息获取的函数*/
function getImageNameAndTarget()
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

function getAdLabel()
{
    const $selected = $('.adLabel_table_cell.selected');
    if ($selected.length === 0)
    {
        showNotification('请选择标签', FAILURE);
        return false;
    }
    else
    {
        let selectedAdTypeArr = [];
        for (const adLabel of $selected)
        {
            selectedAdTypeArr.push($(adLabel).text());
        }
        return selectedAdTypeArr;
    }
}

function getQrCodePosition()
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