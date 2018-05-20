/**
 * Created by 31641 on 2017-6-27.
 */
/**得到资源包信息并填充表格**/

/**DOM structure
 * <tr id=${pack.id}>
 <td>${i+1}</td>
 <td>${pack.name}</td>
 <td>${pack.note}</td>
 <td>
 <button class="plus_screen btn btn-primary btn-sm">+</button>
 <span class="screens">${pack.screen}</span>
 <button class="minus_screen btn btn-primary btn-sm">-</button>
 </td>
 <td><input type="checkbox" class="checkbox-inline screen_checkbox"></td>
 </tr>
 * **/
$(function ()
{
    const $package_management_table = $('#package_management_table');
    const $error_modal = $('#error_modal');
    AJAX('/resource/get', {},
        function (response)
        {
            if (response.status.code !== SUCC)
                $error_modal.modal('show');
            else
            {
                let packs = response.data.resources;
                for (let i = 0; i < packs.length; i++)
                {
                    $package_management_table.append(`<tr id=${packs[i].resource_id} class="packet_row"> 
 <td>${i + 1}</td>
 <td>${packs[i].name}</td>
 <td>${packs[i].note === '' ? '无' : packs[i].note}</td>
 <td>
 <button class="plus_screen btn btn-primary btn-sm">+</button>
 <span class="screens">${packs[i].screen.length > 1 ? packs[i].screen[0].name + '……' : packs[i].screen.length === 0 ? '无' : packs[i].screen[0].name}</span>
 <button class="minus_screen btn btn-primary btn-sm">-</button>
 </td>
 <td><input type="checkbox" class="checkbox-inline screen_checkbox"></td>
 </tr>`)
                }
            }
            activateButton();
        },
        function (error)
        {
            console.log(error);
            $error_modal.modal('show');
        });
});

/**增加按钮设定**/
$(function ()
{
    const $add_btn = $('#add_btn');
    $add_btn.click(function ()
    {
        imageAJAX('add', 'add_modal_table', 'add_modal_btn');
    });

});

/**增加提交按钮**/
$(function ()
{
    const $add_modal_btn = $('#add_modal_btn');
    $add_modal_btn.click(function ()
    {
        packageAJAX('add_modal_table', 'pack_name_input', 'pack_note_input', 'add_modal_footer', 'addPack');
    });
});

