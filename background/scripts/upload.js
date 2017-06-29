/**
 * Created by 31641 on 2017-6-27.
 */
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
            append_warning('upload_panel_body', 'danger', 'glyphicon-remove', "请选择文件");
            return false;
        }
        let formData = new FormData;
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
                        append_warning('upload_panel_body', 'danger', 'glyphicon-remove', response.status.msg);
                    else
                        append_warning('upload_panel_body', 'success', 'glyphicon-ok', response.status.msg);
                },
                error: function (error)
                {
                    console.log(error);
                    append_warning('upload_panel_body', 'danger', 'glyphicon-remove', "出现错误，请重试");
                },
                xhr: function ()
                { //获取ajaxSettings中的xhr对象，为它的upload属性绑定progress事件的处理函数
                    let myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload)
                    { //检查upload属性是否存在
//绑定progress事件的回调函数
                        myXhr.upload.addEventListener('progress', function (e)
                        {
                            if (e.lengthComputable)
                            {
                                let percent = e.loaded / e.total * 100;
                                $upload_progress_bar.css('width', percent + '%');
                            }
                        }, false);
                    }
                    return myXhr; //xhr对象返回给jQuery使用
                }
            })
    })
});

/**填充文件信息表格**/
/**
 *
 <tr>
 <th>序号</th>
 <th>文件名</th>
 <th>文件类型</th>
 <th>文件大小</th>
 </tr>
 * **/
$(function ()
{
    const $upload_input = $('#upload_input');
    const $file_table = $('#file_table');
    $upload_input.change(function ()
    {
        $file_table.html(`
                <tbody><tr>
                    <th>序号</th>
                    <th>文件名</th>
                    <th>文件类型</th>
                    <th>文件大小</th>
                </tr>
            </tbody>`);
        let files = $upload_input[0].files;
        for (let i = 0; i < files.length; i++)
        {
            $file_table.append(`<tr>
    <td>${i + 1}</td>
    <td>${files[i].name}</td>
    <td>${files[i].type}</td>
    <td>${(files[i].size / 1024 / 1024).toFixed(2)}MB</td>
 </tr>`)
        }
    });
});

/**文件表格高度自动设定**/
$(function ()
{
    resizeToScreenHeight('file_info_modal_body', 345);
});