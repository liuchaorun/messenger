'use strict';/**
 * Created by 31641 on 2017-6-25.
 *//**Public constants**/var USERNAME_REG=/^[A-z0-9\u4e00-\u9fa5]{1,16}$/,EMAIL_REG=/^[A-z0-9]+@([A-z0-9]+\.[a-z]+)+$/,PASSWORD_REG=/^[A-z0-9_]{1,32}$/,PACK_NAME_REG=/^[A-z0-9\u4e00-\u9fa5]{1,16}$/,PACK_NOTE_REG=/^[A-z0-9\u4e00-\u9fa5]{0,32}$/,SCREEN_NAME_REG=/^[A-z0-9\u4e00-\u9fa5]{1,16}$/,SCREEN_NOTE_REG=/^[A-z0-9\u4e00-\u9fa5]{1,32}$/;function AJAX(action,data_object,success_function,error_function){var async=arguments.length>4&&arguments[4]!==undefined?arguments[4]:true;$.ajax({xhrFields:{withCredentials:true},contentType:'application/json',timeout:2000,async:async,dataType:'json',url:'http://118.89.197.156:3000/action='+action,//url: `http://127.0.0.1:3000/action=${action}`,
method:'post',data:JSON.stringify(data_object),success:success_function,error:error_function});}var last_one=void 0;//Remember the id of the last tip
function modal_append_warning(modal_body_id,alert_type,icon_class,warn_text){var className=arguments.length>4&&arguments[4]!==undefined?arguments[4]:'';/**Delete last tip**/if(last_one!==undefined&&$('#'+last_one).length){$('#'+last_one).remove();}var id=new Date().getTime();last_one=id;$('#'+modal_body_id).append('<div class="alert alert-'+alert_type+' alert-dismissible fade in '+className+'" role="alert" id='+id+'>\n <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">\xD7</span></button><span class="glyphicon '+icon_class+'"></span><span> '+warn_text+'</span></div>');setTimeout(function(){$('#'+id).alert('close');},2000);}function modal_prepend_warning(modal_footer_id,alert_type,icon_class,warn_text){var className=arguments.length>4&&arguments[4]!==undefined?arguments[4]:'';/**Delete last tip**/if(last_one!==undefined&&$('#'+last_one).length){$('#'+last_one).remove();}var id=new Date().getTime();last_one=id;$('#'+modal_footer_id).prepend('<div class="alert alert-'+alert_type+' alert-dismissible fade in '+className+'" role="alert" id='+id+'>\n <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">\xD7</span></button><span class="glyphicon '+icon_class+'"></span><span> '+warn_text+'</span></div>');setTimeout(function(){$('#'+id).alert('close');},2000);}/**Parse time string**/function parse_time_string(raw_time_string){var date=new Date(raw_time_string);return date.getTime()===0?'这是第一次登陆':date.getFullYear()+'\u5E74'+(date.getMonth()+1)+'\u6708'+date.getDate()+'\u65E5'+date.getHours()+'\u65F6'+date.getMinutes()+'\u5206';}/**Clear inputs**/$(function(){var $input=$('input');var $modal=$('.modal');$input.focus(function(event){$(event.target).removeAttr('style');});$modal.on('hidden.bs.modal',function(event){$(event.target).find("input").val('').removeAttr('style');});});/**Automatically set height**/function auto_height(id,offset){$('#'+id).css('height',$(window).height()-offset);$(window).resize(function(){$('#'+id).css('height',$(window).height()-offset);});}function auto_max_height(id,offset){$('#'+id).css('maxHeight',$(window).height()-offset);$(window).resize(function(){$('#'+id).css('maxHeight',$(window).height()-offset);});}/**Add tip**/function tip_by_id(id,content){var position=arguments.length>2&&arguments[2]!==undefined?arguments[2]:'left';$('#'+id).tooltip({container:'body',placement:''+position,trigger:'focus hover',title:''+content});}function tip_by_className(className,content){var position=arguments.length>2&&arguments[2]!==undefined?arguments[2]:'left';$('.'+className).tooltip({container:'body',placement:''+position,trigger:'focus hover',title:''+content});}/**change border-color**/function border_color_by_id(id){var color=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'red';$('#'+id).css('borderColor',color);}$(function(){var $body=$('body');$body.hide().fadeIn(500);});