/**修改以及修改提交按钮**/
/*
* response.data:{
  "usedAds":[{
    "adName":"string",
		"adMd5":"string",
		"adTime":"int",
		"adUrl":"string",
		"adId":"int",
		"adTarget":"string",
		"adQrcodePosition":"int"
    }],
  "name":"string",
  "note":"string"
}
*/
$(function ()
{
    const $modify_btn = $('#modify_btn');
    const $modify_error_modal = $('#modify_error_modal');
    const $modify_modal = $('#modify_modal');
    const $modify_modal_table = $('#modify_modal_table');
    const $modify_modal_btn = $('#modify_modal_btn');
    const $new_pack_name_input = $('#new_pack_name_input');
    const $new_pack_note_input = $('#new_pack_note_input');

    const $modify_multiple_modal = $('#modify_multiple_modal');
    const $modify_multiple_modal_btn = $('#modify_multiple_modal_btn');
    const $multiple_new_pack_note_input = $('#multiple_new_pack_note_input');

    let data = {};
    $modify_btn.click(function (event)
    {
        event.preventDefault();
        let checkedPack = [];
        let checkedCheckboxes = $('.screen_checkbox:checked');
        if (checkedCheckboxes.length === 0)
        {
            $modify_error_modal.modal('show');
            return false;
        }
        else if (checkedCheckboxes.length === 1)
        {
            $modify_modal.modal('show');
            AJAX('/resource/getPackInfo', {resourceId: $(checkedCheckboxes[0]).parent().parent().attr('id')},
                function (response)
                {
                    if (response.status.code !== SUCC)
                    {
                        showNotification(response.status.msg, FAILURE);
                        $modify_modal_btn.attr('disabled', 'disabled');
                    }
                    else
                    {
                        imageAJAX('modify', 'modify_modal_table', 'modify_modal_btn');
                        $modify_modal_btn.removeAttr('disabled');
                        let packInfo = response.data;
                        $new_pack_name_input.val(packInfo.name);
                        $new_pack_note_input.val(packInfo.note);
                        let checkedAds = packInfo.usedAds;
                        let checkedAd;
                        for (const ad of checkedAds)
                        {
                            checkedAd = $modify_modal_table.find(`label[class=${ad.adId}]`);
                            $(checkedAd).children().first().css('backgroundImage', 'url("../images/admin/selected.png")');
                            $(checkedAd).children().first().children().css('opacity', 0.25);
                            $(checkedAd).find('input[type=text]')
                                .css('opacity', 1)
                                .removeAttr('disabled')
                                .val(ad.adTime);
                            $(checkedAd).find('input[type=checkbox]').attr('checked', true);
                        }
                    }
                },
                function (error)
                {
                    console.log(error);
                    showNotification('出现错误，请重试', FAILURE);
                    $modify_modal_btn.attr('disabled', 'disabled');
                })
        }
        else
            $modify_multiple_modal.modal('show');
        for (let checkbox of checkedCheckboxes)
            checkedPack.push($(checkbox).parent().parent().attr('id'));
        data.pack = checkedPack;

        $modify_modal_btn.click(function (event)
        {
            event.preventDefault();
            let adId = [], adTime = [];
            let adCheckedCheckboxes = $modify_modal_table.find('input:checked');
            if (adCheckedCheckboxes.length === 0)
            {
                showNotification('至少选择一幅图片', FAILURE);
                return false;
            }
            for (const checkbox of adCheckedCheckboxes)
            {
                adId.push($(checkbox).parent().attr('class'));
                if (!/^[\d]*$/.test($(checkbox).next().val()) || $(checkbox).next().val() === 0)
                {
                    showNotification('时间必须为正整数', FAILURE);
                    setBorderColorById($(checkbox).next().attr('id'));
                    return false;
                }
                adTime.push($(checkbox).next().val() === '' ? 10 : $(checkbox).next().val());
            }
            if (!PACK_NAME_REG.test($new_pack_name_input.val()))
            {
                showNotification('包名不合法', FAILURE);
                setBorderColorById('new_pack_name_input');
                return false;
            }
            if (!PACK_NOTE_REG.test($new_pack_note_input.val()))
            {
                showNotification('备注不合法', FAILURE);
                setBorderColorById('new_pack_note_input');
                return false;
            }
            [data.adid, data.adTime, data.newPackName, data.newPackNote, data.mutiple] =
                [adId, adTime, $new_pack_name_input.val(), $new_pack_note_input.val(), false];
            modifyAJAX(data);
        });

        $modify_multiple_modal_btn.click(function (event)
        {
            event.preventDefault();
            if (!/^[A-z0-9\u4e00-\u9fa5]{1,32}$/.test($multiple_new_pack_note_input.val()))
            {
                showNotification('备注不合法', FAILURE);
                setBorderColorById('multiple_new_pack_note_input');
                return false;
            }
            [data.newPackNote, data.mutiple] = [$multiple_new_pack_note_input.val(), true];
            modifyAJAX(data);
        });
    });
});

/**删除按钮**/
$(function ()
{
    const $del_btn = $('#del_btn');
    const $del_modal = $('#del_modal');
    const $del_modal_btn = $('#del_modal_btn');
    const $del_error_modal = $('#del_error_modal');

    $del_btn.click(function ()
    {
        event.preventDefault();
        let checkedPack = [];
        let checkedCheckboxes = $('input:checked');
        if (checkedCheckboxes.length === 0)
        {
            $del_error_modal.modal('show');
            return false;
        }
        else
        {
            let data = {};
            $del_modal.modal('show');
            for (const checkbox of checkedCheckboxes)
                checkedPack.push(parseInt($(checkbox).parent().parent().attr('id')));
            data.pack = checkedPack;
            $del_modal_btn.click(function (event)
            {
                event.preventDefault();
                AJAX('/resource/del', data,
                    function (response)
                    {
                        if (response.status.code !== SUCC)
                            showNotification(response.status.msg, FAILURE);
                        else
                        {
                            showNotification(response.status.msg);
                            setTimeout(function ()
                            {
                                location.reload(true);
                            }, 2000);
                        }
                    },
                    function (error)
                    {
                        console.log(error);
                        showNotification('出现错误，请重试', FAILURE);
                    })
            });
        }
    })
});

