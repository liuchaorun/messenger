'use strict';/**
 * Created by 31641 on 2017-6-27.
 *//**Get packages' info and fill the table**//**DOM structure
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
 * **//**
 * data
 * [
 *      {id,name,note,screen},
 *      {id,name,note,screen},
 *      {id,name,note,screen},
 *      {id,name,note,screen},
 *
 * ]
 * screen is the string that stitched by screens' names
 * **/$(function(){var $package_management_table=$('#package_management_table');var $error_modal=$('#error_modal');AJAX('get_pack',{},function(response){if(response.status.code===0)$error_modal.modal('show');else{var packs=response.data.resources;for(var i=0;i<packs.length;i++){$package_management_table.append('<tr id='+packs[i].resource_id+' class="packet_row"> \n <td>'+(i+1)+'</td>\n <td>'+packs[i].name+'</td>\n <td>'+(packs[i].note===''?'无':packs[i].note)+'</td>\n <td>\n <button class="plus_screen btn btn-primary btn-sm">+</button>\n <span class="screens">'+(packs[i].screen.length>1?packs[i].screen[0].name+'……':packs[i].screen.length===0?'无':packs[i].screen[0].name)+'</span>\n <button class="minus_screen btn btn-primary btn-sm">-</button>\n </td>\n <td><input type="checkbox" class="checkbox-inline screen_checkbox"></td>\n </tr>');}}activate_button();},function(error){console.log(error);$error_modal.modal('show');});});/**Add button**/$(function(){var $add_btn=$('#add_btn');$add_btn.click(function(){modal_prepend_warning('add_modal_footer','info','glyphicon-refresh','加载中……','tip');image_AJAX('add','add_modal_table','add_modal_btn','add_modal_footer');});});/**Add submit button**/$(function(){var $add_modal_btn=$('#add_modal_btn');$add_modal_btn.click(function(){package_AJAX('add_modal_table','pack_name_input','pack_note_input','add_modal_footer','add_pack');});});/**Modify and modify submit button**/$(function(){var $modify_btn=$('#modify_btn');var $modify_error_modal=$('#modify_error_modal');var _ref=[$('#modify_modal'),$('#modify_modal_table'),$('#modify_modal_btn'),$('#new_pack_name_input'),$('#new_pack_note_input')],$modify_modal=_ref[0],$modify_modal_table=_ref[1],$modify_modal_btn=_ref[2],$new_pack_name_input=_ref[3],$new_pack_note_input=_ref[4];var _ref2=[$('#modify_multiple_modal'),$('#modify_multiple_modal_btn'),$('#multiple_new_pack_note_input')],$modify_multiple_modal=_ref2[0],$modify_multiple_modal_btn=_ref2[1],$multiple_new_pack_note_input=_ref2[2];var data={};$modify_btn.click(function(event){event.preventDefault();var checked_pack=[];var checked_checkboxes=$('.screen_checkbox:checked');if(checked_checkboxes.length===0){$modify_error_modal.modal('show');return false;}else if(checked_checkboxes.length===1){$modify_modal.modal('show');modal_prepend_warning('modify_modal_footer','info','glyphicon-refresh','加载中……','tip');AJAX('get_pack_info',{pack_id:$(checked_checkboxes[0]).parent().parent().attr('id')},function(response){if(response.status.code===0){modal_prepend_warning('modify_modal_footer','danger','glyphicon-remove',response.status.msg,'tip');$modify_modal_btn.attr('disabled','disabled');}else{image_AJAX('modify','modify_modal_table','modify_modal_btn','modify_modal_footer');$modify_modal_btn.removeAttr('disabled');var pack_info=response.data;$new_pack_name_input.val(pack_info.name);$new_pack_note_input.val(pack_info.note);var checked_pictures=pack_info.used_pictures.picture;var checked_picture=void 0;var _iteratorNormalCompletion=true;var _didIteratorError=false;var _iteratorError=undefined;try{for(var _iterator=checked_pictures[Symbol.iterator](),_step;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=true){var picture=_step.value;checked_picture=$modify_modal_table.find('label[class='+picture.id+']');$(checked_picture).children().first().css('backgroundImage','url("../images/admin/selected.png")');$(checked_picture).children().first().children().css('opacity',0.25);$(checked_picture).find('input[type=text]').css('opacity',1).removeAttr('disabled').val(picture.time);$(checked_picture).find('input[type=checkbox]').attr('checked',true);}}catch(err){_didIteratorError=true;_iteratorError=err;}finally{try{if(!_iteratorNormalCompletion&&_iterator.return){_iterator.return();}}finally{if(_didIteratorError){throw _iteratorError;}}}}},function(error){console.log(error);modal_prepend_warning('modify_modal_footer','danger','glyphicon-remove','出现错误，请重试','tip');$modify_modal_btn.attr('disabled','disabled');});}else $modify_multiple_modal.modal('show');var _iteratorNormalCompletion2=true;var _didIteratorError2=false;var _iteratorError2=undefined;try{for(var _iterator2=checked_checkboxes[Symbol.iterator](),_step2;!(_iteratorNormalCompletion2=(_step2=_iterator2.next()).done);_iteratorNormalCompletion2=true){var checkbox=_step2.value;checked_pack.push($(checkbox).parent().parent().attr('id'));}}catch(err){_didIteratorError2=true;_iteratorError2=err;}finally{try{if(!_iteratorNormalCompletion2&&_iterator2.return){_iterator2.return();}}finally{if(_didIteratorError2){throw _iteratorError2;}}}data.pack=checked_pack;$modify_modal_btn.click(function(event){event.preventDefault();var picture_id=[],picture_time=[];var picture_checked_checkboxes=$modify_modal_table.find('input:checked');if(picture_checked_checkboxes.length===0){modal_prepend_warning('modify_modal_footer','danger','glyphicon-remove','至少选择一幅图片','tip');return false;}var _iteratorNormalCompletion3=true;var _didIteratorError3=false;var _iteratorError3=undefined;try{for(var _iterator3=picture_checked_checkboxes[Symbol.iterator](),_step3;!(_iteratorNormalCompletion3=(_step3=_iterator3.next()).done);_iteratorNormalCompletion3=true){var checkbox=_step3.value;picture_id.push($(checkbox).parent().attr('class'));if(!/^[\d]*$/.test($(checkbox).next().val())||$(checkbox).next().val()===0){modal_prepend_warning('modify_modal_footer','danger','glyphicon-remove','时间必须为正整数','tip');border_color_by_id($(checkbox).next().attr('id'));return false;}picture_time.push($(checkbox).next().val()===''?10:$(checkbox).next().val());}}catch(err){_didIteratorError3=true;_iteratorError3=err;}finally{try{if(!_iteratorNormalCompletion3&&_iterator3.return){_iterator3.return();}}finally{if(_didIteratorError3){throw _iteratorError3;}}}if(!PACK_NAME_REG.test($new_pack_name_input.val())){modal_prepend_warning('modify_modal_footer','danger','glyphicon-remove','包名不合法','tip');border_color_by_id('new_pack_name_input');return false;}if(!PACK_NOTE_REG.test($new_pack_note_input.val())){modal_prepend_warning('modify_modal_footer','danger','glyphicon-remove','备注不合法','tip');border_color_by_id('new_pack_note_input');return false;}var _ref3=[picture_id,picture_time,$new_pack_name_input.val(),$new_pack_note_input.val(),false];data.picture_id=_ref3[0];data.picture_time=_ref3[1];data.new_pack_name=_ref3[2];data.new_pack_note=_ref3[3];data.mutiple=_ref3[4];modify_AJAX(false,data);});$modify_multiple_modal_btn.click(function(event){event.preventDefault();if(!/^[A-z0-9\u4e00-\u9fa5]{1,32}$/.test($multiple_new_pack_note_input.val())){modal_prepend_warning('modify_multiple_modal_footer','danger','glyphicon-remove','备注不合法','tip');border_color_by_id('multiple_new_pack_note_input');return false;}var _ref4=[$multiple_new_pack_note_input.val(),true];data.new_pack_note=_ref4[0];data.mutiple=_ref4[1];modify_AJAX(true,data);});});});/**Delete button**/$(function(){var _ref5=[$('#del_btn'),$('#del_modal'),$('#del_modal_btn'),$('#del_error_modal')],$del_btn=_ref5[0],$del_modal=_ref5[1],$del_modal_btn=_ref5[2],$del_error_modal=_ref5[3];$del_btn.click(function(){event.preventDefault();var checked_pack=[];var checked_checkboxes=$('input:checked');if(checked_checkboxes.length===0){$del_error_modal.modal('show');return false;}else{var data={};$del_modal.modal('show');var _iteratorNormalCompletion4=true;var _didIteratorError4=false;var _iteratorError4=undefined;try{for(var _iterator4=checked_checkboxes[Symbol.iterator](),_step4;!(_iteratorNormalCompletion4=(_step4=_iterator4.next()).done);_iteratorNormalCompletion4=true){var checkbox=_step4.value;checked_pack.push(parseInt($(checkbox).parent().parent().attr('id')));}}catch(err){_didIteratorError4=true;_iteratorError4=err;}finally{try{if(!_iteratorNormalCompletion4&&_iterator4.return){_iterator4.return();}}finally{if(_didIteratorError4){throw _iteratorError4;}}}data.pack=checked_pack;$del_modal_btn.click(function(event){event.preventDefault();AJAX('del_pack',data,function(response){if(response.status.code===0)modal_prepend_warning('del_modal_footer','danger','glyphicon-remove',response.status.msg,'tip');else{modal_prepend_warning('del_modal_footer','success','glyphicon-ok',response.status.msg,'tip');setTimeout(function(){location.reload(true);},3000);}},function(error){console.log(error);modal_prepend_warning('del_modal_footer','danger','glyphicon-remove','出现错误，请重试','tip');});});}});});/**Set height**/$(function(){auto_height('package_management_panel_body',90);auto_height('add_modal_table_div',300);auto_height('modify_modal_table_div',300);auto_max_height('screen_modal_body',225);auto_height('plus_modal_body',225);auto_height('minus_modal_body',225);});/**Tips**/$(function(){tip_by_className('pack_name_input','16位以内字母、数字与汉字','top');tip_by_className('pack_note_input','32位以内字母、数字与汉字','top');tip_by_className('multiple_new_pack_note_input','32位以内字母、数字与汉字','top');});/**plus/minus_modal button**/$(function(){var _ref6=[$('#plus_modal_btn'),$('#minus_modal_btn')],$plus_modal_btn=_ref6[0],$minus_modal_btn=_ref6[1];$plus_modal_btn.click(function(event){event.preventDefault();screen_AJAX('plus','add_pack_screen');});$minus_modal_btn.click(function(event){event.preventDefault();screen_AJAX('minus','del_pack_screen');});});function screen_AJAX(type,action){var data={};data.screen=[];data.resource_id=$('#'+type+'_head_row').attr('class');var checked_checkboxes=$('#'+type+'_modal_table').find('input:checked');if(checked_checkboxes.length===0){modal_prepend_warning(type+'_modal_footer','danger','glyphicon-remove','至少选择一个屏幕','tip');return false;}var _iteratorNormalCompletion5=true;var _didIteratorError5=false;var _iteratorError5=undefined;try{for(var _iterator5=checked_checkboxes[Symbol.iterator](),_step5;!(_iteratorNormalCompletion5=(_step5=_iterator5.next()).done);_iteratorNormalCompletion5=true){var checkbox=_step5.value;data.screen.push(parseInt($(checkbox).parent().parent().attr('class')));}}catch(err){_didIteratorError5=true;_iteratorError5=err;}finally{try{if(!_iteratorNormalCompletion5&&_iterator5.return){_iterator5.return();}}finally{if(_didIteratorError5){throw _iteratorError5;}}}AJAX(action,data,function(response){if(response.status.code===0)modal_prepend_warning(type+'_modal_footer','danger','glyphicon-remove',response.status.msg,'tip');else{modal_prepend_warning(type+'_modal_footer','success','glyphicon-ok',response.status.msg,'tip');setTimeout(function(){location.reload(true);},1000);}},function(error){console.log(error);modal_prepend_warning(type+'_modal_footer','danger','glyphicon-remove','出现错误，请重试','tip');});}/**
 *DOM structure
 <div class="add_modal_row">
 <div class="add_modal_cell">
 <label id=`${pictures[i].id}`><img src=`${pictures[i].src}` alt="test" class="image img-responsive"><input type="checkbox"        class="add_checkbox"></label>
 </div>
 </div>
 </div>
 * **//**
 * data：
 * [
 *      {id,url},
 *      {id,url},
 *      {id,url},
 *      {id,url}
 * ]
 *
 * <input type="text" class="form-control" id=${}.id_time>
 * **/function image_AJAX(type,table_id,button_id,footer_id){var PICTURES_PER_ROW=5;if($('#'+table_id).find('.modal_cell').length)activate_checkbox(type);else{AJAX('get_picture',{},function(response){if(response.status.code===0){modal_prepend_warning(''+footer_id,'danger','glyphicon-remove',response.status.msg,'tip');$('#'+button_id).attr('disabled','disabled');}else{$('#'+button_id).removeAttr('disabled');var pictures=response.data.pictures;var row=0;var $row_node=$('<div class="modal_row"></div>');for(;row<Math.floor(pictures.length/PICTURES_PER_ROW);row++){for(var i=0;i<PICTURES_PER_ROW;i++){$row_node.append('<div class="modal_cell"><label class='+pictures[row*PICTURES_PER_ROW+i].id+'><div class="picture_div"><img src='+pictures[row*PICTURES_PER_ROW+i].src+' alt='+pictures[row*PICTURES_PER_ROW+i].id+' class="image img-responsive"></div><input type="checkbox" class="'+type+'_checkbox"><input type="text" class="form-control  picture_time_input" id='+table_id+'_'+pictures[row*PICTURES_PER_ROW+i].id+'_time maxlength="6" disabled placeholder="10"></label></div>');}$('#'+table_id).append($row_node);$row_node=$('<div class="modal_row"></div>');}if(pictures.length-row*PICTURES_PER_ROW>0&&!$('#modify_modal_table_last_row').length){$('#'+table_id).append('<div class="modal_row" id="'+table_id+'_last_row"></div>');for(var _i=0;_i<pictures.length-row*5;_i++){$('#'+table_id+'_last_row').append('<div class="modal_cell"><label class='+pictures[row*5+_i].id+'><div class="picture_div"><img src='+pictures[row*5+_i].src+' alt='+pictures[row*5+_i].id+' class="image img-responsive"></div><input type="checkbox" class="'+type+'_checkbox"><input type="text" class="form-control  picture_time_input" id='+table_id+'_'+pictures[row*5+_i].id+'_time maxlength="6" disabled placeholder="10"></label></div></div>');}}activate_checkbox(type);tip_by_className('picture_time_input','该图片的播放时间(秒)','bottom');}},function(error){console.log(error);modal_prepend_warning(''+footer_id,'danger','glyphicon-remove','出现错误，请重试','tip');$('#'+button_id).attr('disabled','disabled');},false);}}/**
 * data
 * {
 *     picture_id = [],
 *     picture_time = [],
 *     pack_name = '',
 *     pack_note = '',
 * }
 *
 * add's action：add_pack
 * **/function package_AJAX(table_id,name_input_id,note_input_id,footer_id,action){var checkboxes=$('#'+table_id).find(':checked');var data={};var picture_id=[];var picture_time=[];var _ref7=[$('#'+name_input_id).val(),$('#'+note_input_id).val()];data.pack_name=_ref7[0];data.pack_note=_ref7[1];if(!PACK_NAME_REG.test(data.pack_name)){modal_prepend_warning(''+footer_id,'danger','glyphicon-remove','包名不合法','tip');border_color_by_id(name_input_id);return false;}if(!PACK_NOTE_REG.test(data.pack_note)){modal_prepend_warning('modify_modal_footer','danger','glyphicon-remove','备注不合法','tip');border_color_by_id(note_input_id);return false;}if(checkboxes.length===0){modal_prepend_warning(''+footer_id,'danger','glyphicon-remove','至少选择一个图片','tip');return false;}var _iteratorNormalCompletion6=true;var _didIteratorError6=false;var _iteratorError6=undefined;try{for(var _iterator6=checkboxes[Symbol.iterator](),_step6;!(_iteratorNormalCompletion6=(_step6=_iterator6.next()).done);_iteratorNormalCompletion6=true){var checkbox=_step6.value;picture_id.push($(checkbox).parent().attr('class'));picture_time.push($(checkbox).next().val()===''?10:parseInt($(checkbox).next().val()));if(!/^[\d]*$/.test($(checkbox).next().val())||$(checkbox).next().val()===0){modal_prepend_warning(''+footer_id,'danger','glyphicon-remove','时间必须为正整数','tip');border_color_by_id($(checkbox).next().attr('id'));return false;}var _ref8=[picture_id,picture_time];data.picture_id=_ref8[0];data.picture_time=_ref8[1];}}catch(err){_didIteratorError6=true;_iteratorError6=err;}finally{try{if(!_iteratorNormalCompletion6&&_iterator6.return){_iterator6.return();}}finally{if(_didIteratorError6){throw _iteratorError6;}}}AJAX(action,data,function(response){if(response.status.code===0)modal_prepend_warning(''+footer_id,'danger','glyphicon-remove',response.status.msg,'tip');else{modal_prepend_warning(''+footer_id,'success','glyphicon-ok',response.status.msg,'tip');setTimeout(function(){location.reload(true);},1000);}},function(error){console.log(error);modal_prepend_warning(''+footer_id,'danger','glyphicon-remove','出现错误，请重试','tip');});}/**modify ajax**//**
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
 * **/function modify_AJAX(multiple_bool,data){var type=multiple_bool===false?'modify_modal':'modify_multiple_modal';AJAX('modify_pack',data,function(response){if(response.status.code===0)modal_prepend_warning(type+'_footer','danger','glyphicon-remove',response.status.msg,'tip');else{modal_prepend_warning(type+'_footer','success','glyphicon-ok',response.status.msg,'tip');setTimeout(function(){location.reload(true);},1000);}},function(error){console.log(error);modal_prepend_warning(type+'_footer','danger','glyphicon-remove','出现错误，请重试','tip');});}/**Activate checkbox**/function activate_checkbox(type){var $checkbox=$('.'+type+'_checkbox');$checkbox.attr('checked',false);$checkbox.click(function(event){if($(event.target).is(':checked')){$(event.target).prev().css('backgroundImage','url("../images/admin/selected.png")');$(event.target).prev().children().css('opacity',0.25);$(event.target).next().removeAttr('disabled').css('opacity',1);$(event.target).next().val('');}else{$(event.target).prev().removeAttr('style');$(event.target).prev().children().removeAttr('style');$(event.target).next().attr('disabled','disabled').css('opacity',0);}});}/**Show +,- button，tips**/function activate_button(){var $packet_row=$('.packet_row');$packet_row.hover(function(){$(this).find('button').css('opacity',1);},function(){$(this).find('button').removeAttr('style');});$('.screens').click(function(event){event.preventDefault();get_screen_modal(event.target);});$('.plus_screen').click(function(event){event.preventDefault();table_btn_AJAX(event.target,'plus','get_pack_no_screen');});$('.minus_screen').click(function(event){event.preventDefault();table_btn_AJAX(event.target,'minus','get_pack_screen');});tip_by_className('plus_screen','增加屏幕','left');tip_by_className('minus_screen','减少屏幕','right');tip_by_className('screens','点击查看完整屏幕列表','bottom');}/**Screen list modal**//**
 * data
 * [name,name,name……]
 * **/function get_screen_modal(pack_dom_obj){var pack_id=$(pack_dom_obj).parent().parent().attr('id');var _ref9=[$('#screen_modal'),$('#screen_modal_body')],$screen_modal=_ref9[0],$screen_modal_body=_ref9[1];$screen_modal.modal('show');var data={};data.resource_id=pack_id;AJAX('get_pack_screen',data,function(response){if(response.status.code===0)modal_append_warning('screen_modal_body','danger','glyphicon-remove',response.status.msg);else{$screen_modal_body.html('');if(response.data.screen.length===0)modal_append_warning('screen_modal_body','danger','glyphicon-remove','该包没有关联屏幕');var _iteratorNormalCompletion7=true;var _didIteratorError7=false;var _iteratorError7=undefined;try{for(var _iterator7=response.data.screen[Symbol.iterator](),_step7;!(_iteratorNormalCompletion7=(_step7=_iterator7.next()).done);_iteratorNormalCompletion7=true){var screen=_step7.value;$screen_modal_body.append('<div class="screen_list_row">'+screen.name+'</div>');}}catch(err){_didIteratorError7=true;_iteratorError7=err;}finally{try{if(!_iteratorNormalCompletion7&&_iterator7.return){_iterator7.return();}}finally{if(_didIteratorError7){throw _iteratorError7;}}}}},function(error){console.log(error);modal_append_warning('screen_modal_body','danger','glyphicon-remove','出现错误，请重试');});}/**AJAX for + and - buttons in table**/function table_btn_AJAX(btn_html_obj,type,action){$('#'+type+'_modal_table').html('<tbody><tr id='+type+'_head_row>\n                        <th>\u5E8F\u53F7</th>\n                        <th>\u5C4F\u5E55\u540D</th>\n                        <th>\u5907\u6CE8</th>\n                        <th></th>\n                    </tr>\n                   </tbody>');$('#'+type+'_modal').modal('show');var data={};data.resource_id=$(btn_html_obj).parent().parent().attr('id');$('#'+type+'_head_row').attr('class',data.resource_id);AJAX(action,data,function(response){if(response.status.code===0)modal_prepend_warning(type+'_modal_footer','danger','glyphicon-remove',response.status.msg,'tip');else{modal_prepend_warning(type+'_modal_footer','info','glyphicon-refresh','加载中','tip');var screens=response.data.screen;for(var i=0;i<screens.length;i++){$('#'+type+'_modal_table').append('<tr class='+screens[i].screen_id+'>\n                        <td>'+(i+1)+'</td>\n                        <td>'+screens[i].name+'</td>\n                        <td>'+(screens[i].note===null?'无':screens[i].note)+'</td>\n                        <td><input type="checkbox"></td>\n                    </tr>');}}},function(error){console.log(error);modal_append_warning('screen_modal_body','danger','glyphicon-remove','出现错误，请重试');});}