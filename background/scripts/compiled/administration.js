'use strict';/**
 * Created by 31641 on 2017-6-25.
 *//**Set height**/$(function(){auto_height('sidebar',0);auto_height('frame_div',0);auto_height('frame',0);});/**Exit button**/$(function(){var $exit_btn=$('#exit_btn');$exit_btn.click(function(event){event.preventDefault();location.href='index.html';});});/**Sidebar tab change**/$(function(){var $frame=$('#frame');var _ref=[$('#user_info'),$('#screen_info'),$('#resource_management'),$('#upload'),$('#del_picture'),$('#package_management'),$('#modify_info')],$user_info=_ref[0],$screen_info=_ref[1],$resource_management=_ref[2],$upload=_ref[3],$del_picture=_ref[4],$package_management=_ref[5],$modify_info=_ref[6];var _ref2=[$('#resource_management_icon_front'),$('#resource_management_icon'),$('#collapse')],$resource_management_icon_front=_ref2[0],$resource_management_icon=_ref2[1],$collapse=_ref2[2];$user_info.click(function(event){event.preventDefault();$('.active').removeClass('active');$user_info.addClass('active');$frame.attr('src','frames/user_info.html');});$screen_info.click(function(event){event.preventDefault();$('.active').removeClass('active');$screen_info.addClass('active');$frame.attr('src','frames/screen_info.html');});$resource_management.click(function(event){event.preventDefault();if(!$collapse.hasClass('collapsing'))if($collapse.hasClass('in')){$resource_management_icon.removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');$resource_management_icon_front.removeClass('glyphicon-folder-open').addClass('glyphicon-folder-close');}else{$resource_management_icon.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');$resource_management_icon_front.removeClass('glyphicon-folder-close').addClass('glyphicon-folder-open');}});$upload.click(function(event){event.preventDefault();$('.active').removeClass('active');$resource_management.addClass('active');$upload.addClass('active');$frame.attr('src','frames/upload.html');});$del_picture.click(function(event){event.preventDefault();$('.active').removeClass('active');$del_picture.addClass('active');$frame.attr('src','frames/del_picture.html');});$package_management.click(function(event){event.preventDefault();$('.active').removeClass('active');$resource_management.addClass('active');$package_management.addClass('active');$frame.attr('src','frames/package_management.html');});$modify_info.click(function(event){event.preventDefault();$('.active').removeClass('active');$modify_info.addClass('active');$frame.attr('src','frames/modify_info.html');});});