/**自动设置高度**/
$(function ()
{
    setHeight('package_management_panel_body', 90);
    setHeight('add_modal_table_div', 300);
    setHeight('modify_modal_table_div', 300);
    setMaxHeight('screen_modal_body', 225);
    setHeight('plus_modal_body', 225);
    setHeight('minus_modal_body', 225);

});

/**Tips**/
$(function ()
{
    addTooltipByClassName('pack_name_input', '16位以内字母、数字与汉字', 'top');
    addTooltipByClassName('pack_note_input', '32位以内字母、数字与汉字', 'top');
    addTooltipByClassName('multiple_new_pack_note_input', '32位以内字母、数字与汉字', 'top');
});

/**加减屏幕按钮**/
$(function ()
{
    const [$plus_modal_btn, $minus_modal_btn] = [$('#plus_modal_btn'), $('#minus_modal_btn')];
    $plus_modal_btn.click(function (event)
    {
        event.preventDefault();
        screenAJAX('plus', '/resource/addPackScreen');
    });
    $minus_modal_btn.click(function (event)
    {
        event.preventDefault();
        screenAJAX('minus', '/resource/delPackScreen');
    })
});

function screenAJAX(type, suffix)
{
    let data = {};
    data.screen = [];
    data.resourceId = $(`#${type}_head_row`).attr('class');
    let checkedCheckboxes = $(`#${type}_modal_table`).find('input:checked');
    if (checkedCheckboxes.length === 0)
    {
        showNotification('至少选择一个屏幕', FAILURE);
        return false;
    }
    for (let checkbox of checkedCheckboxes)
        data.screen.push(parseInt($(checkbox).parent().parent().attr('class')));
    AJAX(suffix, data,
        function (response)
        {
            if (response.status.code !== SUCC)
                showNotification('response.status.msg', FAILURE);
            else
            {
                showNotification(response.status.msg);
                setTimeout(function ()
                {
                    location.reload(true);
                }, 1000);
            }
        },
        function (error)
        {

            console.log(error);
            showNotification('出现错误，请重试', FAILURE);
        })
}

/**
 *DOM structure
 <div class="add_modal_row">
 <div class="add_modal_cell">
 <label id=`${pictures[i].id}`><img src=`${pictures[i].src}` alt="test" class="image img-responsive"><input type="checkbox"        class="add_checkbox"></label>
 </div>
 </div>
 </div>
 * **/
/**
 response.data:{
  "ads":{
    "adId":{
    "name":"string",
    "src":"string",
    "target":"string",
    "position":"int",
    "pack":["string"],
    "adLabel":["string"]
    }
  }
}
 * <input type="text" class="form-control" id=${}.id_time>
 * **/
