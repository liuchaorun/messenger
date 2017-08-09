/**
 * Created by 31641 on 2017-6-27.
 */
let $upload_input;

/**Upload**/
$(function ()
{
	const $upload_btn = $('#upload_btn');
	const $upload_progress_bar = $('#upload_progress_bar');
	$upload_btn.click(function (event)
	{
		event.preventDefault();
		if ($upload_input[0].files.length === 0)
		{
			modal_append_warning('upload_panel_body', 'danger', 'glyphicon-remove', "请选择文件");
			return false;
		}
		else
		{
			modal_append_warning('upload_panel_body', 'success', 'glyphicon-ok', "上传中，请稍等");
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
						modal_append_warning('upload_panel_body', 'danger', 'glyphicon-remove', response.status.msg);
					else
						modal_append_warning('upload_panel_body', 'success', 'glyphicon-ok', response.status.msg);
				},
				error: function (error)
				{
					console.log(error);
					modal_append_warning('upload_panel_body', 'danger', 'glyphicon-remove', "出现错误，请重试");
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
									initialize_upload();
									setTimeout(clear_progress_bar, 2000);
								}
							}
						}, false);
					}
					return myXhr; //xhr对象返回给jQuery使用
				}
			})
	})
});

/**File info table structure**/
/**
 *
 <tr>
 <th>序号</th>
 <th>文件名</th>
 <th>文件类型</th>
 <th>文件大小</th>
 </tr>
 * **/


/**Set height and activate form changing listener**/
$(function ()
{
	auto_height('file_info_modal_body', 320);
	update_table();
});

/**Clear button**/
$(function ()
{
	const $clear_file_btn = $('#clear_file_btn');
	$clear_file_btn.click(function (event)
	{
		event.preventDefault();
		initialize_upload();
		clear_progress_bar();
	});
});

/**Initialize upload form**/
function initialize_upload()
{
	$upload_input.after($upload_input.clone().val(""));
	$upload_input.remove();
	$upload_input = $('#upload_input');
	/**Delete original upload control**/
	reset_file_table();
	update_table();
}

function clear_progress_bar()
{
	const $upload_progress_bar = $('#upload_progress_bar');
	$upload_progress_bar.css('width', 0 + '%');
}

/**Clear table**/
function reset_file_table()
{
	const $file_table = $('#file_table');
	$file_table.html(`
                <tbody><tr>
                    <th>序号</th>
                    <th>文件名</th>
                    <th>文件类型</th>
                    <th>文件大小</th>
                </tr>
            </tbody>`);
	const $file_total_info = $('#file_total_info');
	$file_total_info.text(`(共0个文件，0.00MB)`);
}

/**Set upload table**/
function update_table()
{
	$upload_input = $('#upload_input');
	const $file_table = $('#file_table');
	const $file_total_info = $('#file_total_info');
	let file_size;
	$upload_input.change(function ()
	{
		reset_file_table();
		let files = $upload_input[0].files;
		file_size = 0;
		for (let i = 0; i < files.length; i++)
		{
			file_size += files[i].size;
			$file_table.append(`<tr>
    <td>${i + 1}</td>
    <td>${files[i].name}</td>
    <td>${files[i].type}</td>
    <td>${(files[i].size / 1024 / 1024).toFixed(2)}MB</td>
 </tr>`)
		}
		$file_total_info.text(`(共${files.length}个文件，${(file_size / 1024 / 1024).toFixed(2)}MB)`);
	})
}