function imageAJAX(type, table_id, button_id)
{
    const PICTURES_PER_ROW = 5;
    if ($(`#${table_id}`).find('.modal_cell').length === 0)
    {
        AJAX('/ad/get', {},
            function (response)
            {
                if (response.status.code !== SUCC)
                {
                    showNotification(response.status.msg, FAILURE);
                    $(`#${button_id}`).attr('disabled', 'disabled');
                }
                else
                {
                    $(`#${button_id}`).removeAttr('disabled');
                    let ads = response.data.ads;
                    let row = 0;
                    let $row_node = $(`<div class="modal_row"></div>`);
                    const adIds = ads.keys();
                    for (; row < Math.floor(adIds.length / PICTURES_PER_ROW); row++)
                    {
                        for (let i = 0; i < PICTURES_PER_ROW; i++)
                        {
                            let currentAdId = adIds[row * PICTURES_PER_ROW + i];
                            $row_node.append(`
<div class="modal_cell">
    <label class=${currentAdId}>
        <div class="picture_div">
            <img src=${ads[currentAdId].src} alt=${currentAdId} class="image img-responsive">
        </div>
        <input type="checkbox" class="${type}_checkbox">
        <input type="text" class="form-control  picture_time_input" id=${table_id}_${currentAdId}_time maxlength="6" disabled placeholder="10">
    </label>
</div>`)
                        }
                        $(`#${table_id}`).append($row_node);
                        $row_node = $(`<div class="modal_row"></div>`);
                    }
                    if (adIds.length - row * PICTURES_PER_ROW > 0 && !$('#modify_modal_table_last_row').length)
                    {
                        $(`#${table_id}`).append(`<div class="modal_row" id="${table_id}_last_row"></div>`);
                        for (let i = 0; i < ads.length - row * 5; i++)
                        {
                            let currentAdId = adIds[row * PICTURES_PER_ROW + i];
                            $(`#${table_id}_last_row`).append(`
<div class="modal_cell">
    <label class=${currentAdId}>
        <div class="picture_div">
            <img src=${ads[currentAdId].src} alt=${currentAdId} class="image img-responsive">
        </div>
        <input type="checkbox" class="${type}_checkbox">
        <input type="text" class="form-control  picture_time_input" id=${table_id}_${currentAdId}_time maxlength="6" disabled placeholder="10">
    </label>
</div>`)
                        }
                    }
                    activateCheckbox(type);
                    addTooltipByClassName('picture_time_input', '该图片的播放时间(秒)', 'bottom');
                }
            },
            function (error)
            {
                console.log(error);
                showNotification('出现错误，请重试', FAILURE);
                $(`#${button_id}`).attr('disabled', 'disabled');
            }, false)
    }
    else
    {
        const $checkbox = $(`.${type}_checkbox`);
        $checkbox.attr('checked', false);
        $checkbox.prev().removeAttr('style');
        $checkbox.prev().children().removeAttr('style');
        $checkbox.next().attr('disabled', 'disabled').css('opacity', 0);
        activateCheckbox(type);
    }
}

/**
 * data
 * {
 *     picture_id = [],
 *     picture_time = [],
 *     pack_name = '',
 *     pack_note = '',
 * }
 *
 * add's action：add_pack
 * **/
function packageAJAX(table_id, name_input_id, note_input_id, footer_id, suffix)
{
    let checkboxes = $(`#${table_id}`).find(':checked');
    let data = {};
    let adId = [];
    let adTime = [];
    data.packName = $(`#${name_input_id}`).val();
    data.packNote = $(`#${note_input_id}`).val();
    if (!PACK_NAME_REG.test(data.packName))
    {
        showNotification('包名不合法', FAILURE);
        setBorderColorById(name_input_id);
        return false;
    }
    if (!PACK_NOTE_REG.test(data.packNote))
    {
        showNotification('备注不合法', FAILURE);
        setBorderColorById(note_input_id);
        return false;
    }
    if (checkboxes.length === 0)
    {
        showNotification('至少选择一个图片', FAILURE);
        return false;
    }
    for (let checkbox of checkboxes)
    {
        adId.push($(checkbox).parent().attr('class'));
        adTime.push($(checkbox).next().val() === '' ? 10 : parseInt($(checkbox).next().val()));
        if (!/^[\d]*$/.test($(checkbox).next().val()) || $(checkbox).next().val() === 0)
        {
            showNotification('时间必须为正整数', FAILURE);
            setBorderColorById($(checkbox).next().attr('id'));
            return false;
        }
        [data.adId, data.adTime] = [adId, adTime];
    }

    AJAX(suffix, data,
        function (response)
        {
            if (response.status.code !== SUCC)
                showNotification(response.status.msg, FAILURE);
            else
            {
                showNotification(response.status.msg);
                setTimeout(function ()
                {
                    location.reload(true);
                }, 1000);
            }
        },
        function (error)
        {
            console.log(error);
            showNotification('出现错误，请重试', FAILURE);
        })
}

/**modify ajax**/
/**
 * data
 * single
 * {
 *      pack:[],
  *     picture_id = [],
  *     picture_time = [],
  *     new_pack_name = '',
  *     new_pack_note = '',
  *     multiple:false
 * }
 *
 * multiple
 * {
 *      pack:[],
  *     new_pack_note = '',
  *     multiple:true
 * }
 * **/
function modifyAJAX(data)
{
    AJAX('/resource/modifyPack', data,
        function (response)
        {
            if (response.status.code !== SUCC)
                showNotification(response.status.msg, FAILURE);
            else
            {
                showNotification(response.status.msg);
                setTimeout(function ()
                {
                    location.reload(true);
                }, 1000);
            }
        },
        function (error)
        {
            console.log(error);
            showNotification('出现错误，请重试', FAILURE);
        });
}

/**图片选中后显示对号**/
function activateCheckbox(type)
{
    const $checkbox = $(`.${type}_checkbox`);

    $checkbox.prop('checked', false);
    $checkbox.unbind();

    $checkbox.click(function (event)
    {
        if ($(this).is(':checked'))
        {
            $(this).prev().css('backgroundImage', 'url("../images/admin/selected.png")');
            $(this).prev().children().css('opacity', 0.25);
            $(this).next().removeAttr('disabled').css('opacity', 1);
            $(this).next().val('');
        }
        else
        {
            $(this).prev().removeAttr('style');
            $(this).prev().children().removeAttr('style');
            $(this).next().attr('disabled', 'disabled').css('opacity', 0);
        }
    });
}

/**显示+-按钮以及tip**/
function activateButton()
{
    const $packet_row = $('.packet_row');
    $packet_row.hover(
        function ()
        {
            $(this).find('button').css('opacity', 1);
        },
        function ()
        {
            $(this).find('button').removeAttr('style');
        });
    $('.screens').click(function (event)
    {
        event.preventDefault();
        getScreenModal(event.target);
    });

    $('.plus_screen').click(function (event)
    {
        event.preventDefault();
        tableBtnAJAX(event.target, 'plus', '/resource/get_pack_no_screen');
    });
    $('.minus_screen').click(function (event)
    {
        event.preventDefault();
        tableBtnAJAX(event.target, 'minus', '/resource/get_pack_screen');
    });
    addTooltipByClassName('plus_screen', '增加屏幕', 'left');
    addTooltipByClassName('minus_screen', '减少屏幕', 'right');
    addTooltipByClassName('screens', '点击查看完整屏幕列表', 'bottom');
}

/**图片列表modal**/
/**
 * data
 * [name,name,name……]
 * **/
function getScreenModal(pack_dom_obj)
{
    let packId = $(pack_dom_obj).parent().parent().attr('id');
    const [$screen_modal, $screen_modal_body] = [$('#screen_modal'), $('#screen_modal_body')];
    let data = {};
    data.resource_id = packId;
    AJAX('getPackScreen', data,
        function (response)
        {
            if (response.status.code !== SUCC)
                showNotification(response.status.msg, FAILURE);
            else
            {
                $screen_modal_body.html('');
                if (response.data.screen.length === 0)
                    showNotification('该包没有关联屏幕', WARNING);
                else
                {
                    for (let screen of response.data.screen)
                        $screen_modal_body.append(`<div class="label label-info screen_name_label">${screen.name}</div>`);
                    $screen_modal.modal('show');
                }
            }
        },
        function (error)
        {
            console.log(error);
            showNotification('出现错误，请重试', FAILURE);
        });
}

/**AJAX for + and - buttons in table**/
function tableBtnAJAX(btn_html_obj, type, suffix)
{
    $(`#${type}_modal_table`).html(`<tbody><tr id=${type}_head_row>
                        <th>序号</th>
                        <th>屏幕名</th>
                        <th>备注</th>
                        <th></th>
                    </tr>
                   </tbody>`);
    $(`#${type}_modal`).modal('show');
    let data = {};
    data.resource_id = $(btn_html_obj).parent().parent().attr('id');
    $(`#${type}_head_row`).attr('class', data.resource_id);
    AJAX(suffix, data,
        function (response)
        {
            if (response.status.code !== SUCC)
                showNotification(response.status.msg, FAILURE);
            else
            {
                let screens = response.data.screen;
                for (let i = 0; i < screens.length; i++)
                {
                    $(`#${type}_modal_table`).append(`<tr class=${screens[i].screen_id}>
                        <td>${i + 1}</td>
                        <td>${screens[i].name}</td>
                        <td>${screens[i].note === null ? '无' : screens[i].note}</td>
                        <td><input type="checkbox"></td>
                    </tr>`)
                }
            }
        },
        function (error)
        {
            console.log(error);
            showNotification('出现错误，请重试', FAILURE);
        })

}
