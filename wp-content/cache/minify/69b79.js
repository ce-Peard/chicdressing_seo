window.socialWarfare=window.socialWarfare||{};(function(window,$){"use strict";if(typeof $!="function"){if(typeof jQuery=="function"){var $=jQuery}else{console.log("Social Warfare requires jQuery, or $ as an alias of jQuery. Please make sure your theme provides access to jQuery before activating Social Warfare.");return}}function isString(maybeString){return typeof maybeString=="string"&&maybeString.length>0}socialWarfare.paddingTop=parseInt($("body").css("padding-top"));socialWarfare.paddingBottom=parseInt($("body").css("padding-bottom"));socialWarfare.initPlugin=function(){$("body").css({paddingTop:socialWarfare.paddingTop,paddingBottom:socialWarfare.paddingBottom});socialWarfare.establishPanels();socialWarfare.establishBreakpoint();if(!socialWarfare.panels.staticHorizontal&&!socialWarfare.panels.floatingSide&&!socialWarfare.panels.floatingHorizontal){return}socialWarfare.emphasizeButtons();socialWarfare.createFloatHorizontalPanel();socialWarfare.positionFloatSidePanel();socialWarfare.activateHoverStates();socialWarfare.handleButtonClicks();socialWarfare.updateFloatingButtons();socialWarfare.closeLightboxOverlay();socialWarfare.preloadPinterestImages();if(typeof swpPinIt=="object"&&swpPinIt.enabled==true){socialWarfare.createHoverSaveButton();socialWarfare.triggerImageListeners()}setTimeout(function(){socialWarfare.checkListeners(0,5)},2e3);var time=Date.now();var scrollDelay=50;$(window).on("scroll",function(){if(time+scrollDelay-Date.now()<0){socialWarfare.updateFloatingButtons();time=Date.now()}})};var resizeWait;socialWarfare.onWindowResize=function(){clearTimeout(resizeWait);resizeWait=setTimeout(socialWarfare.initPlugin,100)};socialWarfare.establishPanels=function(){socialWarfare.panels={staticHorizontal:null,floatingSide:null,floatingHorizontal:null};socialWarfare.panels.staticHorizontal=$(".swp_social_panel").not(".swp_social_panelSide");socialWarfare.panels.floatingSide=$(".swp_social_panelSide");return socialWarfare.panels};socialWarfare.emphasizeButtons=function(){if(typeof socialWarfare.variables.emphasizeIcons=="undefined"){return}if(socialWarfare.isMobile()){return}jQuery(".swp_social_panel:not(.swp_social_panelSide)").each(function(i,panel){jQuery(panel).find(".nc_tweetContainer:not(.total_shares)").each(function(index,button){if(index<socialWarfare.variables.emphasizeIcons){var shareWidth=jQuery(button).find(".swp_share").width();var iconWidth=jQuery(button).find("i.sw").outerWidth();var iconTextWidth=shareWidth+iconWidth+35;var containerWidth=jQuery(button).width();var change=1+(shareWidth+35)/containerWidth;if(change<2){jQuery(button).addClass("swp_nohover").css({flex:"2 1 0%"}).find(".iconFiller").width(iconTextWidth)}else{jQuery(button).addClass("swp_nohover").css({flex:change+" 1 0%"}).find(".iconFiller").width(iconTextWidth)}}})})};socialWarfare.activateHoverStates=function(){socialWarfare.trigger("pre_activate_buttons");$(".swp_social_panel:not(.swp_social_panelSide) .nc_tweetContainer").on("mouseenter",function(){if($(this).hasClass("swp_nohover")){return}socialWarfare.resetStaticPanel();var termWidth=$(this).find(".swp_share").outerWidth();var iconWidth=$(this).find("i.sw").outerWidth();var containerWidth=$(this).width();var change=1+(termWidth+35)/containerWidth;$(this).find(".iconFiller").width(termWidth+iconWidth+25+"px");$(this).css("flex",change+" 1 0%")});$(".swp_social_panel:not(.swp_social_panelSide)").on("mouseleave",socialWarfare.resetStaticPanel)};socialWarfare.resetStaticPanel=function(){$(".swp_social_panel:not(.swp_social_panelSide) .nc_tweetContainer:not(.swp_nohover) .iconFiller").removeAttr("style");$(".swp_social_panel:not(.swp_social_panelSide) .nc_tweetContainer:not(.swp_nohover)").removeAttr("style")};socialWarfare.handleButtonClicks=function(){$(".nc_tweet, a.swp_CTT").off("click");$(".nc_tweet, a.swp_CTT").on("click",function(event){if($(this).parent(".swp_print").length>0){event.preventDefault();window.print();return}if(true===$(this).hasClass("pinterest_multi_image_select")){event.preventDefault();socialWarfare.openMultiPinterestOverlay($(this));return}if($(this).parent(".swp_more").length>0){event.preventDefault();socialWarfare.openMoreOptions($(this));return}if($(this).hasClass("noPop")){return event}if("undefined"==typeof $(this).data("link")&&false===$(this).is(".swp-hover-pin-button")){return event}event.preventDefault();var href=$(this).data("link").replace("’","'");var height,width,top,left,instance,windowAttributes,network;height=270;width=500;if($(this).is(".swp_pinterest a, .buffer_link a, .flipboard a, .swp-hover-pin-button")){height=550;width=775}if($(this).hasClass("nc_tweet")){network=$(this).parents(".nc_tweetContainer").data("network")}else if($(this).hasClass("swp_CTT")){network="ctt"}top=window.screenY+(window.innerHeight-height)/2;left=window.screenX+(window.innerWidth-width)/2;windowAttributes="height="+height+",width="+width+",top="+top+",left="+left;instance=window.open(href,network,windowAttributes);socialWarfare.trackClick(network)})};socialWarfare.openMultiPinterestOverlay=function(element){if($(".pinterest-overlay").length>0){$(".pinterest-overlay").fadeIn();$(".swp-lightbox-inner").scrollTop(0);return}var html="";var pin_data=element.data("pins");var pin_images="";pin_data.images.forEach(function(image){var share_url="https://pinterest.com/pin/create/button/?url="+pin_data.url+"&media="+image+"&description="+encodeURIComponent(pin_data.description);var pin_html="";pin_html+='<div class="pin_image_select_wrapper">';pin_html+='<img class="pin_image" src="'+image+'" />';pin_html+='<a class="swp-hover-pin-button" href="'+share_url+'" data-link="'+share_url+'">Save</a>';pin_html+="</div>";pin_images+=pin_html});html+='<div class="swp-lightbox-wrapper pinterest-overlay"><div class="swp-lightbox-inner">';html+='<i class="sw swp_pinterest_icon top_icon"></i>';html+='<div class="swp-lightbox-close"></div>';html+="<h5>Which image would you like to pin?</h5>";html+='<div class="pin_images_wrapper">';html+=pin_images;html+="</div>";html+=socialWarfare.buildPoweredByLink();html+="</div></div>";$("body").append(html);$(".pinterest-overlay").hide().fadeIn();socialWarfare.handleButtonClicks();var max_height=999999;var iteration=0,images=$(".pinterest-overlay .pin_images_wrapper img");images.load(function(){if(++iteration===images.length){images.each(function(){if($(this).height()<max_height){max_height=$(this).height()}}).promise().done(function(){images.height(max_height+"px");var number_of_rows=Math.ceil(images.length/4);for(i=0;i<number_of_rows;i++){var current_row_images=images.slice(i*4,i*4+4);var max_allowable_width=current_row_images.length/4;var total_width=$(".pin_images_wrapper").width();var total_images_width=0;current_row_images.each(function(){total_images_width=total_images_width+$(this).width()});var ratio=total_width/total_images_width;current_row_images.each(function(){var new_width=$(this).width()*ratio/total_width*100*max_allowable_width-1;$(this).parent().width(new_width+"%");$(this).height("auto")});var height=current_row_images.first().height();current_row_images.each(function(){$(this).width($(this).width()).height(height)})}})}})};socialWarfare.buildPoweredByLink=function(){var html="";if(true===socialWarfare.variables.powered_by_toggle){var anchor_tag_open="";var anchor_tag_close="";if(false!==socialWarfare.variables.affiliate_link){anchor_tag_open='<a href="'+socialWarfare.variables.affiliate_link+'" target="_blank">';anchor_tag_close="</a>"}html='<div class="swp_powered_by">'+anchor_tag_open+'<span>Powered by</span> <img src="/wp-content/plugins/social-warfare/assets/images/admin-options-page/social-warfare-pro-light.png">'+anchor_tag_close+"</div>"}return html};socialWarfare.preloadPinterestImages=function(){if($(".pinterest_multi_image_select").length<1){return}var pin_data=$(".pinterest_multi_image_select").data("pins");pin_data.images.forEach(function(image_url){var image_object=new Image;image_object.src=image_url})};socialWarfare.openMoreOptions=function(element){if($(".swp-more-wrapper").length>0){$(".swp-more-wrapper").fadeIn();return}var post_id=element.parents(".swp_social_panel").data("post-id");var data={action:"swp_buttons_panel",post_id:post_id,_ajax_nonce:swp_nonce};jQuery.post(swp_ajax_url,data,function(response){$("body").append(response);$(".swp-lightbox-wrapper").hide().fadeIn();socialWarfare.activateHoverStates();socialWarfare.handleButtonClicks()})};socialWarfare.closeLightboxOverlay=function(){$("body").on("click",".swp-lightbox-close",function(){$(".swp-lightbox-wrapper").fadeOut()});$(document).on("keyup",function(e){if(e.key==="Escape"){$(".swp-lightbox-wrapper").fadeOut()}})};socialWarfare.createFloatHorizontalPanel=function(){if(!socialWarfare.panels.staticHorizontal.length){return}var floatLocation=socialWarfare.panels.staticHorizontal.data("float");var mobileFloatLocation=socialWarfare.panels.staticHorizontal.data("float-mobile");var backgroundColor=socialWarfare.panels.staticHorizontal.data("float-color");var wrapper=$('<div class="nc_wrapper swp_floating_horizontal_wrapper" style="background-color:'+backgroundColor+'"></div>');var barLocation="";if($(".nc_wrapper").length){$(".nc_wrapper").remove()}if($(".swp_floating_horizontal_wrapper").length){$(".swp_floating_horizontal_wrapper").remove()}if(floatLocation!="top"&&floatLocation!="bottom"&&mobileFloatLocation!="top"&&mobileFloatLocation!="bottom"){return}if(socialWarfare.isMobile()){barLocation=mobileFloatLocation}else{barLocation=floatLocation}wrapper.addClass(barLocation).hide().appendTo("body");socialWarfare.panels.floatingHorizontal=socialWarfare.panels.staticHorizontal.first().clone();socialWarfare.panels.floatingHorizontal.addClass("nc_floater").appendTo(wrapper);socialWarfare.updateFloatingHorizontalDimensions();$(".swp_social_panel .swp_count").css({transition:"padding .1s linear"})};socialWarfare.updateFloatingHorizontalDimensions=function(){if(!socialWarfare.panels.staticHorizontal.length){return}if(!socialWarfare.panels.floatingHorizontal){return}var width="100%";var left=0;var panel=socialWarfare.panels.staticHorizontal;var parent=panel.parent();if(parent.hasClass("swp-hidden-panel-wrap")){parent=parent.parent()}if("undefined"!==typeof panel.offset().left){left=panel.offset().left}if("undefined"!==typeof panel.width()){width=panel.width()}if(left==0){left=parent.offset().left}if(width==100||width==0){width=parent.width()}socialWarfare.panels.floatingHorizontal.css({width:width,left:left})};socialWarfare.staticPanelIsVisible=function(){var visible=false;var scrollPos=$(window).scrollTop();$(".swp_social_panel").not(".swp_social_panelSide, .nc_floater").each(function(index){var offset=$(this).offset();if(typeof socialWarfare.floatBeforeContent!="undefined"&&"1"!=socialWarfare.floatBeforeContent){var theContent=$(".swp-content-locator").parent();if(index===0&&theContent.length&&theContent.offset().top>scrollPos+$(window).height()){visible=true}}if($(this).is(":visible")&&offset.top+$(this).height()>scrollPos&&offset.top<scrollPos+$(window).height()){visible=true}});return visible};socialWarfare.updateFloatingButtons=function(){if(socialWarfare.panels.staticHorizontal.length){var panel=socialWarfare.panels.staticHorizontal}else if(socialWarfare.panels.floatingSide.length){var panel=socialWarfare.panels.floatingSide}else{return}var location=panel.data("float");if(true==socialWarfare.isMobile()){var location=panel.data("float-mobile")}if(location=="none"){return $(".nc_wrapper, .swp_floating_horizontal_wrapper, .swp_social_panelSide").hide()}if(socialWarfare.isMobile()){socialWarfare.toggleMobileButtons();socialWarfare.toggleFloatingHorizontalPanel();return}if(location=="right"||location=="left"){socialWarfare.toggleFloatingVerticalPanel()}if(location=="bottom"||location=="top"){socialWarfare.toggleFloatingHorizontalPanel()}};socialWarfare.toggleMobileButtons=function(){socialWarfare.panels.floatingSide.hide();var visibility=socialWarfare.staticPanelIsVisible()?"collapse":"visible";$(".nc_wrapper, .swp_floating_horizontal_wrapper").css("visibility",visibility)};socialWarfare.toggleFloatingVerticalPanel=function(){var direction="";var location=socialWarfare.panels.floatingSide.data("float");var visible=socialWarfare.staticPanelIsVisible();var offset="";if(socialWarfare.isMobile()){return socialWarfare.panels.floatingSide.hide()}if(!socialWarfare.panels.floatingSide||!socialWarfare.panels.floatingSide.length){visible=true}if(socialWarfare.panels.floatingSide.data("transition")=="slide"){direction=location;offset=visible?"-150px":"5px";socialWarfare.panels.floatingSide.css(direction,offset).show()}else{if(visible){socialWarfare.panels.floatingSide.css("opacity",1).fadeOut(300).css("opacity",0)}else{socialWarfare.panels.floatingSide.css("opacity",0).fadeIn(300).css("display","flex").css("opacity",1)}}};socialWarfare.hasReferencePanel=function(){return typeof socialWarfare.panels.staticHorizontal!="undefined"&&socialWarfare.panels.staticHorizontal.length>0};socialWarfare.toggleFloatingHorizontalPanel=function(){if(!socialWarfare.hasReferencePanel()){return}if(!socialWarfare.panels.floatingHorizontal){return}var panel=socialWarfare.panels.floatingHorizontal.first();var location=socialWarfare.isMobile()?$(panel).data("float-mobile"):$(panel).data("float");var newPadding=location=="bottom"?socialWarfare.paddingBottom:socialWarfare.paddingTop;var paddingProp="padding-"+location;if(location=="off"){return}if(socialWarfare.staticPanelIsVisible()){$(".nc_wrapper, .swp_floating_horizontal_wrapper").hide();if(socialWarfare.isMobile()&&$("#wpadminbar").length){$("#wpadminbar").css("top",0)}}else{newPadding+=50;$(".nc_wrapper, .swp_floating_horizontal_wrapper").show();if(socialWarfare.isMobile()&&location=="top"&&$("#wpadminbar").length){$("#wpadminbar").css("top",panel.parent().height())}}$("body").css(paddingProp,newPadding)};socialWarfare.positionFloatSidePanel=function(){var panelHeight,windowHeight,offset;var sidePanel=socialWarfare.panels.floatingSide;if(!sidePanel||!sidePanel.length){return}if(sidePanel.hasClass("swp_side_top")||sidePanel.hasClass("swp_side_bottom")){return}panelHeight=sidePanel.outerHeight();windowHeight=window.innerHeight;if(panelHeight>windowHeight){return sidePanel.css("top",0)}offset=(windowHeight-panelHeight)/2;sidePanel.css("top",offset)};socialWarfare.createHoverSaveButton=function(){if($(".tve_editor_page").length){$(".sw-pinit-button").remove();$(".sw-pinit").each(function(){var inner_content=$(".sw-pinit").contents();$(this).replaceWith(inner_content)});return}var button=$(document.createElement("a"));button.css("display: none");button.addClass("swp-hover-pin-button");button.text("Save");socialWarfare.hoverSaveButton=$(button);return button};socialWarfare.triggerImageListeners=function(){$(".swp-content-locator").parent().find("img").off("mouseenter",socialWarfare.renderPinterestSaveButton);$(".swp-content-locator").parent().find("img").on("mouseenter",socialWarfare.renderPinterestSaveButton);setTimeout(socialWarfare.triggerImageListeners,2e3)};socialWarfare.getPinMedia=function(image){if(isString(swpPinIt.image_source)){return swpPinIt.image_source}if(isString(image.attr("src"))){return image.attr("src")}var dataSources=["src","lazy-src","media"];var media="";dataSources.some(function(maybeSource){if(isString(image.data(maybeSource))){media=image.data(maybeSource);return true}});if(media==""){return}var i=$("<img>");i.attr("src",media);return i.prop("src")};socialWarfare.getPinDescription=function(image){if(isString(image.data("pin-description"))){return image.data("pin-description")}if(isString(swpPinIt.image_description)){return swpPinIt.image_description}if(isString(image.attr("title"))){return image.attr("title")}if(isString(image.attr("alt"))){return image.attr("alt")}if(isString(swpPinIt.post_title)){return swpPinIt.post_title}};socialWarfare.enablePinterestSaveButtons=function(){jQuery("img").on("mouseenter",function(){var pinterestBrowserButtons=socialWarfare.findPinterestBrowserSaveButtons();if(typeof pinterestBrowserButtons!="undefined"&&pinterestBrowserButtons){socialWarfare.removePinterestBrowserSaveButtons(pinterestBrowserButtons)}})};socialWarfare.toggleHoverSaveDisplay=function(image){var top=image.offset().top;var left=image.offset().left;var vMargin=15;var hMargin=15;var button_size=swpPinIt.button_size||1;var buttonHeight=24;var buttonWidth=120;switch(swpPinIt.vLocation){case"top":top+=vMargin;break;case"middle":var offset=image.height()/2-vMargin/2-buttonHeight/2;top+=offset;break;case"bottom":top+=image.height()-vMargin-buttonHeight;break}switch(swpPinIt.hLocation){case"left":left+=hMargin;break;case"center":var offset=image.width()/2-hMargin/2-buttonWidth/2;left+=offset;break;case"right":left+=image.width()-hMargin-buttonWidth;break}socialWarfare.hoverSaveButton.css({top:top,left:left,transform:"scale("+button_size+")","transform-origin":swpPinIt.vLocation+" "+swpPinIt.hLocation});image.on("mouseleave",function(event){if(event.relatedTarget!=null&&event.relatedTarget.className=="swp-hover-pin-button"){return}$(".swp-hover-pin-button").remove()});$(document.body).append(socialWarfare.hoverSaveButton)};socialWarfare.renderPinterestSaveButton=function(event){if(event.relatedTarget&&event.relatedTarget.className=="swp-hover-pin-button"){return}if($(".swp-hover-pin-button").length>0){return}var image=$(event.target);if(typeof swpPinIt.disableOnAnchors!=undefined&&swpPinIt.disableOnAnchors){if(image.parents().filter("a").length){return}}if(image.outerHeight()<swpPinIt.minHeight||image.outerWidth()<swpPinIt.minWidth){return}if(image.hasClass("no_pin")||image.hasClass("no-pin")){return}socialWarfare.toggleHoverSaveDisplay(image);var description=socialWarfare.getPinDescription(image);var media=socialWarfare.getPinMedia(image);var shareLink="http://pinterest.com/pin/create/bookmarklet/?media="+encodeURI(media)+"&url="+encodeURI(document.URL)+"&is_video=false"+"&description="+encodeURIComponent(description);function openPinterestDialogue(event){var offsetLeft=($(window).width()-775)/2;var offsetTop=($(window).height()-550)/2;var position=",top="+offsetTop+",left="+offsetLeft;window.open(shareLink,"Pinterest","width=775,height=550,status=0,toolbar=0,menubar=0,location=1,scrollbars=1"+position);socialWarfare.trackClick("pin_image");$(".swp-hover-pin-button").remove()}$(".swp-hover-pin-button").on("click",openPinterestDialogue)};socialWarfare.findPinterestBrowserSaveButtons=function(){var pinterestRed,pinterestRed2019,pinterestZIndex,pinterestBackgroundSize,button,style;pinterestRed="rgb(189, 8, 28)";pinterestRed2019="rgb(230, 0, 35)";pinterestZIndex="8675309";pinterestBackgroundSize="14px 14px";button=null;document.querySelectorAll("span").forEach(function(element,index){style=window.getComputedStyle(element);if(style.backgroundColor==pinterestRed||style.backgroundColor==pinterestRed2019){if(style.backgroundSize==pinterestBackgroundSize&&style.zIndex==pinterestZIndex){button=element}}});return button};socialWarfare.removePinterestBrowserSaveButtons=function(button){var pinterestSquare,style,size;pinterestSquare=button.nextSibling;if(pinterestSquare!=undefined&&pinterestSquare.nodeName=="SPAN"){style=window.getComputedStyle(pinterestSquare);size="24px";if(style.width.indexOf(size)===0&&style.height.indexOf(size)===0){pinterestSquare.remove()}}button.remove()};socialWarfare.fetchFacebookShares=function(){var url1="https://graph.facebook.com/v6.0/?fields=og_object{engagement}&id="+swp_post_url;var url2=swp_post_recovery_url?"https://graph.facebook.com/v6.0/?fields=og_object{engagement}&id="+swp_post_recovery_url:"";console.log("Facebook Share API: "+url1);console.log("Facebook Share API (recovery): "+url2);$.when($.get(url1),$.get(url2)).then(function(response1,response2){var shares,shares1,shares2,data;shares1=socialWarfare.parseFacebookShares(response1[0]);shares2=0;if(swp_post_recovery_url){shares2=socialWarfare.parseFacebookShares(response2[0])}shares=shares1;if(shares1!==shares2){shares=shares1+shares2}var data={action:"swp_facebook_shares_update",post_id:swp_post_id,share_counts:shares};$.post(swp_admin_ajax,data,function(response){console.log(response)})})};socialWarfare.parseFacebookShares=function(response){if("undefined"===typeof response.og_object){console.log("Facebook Shares: 0");return 0}console.log("Facebook Shares: "+response.og_object.engagement.count);return parseInt(response.og_object.engagement.count)};socialWarfare.trigger=function(event){$(window).trigger($.Event(event))};socialWarfare.trackClick=function(event){if(true===swpClickTracking){if("function"==typeof ga){ga("send","event","social_media","swp_"+event+"_share")}if("object"==typeof dataLayer){dataLayer.push({event:"swp_"+event+"_share"})}}};socialWarfare.checkListeners=function(count,limit){if(count>limit){return}var panel=$(".swp_social_panel");if(panel.length>0&&panel.find(".swp_pinterest")){socialWarfare.handleButtonClicks();return}setTimeout(function(){socialWarfare.checkListeners(++count,limit)},2e3)};socialWarfare.establishBreakpoint=function(){var panel=$(".swp_social_panel");socialWarfare.breakpoint=1100;if(panel.length&&panel.data("min-width")||panel.data("min-width")==0){socialWarfare.breakpoint=parseInt(panel.data("min-width"))}};socialWarfare.isMobile=function(){return $(window).width()<socialWarfare.breakpoint};$(document).ready(function(){socialWarfare.initPlugin();socialWarfare.panels.floatingSide.hide();$(window).on("resize",socialWarfare.onWindowResize);if("undefined"!==typeof swpPinIt&&swpPinIt.enabled){socialWarfare.enablePinterestSaveButtons()}});$(window).on("load",function(){if("undefined"!==typeof swpPinIt&&swpPinIt.enabled){socialWarfare.enablePinterestSaveButtons()}window.clearCheckID=0})})(this,jQuery);
//# sourceMappingURL=script.min.js.map
;/*
* ! waitForImages jQuery Plugin - v2.2.0 - 2017-02-20
* https://github.com/alexanderdickson/waitForImages
* Copyright (c) 2017 Alex Dickson; Licensed MIT 
*/
	;(function (factory) {
	    if (typeof define === 'function' && define.amd) {
	        // AMD. Register as an anonymous module.
	        define(['jquery'], factory);
	    } else if (typeof exports === 'object') {
	        // CommonJS / nodejs module
	        module.exports = factory(require('jquery'));
	    } else {
	        // Browser globals
	        factory(jQuery);
	    }
	}(function ($) {
	    // Namespace all events.
	    var eventNamespace = 'waitForImages';

	    // Is srcset supported by this browser?
	    var hasSrcset = (function(img) {
	        return img.srcset && img.sizes;
	    })(new Image());

	    // CSS properties which contain references to images.
	    $.waitForImages = {
	        hasImageProperties: [
	            'backgroundImage',
	            'listStyleImage',
	            'borderImage',
	            'borderCornerImage',
	            'cursor'
	        ],
	        hasImageAttributes: ['srcset']
	    };

	    // Custom selector to find all `img` elements with a valid `src` attribute.
	    $.expr[':']['has-src'] = function (obj) {
	        // Ensure we are dealing with an `img` element with a valid
	        // `src` attribute.
	        return $(obj).is('img[src][src!=""]');
	    };

	    // Custom selector to find images which are not already cached by the
	    // browser.
	    $.expr[':'].uncached = function (obj) {
	        // Ensure we are dealing with an `img` element with a valid
	        // `src` attribute.
	        if (!$(obj).is(':has-src')) {
	            return false;
	        }

	        return !obj.complete;
	    };

	    $.fn.waitForImages = function () {

	        var allImgsLength = 0;
	        var allImgsLoaded = 0;
	        var deferred = $.Deferred();
	        var originalCollection = this;
	        var allImgs = [];

	        // CSS properties which may contain an image.
	        var hasImgProperties = $.waitForImages.hasImageProperties || [];
	        // Element attributes which may contain an image.
	        var hasImageAttributes = $.waitForImages.hasImageAttributes || [];
	        // To match `url()` references.
	        // Spec: http://www.w3.org/TR/CSS2/syndata.html#value-def-uri
	        var matchUrl = /url\(\s*(['"]?)(.*?)\1\s*\)/g;

	        var finishedCallback;
	        var eachCallback;
	        var waitForAll;

	        // Handle options object (if passed).
	        if ($.isPlainObject(arguments[0])) {

	            waitForAll = arguments[0].waitForAll;
	            eachCallback = arguments[0].each;
	            finishedCallback = arguments[0].finished;

	        } else {

	            // Handle if using deferred object and only one param was passed in.
	            if (arguments.length === 1 && $.type(arguments[0]) === 'boolean') {
	                waitForAll = arguments[0];
	            } else {
	                finishedCallback = arguments[0];
	                eachCallback = arguments[1];
	                waitForAll = arguments[2];
	            }

	        }

	        // Handle missing callbacks.
	        finishedCallback = finishedCallback || $.noop;
	        eachCallback = eachCallback || $.noop;

	        // Convert waitForAll to Boolean.
	        waitForAll = !! waitForAll;

	        // Ensure callbacks are functions.
	        if (!$.isFunction(finishedCallback) || !$.isFunction(eachCallback)) {
	            throw new TypeError('An invalid callback was supplied.');
	        }

	        this.each(function () {
	            // Build a list of all imgs, dependent on what images will
	            // be considered.
	            var obj = $(this);

	            if (waitForAll) {

	                // Get all elements (including the original), as any one of
	                // them could have a background image.
	                obj.find('*').addBack().each(function () {
	                    var element = $(this);

	                    // If an `img` element, add it. But keep iterating in
	                    // case it has a background image too.
	                    if (element.is('img:has-src') &&
	                        !element.is('[srcset]')) {
	                        allImgs.push({
	                            src: element.attr('src'),
	                            element: element[0]
	                        });
	                    }

	                    $.each(hasImgProperties, function (i, property) {
	                        var propertyValue = element.css(property);
	                        var match;

	                        // If it doesn't contain this property, skip.
	                        if (!propertyValue) {
	                            return true;
	                        }

	                        // Get all url() of this element.
	                        while (match = matchUrl.exec(propertyValue)) {
	                            allImgs.push({
	                                src: match[2],
	                                element: element[0]
	                            });
	                        }
	                    });

	                    $.each(hasImageAttributes, function (i, attribute) {
	                        var attributeValue = element.attr(attribute);
	                        var attributeValues;

	                        // If it doesn't contain this property, skip.
	                        if (!attributeValue) {
	                            return true;
	                        }

	                        allImgs.push({
	                            src: element.attr('src'),
	                            srcset: element.attr('srcset'),
	                            element: element[0]
	                        });
	                    });
	                });
	            } else {
	                // For images only, the task is simpler.
	                obj.find('img:has-src')
	                    .each(function () {
	                    allImgs.push({
	                        src: this.src,
	                        element: this
	                    });
	                });
	            }
	        });

	        allImgsLength = allImgs.length;
	        allImgsLoaded = 0;

	        // If no images found, don't bother.
	        if (allImgsLength === 0) {
	            finishedCallback.call(originalCollection);
	            deferred.resolveWith(originalCollection);
	        }

	        // Now that we've found all imgs in all elements in this,
	        // load them and attach callbacks.
	        $.each(allImgs, function (i, img) {

	            var image = new Image();
	            var events =
	              'load.' + eventNamespace + ' error.' + eventNamespace;

	            // Handle the image loading and error with the same callback.
	            $(image).one(events, function me (event) {
	                // If an error occurred with loading the image, set the
	                // third argument accordingly.
	                var eachArguments = [
	                    allImgsLoaded,
	                    allImgsLength,
	                    event.type == 'load'
	                ];
	                allImgsLoaded++;

	                eachCallback.apply(img.element, eachArguments);
	                deferred.notifyWith(img.element, eachArguments);

	                // Unbind the event listeners. I use this in addition to
	                // `one` as one of those events won't be called (either
	                // 'load' or 'error' will be called).
	                $(this).off(events, me);

	                if (allImgsLoaded == allImgsLength) {
	                    finishedCallback.call(originalCollection[0]);
	                    deferred.resolveWith(originalCollection[0]);
	                    return false;
	                }

	            });

	            if (hasSrcset && img.srcset) {
	                image.srcset = img.srcset;
	                image.sizes = img.sizes;
	            }
	            image.src = img.src;
	        });

	        return deferred.promise();

	    };
	}));



/*!
* FitVids 1.1
*
* Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
*/
	;(function( $ ){

	  'use strict';

	  $.fn.fitVids = function( options ) {
	    var settings = {
	      customSelector: null,
	      ignore: null
	    };

	    if(!document.getElementById('fit-vids-style')) {
	      // appendStyles: https://github.com/toddmotto/fluidvids/blob/master/dist/fluidvids.js
	      var head = document.head || document.getElementsByTagName('head')[0];
	      var css = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}';
	      var div = document.createElement("div");
	      div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + '</style>';
	      head.appendChild(div.childNodes[1]);
	    }

	    if ( options ) {
	      $.extend( settings, options );
	    }

	    return this.each(function(){
	      var selectors = [
	        'iframe[src*="player.vimeo.com"]',
	        'iframe[src*="youtube.com"]',
	        'iframe[src*="youtube-nocookie.com"]',
	        'iframe[src*="kickstarter.com"][src*="video.html"]',
	        'object',
	        'embed'
	      ];

	      if (settings.customSelector) {
	        selectors.push(settings.customSelector);
	      }

	      var ignoreList = '.fitvidsignore';

	      if(settings.ignore) {
	        ignoreList = ignoreList + ', ' + settings.ignore;
	      }

	      var $allVideos = $(this).find(selectors.join(','));
	      $allVideos = $allVideos.not('object object'); // SwfObj conflict patch
	      $allVideos = $allVideos.not(ignoreList); // Disable FitVids on this video.

	      $allVideos.each(function(){
	        var $this = $(this);
	        if($this.parents(ignoreList).length > 0) {
	          return; // Disable FitVids on this video.
	        }
	        if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }
	        if ((!$this.css('height') && !$this.css('width')) && (isNaN($this.attr('height')) || isNaN($this.attr('width'))))
	        {
	          $this.attr('height', 9);
	          $this.attr('width', 16);
	        }
	        var height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height(),
	            width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
	            aspectRatio = height / width;
	        if(!$this.attr('name')){
	          var videoName = 'fitvid' + $.fn.fitVids._count;
	          $this.attr('name', videoName);
	          $.fn.fitVids._count++;
	        }
	        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100)+'%');
	        $this.removeAttr('height').removeAttr('width');
	      });
	    });
	  };
	  
	  // Internal counter for unique video names.
	  $.fn.fitVids._count = 0;
	  
	// Works with either jQuery or Zepto
	})( window.jQuery || window.Zepto );


/*
	Version: 1.6.0
	Author: Ken Wheeler
	Website: http://kenwheeler.github.io
	Docs: http://kenwheeler.github.io/slick
	Repo: http://github.com/kenwheeler/slick
	Issues: http://github.com/kenwheeler/slick/issues
*/

	/* global window, document, define, jQuery, setInterval, clearInterval */
	;(function(factory) {
	    'use strict';
	    if (typeof define === 'function' && define.amd) {
	        define(['jquery'], factory);
	    } else if (typeof exports !== 'undefined') {
	        module.exports = factory(require('jquery'));
	    } else {
	        factory(jQuery);
	    }

	}(function($) {
	    'use strict';
	    var Slick = window.Slick || {};

	    Slick = (function() {

	        var instanceUid = 0;

	        function Slick(element, settings) {

	            var _ = this, dataSettings;

	            _.defaults = {
	                accessibility: true,
	                adaptiveHeight: false,
	                appendArrows: $(element),
	                appendDots: $(element),
	                arrows: true,
	                asNavFor: null,
	                prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
	                nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
	                autoplay: false,
	                autoplaySpeed: 3000,
	                centerMode: false,
	                centerPadding: '50px',
	                cssEase: 'ease',
	                customPaging: function(slider, i) {
	                    return $('<button type="button" />').text(i + 1);
	                },
	                dots: false,
	                dotsClass: 'slick-dots',
	                draggable: true,
	                easing: 'linear',
	                edgeFriction: 0.35,
	                fade: false,
	                focusOnSelect: false,
	                infinite: true,
	                initialSlide: 0,
	                lazyLoad: 'ondemand',
	                mobileFirst: false,
	                pauseOnHover: true,
	                pauseOnFocus: true,
	                pauseOnDotsHover: false,
	                respondTo: 'window',
	                responsive: null,
	                rows: 1,
	                rtl: false,
	                slide: '',
	                slidesPerRow: 1,
	                slidesToShow: 1,
	                slidesToScroll: 1,
	                speed: 500,
	                swipe: true,
	                swipeToSlide: false,
	                touchMove: true,
	                touchThreshold: 5,
	                useCSS: true,
	                useTransform: true,
	                variableWidth: false,
	                vertical: false,
	                verticalSwiping: false,
	                waitForAnimate: true,
	                zIndex: 1000
	            };

	            _.initials = {
	                animating: false,
	                dragging: false,
	                autoPlayTimer: null,
	                currentDirection: 0,
	                currentLeft: null,
	                currentSlide: 0,
	                direction: 1,
	                $dots: null,
	                listWidth: null,
	                listHeight: null,
	                loadIndex: 0,
	                $nextArrow: null,
	                $prevArrow: null,
	                scrolling: false,
	                slideCount: null,
	                slideWidth: null,
	                $slideTrack: null,
	                $slides: null,
	                sliding: false,
	                slideOffset: 0,
	                swipeLeft: null,
	                swiping: false,
	                $list: null,
	                touchObject: {},
	                transformsEnabled: false,
	                unslicked: false
	            };

	            $.extend(_, _.initials);

	            _.activeBreakpoint = null;
	            _.animType = null;
	            _.animProp = null;
	            _.breakpoints = [];
	            _.breakpointSettings = [];
	            _.cssTransitions = false;
	            _.focussed = false;
	            _.interrupted = false;
	            _.hidden = 'hidden';
	            _.paused = true;
	            _.positionProp = null;
	            _.respondTo = null;
	            _.rowCount = 1;
	            _.shouldClick = true;
	            _.$slider = $(element);
	            _.$slidesCache = null;
	            _.transformType = null;
	            _.transitionType = null;
	            _.visibilityChange = 'visibilitychange';
	            _.windowWidth = 0;
	            _.windowTimer = null;

	            dataSettings = $(element).data('slick') || {};

	            _.options = $.extend({}, _.defaults, settings, dataSettings);

	            _.currentSlide = _.options.initialSlide;

	            _.originalSettings = _.options;

	            if (typeof document.mozHidden !== 'undefined') {
	                _.hidden = 'mozHidden';
	                _.visibilityChange = 'mozvisibilitychange';
	            } else if (typeof document.webkitHidden !== 'undefined') {
	                _.hidden = 'webkitHidden';
	                _.visibilityChange = 'webkitvisibilitychange';
	            }

	            _.autoPlay = $.proxy(_.autoPlay, _);
	            _.autoPlayClear = $.proxy(_.autoPlayClear, _);
	            _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
	            _.changeSlide = $.proxy(_.changeSlide, _);
	            _.clickHandler = $.proxy(_.clickHandler, _);
	            _.selectHandler = $.proxy(_.selectHandler, _);
	            _.setPosition = $.proxy(_.setPosition, _);
	            _.swipeHandler = $.proxy(_.swipeHandler, _);
	            _.dragHandler = $.proxy(_.dragHandler, _);
	            _.keyHandler = $.proxy(_.keyHandler, _);

	            _.instanceUid = instanceUid++;

	            // A simple way to check for HTML strings
	            // Strict HTML recognition (must start with <)
	            // Extracted from jQuery v1.11 source
	            _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;


	            _.registerBreakpoints();
	            _.init(true);

	        }

	        return Slick;

	    }());

	    Slick.prototype.activateADA = function() {
	        var _ = this;

	        _.$slideTrack.find('.slick-active').attr({
	            'aria-hidden': 'false'
	        }).find('a, input, button, select').attr({
	            'tabindex': '0'
	        });

	    };

	    Slick.prototype.addSlide = Slick.prototype.slickAdd = function(markup, index, addBefore) {

	        var _ = this;

	        if (typeof(index) === 'boolean') {
	            addBefore = index;
	            index = null;
	        } else if (index < 0 || (index >= _.slideCount)) {
	            return false;
	        }

	        _.unload();

	        if (typeof(index) === 'number') {
	            if (index === 0 && _.$slides.length === 0) {
	                $(markup).appendTo(_.$slideTrack);
	            } else if (addBefore) {
	                $(markup).insertBefore(_.$slides.eq(index));
	            } else {
	                $(markup).insertAfter(_.$slides.eq(index));
	            }
	        } else {
	            if (addBefore === true) {
	                $(markup).prependTo(_.$slideTrack);
	            } else {
	                $(markup).appendTo(_.$slideTrack);
	            }
	        }

	        _.$slides = _.$slideTrack.children(this.options.slide);

	        _.$slideTrack.children(this.options.slide).detach();

	        _.$slideTrack.append(_.$slides);

	        _.$slides.each(function(index, element) {
	            $(element).attr('data-slick-index', index);
	        });

	        _.$slidesCache = _.$slides;

	        _.reinit();

	    };

	    Slick.prototype.animateHeight = function() {
	        var _ = this;
	        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
	            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
	            _.$list.animate({
	                height: targetHeight
	            }, _.options.speed);
	        }
	    };

	    Slick.prototype.animateSlide = function(targetLeft, callback) {

	        var animProps = {},
	            _ = this;

	        _.animateHeight();

	        if (_.options.rtl === true && _.options.vertical === false) {
	            targetLeft = -targetLeft;
	        }
	        if (_.transformsEnabled === false) {
	            if (_.options.vertical === false) {
	                _.$slideTrack.animate({
	                    left: targetLeft
	                }, _.options.speed, _.options.easing, callback);
	            } else {
	                _.$slideTrack.animate({
	                    top: targetLeft
	                }, _.options.speed, _.options.easing, callback);
	            }

	        } else {

	            if (_.cssTransitions === false) {
	                if (_.options.rtl === true) {
	                    _.currentLeft = -(_.currentLeft);
	                }
	                $({
	                    animStart: _.currentLeft
	                }).animate({
	                    animStart: targetLeft
	                }, {
	                    duration: _.options.speed,
	                    easing: _.options.easing,
	                    step: function(now) {
	                        now = Math.ceil(now);
	                        if (_.options.vertical === false) {
	                            animProps[_.animType] = 'translate(' +
	                                now + 'px, 0px)';
	                            _.$slideTrack.css(animProps);
	                        } else {
	                            animProps[_.animType] = 'translate(0px,' +
	                                now + 'px)';
	                            _.$slideTrack.css(animProps);
	                        }
	                    },
	                    complete: function() {
	                        if (callback) {
	                            callback.call();
	                        }
	                    }
	                });

	            } else {

	                _.applyTransition();
	                targetLeft = Math.ceil(targetLeft);

	                if (_.options.vertical === false) {
	                    animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
	                } else {
	                    animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
	                }
	                _.$slideTrack.css(animProps);

	                if (callback) {
	                    setTimeout(function() {

	                        _.disableTransition();

	                        callback.call();
	                    }, _.options.speed);
	                }

	            }

	        }

	    };

	    Slick.prototype.getNavTarget = function() {

	        var _ = this,
	            asNavFor = _.options.asNavFor;

	        if ( asNavFor && asNavFor !== null ) {
	            asNavFor = $(asNavFor).not(_.$slider);
	        }

	        return asNavFor;

	    };

	    Slick.prototype.asNavFor = function(index) {

	        var _ = this,
	            asNavFor = _.getNavTarget();

	        if ( asNavFor !== null && typeof asNavFor === 'object' ) {
	            asNavFor.each(function() {
	                var target = $(this).slick('getSlick');
	                if(!target.unslicked) {
	                    target.slideHandler(index, true);
	                }
	            });
	        }

	    };

	    Slick.prototype.applyTransition = function(slide) {

	        var _ = this,
	            transition = {};

	        if (_.options.fade === false) {
	            transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
	        } else {
	            transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
	        }

	        if (_.options.fade === false) {
	            _.$slideTrack.css(transition);
	        } else {
	            _.$slides.eq(slide).css(transition);
	        }

	    };

	    Slick.prototype.autoPlay = function() {

	        var _ = this;

	        _.autoPlayClear();

	        if ( _.slideCount > _.options.slidesToShow ) {
	            _.autoPlayTimer = setInterval( _.autoPlayIterator, _.options.autoplaySpeed );
	        }

	    };

	    Slick.prototype.autoPlayClear = function() {

	        var _ = this;

	        if (_.autoPlayTimer) {
	            clearInterval(_.autoPlayTimer);
	        }

	    };

	    Slick.prototype.autoPlayIterator = function() {

	        var _ = this,
	            slideTo = _.currentSlide + _.options.slidesToScroll;

	        if ( !_.paused && !_.interrupted && !_.focussed ) {

	            if ( _.options.infinite === false ) {

	                if ( _.direction === 1 && ( _.currentSlide + 1 ) === ( _.slideCount - 1 )) {
	                    _.direction = 0;
	                }

	                else if ( _.direction === 0 ) {

	                    slideTo = _.currentSlide - _.options.slidesToScroll;

	                    if ( _.currentSlide - 1 === 0 ) {
	                        _.direction = 1;
	                    }

	                }

	            }

	            _.slideHandler( slideTo );

	        }

	    };

	    Slick.prototype.buildArrows = function() {

	        var _ = this;

	        if (_.options.arrows === true ) {

	            _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
	            _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');

	            if( _.slideCount > _.options.slidesToShow ) {

	                _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');
	                _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

	                if (_.htmlExpr.test(_.options.prevArrow)) {
	                    _.$prevArrow.prependTo(_.options.appendArrows);
	                }

	                if (_.htmlExpr.test(_.options.nextArrow)) {
	                    _.$nextArrow.appendTo(_.options.appendArrows);
	                }

	                if (_.options.infinite !== true) {
	                    _.$prevArrow
	                        .addClass('slick-disabled')
	                        .attr('aria-disabled', 'true');
	                }

	            } else {

	                _.$prevArrow.add( _.$nextArrow )

	                    .addClass('slick-hidden')
	                    .attr({
	                        'aria-disabled': 'true',
	                        'tabindex': '-1'
	                    });

	            }

	        }

	    };

	    Slick.prototype.buildDots = function() {

	        var _ = this,
	            i, dot;

	        if (_.options.dots === true) {

	            _.$slider.addClass('slick-dotted');

	            dot = $('<ul />').addClass(_.options.dotsClass);

	            for (i = 0; i <= _.getDotCount(); i += 1) {
	                dot.append($('<li />').append(_.options.customPaging.call(this, _, i)));
	            }

	            _.$dots = dot.appendTo(_.options.appendDots);

	            _.$dots.find('li').first().addClass('slick-active');

	        }

	    };

	    Slick.prototype.buildOut = function() {

	        var _ = this;

	        _.$slides =
	            _.$slider
	                .children( _.options.slide + ':not(.slick-cloned)')
	                .addClass('slick-slide');

	        _.slideCount = _.$slides.length;

	        _.$slides.each(function(index, element) {
	            $(element)
	                .attr('data-slick-index', index)
	                .data('originalStyling', $(element).attr('style') || '');
	        });

	        _.$slider.addClass('slick-slider');

	        _.$slideTrack = (_.slideCount === 0) ?
	            $('<div class="slick-track"/>').appendTo(_.$slider) :
	            _.$slides.wrapAll('<div class="slick-track"/>').parent();

	        _.$list = _.$slideTrack.wrap(
	            '<div class="slick-list"/>').parent();
	        _.$slideTrack.css('opacity', 0);

	        if (_.options.centerMode === true || _.options.swipeToSlide === true) {
	            _.options.slidesToScroll = 1;
	        }

	        $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');

	        _.setupInfinite();

	        _.buildArrows();

	        _.buildDots();

	        _.updateDots();


	        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

	        if (_.options.draggable === true) {
	            _.$list.addClass('draggable');
	        }

	    };

	    Slick.prototype.buildRows = function() {

	        var _ = this, a, b, c, newSlides, numOfSlides, originalSlides,slidesPerSection;

	        newSlides = document.createDocumentFragment();
	        originalSlides = _.$slider.children();

	        if(_.options.rows > 1) {

	            slidesPerSection = _.options.slidesPerRow * _.options.rows;
	            numOfSlides = Math.ceil(
	                originalSlides.length / slidesPerSection
	            );

	            for(a = 0; a < numOfSlides; a++){
	                var slide = document.createElement('div');
	                for(b = 0; b < _.options.rows; b++) {
	                    var row = document.createElement('div');
	                    for(c = 0; c < _.options.slidesPerRow; c++) {
	                        var target = (a * slidesPerSection + ((b * _.options.slidesPerRow) + c));
	                        if (originalSlides.get(target)) {
	                            row.appendChild(originalSlides.get(target));
	                        }
	                    }
	                    slide.appendChild(row);
	                }
	                newSlides.appendChild(slide);
	            }

	            _.$slider.empty().append(newSlides);
	            _.$slider.children().children().children()
	                .css({
	                    'width':(100 / _.options.slidesPerRow) + '%',
	                    'display': 'inline-block'
	                });

	        }

	    };

	    Slick.prototype.checkResponsive = function(initial, forceUpdate) {

	        var _ = this,
	            breakpoint, targetBreakpoint, respondToWidth, triggerBreakpoint = false;
	        var sliderWidth = _.$slider.width();
	        var windowWidth = window.innerWidth || $(window).width();

	        if (_.respondTo === 'window') {
	            respondToWidth = windowWidth;
	        } else if (_.respondTo === 'slider') {
	            respondToWidth = sliderWidth;
	        } else if (_.respondTo === 'min') {
	            respondToWidth = Math.min(windowWidth, sliderWidth);
	        }

	        if ( _.options.responsive &&
	            _.options.responsive.length &&
	            _.options.responsive !== null) {

	            targetBreakpoint = null;

	            for (breakpoint in _.breakpoints) {
	                if (_.breakpoints.hasOwnProperty(breakpoint)) {
	                    if (_.originalSettings.mobileFirst === false) {
	                        if (respondToWidth < _.breakpoints[breakpoint]) {
	                            targetBreakpoint = _.breakpoints[breakpoint];
	                        }
	                    } else {
	                        if (respondToWidth > _.breakpoints[breakpoint]) {
	                            targetBreakpoint = _.breakpoints[breakpoint];
	                        }
	                    }
	                }
	            }

	            if (targetBreakpoint !== null) {
	                if (_.activeBreakpoint !== null) {
	                    if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
	                        _.activeBreakpoint =
	                            targetBreakpoint;
	                        if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
	                            _.unslick(targetBreakpoint);
	                        } else {
	                            _.options = $.extend({}, _.originalSettings,
	                                _.breakpointSettings[
	                                    targetBreakpoint]);
	                            if (initial === true) {
	                                _.currentSlide = _.options.initialSlide;
	                            }
	                            _.refresh(initial);
	                        }
	                        triggerBreakpoint = targetBreakpoint;
	                    }
	                } else {
	                    _.activeBreakpoint = targetBreakpoint;
	                    if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
	                        _.unslick(targetBreakpoint);
	                    } else {
	                        _.options = $.extend({}, _.originalSettings,
	                            _.breakpointSettings[
	                                targetBreakpoint]);
	                        if (initial === true) {
	                            _.currentSlide = _.options.initialSlide;
	                        }
	                        _.refresh(initial);
	                    }
	                    triggerBreakpoint = targetBreakpoint;
	                }
	            } else {
	                if (_.activeBreakpoint !== null) {
	                    _.activeBreakpoint = null;
	                    _.options = _.originalSettings;
	                    if (initial === true) {
	                        _.currentSlide = _.options.initialSlide;
	                    }
	                    _.refresh(initial);
	                    triggerBreakpoint = targetBreakpoint;
	                }
	            }

	            // only trigger breakpoints during an actual break. not on initialize.
	            if( !initial && triggerBreakpoint !== false ) {
	                _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
	            }
	        }

	    };

	    Slick.prototype.changeSlide = function(event, dontAnimate) {

	        var _ = this,
	            $target = $(event.currentTarget),
	            indexOffset, slideOffset, unevenOffset;

	        // If target is a link, prevent default action.
	        if($target.is('a')) {
	            event.preventDefault();
	        }

	        // If target is not the <li> element (ie: a child), find the <li>.
	        if(!$target.is('li')) {
	            $target = $target.closest('li');
	        }

	        unevenOffset = (_.slideCount % _.options.slidesToScroll !== 0);
	        indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

	        switch (event.data.message) {

	            case 'previous':
	                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;
	                if (_.slideCount > _.options.slidesToShow) {
	                    _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
	                }
	                break;

	            case 'next':
	                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
	                if (_.slideCount > _.options.slidesToShow) {
	                    _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
	                }
	                break;

	            case 'index':
	                var index = event.data.index === 0 ? 0 :
	                    event.data.index || $target.index() * _.options.slidesToScroll;

	                _.slideHandler(_.checkNavigable(index), false, dontAnimate);
	                $target.children().trigger('focus');
	                break;

	            default:
	                return;
	        }

	    };

	    Slick.prototype.checkNavigable = function(index) {

	        var _ = this,
	            navigables, prevNavigable;

	        navigables = _.getNavigableIndexes();
	        prevNavigable = 0;
	        if (index > navigables[navigables.length - 1]) {
	            index = navigables[navigables.length - 1];
	        } else {
	            for (var n in navigables) {
	                if (index < navigables[n]) {
	                    index = prevNavigable;
	                    break;
	                }
	                prevNavigable = navigables[n];
	            }
	        }

	        return index;
	    };

	    Slick.prototype.cleanUpEvents = function() {

	        var _ = this;

	        if (_.options.dots && _.$dots !== null) {

	            $('li', _.$dots)
	                .off('click.slick', _.changeSlide)
	                .off('mouseenter.slick', $.proxy(_.interrupt, _, true))
	                .off('mouseleave.slick', $.proxy(_.interrupt, _, false));

	            if (_.options.accessibility === true) {
	                _.$dots.off('keydown.slick', _.keyHandler);
	            }
	        }

	        _.$slider.off('focus.slick blur.slick');

	        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
	            _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);
	            _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);

	            if (_.options.accessibility === true) {
	                _.$prevArrow.off('keydown.slick', _.keyHandler);
	                _.$nextArrow.off('keydown.slick', _.keyHandler);
	            }
	        }

	        _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);
	        _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);
	        _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);
	        _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);

	        _.$list.off('click.slick', _.clickHandler);

	        $(document).off(_.visibilityChange, _.visibility);

	        _.cleanUpSlideEvents();

	        if (_.options.accessibility === true) {
	            _.$list.off('keydown.slick', _.keyHandler);
	        }

	        if (_.options.focusOnSelect === true) {
	            $(_.$slideTrack).children().off('click.slick', _.selectHandler);
	        }

	        $(window).off('orientationchange.slick.slick-' + _.instanceUid, _.orientationChange);

	        $(window).off('resize.slick.slick-' + _.instanceUid, _.resize);

	        $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);

	        $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);

	    };

	    Slick.prototype.cleanUpSlideEvents = function() {

	        var _ = this;

	        _.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true));
	        _.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false));

	    };

	    Slick.prototype.cleanUpRows = function() {

	        var _ = this, originalSlides;

	        if(_.options.rows > 1) {
	            originalSlides = _.$slides.children().children();
	            originalSlides.removeAttr('style');
	            _.$slider.empty().append(originalSlides);
	        }

	    };

	    Slick.prototype.clickHandler = function(event) {

	        var _ = this;

	        if (_.shouldClick === false) {
	            event.stopImmediatePropagation();
	            event.stopPropagation();
	            event.preventDefault();
	        }

	    };

	    Slick.prototype.destroy = function(refresh) {

	        var _ = this;

	        _.autoPlayClear();

	        _.touchObject = {};

	        _.cleanUpEvents();

	        $('.slick-cloned', _.$slider).detach();

	        if (_.$dots) {
	            _.$dots.remove();
	        }

	        if ( _.$prevArrow && _.$prevArrow.length ) {

	            _.$prevArrow
	                .removeClass('slick-disabled slick-arrow slick-hidden')
	                .removeAttr('aria-hidden aria-disabled tabindex')
	                .css('display','');

	            if ( _.htmlExpr.test( _.options.prevArrow )) {
	                _.$prevArrow.remove();
	            }
	        }

	        if ( _.$nextArrow && _.$nextArrow.length ) {

	            _.$nextArrow
	                .removeClass('slick-disabled slick-arrow slick-hidden')
	                .removeAttr('aria-hidden aria-disabled tabindex')
	                .css('display','');

	            if ( _.htmlExpr.test( _.options.nextArrow )) {
	                _.$nextArrow.remove();
	            }
	        }


	        if (_.$slides) {

	            _.$slides
	                .removeClass('slick-slide slick-active slick-center slick-visible slick-current')
	                .removeAttr('aria-hidden')
	                .removeAttr('data-slick-index')
	                .each(function(){
	                    $(this).attr('style', $(this).data('originalStyling'));
	                });

	            _.$slideTrack.children(this.options.slide).detach();

	            _.$slideTrack.detach();

	            _.$list.detach();

	            _.$slider.append(_.$slides);
	        }

	        _.cleanUpRows();

	        _.$slider.removeClass('slick-slider');
	        _.$slider.removeClass('slick-initialized');
	        _.$slider.removeClass('slick-dotted');

	        _.unslicked = true;

	        if(!refresh) {
	            _.$slider.trigger('destroy', [_]);
	        }

	    };

	    Slick.prototype.disableTransition = function(slide) {

	        var _ = this,
	            transition = {};

	        transition[_.transitionType] = '';

	        if (_.options.fade === false) {
	            _.$slideTrack.css(transition);
	        } else {
	            _.$slides.eq(slide).css(transition);
	        }

	    };

	    Slick.prototype.fadeSlide = function(slideIndex, callback) {

	        var _ = this;

	        if (_.cssTransitions === false) {

	            _.$slides.eq(slideIndex).css({
	                zIndex: _.options.zIndex
	            });

	            _.$slides.eq(slideIndex).animate({
	                opacity: 1
	            }, _.options.speed, _.options.easing, callback);

	        } else {

	            _.applyTransition(slideIndex);

	            _.$slides.eq(slideIndex).css({
	                opacity: 1,
	                zIndex: _.options.zIndex
	            });

	            if (callback) {
	                setTimeout(function() {

	                    _.disableTransition(slideIndex);

	                    callback.call();
	                }, _.options.speed);
	            }

	        }

	    };

	    Slick.prototype.fadeSlideOut = function(slideIndex) {

	        var _ = this;

	        if (_.cssTransitions === false) {

	            _.$slides.eq(slideIndex).animate({
	                opacity: 0,
	                zIndex: _.options.zIndex - 2
	            }, _.options.speed, _.options.easing);

	        } else {

	            _.applyTransition(slideIndex);

	            _.$slides.eq(slideIndex).css({
	                opacity: 0,
	                zIndex: _.options.zIndex - 2
	            });

	        }

	    };

	    Slick.prototype.filterSlides = Slick.prototype.slickFilter = function(filter) {

	        var _ = this;

	        if (filter !== null) {

	            _.$slidesCache = _.$slides;

	            _.unload();

	            _.$slideTrack.children(this.options.slide).detach();

	            _.$slidesCache.filter(filter).appendTo(_.$slideTrack);

	            _.reinit();

	        }

	    };

	    Slick.prototype.focusHandler = function() {

	        var _ = this;

	        _.$slider
	            .off('focus.slick blur.slick')
	            .on('focus.slick blur.slick', '*', function(event) {

	            event.stopImmediatePropagation();
	            var $sf = $(this);

	            setTimeout(function() {

	                if( _.options.pauseOnFocus ) {
	                    _.focussed = $sf.is(':focus');
	                    _.autoPlay();
	                }

	            }, 0);

	        });
	    };

	    Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function() {

	        var _ = this;
	        return _.currentSlide;

	    };

	    Slick.prototype.getDotCount = function() {

	        var _ = this;

	        var breakPoint = 0;
	        var counter = 0;
	        var pagerQty = 0;

	        if (_.options.infinite === true) {
	            if (_.slideCount <= _.options.slidesToShow) {
	                 ++pagerQty;
	            } else {
	                while (breakPoint < _.slideCount) {
	                    ++pagerQty;
	                    breakPoint = counter + _.options.slidesToScroll;
	                    counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
	                }
	            }
	        } else if (_.options.centerMode === true) {
	            pagerQty = _.slideCount;
	        } else if(!_.options.asNavFor) {
	            pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);
	        }else {
	            while (breakPoint < _.slideCount) {
	                ++pagerQty;
	                breakPoint = counter + _.options.slidesToScroll;
	                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
	            }
	        }

	        return pagerQty - 1;

	    };

	    Slick.prototype.getLeft = function(slideIndex) {

	        var _ = this,
	            targetLeft,
	            verticalHeight,
	            verticalOffset = 0,
	            targetSlide,
	            coef;

	        _.slideOffset = 0;
	        verticalHeight = _.$slides.first().outerHeight(true);

	        if (_.options.infinite === true) {
	            if (_.slideCount > _.options.slidesToShow) {
	                _.slideOffset = (_.slideWidth * _.options.slidesToShow) * -1;
	                coef = -1
	                
	                if (_.options.vertical === true && _.options.centerMode === true) {
	                    if (_.options.slidesToShow === 2) {
	                        coef = -1.5;
	                    } else if (_.options.slidesToShow === 1) {
	                        coef = -2
	                    }
	                }
	                verticalOffset = (verticalHeight * _.options.slidesToShow) * coef;
	            }
	            if (_.slideCount % _.options.slidesToScroll !== 0) {
	                if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
	                    if (slideIndex > _.slideCount) {
	                        _.slideOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth) * -1;
	                        verticalOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight) * -1;
	                    } else {
	                        _.slideOffset = ((_.slideCount % _.options.slidesToScroll) * _.slideWidth) * -1;
	                        verticalOffset = ((_.slideCount % _.options.slidesToScroll) * verticalHeight) * -1;
	                    }
	                }
	            }
	        } else {
	            if (slideIndex + _.options.slidesToShow > _.slideCount) {
	                _.slideOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * _.slideWidth;
	                verticalOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * verticalHeight;
	            }
	        }

	        if (_.slideCount <= _.options.slidesToShow) {
	            _.slideOffset = 0;
	            verticalOffset = 0;
	        }

	        if (_.options.centerMode === true && _.slideCount <= _.options.slidesToShow) {
	            _.slideOffset = ((_.slideWidth * Math.floor(_.options.slidesToShow)) / 2) - ((_.slideWidth * _.slideCount) / 2);
	        } else if (_.options.centerMode === true && _.options.infinite === true) {
	            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
	        } else if (_.options.centerMode === true) {
	            _.slideOffset = 0;
	            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
	        }

	        if (_.options.vertical === false) {
	            targetLeft = ((slideIndex * _.slideWidth) * -1) + _.slideOffset;
	        } else {
	            targetLeft = ((slideIndex * verticalHeight) * -1) + verticalOffset;
	        }

	        if (_.options.variableWidth === true) {

	            if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
	                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
	            } else {
	                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);
	            }

	            if (_.options.rtl === true) {
	                if (targetSlide[0]) {
	                    targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
	                } else {
	                    targetLeft =  0;
	                }
	            } else {
	                targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
	            }

	            if (_.options.centerMode === true) {
	                if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
	                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
	                } else {
	                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);
	                }

	                if (_.options.rtl === true) {
	                    if (targetSlide[0]) {
	                        targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
	                    } else {
	                        targetLeft =  0;
	                    }
	                } else {
	                    targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
	                }

	                targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
	            }
	        }

	        return targetLeft;

	    };

	    Slick.prototype.getOption = Slick.prototype.slickGetOption = function(option) {

	        var _ = this;

	        return _.options[option];

	    };

	    Slick.prototype.getNavigableIndexes = function() {

	        var _ = this,
	            breakPoint = 0,
	            counter = 0,
	            indexes = [],
	            max;

	        if (_.options.infinite === false) {
	            max = _.slideCount;
	        } else {
	            breakPoint = _.options.slidesToScroll * -1;
	            counter = _.options.slidesToScroll * -1;
	            max = _.slideCount * 2;
	        }

	        while (breakPoint < max) {
	            indexes.push(breakPoint);
	            breakPoint = counter + _.options.slidesToScroll;
	            counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
	        }

	        return indexes;

	    };

	    Slick.prototype.getSlick = function() {

	        return this;

	    };

	    Slick.prototype.getSlideCount = function() {

	        var _ = this,
	            slidesTraversed, swipedSlide, centerOffset;

	        centerOffset = _.options.centerMode === true ? _.slideWidth * Math.floor(_.options.slidesToShow / 2) : 0;

	        if (_.options.swipeToSlide === true) {
	            _.$slideTrack.find('.slick-slide').each(function(index, slide) {
	                if (slide.offsetLeft - centerOffset + ($(slide).outerWidth() / 2) > (_.swipeLeft * -1)) {
	                    swipedSlide = slide;
	                    return false;
	                }
	            });

	            slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;

	            return slidesTraversed;

	        } else {
	            return _.options.slidesToScroll;
	        }

	    };

	    Slick.prototype.goTo = Slick.prototype.slickGoTo = function(slide, dontAnimate) {

	        var _ = this;

	        _.changeSlide({
	            data: {
	                message: 'index',
	                index: parseInt(slide)
	            }
	        }, dontAnimate);

	    };

	    Slick.prototype.init = function(creation) {

	        var _ = this;

	        if (!$(_.$slider).hasClass('slick-initialized')) {

	            $(_.$slider).addClass('slick-initialized');

	            _.buildRows();
	            _.buildOut();
	            _.setProps();
	            _.startLoad();
	            _.loadSlider();
	            _.initializeEvents();
	            _.updateArrows();
	            _.updateDots();
	            _.checkResponsive(true);
	            _.focusHandler();

	        }

	        if (creation) {
	            _.$slider.trigger('init', [_]);
	        }

	        if (_.options.accessibility === true) {
	            _.initADA();
	        }

	        if ( _.options.autoplay ) {

	            _.paused = false;
	            _.autoPlay();

	        }

	    };

	    Slick.prototype.initADA = function() {
	        var _ = this,
	                numDotGroups = Math.ceil(_.slideCount / _.options.slidesToShow),
	                tabControlIndexes = _.getNavigableIndexes().filter(function(val) {
	                    return (val >= 0) && (val < _.slideCount);
	                });

	        _.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({
	            'aria-hidden': 'true',
	            'tabindex': '-1'
	        }).find('a, input, button, select').attr({
	            'tabindex': '-1'
	        });

	        if (_.$dots !== null) {
	            _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function(i) {
	                var slideControlIndex = tabControlIndexes.indexOf(i);

	                $(this).attr({
	                    'role': 'tabpanel',
	                    'id': 'slick-slide' + _.instanceUid + i,
	                    'tabindex': -1
	                });            

	                if (slideControlIndex !== -1) {
	                    $(this).attr({
	                        'aria-describedby': 'slick-slide-control' + _.instanceUid + slideControlIndex
	                    });
	                }
	            });

	            _.$dots.attr('role', 'tablist').find('li').each(function(i) {
	                var mappedSlideIndex = tabControlIndexes[i];
	        
	                $(this).attr({
	                    'role': 'presentation'
	                });

	                $(this).find('button').first().attr({
	                    'role': 'tab',
	                    'id': 'slick-slide-control' + _.instanceUid + i,
	                    'aria-controls': 'slick-slide' + _.instanceUid + mappedSlideIndex,
	                    'aria-label': (i + 1) + ' of ' + numDotGroups,
	                    'aria-selected': null,
	                    'tabindex': '-1'
	                });

	            }).eq(_.currentSlide).find('button').attr({
	                'aria-selected': 'true',
	                'tabindex': '0'
	            }).end();
	        }

	        for (var i=_.currentSlide, max=i+_.options.slidesToShow; i < max; i++) {
	            _.$slides.eq(i).attr('tabindex', 0);
	        }

	        _.activateADA();

	    };

	    Slick.prototype.initArrowEvents = function() {

	        var _ = this;

	        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
	            _.$prevArrow
	               .off('click.slick')
	               .on('click.slick', {
	                    message: 'previous'
	               }, _.changeSlide);
	            _.$nextArrow
	               .off('click.slick')
	               .on('click.slick', {
	                    message: 'next'
	               }, _.changeSlide);

	            if (_.options.accessibility === true) {
	                _.$prevArrow.on('keydown.slick', _.keyHandler);
	                _.$nextArrow.on('keydown.slick', _.keyHandler);
	            }   
	        }

	    };

	    Slick.prototype.initDotEvents = function() {

	        var _ = this;

	        if (_.options.dots === true) {
	            $('li', _.$dots).on('click.slick', {
	                message: 'index'
	            }, _.changeSlide);

	            if (_.options.accessibility === true) {
	                _.$dots.on('keydown.slick', _.keyHandler);
	            }
	        }

	        if ( _.options.dots === true && _.options.pauseOnDotsHover === true ) {

	            $('li', _.$dots)
	                .on('mouseenter.slick', $.proxy(_.interrupt, _, true))
	                .on('mouseleave.slick', $.proxy(_.interrupt, _, false));

	        }

	    };

	    Slick.prototype.initSlideEvents = function() {

	        var _ = this;

	        if ( _.options.pauseOnHover ) {

	            _.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true));
	            _.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false));

	        }

	    };

	    Slick.prototype.initializeEvents = function() {

	        var _ = this;

	        _.initArrowEvents();

	        _.initDotEvents();
	        _.initSlideEvents();

	        _.$list.on('touchstart.slick mousedown.slick', {
	            action: 'start'
	        }, _.swipeHandler);
	        _.$list.on('touchmove.slick mousemove.slick', {
	            action: 'move'
	        }, _.swipeHandler);
	        _.$list.on('touchend.slick mouseup.slick', {
	            action: 'end'
	        }, _.swipeHandler);
	        _.$list.on('touchcancel.slick mouseleave.slick', {
	            action: 'end'
	        }, _.swipeHandler);

	        _.$list.on('click.slick', _.clickHandler);

	        $(document).on(_.visibilityChange, $.proxy(_.visibility, _));

	        if (_.options.accessibility === true) {
	            _.$list.on('keydown.slick', _.keyHandler);
	        }

	        if (_.options.focusOnSelect === true) {
	            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
	        }

	        $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));

	        $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));

	        $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);

	        $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
	        $(_.setPosition);

	    };

	    Slick.prototype.initUI = function() {

	        var _ = this;

	        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

	            _.$prevArrow.show();
	            _.$nextArrow.show();

	        }

	        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

	            _.$dots.show();

	        }

	    };

	    Slick.prototype.keyHandler = function(event) {

	        var _ = this;
	         //Dont slide if the cursor is inside the form fields and arrow keys are pressed
	        if(!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
	            if (event.keyCode === 37 && _.options.accessibility === true) {
	                _.changeSlide({
	                    data: {
	                        message: _.options.rtl === true ? 'next' :  'previous'
	                    }
	                });
	            } else if (event.keyCode === 39 && _.options.accessibility === true) {
	                _.changeSlide({
	                    data: {
	                        message: _.options.rtl === true ? 'previous' : 'next'
	                    }
	                });
	            }
	        }

	    };

	    Slick.prototype.lazyLoad = function() {

	        var _ = this,
	            loadRange, cloneRange, rangeStart, rangeEnd;

	        function loadImages(imagesScope) {

	            $('img[data-lazy]', imagesScope).each(function() {

	                var image = $(this),
	                    imageSource = $(this).attr('data-lazy'),
	                    imageSrcSet = $(this).attr('data-srcset'),
	                    imageSizes  = $(this).attr('data-sizes') || _.$slider.attr('data-sizes'),
	                    imageToLoad = document.createElement('img');

	                imageToLoad.onload = function() {

	                    image
	                        .animate({ opacity: 0 }, 100, function() {

	                            if (imageSrcSet) {
	                                image
	                                    .attr('srcset', imageSrcSet );

	                                if (imageSizes) {
	                                    image
	                                        .attr('sizes', imageSizes );
	                                }
	                            }

	                            image
	                                .attr('src', imageSource)
	                                .animate({ opacity: 1 }, 200, function() {
	                                    image
	                                        .removeAttr('data-lazy data-srcset data-sizes')
	                                        .removeClass('slick-loading');
	                                });
	                            _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
	                        });

	                };

	                imageToLoad.onerror = function() {

	                    image
	                        .removeAttr( 'data-lazy' )
	                        .removeClass( 'slick-loading' )
	                        .addClass( 'slick-lazyload-error' );

	                    _.$slider.trigger('lazyLoadError', [ _, image, imageSource ]);

	                };

	                imageToLoad.src = imageSource;

	            });

	        }

	        if (_.options.centerMode === true) {
	            if (_.options.infinite === true) {
	                rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
	                rangeEnd = rangeStart + _.options.slidesToShow + 2;
	            } else {
	                rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
	                rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
	            }
	        } else {
	            rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
	            rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);
	            if (_.options.fade === true) {
	                if (rangeStart > 0) rangeStart--;
	                if (rangeEnd <= _.slideCount) rangeEnd++;
	            }
	        }

	        loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);

	        if (_.options.lazyLoad === 'anticipated') {
	            var prevSlide = rangeStart - 1,
	                nextSlide = rangeEnd,
	                $slides = _.$slider.find('.slick-slide');

	            for (var i = 0; i < _.options.slidesToScroll; i++) {
	                if (prevSlide < 0) prevSlide = _.slideCount - 1;
	                loadRange = loadRange.add($slides.eq(prevSlide));
	                loadRange = loadRange.add($slides.eq(nextSlide));
	                prevSlide--;
	                nextSlide++;
	            }
	        }

	        loadImages(loadRange);

	        if (_.slideCount <= _.options.slidesToShow) {
	            cloneRange = _.$slider.find('.slick-slide');
	            loadImages(cloneRange);
	        } else
	        if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
	            cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
	            loadImages(cloneRange);
	        } else if (_.currentSlide === 0) {
	            cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
	            loadImages(cloneRange);
	        }

	    };

	    Slick.prototype.loadSlider = function() {

	        var _ = this;

	        _.setPosition();

	        _.$slideTrack.css({
	            opacity: 1
	        });

	        _.$slider.removeClass('slick-loading');

	        _.initUI();

	        if (_.options.lazyLoad === 'progressive') {
	            _.progressiveLazyLoad();
	        }

	    };

	    Slick.prototype.next = Slick.prototype.slickNext = function() {

	        var _ = this;

	        _.changeSlide({
	            data: {
	                message: 'next'
	            }
	        });

	    };

	    Slick.prototype.orientationChange = function() {

	        var _ = this;

	        _.checkResponsive();
	        _.setPosition();

	    };

	    Slick.prototype.pause = Slick.prototype.slickPause = function() {

	        var _ = this;

	        _.autoPlayClear();
	        _.paused = true;

	    };

	    Slick.prototype.play = Slick.prototype.slickPlay = function() {

	        var _ = this;

	        _.autoPlay();
	        _.options.autoplay = true;
	        _.paused = false;
	        _.focussed = false;
	        _.interrupted = false;

	    };

	    Slick.prototype.postSlide = function(index) {

	        var _ = this;

	        if( !_.unslicked ) {

	            _.$slider.trigger('afterChange', [_, index]);

	            _.animating = false;

	            if (_.slideCount > _.options.slidesToShow) {
	                _.setPosition();
	            }

	            _.swipeLeft = null;

	            if ( _.options.autoplay ) {
	                _.autoPlay();
	            }

	            if (_.options.accessibility === true) {
	                _.initADA();
	                // for non-autoplay: once active slide (group) has updated, set focus on first newly showing slide 
	                if (!_.options.autoplay) {
	                    var $currentSlide = $(_.$slides.get(_.currentSlide));
	                    $currentSlide.attr('tabindex', 0).focus();
	                }
	            }

	        }

	    };

	    Slick.prototype.prev = Slick.prototype.slickPrev = function() {

	        var _ = this;

	        _.changeSlide({
	            data: {
	                message: 'previous'
	            }
	        });

	    };

	    Slick.prototype.preventDefault = function(event) {

	        event.preventDefault();

	    };

	    Slick.prototype.progressiveLazyLoad = function( tryCount ) {

	        tryCount = tryCount || 1;

	        var _ = this,
	            $imgsToLoad = $( 'img[data-lazy]', _.$slider ),
	            image,
	            imageSource,
	            imageSrcSet,
	            imageSizes,
	            imageToLoad;

	        if ( $imgsToLoad.length ) {

	            image = $imgsToLoad.first();
	            imageSource = image.attr('data-lazy');
	            imageSrcSet = image.attr('data-srcset');
	            imageSizes  = image.attr('data-sizes') || _.$slider.attr('data-sizes');
	            imageToLoad = document.createElement('img');

	            imageToLoad.onload = function() {

	                if (imageSrcSet) {
	                    image
	                        .attr('srcset', imageSrcSet );

	                    if (imageSizes) {
	                        image
	                            .attr('sizes', imageSizes );
	                    }
	                }

	                image
	                    .attr( 'src', imageSource )
	                    .removeAttr('data-lazy data-srcset data-sizes')
	                    .removeClass('slick-loading');

	                if ( _.options.adaptiveHeight === true ) {
	                    _.setPosition();
	                }

	                _.$slider.trigger('lazyLoaded', [ _, image, imageSource ]);
	                _.progressiveLazyLoad();

	            };

	            imageToLoad.onerror = function() {

	                if ( tryCount < 3 ) {

	                    /**
	                     * try to load the image 3 times,
	                     * leave a slight delay so we don't get
	                     * servers blocking the request.
	                     */
	                    setTimeout( function() {
	                        _.progressiveLazyLoad( tryCount + 1 );
	                    }, 500 );

	                } else {

	                    image
	                        .removeAttr( 'data-lazy' )
	                        .removeClass( 'slick-loading' )
	                        .addClass( 'slick-lazyload-error' );

	                    _.$slider.trigger('lazyLoadError', [ _, image, imageSource ]);

	                    _.progressiveLazyLoad();

	                }

	            };

	            imageToLoad.src = imageSource;

	        } else {

	            _.$slider.trigger('allImagesLoaded', [ _ ]);

	        }

	    };

	    Slick.prototype.refresh = function( initializing ) {

	        var _ = this, currentSlide, lastVisibleIndex;

	        lastVisibleIndex = _.slideCount - _.options.slidesToShow;

	        // in non-infinite sliders, we don't want to go past the
	        // last visible index.
	        if( !_.options.infinite && ( _.currentSlide > lastVisibleIndex )) {
	            _.currentSlide = lastVisibleIndex;
	        }

	        // if less slides than to show, go to start.
	        if ( _.slideCount <= _.options.slidesToShow ) {
	            _.currentSlide = 0;

	        }

	        currentSlide = _.currentSlide;

	        _.destroy(true);

	        $.extend(_, _.initials, { currentSlide: currentSlide });

	        _.init();

	        if( !initializing ) {

	            _.changeSlide({
	                data: {
	                    message: 'index',
	                    index: currentSlide
	                }
	            }, false);

	        }

	    };

	    Slick.prototype.registerBreakpoints = function() {

	        var _ = this, breakpoint, currentBreakpoint, l,
	            responsiveSettings = _.options.responsive || null;

	        if ( $.type(responsiveSettings) === 'array' && responsiveSettings.length ) {

	            _.respondTo = _.options.respondTo || 'window';

	            for ( breakpoint in responsiveSettings ) {

	                l = _.breakpoints.length-1;

	                if (responsiveSettings.hasOwnProperty(breakpoint)) {
	                    currentBreakpoint = responsiveSettings[breakpoint].breakpoint;

	                    // loop through the breakpoints and cut out any existing
	                    // ones with the same breakpoint number, we don't want dupes.
	                    while( l >= 0 ) {
	                        if( _.breakpoints[l] && _.breakpoints[l] === currentBreakpoint ) {
	                            _.breakpoints.splice(l,1);
	                        }
	                        l--;
	                    }

	                    _.breakpoints.push(currentBreakpoint);
	                    _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;

	                }

	            }

	            _.breakpoints.sort(function(a, b) {
	                return ( _.options.mobileFirst ) ? a-b : b-a;
	            });

	        }

	    };

	    Slick.prototype.reinit = function() {

	        var _ = this;

	        _.$slides =
	            _.$slideTrack
	                .children(_.options.slide)
	                .addClass('slick-slide');

	        _.slideCount = _.$slides.length;

	        if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
	            _.currentSlide = _.currentSlide - _.options.slidesToScroll;
	        }

	        if (_.slideCount <= _.options.slidesToShow) {
	            _.currentSlide = 0;
	        }

	        _.registerBreakpoints();

	        _.setProps();
	        _.setupInfinite();
	        _.buildArrows();
	        _.updateArrows();
	        _.initArrowEvents();
	        _.buildDots();
	        _.updateDots();
	        _.initDotEvents();
	        _.cleanUpSlideEvents();
	        _.initSlideEvents();

	        _.checkResponsive(false, true);

	        if (_.options.focusOnSelect === true) {
	            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
	        }

	        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

	        _.setPosition();
	        _.focusHandler();

	        _.paused = !_.options.autoplay;
	        _.autoPlay();

	        _.$slider.trigger('reInit', [_]);

	    };

	    Slick.prototype.resize = function() {

	        var _ = this;

	        if ($(window).width() !== _.windowWidth) {
	            clearTimeout(_.windowDelay);
	            _.windowDelay = window.setTimeout(function() {
	                _.windowWidth = $(window).width();
	                _.checkResponsive();
	                if( !_.unslicked ) { _.setPosition(); }
	            }, 50);
	        }
	    };

	    Slick.prototype.removeSlide = Slick.prototype.slickRemove = function(index, removeBefore, removeAll) {

	        var _ = this;

	        if (typeof(index) === 'boolean') {
	            removeBefore = index;
	            index = removeBefore === true ? 0 : _.slideCount - 1;
	        } else {
	            index = removeBefore === true ? --index : index;
	        }

	        if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
	            return false;
	        }

	        _.unload();

	        if (removeAll === true) {
	            _.$slideTrack.children().remove();
	        } else {
	            _.$slideTrack.children(this.options.slide).eq(index).remove();
	        }

	        _.$slides = _.$slideTrack.children(this.options.slide);

	        _.$slideTrack.children(this.options.slide).detach();

	        _.$slideTrack.append(_.$slides);

	        _.$slidesCache = _.$slides;

	        _.reinit();

	    };

	    Slick.prototype.setCSS = function(position) {

	        var _ = this,
	            positionProps = {},
	            x, y;

	        if (_.options.rtl === true) {
	            position = -position;
	        }
	        x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
	        y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';

	        positionProps[_.positionProp] = position;

	        if (_.transformsEnabled === false) {
	            _.$slideTrack.css(positionProps);
	        } else {
	            positionProps = {};
	            if (_.cssTransitions === false) {
	                positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';
	                _.$slideTrack.css(positionProps);
	            } else {
	                positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';
	                _.$slideTrack.css(positionProps);
	            }
	        }

	    };

	    Slick.prototype.setDimensions = function() {

	        var _ = this;

	        if (_.options.vertical === false) {
	            if (_.options.centerMode === true) {
	                _.$list.css({
	                    padding: ('0px ' + _.options.centerPadding)
	                });
	            }
	        } else {
	            _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);
	            if (_.options.centerMode === true) {
	                _.$list.css({
	                    padding: (_.options.centerPadding + ' 0px')
	                });
	            }
	        }

	        _.listWidth = _.$list.width();
	        _.listHeight = _.$list.height();


	        if (_.options.vertical === false && _.options.variableWidth === false) {
	            _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
	            _.$slideTrack.width(Math.ceil((_.slideWidth * _.$slideTrack.children('.slick-slide').length)));

	        } else if (_.options.variableWidth === true) {
	            _.$slideTrack.width(5000 * _.slideCount);
	        } else {
	            _.slideWidth = Math.ceil(_.listWidth);
	            _.$slideTrack.height(Math.ceil((_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length)));
	        }

	        var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
	        if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);

	    };

	    Slick.prototype.setFade = function() {

	        var _ = this,
	            targetLeft;

	        _.$slides.each(function(index, element) {
	            targetLeft = (_.slideWidth * index) * -1;
	            if (_.options.rtl === true) {
	                $(element).css({
	                    position: 'relative',
	                    right: targetLeft,
	                    top: 0,
	                    zIndex: _.options.zIndex - 2,
	                    opacity: 0
	                });
	            } else {
	                $(element).css({
	                    position: 'relative',
	                    left: targetLeft,
	                    top: 0,
	                    zIndex: _.options.zIndex - 2,
	                    opacity: 0
	                });
	            }
	        });

	        _.$slides.eq(_.currentSlide).css({
	            zIndex: _.options.zIndex - 1,
	            opacity: 1
	        });

	    };

	    Slick.prototype.setHeight = function() {

	        var _ = this;

	        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
	            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
	            _.$list.css('height', targetHeight);
	        }

	    };

	    Slick.prototype.setOption =
	    Slick.prototype.slickSetOption = function() {

	        /**
	         * accepts arguments in format of:
	         *
	         *  - for changing a single option's value:
	         *     .slick("setOption", option, value, refresh )
	         *
	         *  - for changing a set of responsive options:
	         *     .slick("setOption", 'responsive', [{}, ...], refresh )
	         *
	         *  - for updating multiple values at once (not responsive)
	         *     .slick("setOption", { 'option': value, ... }, refresh )
	         */

	        var _ = this, l, item, option, value, refresh = false, type;

	        if( $.type( arguments[0] ) === 'object' ) {

	            option =  arguments[0];
	            refresh = arguments[1];
	            type = 'multiple';

	        } else if ( $.type( arguments[0] ) === 'string' ) {

	            option =  arguments[0];
	            value = arguments[1];
	            refresh = arguments[2];

	            if ( arguments[0] === 'responsive' && $.type( arguments[1] ) === 'array' ) {

	                type = 'responsive';

	            } else if ( typeof arguments[1] !== 'undefined' ) {

	                type = 'single';

	            }

	        }

	        if ( type === 'single' ) {

	            _.options[option] = value;


	        } else if ( type === 'multiple' ) {

	            $.each( option , function( opt, val ) {

	                _.options[opt] = val;

	            });


	        } else if ( type === 'responsive' ) {

	            for ( item in value ) {

	                if( $.type( _.options.responsive ) !== 'array' ) {

	                    _.options.responsive = [ value[item] ];

	                } else {

	                    l = _.options.responsive.length-1;

	                    // loop through the responsive object and splice out duplicates.
	                    while( l >= 0 ) {

	                        if( _.options.responsive[l].breakpoint === value[item].breakpoint ) {

	                            _.options.responsive.splice(l,1);

	                        }

	                        l--;

	                    }

	                    _.options.responsive.push( value[item] );

	                }

	            }

	        }

	        if ( refresh ) {

	            _.unload();
	            _.reinit();

	        }

	    };

	    Slick.prototype.setPosition = function() {

	        var _ = this;

	        _.setDimensions();

	        _.setHeight();

	        if (_.options.fade === false) {
	            _.setCSS(_.getLeft(_.currentSlide));
	        } else {
	            _.setFade();
	        }

	        _.$slider.trigger('setPosition', [_]);

	    };

	    Slick.prototype.setProps = function() {

	        var _ = this,
	            bodyStyle = document.body.style;

	        _.positionProp = _.options.vertical === true ? 'top' : 'left';

	        if (_.positionProp === 'top') {
	            _.$slider.addClass('slick-vertical');
	        } else {
	            _.$slider.removeClass('slick-vertical');
	        }

	        if (bodyStyle.WebkitTransition !== undefined ||
	            bodyStyle.MozTransition !== undefined ||
	            bodyStyle.msTransition !== undefined) {
	            if (_.options.useCSS === true) {
	                _.cssTransitions = true;
	            }
	        }

	        if ( _.options.fade ) {
	            if ( typeof _.options.zIndex === 'number' ) {
	                if( _.options.zIndex < 3 ) {
	                    _.options.zIndex = 3;
	                }
	            } else {
	                _.options.zIndex = _.defaults.zIndex;
	            }
	        }

	        if (bodyStyle.OTransform !== undefined) {
	            _.animType = 'OTransform';
	            _.transformType = '-o-transform';
	            _.transitionType = 'OTransition';
	            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
	        }
	        if (bodyStyle.MozTransform !== undefined) {
	            _.animType = 'MozTransform';
	            _.transformType = '-moz-transform';
	            _.transitionType = 'MozTransition';
	            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;
	        }
	        if (bodyStyle.webkitTransform !== undefined) {
	            _.animType = 'webkitTransform';
	            _.transformType = '-webkit-transform';
	            _.transitionType = 'webkitTransition';
	            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
	        }
	        if (bodyStyle.msTransform !== undefined) {
	            _.animType = 'msTransform';
	            _.transformType = '-ms-transform';
	            _.transitionType = 'msTransition';
	            if (bodyStyle.msTransform === undefined) _.animType = false;
	        }
	        if (bodyStyle.transform !== undefined && _.animType !== false) {
	            _.animType = 'transform';
	            _.transformType = 'transform';
	            _.transitionType = 'transition';
	        }
	        _.transformsEnabled = _.options.useTransform && (_.animType !== null && _.animType !== false);
	    };


	    Slick.prototype.setSlideClasses = function(index) {

	        var _ = this,
	            centerOffset, allSlides, indexOffset, remainder;

	        allSlides = _.$slider
	            .find('.slick-slide')
	            .removeClass('slick-active slick-center slick-current')
	            .attr('aria-hidden', 'true');

	        _.$slides
	            .eq(index)
	            .addClass('slick-current');

	        if (_.options.centerMode === true) {

	            var evenCoef = _.options.slidesToShow % 2 === 0 ? 1 : 0;

	            centerOffset = Math.floor(_.options.slidesToShow / 2);

	            if (_.options.infinite === true) {

	                if (index >= centerOffset && index <= (_.slideCount - 1) - centerOffset) {
	                    _.$slides
	                        .slice(index - centerOffset + evenCoef, index + centerOffset + 1)
	                        .addClass('slick-active')
	                        .attr('aria-hidden', 'false');

	                } else {

	                    indexOffset = _.options.slidesToShow + index;
	                    allSlides
	                        .slice(indexOffset - centerOffset + 1 + evenCoef, indexOffset + centerOffset + 2)
	                        .addClass('slick-active')
	                        .attr('aria-hidden', 'false');

	                }

	                if (index === 0) {

	                    allSlides
	                        .eq(allSlides.length - 1 - _.options.slidesToShow)
	                        .addClass('slick-center');

	                } else if (index === _.slideCount - 1) {

	                    allSlides
	                        .eq(_.options.slidesToShow)
	                        .addClass('slick-center');

	                }

	            }

	            _.$slides
	                .eq(index)
	                .addClass('slick-center');

	        } else {

	            if (index >= 0 && index <= (_.slideCount - _.options.slidesToShow)) {

	                _.$slides
	                    .slice(index, index + _.options.slidesToShow)
	                    .addClass('slick-active')
	                    .attr('aria-hidden', 'false');

	            } else if (allSlides.length <= _.options.slidesToShow) {

	                allSlides
	                    .addClass('slick-active')
	                    .attr('aria-hidden', 'false');

	            } else {

	                remainder = _.slideCount % _.options.slidesToShow;
	                indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;

	                if (_.options.slidesToShow == _.options.slidesToScroll && (_.slideCount - index) < _.options.slidesToShow) {

	                    allSlides
	                        .slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder)
	                        .addClass('slick-active')
	                        .attr('aria-hidden', 'false');

	                } else {

	                    allSlides
	                        .slice(indexOffset, indexOffset + _.options.slidesToShow)
	                        .addClass('slick-active')
	                        .attr('aria-hidden', 'false');

	                }

	            }

	        }

	        if (_.options.lazyLoad === 'ondemand' || _.options.lazyLoad === 'anticipated') {
	            _.lazyLoad();
	        }
	    };

	    Slick.prototype.setupInfinite = function() {

	        var _ = this,
	            i, slideIndex, infiniteCount;

	        if (_.options.fade === true) {
	            _.options.centerMode = false;
	        }

	        if (_.options.infinite === true && _.options.fade === false) {

	            slideIndex = null;

	            if (_.slideCount > _.options.slidesToShow) {

	                if (_.options.centerMode === true) {
	                    infiniteCount = _.options.slidesToShow + 1;
	                } else {
	                    infiniteCount = _.options.slidesToShow;
	                }

	                for (i = _.slideCount; i > (_.slideCount -
	                        infiniteCount); i -= 1) {
	                    slideIndex = i - 1;
	                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
	                        .attr('data-slick-index', slideIndex - _.slideCount)
	                        .prependTo(_.$slideTrack).addClass('slick-cloned');
	                }
	                for (i = 0; i < infiniteCount  + _.slideCount; i += 1) {
	                    slideIndex = i;
	                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
	                        .attr('data-slick-index', slideIndex + _.slideCount)
	                        .appendTo(_.$slideTrack).addClass('slick-cloned');
	                }
	                _.$slideTrack.find('.slick-cloned').find('[id]').each(function() {
	                    $(this).attr('id', '');
	                });

	            }

	        }

	    };

	    Slick.prototype.interrupt = function( toggle ) {

	        var _ = this;

	        if( !toggle ) {
	            _.autoPlay();
	        }
	        _.interrupted = toggle;

	    };

	    Slick.prototype.selectHandler = function(event) {

	        var _ = this;

	        var targetElement =
	            $(event.target).is('.slick-slide') ?
	                $(event.target) :
	                $(event.target).parents('.slick-slide');

	        var index = parseInt(targetElement.attr('data-slick-index'));

	        if (!index) index = 0;

	        if (_.slideCount <= _.options.slidesToShow) {

	            _.slideHandler(index, false, true);
	            return;

	        }

	        _.slideHandler(index);

	    };

	    Slick.prototype.slideHandler = function(index, sync, dontAnimate) {

	        var targetSlide, animSlide, oldSlide, slideLeft, targetLeft = null,
	            _ = this, navTarget;

	        sync = sync || false;

	        if (_.animating === true && _.options.waitForAnimate === true) {
	            return;
	        }

	        if (_.options.fade === true && _.currentSlide === index) {
	            return;
	        }

	        if (sync === false) {
	            _.asNavFor(index);
	        }

	        targetSlide = index;
	        targetLeft = _.getLeft(targetSlide);
	        slideLeft = _.getLeft(_.currentSlide);

	        _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

	        if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {
	            if (_.options.fade === false) {
	                targetSlide = _.currentSlide;
	                if (dontAnimate !== true) {
	                    _.animateSlide(slideLeft, function() {
	                        _.postSlide(targetSlide);
	                    });
	                } else {
	                    _.postSlide(targetSlide);
	                }
	            }
	            return;
	        } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > (_.slideCount - _.options.slidesToScroll))) {
	            if (_.options.fade === false) {
	                targetSlide = _.currentSlide;
	                if (dontAnimate !== true) {
	                    _.animateSlide(slideLeft, function() {
	                        _.postSlide(targetSlide);
	                    });
	                } else {
	                    _.postSlide(targetSlide);
	                }
	            }
	            return;
	        }

	        if ( _.options.autoplay ) {
	            clearInterval(_.autoPlayTimer);
	        }

	        if (targetSlide < 0) {
	            if (_.slideCount % _.options.slidesToScroll !== 0) {
	                animSlide = _.slideCount - (_.slideCount % _.options.slidesToScroll);
	            } else {
	                animSlide = _.slideCount + targetSlide;
	            }
	        } else if (targetSlide >= _.slideCount) {
	            if (_.slideCount % _.options.slidesToScroll !== 0) {
	                animSlide = 0;
	            } else {
	                animSlide = targetSlide - _.slideCount;
	            }
	        } else {
	            animSlide = targetSlide;
	        }

	        _.animating = true;

	        _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);

	        oldSlide = _.currentSlide;
	        _.currentSlide = animSlide;

	        _.setSlideClasses(_.currentSlide);

	        if ( _.options.asNavFor ) {

	            navTarget = _.getNavTarget();
	            navTarget = navTarget.slick('getSlick');

	            if ( navTarget.slideCount <= navTarget.options.slidesToShow ) {
	                navTarget.setSlideClasses(_.currentSlide);
	            }

	        }

	        _.updateDots();
	        _.updateArrows();

	        if (_.options.fade === true) {
	            if (dontAnimate !== true) {

	                _.fadeSlideOut(oldSlide);

	                _.fadeSlide(animSlide, function() {
	                    _.postSlide(animSlide);
	                });

	            } else {
	                _.postSlide(animSlide);
	            }
	            _.animateHeight();
	            return;
	        }

	        if (dontAnimate !== true) {
	            _.animateSlide(targetLeft, function() {
	                _.postSlide(animSlide);
	            });
	        } else {
	            _.postSlide(animSlide);
	        }

	    };

	    Slick.prototype.startLoad = function() {

	        var _ = this;

	        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

	            _.$prevArrow.hide();
	            _.$nextArrow.hide();

	        }

	        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

	            _.$dots.hide();

	        }

	        _.$slider.addClass('slick-loading');

	    };

	    Slick.prototype.swipeDirection = function() {

	        var xDist, yDist, r, swipeAngle, _ = this;

	        xDist = _.touchObject.startX - _.touchObject.curX;
	        yDist = _.touchObject.startY - _.touchObject.curY;
	        r = Math.atan2(yDist, xDist);

	        swipeAngle = Math.round(r * 180 / Math.PI);
	        if (swipeAngle < 0) {
	            swipeAngle = 360 - Math.abs(swipeAngle);
	        }

	        if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
	            return (_.options.rtl === false ? 'left' : 'right');
	        }
	        if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
	            return (_.options.rtl === false ? 'left' : 'right');
	        }
	        if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
	            return (_.options.rtl === false ? 'right' : 'left');
	        }
	        if (_.options.verticalSwiping === true) {
	            if ((swipeAngle >= 35) && (swipeAngle <= 135)) {
	                return 'down';
	            } else {
	                return 'up';
	            }
	        }

	        return 'vertical';

	    };

	    Slick.prototype.swipeEnd = function(event) {

	        var _ = this,
	            slideCount,
	            direction;

	        _.dragging = false;
	        _.swiping = false;

	        if (_.scrolling) {
	            _.scrolling = false;
	            return false;
	        }

	        _.interrupted = false;
	        _.shouldClick = ( _.touchObject.swipeLength > 10 ) ? false : true;

	        if ( _.touchObject.curX === undefined ) {
	            return false;
	        }

	        if ( _.touchObject.edgeHit === true ) {
	            _.$slider.trigger('edge', [_, _.swipeDirection() ]);
	        }

	        if ( _.touchObject.swipeLength >= _.touchObject.minSwipe ) {

	            direction = _.swipeDirection();

	            switch ( direction ) {

	                case 'left':
	                case 'down':

	                    slideCount =
	                        _.options.swipeToSlide ?
	                            _.checkNavigable( _.currentSlide + _.getSlideCount() ) :
	                            _.currentSlide + _.getSlideCount();

	                    _.currentDirection = 0;

	                    break;

	                case 'right':
	                case 'up':

	                    slideCount =
	                        _.options.swipeToSlide ?
	                            _.checkNavigable( _.currentSlide - _.getSlideCount() ) :
	                            _.currentSlide - _.getSlideCount();

	                    _.currentDirection = 1;

	                    break;

	                default:


	            }

	            if( direction != 'vertical' ) {

	                _.slideHandler( slideCount );
	                _.touchObject = {};
	                _.$slider.trigger('swipe', [_, direction ]);

	            }

	        } else {

	            if ( _.touchObject.startX !== _.touchObject.curX ) {

	                _.slideHandler( _.currentSlide );
	                _.touchObject = {};

	            }

	        }

	    };

	    Slick.prototype.swipeHandler = function(event) {

	        var _ = this;

	        if ((_.options.swipe === false) || ('ontouchend' in document && _.options.swipe === false)) {
	            return;
	        } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
	            return;
	        }

	        _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ?
	            event.originalEvent.touches.length : 1;

	        _.touchObject.minSwipe = _.listWidth / _.options
	            .touchThreshold;

	        if (_.options.verticalSwiping === true) {
	            _.touchObject.minSwipe = _.listHeight / _.options
	                .touchThreshold;
	        }

	        switch (event.data.action) {

	            case 'start':
	                _.swipeStart(event);
	                break;

	            case 'move':
	                _.swipeMove(event);
	                break;

	            case 'end':
	                _.swipeEnd(event);
	                break;

	        }

	    };

	    Slick.prototype.swipeMove = function(event) {

	        var _ = this,
	            edgeWasHit = false,
	            curLeft, swipeDirection, swipeLength, positionOffset, touches, verticalSwipeLength;

	        touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

	        if (!_.dragging || _.scrolling || touches && touches.length !== 1) {
	            return false;
	        }

	        curLeft = _.getLeft(_.currentSlide);

	        _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
	        _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;

	        _.touchObject.swipeLength = Math.round(Math.sqrt(
	            Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));

	        verticalSwipeLength = Math.round(Math.sqrt(
	            Math.pow(_.touchObject.curY - _.touchObject.startY, 2)));

	        if (!_.options.verticalSwiping && !_.swiping && verticalSwipeLength > 4) {
	            _.scrolling = true;
	            return false;
	        }

	        if (_.options.verticalSwiping === true) {
	            _.touchObject.swipeLength = verticalSwipeLength;
	        }

	        swipeDirection = _.swipeDirection();

	        if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
	            _.swiping = true;
	            event.preventDefault();
	        }

	        positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);
	        if (_.options.verticalSwiping === true) {
	            positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
	        }


	        swipeLength = _.touchObject.swipeLength;

	        _.touchObject.edgeHit = false;

	        if (_.options.infinite === false) {
	            if ((_.currentSlide === 0 && swipeDirection === 'right') || (_.currentSlide >= _.getDotCount() && swipeDirection === 'left')) {
	                swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
	                _.touchObject.edgeHit = true;
	            }
	        }

	        if (_.options.vertical === false) {
	            _.swipeLeft = curLeft + swipeLength * positionOffset;
	        } else {
	            _.swipeLeft = curLeft + (swipeLength * (_.$list.height() / _.listWidth)) * positionOffset;
	        }
	        if (_.options.verticalSwiping === true) {
	            _.swipeLeft = curLeft + swipeLength * positionOffset;
	        }

	        if (_.options.fade === true || _.options.touchMove === false) {
	            return false;
	        }

	        if (_.animating === true) {
	            _.swipeLeft = null;
	            return false;
	        }

	        _.setCSS(_.swipeLeft);

	    };

	    Slick.prototype.swipeStart = function(event) {

	        var _ = this,
	            touches;

	        _.interrupted = true;

	        if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
	            _.touchObject = {};
	            return false;
	        }

	        if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
	            touches = event.originalEvent.touches[0];
	        }

	        _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
	        _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;

	        _.dragging = true;

	    };

	    Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function() {

	        var _ = this;

	        if (_.$slidesCache !== null) {

	            _.unload();

	            _.$slideTrack.children(this.options.slide).detach();

	            _.$slidesCache.appendTo(_.$slideTrack);

	            _.reinit();

	        }

	    };

	    Slick.prototype.unload = function() {

	        var _ = this;

	        $('.slick-cloned', _.$slider).remove();

	        if (_.$dots) {
	            _.$dots.remove();
	        }

	        if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
	            _.$prevArrow.remove();
	        }

	        if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
	            _.$nextArrow.remove();
	        }

	        _.$slides
	            .removeClass('slick-slide slick-active slick-visible slick-current')
	            .attr('aria-hidden', 'true')
	            .css('width', '');

	    };

	    Slick.prototype.unslick = function(fromBreakpoint) {

	        var _ = this;
	        _.$slider.trigger('unslick', [_, fromBreakpoint]);
	        _.destroy();

	    };

	    Slick.prototype.updateArrows = function() {

	        var _ = this,
	            centerOffset;

	        centerOffset = Math.floor(_.options.slidesToShow / 2);

	        if ( _.options.arrows === true &&
	            _.slideCount > _.options.slidesToShow &&
	            !_.options.infinite ) {

	            _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
	            _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

	            if (_.currentSlide === 0) {

	                _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
	                _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

	            } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {

	                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
	                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

	            } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {

	                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
	                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

	            }

	        }

	    };

	    Slick.prototype.updateDots = function() {

	        var _ = this;

	        if (_.$dots !== null) {

	            _.$dots
	                .find('li')
	                    .removeClass('slick-active')
	                    .end();

	            _.$dots
	                .find('li')
	                .eq(Math.floor(_.currentSlide / _.options.slidesToScroll))
	                .addClass('slick-active');

	        }

	    };

	    Slick.prototype.visibility = function() {

	        var _ = this;

	        if ( _.options.autoplay ) {

	            if ( document[_.hidden] ) {

	                _.interrupted = true;

	            } else {

	                _.interrupted = false;

	            }

	        }

	    };

	    $.fn.slick = function() {
	        var _ = this,
	            opt = arguments[0],
	            args = Array.prototype.slice.call(arguments, 1),
	            l = _.length,
	            i,
	            ret;
	        for (i = 0; i < l; i++) {
	            if (typeof opt == 'object' || typeof opt == 'undefined')
	                _[i].slick = new Slick(_[i], opt);
	            else
	                ret = _[i].slick[opt].apply(_[i].slick, args);
	            if (typeof ret != 'undefined') return ret;
	        }
	        return _;
	    };

	}));



/*
* perfect-scrollbar - v0.4.9
*
* http://noraesae.github.com/perfect-scrollbar/
* Copyright (c) 2014 Hyeonje Jun;
*
*/

	(function(e) {
	    "use strict";
	    "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof exports ? e(require("jquery")) : e(jQuery)
	})(function(e) {
	    "use strict";
	    var t = {
	            wheelSpeed: 10,
	            wheelPropagation: !1,
	            minScrollbarLength: null,
	            useBothWheelAxes: !1,
	            useKeyboard: !0,
	            suppressScrollX: !1,
	            suppressScrollY: !1,
	            scrollXMarginOffset: 0,
	            scrollYMarginOffset: 0,
	            includePadding: !1
	        },
	        n = function() {
	            var e = 0;
	            return function() {
	                var t = e;
	                return e += 1, ".perfect-scrollbar-" + t
	            }
	        }();
	    e.fn.perfectScrollbar = function(o, r) {
	        return this.each(function() {
	            var l = e.extend(!0, {}, t),
	                a = e(this);
	            if ("object" == typeof o ? e.extend(!0, l, o) : r = o, "update" === r) return a.data("perfect-scrollbar-update") && a.data("perfect-scrollbar-update")(), a;
	            if ("destroy" === r) return a.data("perfect-scrollbar-destroy") && a.data("perfect-scrollbar-destroy")(), a;
	            if (a.data("perfect-scrollbar")) return a.data("perfect-scrollbar");
	            a.addClass("ps-container");
	            var s, i, c, u, d, p, f, h, v, g, b = e("<div class='ps-scrollbar-x-rail'></div>").appendTo(a),
	                m = e("<div class='ps-scrollbar-y-rail'></div>").appendTo(a),
	                w = e("<div class='ps-scrollbar-x'></div>").appendTo(b),
	                T = e("<div class='ps-scrollbar-y'></div>").appendTo(m),
	                y = parseInt(b.css("bottom"), 10),
	                L = parseInt(m.css("right"), 10),
	                S = n(),
	                x = function(e, t) {
	                    var n = e + t,
	                        o = u - v;
	                    g = 0 > n ? 0 : n > o ? o : n;
	                    var r = parseInt(g * (p - u) / (u - v), 10);
	                    a.scrollTop(r), b.css({
	                        bottom: y - r
	                    })
	                },
	                M = function(e, t) {
	                    var n = e + t,
	                        o = c - f;
	                    h = 0 > n ? 0 : n > o ? o : n;
	                    var r = parseInt(h * (d - c) / (c - f), 10);
	                    a.scrollLeft(r), m.css({
	                        right: L - r
	                    })
	                },
	                P = function(e) {
	                    return l.minScrollbarLength && (e = Math.max(e, l.minScrollbarLength)), e
	                },
	                X = function() {
	                    b.css({
	                        left: a.scrollLeft(),
	                        bottom: y - a.scrollTop(),
	                        width: c,
	                        display: s ? "inherit" : "none"
	                    }), m.css({
	                        top: a.scrollTop(),
	                        right: L - a.scrollLeft(),
	                        height: u,
	                        display: i ? "inherit" : "none"
	                    }), w.css({
	                        left: h,
	                        width: f
	                    }), T.css({
	                        top: g,
	                        height: v
	                    })
	                },
	                D = function() {
	                    c = l.includePadding ? a.innerWidth() : a.width(), u = l.includePadding ? a.innerHeight() : a.height(), d = a.prop("scrollWidth"), p = a.prop("scrollHeight"), !l.suppressScrollX && d > c + l.scrollXMarginOffset ? (s = !0, f = P(parseInt(c * c / d, 10)), h = parseInt(a.scrollLeft() * (c - f) / (d - c), 10)) : (s = !1, f = 0, h = 0, a.scrollLeft(0)), !l.suppressScrollY && p > u + l.scrollYMarginOffset ? (i = !0, v = P(parseInt(u * u / p, 10)), g = parseInt(a.scrollTop() * (u - v) / (p - u), 10)) : (i = !1, v = 0, g = 0, a.scrollTop(0)), g >= u - v && (g = u - v), h >= c - f && (h = c - f), X()
	                },
	                I = function() {
	                    var t, n;
	                    w.bind("mousedown" + S, function(e) {
	                        n = e.pageX, t = w.position().left, b.addClass("in-scrolling"), e.stopPropagation(), e.preventDefault()
	                    }), e(document).bind("mousemove" + S, function(e) {
	                        b.hasClass("in-scrolling") && (M(t, e.pageX - n), e.stopPropagation(), e.preventDefault())
	                    }), e(document).bind("mouseup" + S, function() {
	                        b.hasClass("in-scrolling") && b.removeClass("in-scrolling")
	                    }), t = n = null
	                },
	                Y = function() {
	                    var t, n;
	                    T.bind("mousedown" + S, function(e) {
	                        n = e.pageY, t = T.position().top, m.addClass("in-scrolling"), e.stopPropagation(), e.preventDefault()
	                    }), e(document).bind("mousemove" + S, function(e) {
	                        m.hasClass("in-scrolling") && (x(t, e.pageY - n), e.stopPropagation(), e.preventDefault())
	                    }), e(document).bind("mouseup" + S, function() {
	                        m.hasClass("in-scrolling") && m.removeClass("in-scrolling")
	                    }), t = n = null
	                },
	                k = function(e, t) {
	                    var n = a.scrollTop();
	                    if (0 === e) {
	                        if (!i) return !1;
	                        if (0 === n && t > 0 || n >= p - u && 0 > t) return !l.wheelPropagation
	                    }
	                    var o = a.scrollLeft();
	                    if (0 === t) {
	                        if (!s) return !1;
	                        if (0 === o && 0 > e || o >= d - c && e > 0) return !l.wheelPropagation
	                    }
	                    return !0
	                },
	                C = function() {
	                    l.wheelSpeed /= 10;
	                    var e = !1;
	                    a.bind("mousewheel" + S, function(t, n, o, r) {
	                        var c = t.deltaX * t.deltaFactor || o,
	                            u = t.deltaY * t.deltaFactor || r;
	                        e = !1, l.useBothWheelAxes ? i && !s ? (u ? a.scrollTop(a.scrollTop() - u * l.wheelSpeed) : a.scrollTop(a.scrollTop() + c * l.wheelSpeed), e = !0) : s && !i && (c ? a.scrollLeft(a.scrollLeft() + c * l.wheelSpeed) : a.scrollLeft(a.scrollLeft() - u * l.wheelSpeed), e = !0) : (a.scrollTop(a.scrollTop() - u * l.wheelSpeed), a.scrollLeft(a.scrollLeft() + c * l.wheelSpeed)), D(), e = e || k(c, u), e && (t.stopPropagation(), t.preventDefault())
	                    }), a.bind("MozMousePixelScroll" + S, function(t) {
	                        e && t.preventDefault()
	                    })
	                },
	                j = function() {
	                    var t = !1;
	                    a.bind("mouseenter" + S, function() {
	                        t = !0
	                    }), a.bind("mouseleave" + S, function() {
	                        t = !1
	                    });
	                    var n = !1;
	                    e(document).bind("keydown" + S, function(o) {
	                        if (t && !e(document.activeElement).is(":input,[contenteditable]")) {
	                            var r = 0,
	                                l = 0;
	                            switch (o.which) {
	                                case 37:
	                                    r = -30;
	                                    break;
	                                case 38:
	                                    l = 30;
	                                    break;
	                                case 39:
	                                    r = 30;
	                                    break;
	                                case 40:
	                                    l = -30;
	                                    break;
	                                case 33:
	                                    l = 90;
	                                    break;
	                                case 32:
	                                case 34:
	                                    l = -90;
	                                    break;
	                                case 35:
	                                    l = -u;
	                                    break;
	                                case 36:
	                                    l = u;
	                                    break;
	                                default:
	                                    return
	                            }
	                            a.scrollTop(a.scrollTop() - l), a.scrollLeft(a.scrollLeft() + r), n = k(r, l), n && o.preventDefault()
	                        }
	                    })
	                },
	                O = function() {
	                    var e = function(e) {
	                        e.stopPropagation()
	                    };
	                    T.bind("click" + S, e), m.bind("click" + S, function(e) {
	                        var t = parseInt(v / 2, 10),
	                            n = e.pageY - m.offset().top - t,
	                            o = u - v,
	                            r = n / o;
	                        0 > r ? r = 0 : r > 1 && (r = 1), a.scrollTop((p - u) * r)
	                    }), w.bind("click" + S, e), b.bind("click" + S, function(e) {
	                        var t = parseInt(f / 2, 10),
	                            n = e.pageX - b.offset().left - t,
	                            o = c - f,
	                            r = n / o;
	                        0 > r ? r = 0 : r > 1 && (r = 1), a.scrollLeft((d - c) * r)
	                    })
	                },
	                E = function() {
	                    var t = function(e, t) {
	                            a.scrollTop(a.scrollTop() - t), a.scrollLeft(a.scrollLeft() - e), D()
	                        },
	                        n = {},
	                        o = 0,
	                        r = {},
	                        l = null,
	                        s = !1;
	                    e(window).bind("touchstart" + S, function() {
	                        s = !0
	                    }), e(window).bind("touchend" + S, function() {
	                        s = !1
	                    }), a.bind("touchstart" + S, function(e) {
	                        var t = e.originalEvent.targetTouches[0];
	                        n.pageX = t.pageX, n.pageY = t.pageY, o = (new Date).getTime(), null !== l && clearInterval(l), e.stopPropagation()
	                    }), a.bind("touchmove" + S, function(e) {
	                        if (!s && 1 === e.originalEvent.targetTouches.length) {
	                            var l = e.originalEvent.targetTouches[0],
	                                a = {};
	                            a.pageX = l.pageX, a.pageY = l.pageY;
	                            var i = a.pageX - n.pageX,
	                                c = a.pageY - n.pageY;
	                            t(i, c), n = a;
	                            var u = (new Date).getTime(),
	                                d = u - o;
	                            d > 0 && (r.x = i / d, r.y = c / d, o = u), e.preventDefault()
	                        }
	                    }), a.bind("touchend" + S, function() {
	                        clearInterval(l), l = setInterval(function() {
	                            return .01 > Math.abs(r.x) && .01 > Math.abs(r.y) ? (clearInterval(l), void 0) : (t(30 * r.x, 30 * r.y), r.x *= .8, r.y *= .8, void 0)
	                        }, 10)
	                    })
	                },
	                H = function() {
	                    a.bind("scroll" + S, function() {
	                        D()
	                    })
	                },
	                A = function() {
	                    a.unbind(S), e(window).unbind(S), e(document).unbind(S), a.data("perfect-scrollbar", null), a.data("perfect-scrollbar-update", null), a.data("perfect-scrollbar-destroy", null), w.remove(), T.remove(), b.remove(), m.remove(), w = T = c = u = d = p = f = h = y = v = g = L = null
	                },
	                W = function(t) {
	                    a.addClass("ie").addClass("ie" + t);
	                    var n = function() {
	                            var t = function() {
	                                    e(this).addClass("hover")
	                                },
	                                n = function() {
	                                    e(this).removeClass("hover")
	                                };
	                            a.bind("mouseenter" + S, t).bind("mouseleave" + S, n), b.bind("mouseenter" + S, t).bind("mouseleave" + S, n), m.bind("mouseenter" + S, t).bind("mouseleave" + S, n), w.bind("mouseenter" + S, t).bind("mouseleave" + S, n), T.bind("mouseenter" + S, t).bind("mouseleave" + S, n)
	                        },
	                        o = function() {
	                            X = function() {
	                                w.css({
	                                    left: h + a.scrollLeft(),
	                                    bottom: y,
	                                    width: f
	                                }), T.css({
	                                    top: g + a.scrollTop(),
	                                    right: L,
	                                    height: v
	                                }), w.hide().show(), T.hide().show()
	                            }
	                        };
	                    6 === t && (n(), o())
	                },
	                q = "ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch,
	                F = function() {
	                    var e = navigator.userAgent.toLowerCase().match(/(msie) ([\w.]+)/);
	                    e && "msie" === e[1] && W(parseInt(e[2], 10)), D(), H(), I(), Y(), O(), q && E(), a.mousewheel && C(), l.useKeyboard && j(), a.data("perfect-scrollbar", a), a.data("perfect-scrollbar-update", D), a.data("perfect-scrollbar-destroy", A)
	                };
	            return F(), a
	        })
	    }
	}),
	function(e) {
	    "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof exports ? module.exports = e : e(jQuery)
	}(function(e) {
	    function t(t) {
	        var a = t || window.event,
	            s = i.call(arguments, 1),
	            c = 0,
	            u = 0,
	            d = 0,
	            p = 0;
	        if (t = e.event.fix(a), t.type = "mousewheel", "detail" in a && (d = -1 * a.detail), "wheelDelta" in a && (d = a.wheelDelta), "wheelDeltaY" in a && (d = a.wheelDeltaY), "wheelDeltaX" in a && (u = -1 * a.wheelDeltaX), "axis" in a && a.axis === a.HORIZONTAL_AXIS && (u = -1 * d, d = 0), c = 0 === d ? u : d, "deltaY" in a && (d = -1 * a.deltaY, c = d), "deltaX" in a && (u = a.deltaX, 0 === d && (c = -1 * u)), 0 !== d || 0 !== u) {
	            if (1 === a.deltaMode) {
	                var f = e.data(this, "mousewheel-line-height");
	                c *= f, d *= f, u *= f
	            } else if (2 === a.deltaMode) {
	                var h = e.data(this, "mousewheel-page-height");
	                c *= h, d *= h, u *= h
	            }
	            return p = Math.max(Math.abs(d), Math.abs(u)), (!l || l > p) && (l = p, o(a, p) && (l /= 40)), o(a, p) && (c /= 40, u /= 40, d /= 40), c = Math[c >= 1 ? "floor" : "ceil"](c / l), u = Math[u >= 1 ? "floor" : "ceil"](u / l), d = Math[d >= 1 ? "floor" : "ceil"](d / l), t.deltaX = u, t.deltaY = d, t.deltaFactor = l, t.deltaMode = 0, s.unshift(t, c, u, d), r && clearTimeout(r), r = setTimeout(n, 200), (e.event.dispatch || e.event.handle).apply(this, s)
	        }
	    }

	    function n() {
	        l = null
	    }

	    function o(e, t) {
	        return u.settings.adjustOldDeltas && "mousewheel" === e.type && 0 === t % 120
	    }
	    var r, l, a = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
	        s = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
	        i = Array.prototype.slice;
	    if (e.event.fixHooks)
	        for (var c = a.length; c;) e.event.fixHooks[a[--c]] = e.event.mouseHooks;
	    var u = e.event.special.mousewheel = {
	        version: "3.1.9",
	        setup: function() {
	            if (this.addEventListener)
	                for (var n = s.length; n;) this.addEventListener(s[--n], t, !1);
	            else this.onmousewheel = t;
	            e.data(this, "mousewheel-line-height", u.getLineHeight(this)), e.data(this, "mousewheel-page-height", u.getPageHeight(this))
	        },
	        teardown: function() {
	            if (this.removeEventListener)
	                for (var e = s.length; e;) this.removeEventListener(s[--e], t, !1);
	            else this.onmousewheel = null
	        },
	        getLineHeight: function(t) {
	            return parseInt(e(t)["offsetParent" in e.fn ? "offsetParent" : "parent"]().css("fontSize"), 10)
	        },
	        getPageHeight: function(t) {
	            return e(t).height()
	        },
	        settings: {
	            adjustOldDeltas: !0
	        }
	    };
	    e.fn.extend({
	        mousewheel: function(e) {
	            return e ? this.bind("mousewheel", e) : this.trigger("mousewheel")
	        },
	        unmousewheel: function(e) {
	            return this.unbind("mousewheel", e)
	        }
	    })
	});

/*
 Sticky-kit v1.1.2 | WTFPL | Leaf Corcoran 2015 | http://leafo.net
*/

	(function() {
	  var $, win;

	  $ = this.jQuery || window.jQuery;

	  win = $(window);

	  $.fn.stick_in_parent = function(opts) {
	    var doc, elm, enable_bottoming, fn, i, inner_scrolling, len, manual_spacer, offset_top, parent_selector, recalc_every, sticky_class;
	    if (opts == null) {
	      opts = {};
	    }
	    sticky_class = opts.sticky_class, inner_scrolling = opts.inner_scrolling, recalc_every = opts.recalc_every, parent_selector = opts.parent, offset_top = opts.offset_top, manual_spacer = opts.spacer, enable_bottoming = opts.bottoming;
	    if (offset_top == null) {
	      offset_top = 0;
	    }
	    if (parent_selector == null) {
	      parent_selector = void 0;
	    }
	    if (inner_scrolling == null) {
	      inner_scrolling = true;
	    }
	    if (sticky_class == null) {
	      sticky_class = "is_stuck";
	    }
	    doc = $(document);
	    if (enable_bottoming == null) {
	      enable_bottoming = true;
	    }
	    fn = function(elm, padding_bottom, parent_top, parent_height, top, height, el_float, detached) {
	      var bottomed, detach, fixed, last_pos, last_scroll_height, offset, parent, recalc, recalc_and_tick, recalc_counter, spacer, tick;
	      if (elm.data("sticky_kit")) {
	        return;
	      }
	      elm.data("sticky_kit", true);
	      last_scroll_height = doc.height();
	      parent = elm.parent();
	      if (parent_selector != null) {
	        parent = parent.closest(parent_selector);
	      }
	      if (!parent.length) {
	        throw "failed to find stick parent";
	      }
	      fixed = false;
	      bottomed = false;
	      spacer = manual_spacer != null ? manual_spacer && elm.closest(manual_spacer) : $("<div />");
	      if (spacer) {
	        spacer.css('position', elm.css('position'));
	      }
	      recalc = function() {
	        var border_top, padding_top, restore;
	        if (detached) {
	          return;
	        }
	        last_scroll_height = doc.height();
	        border_top = parseInt(parent.css("border-top-width"), 10);
	        padding_top = parseInt(parent.css("padding-top"), 10);
	        padding_bottom = parseInt(parent.css("padding-bottom"), 10);
	        parent_top = parent.offset().top + border_top + padding_top;
	        parent_height = parent.height();
	        if (fixed) {
	          fixed = false;
	          bottomed = false;
	          if (manual_spacer == null) {
	            elm.insertAfter(spacer);
	            spacer.detach();
	          }
	          elm.css({
	            position: "",
	            top: "",
	            width: "",
	            bottom: ""
	          }).removeClass(sticky_class);
	          restore = true;
	        }
	        top = elm.offset().top - (parseInt(elm.css("margin-top"), 10) || 0) - offset_top;
	        height = elm.outerHeight(true);
	        el_float = elm.css("float");
	        if (spacer) {
	          spacer.css({
	            width: elm.outerWidth(true),
	            height: height,
	            display: elm.css("display"),
	            "vertical-align": elm.css("vertical-align"),
	            "float": el_float
	          });
	        }
	        if (restore) {
	          return tick();
	        }
	      };
	      recalc();
	      if (height === parent_height) {
	        return;
	      }
	      last_pos = void 0;
	      offset = offset_top;
	      recalc_counter = recalc_every;
	      tick = function() {
	        var css, delta, recalced, scroll, will_bottom, win_height;
	        if (detached) {
	          return;
	        }
	        recalced = false;
	        if (recalc_counter != null) {
	          recalc_counter -= 1;
	          if (recalc_counter <= 0) {
	            recalc_counter = recalc_every;
	            recalc();
	            recalced = true;
	          }
	        }
	        if (!recalced && doc.height() !== last_scroll_height) {
	          recalc();
	          recalced = true;
	        }
	        scroll = win.scrollTop();
	        if (last_pos != null) {
	          delta = scroll - last_pos;
	        }
	        last_pos = scroll;
	        if (fixed) {
	          if (enable_bottoming) {
	            will_bottom = scroll + height + offset > parent_height + parent_top;
	            if (bottomed && !will_bottom) {
	              bottomed = false;
	              elm.css({
	                position: "fixed",
	                bottom: "",
	                top: offset
	              }).trigger("sticky_kit:unbottom");
	            }
	          }
	          if (scroll < top) {
	            fixed = false;
	            offset = offset_top;
	            if (manual_spacer == null) {
	              if (el_float === "left" || el_float === "right") {
	                elm.insertAfter(spacer);
	              }
	              spacer.detach();
	            }
	            css = {
	              position: "",
	              width: "",
	              top: ""
	            };
	            elm.css(css).removeClass(sticky_class).trigger("sticky_kit:unstick");
	          }
	          if (inner_scrolling) {
	            win_height = win.height();
	            if (height + offset_top > win_height) {
	              if (!bottomed) {
	                offset -= delta;
	                offset = Math.max(win_height - height, offset);
	                offset = Math.min(offset_top, offset);
	                if (fixed) {
	                  elm.css({
	                    top: offset + "px"
	                  });
	                }
	              }
	            }
	          }
	        } else {
	          if (scroll > top) {
	            fixed = true;
	            css = {
	              position: "fixed",
	              top: offset
	            };
	            css.width = elm.css("box-sizing") === "border-box" ? elm.outerWidth() + "px" : elm.width() + "px";
	            elm.css(css).addClass(sticky_class);
	            if (manual_spacer == null) {
	              elm.after(spacer);
	              if (el_float === "left" || el_float === "right") {
	                spacer.append(elm);
	              }
	            }
	            elm.trigger("sticky_kit:stick");
	          }
	        }
	        if (fixed && enable_bottoming) {
	          if (will_bottom == null) {
	            will_bottom = scroll + height + offset > parent_height + parent_top;
	          }
	          if (!bottomed && will_bottom) {
	            bottomed = true;
	            if (parent.css("position") === "static") {
	              parent.css({
	                position: "relative"
	              });
	            }
	            return elm.css({
	              position: "absolute",
	              bottom: padding_bottom,
	              top: "auto"
	            }).trigger("sticky_kit:bottom");
	          }
	        }
	      };
	      recalc_and_tick = function() {
	        recalc();
	        return tick();
	      };
	      detach = function() {
	        detached = true;
	        win.off("touchmove", tick);
	        win.off("scroll", tick);
	        win.off("resize", recalc_and_tick);
	        $(document.body).off("sticky_kit:recalc", recalc_and_tick);
	        elm.off("sticky_kit:detach", detach);
	        elm.removeData("sticky_kit");
	        elm.css({
	          position: "",
	          bottom: "",
	          top: "",
	          width: ""
	        });
	        parent.position("position", "");
	        if (fixed) {
	          if (manual_spacer == null) {
	            if (el_float === "left" || el_float === "right") {
	              elm.insertAfter(spacer);
	            }
	            spacer.remove();
	          }
	          return elm.removeClass(sticky_class);
	        }
	      };
	      win.on("touchmove", tick);
	      win.on("scroll", tick);
	      win.on("resize", recalc_and_tick);
	      $(document.body).on("sticky_kit:recalc", recalc_and_tick);
	      elm.on("sticky_kit:detach", detach);
	      return setTimeout(tick, 0);
	    };
	    for (i = 0, len = this.length; i < len; i++) {
	      elm = this[i];
	      fn($(elm));
	    }
	    return this;
	  };

	}).call(this);
;$ = jQuery;

jQuery(document).ready(function( $ ) {
	"use strict";

/*
** Main Navigation =====
*/
	// Navigation Hover
	$('#top-menu, #main-menu').find('li').on('mouseenter', function() {
		$(this).children('.sub-menu').stop().fadeIn( 200 );
	}).on('mouseleave', function() {
		$(this).children('.sub-menu').stop().fadeOut( 200 );
	});

	// Mobile Menu
	$('.mobile-menu-btn').on( 'click', function() {
		$('.mobile-menu-container').slideToggle();
	});

	// Responsive Menu 
	$( '#mobile-menu .menu-item-has-children' ).prepend( '<div class="sub-menu-btn"></div>' );
	$( '#mobile-menu .sub-menu' ).before( '<span class="sub-menu-btn-icon"><i class="fa fa-angle-down"></i></span>' );

	// Responsive sub-menu btn
	$('.sub-menu-btn').click(function(){
		$(this).closest('li').children('.sub-menu').slideToggle();
		$(this).closest('li').children('.sub-menu-btn-icon').children('i').toggleClass( 'fa-rotate-270' );
	});

	// Search Form
	$('.main-nav-icons').after($('.main-nav-search #searchform').remove());
	var mainNavSearch = $('#main-nav #searchform');
	
	mainNavSearch.find('#s').attr( 'placeholder', mainNavSearch.find('#s').data('placeholder') );

	$('.main-nav-search').click(function() {
		if ( mainNavSearch.css('display') === 'none' ) {
			mainNavSearch.show();
			$('.main-nav-search i:last-of-type').show();
			$('.main-nav-search i:first-of-type').hide();
			$('.dark-mode-switcher').css('visibility', 'hidden');
		} else {
			mainNavSearch.hide();
			$('.main-nav-search i:last-of-type').hide();
			$('.main-nav-search i:first-of-type').show();
			$('.dark-mode-switcher').css('visibility', 'visible');
		}
	});


/*
** Featured Slider =====
*/
	var RTL = false;
	if( $('html').attr('dir') == 'rtl' ) {
	RTL = true;
	}

	$('#featured-slider').slick({
		prevArrow: '<span class="prev-arrow icon-left-open-big"></span>',
		nextArrow: '<span class="next-arrow icon-right-open-big"></span>',
		dotsClass: 'slider-dots',
		adaptiveHeight: true,
		rtl: RTL,
		speed: 750,
  		customPaging: function(slider, i) {
            return '';
        }
	});


/*
** Single Navigation =====
*/

	var singleNav 	 = $('.single-navigation'),
		headerHeight = $('#page-header').outerHeight();

	$(window).scroll(function() {
		if ( $(this).scrollTop() > headerHeight ) {
			singleNav.fadeIn();
		} else {
			singleNav.fadeOut();
		}
	});


/*
** Sidebars =====
*/

	// Sidebar Alt Scroll
	$('.sidebar-alt').perfectScrollbar({
		suppressScrollX : true,
		includePadding : true,
		wheelSpeed: 3.5
	});

	// Sidebar Alt
	$('.main-nav-sidebar').on('click', function () {
		$('.sidebar-alt').css( 'left','0' );
		$('.sidebar-alt-close').fadeIn( 500 );
	});

	// Sidebar Alt Close
	function asheAltSidebarClose() {
		var leftPosition = parseInt( $( ".sidebar-alt" ).outerWidth(), 10 ) + 30;
		$('.sidebar-alt').css( 'left','-'+ leftPosition +'px' );
		$('.sidebar-alt-close').fadeOut( 500 );
	}
	
	$('.sidebar-alt-close, .sidebar-alt-close-btn').on('click', function () {
		asheAltSidebarClose();
	});


/*
** Scroll Top Button =====
*/

	$('.scrolltop').on( 'click', function() {
		$('html, body').animate( { scrollTop : 0 }, 800 );
		return false;
	});

	$( window ).on( 'scroll', function() {
		if ($(this).scrollTop() >= 800 ) {
			$('.scrolltop').fadeIn(350);
		} else {
			$('.scrolltop').fadeOut(350);
		}
	});


/*
** Dark Mode
*/
	var darkModeSwitcher = $('.dark-mode-switcher');

	if ( darkModeSwitcher.length === 1 ) {
		var boxedBackground = '';

		if ( $('body').hasClass('ashe-boxed-style') ) {
			boxedBackground = '.featured-slider-area #featured-slider,#featured-links,.category-description,.author-description,.comments-area,article.post,article.blog-post,.single .related-posts,.page-content article.page,.sidebar-left .ashe-widget,.sidebar-right .ashe-widget,.page-footer-inner,.blog-pagination,main#main{background:#333!important}';
		}

		var darkModeCSS = '<style id="ashe_dark_mode">.cssload-cube { background: #fff; !important}body{background: #222222 !important;}.mc4wp-form-fields,.widget_wysija_cont{background-color:#272727!important}#top-bar{background-color:#111}#top-bar a{color:#fff}#top-menu .sub-menu,#top-menu .sub-menu a{background-color:#111;border-color:rgba(0,0,0,0.35)}#main-nav{background-color:#111;box-shadow:0 1px 5px rgba(0,0,0,0.3)}#featured-links h6{background-color:rgba(34,34,34,0.85);color:#c4c4c4}#main-nav a,#main-nav i,#main-nav #s{color:#fff}.main-nav-sidebar span,.sidebar-alt-close-btn span{background-color:#fff}#main-menu .sub-menu,#main-menu .sub-menu a{background-color:#111;border-color:rgba(0,0,0,0.35)}#main-nav #s{background-color:#111}#main-nav #s::-webkit-input-placeholder{color:rgba(0,0,0,0.3)}#main-nav #s::-moz-placeholder{color:rgba(0,0,0,0.3)}#main-nav #s:-ms-input-placeholder{color:rgba(0,0,0,0.3)}#main-nav #s:-moz-placeholder{color:rgba(0,0,0,0.3)}.sidebar-alt,#featured-links,.main-content,.featured-slider-area,.page-content select,.page-content input,.page-content textarea{background-color:#222}.page-content,.page-content select,.page-content input,.page-content textarea,.page-content .post-author a,.page-content .ashe-widget a,.page-content .comment-author{color:#c4c4c4}.page-content h1,.page-content h2,.page-content h3,.page-content h4,.page-content h5,.page-content h6,.page-content .post-title a,.page-content .author-description h4 a,.page-content .related-posts h4 a,.page-content .blog-pagination .previous-page a,.page-content .blog-pagination .next-page a,blockquote,.page-content .post-share a{color:#fff}.page-content .post-title a:hover{color:rgba(255,255,255,0.75)}.page-content .post-date,.page-content .post-comments,.page-content .post-author,.page-content [data-layout*="list"] .post-author a,.page-content .related-post-date,.page-content .comment-meta a,.page-content .author-share a,.page-content .post-tags a,.page-content .tagcloud a,.widget_categories li,.widget_archive li,.ahse-subscribe-box p,.rpwwt-post-author,.rpwwt-post-categories,.rpwwt-post-date,.rpwwt-post-comments-number{color:#9e9e9e}.page-content input::-webkit-input-placeholder{color:#9e9e9e}.page-content input::-moz-placeholder{color:#9e9e9e}.page-content input:-ms-input-placeholder{color:#9e9e9e}.page-content input:-moz-placeholder{color:#9e9e9e}.ashe-boxed-style #searchform i{background:#ccc;color:#222}.widget_search i,.widget_search #searchsubmit,.single-navigation i,.page-content .submit,.page-content .blog-pagination.numeric a,.page-content .blog-pagination.load-more a,.page-content .ashe-subscribe-box input[type="submit"],.page-content .widget_wysija input[type="submit"],.page-content .post-password-form input[type="submit"],.page-content .wpcf7 [type="submit"]{color:#c4c4c4;background-color:#333}.ashe-boxed-style .page-content .blog-pagination.numeric a,.ashe-boxed-style.woocommerce .page-content .woocommerce-pagination ul li a { background: #272727; }.image-overlay,#infscr-loading,.page-content h4.image-overlay{background-color:rgba(0,0,0,0.3)}#page-footer,#page-footer select,#page-footer input,#page-footer textarea,.select2-container--default .select2-selection--single{background-color:#222}#page-footer,#page-footer a,#page-footer select,#page-footer input,#page-footer textarea{color:#c4c4c4}#page-footer #s::-webkit-input-placeholder{color:#c4c4c4}#page-footer #s::-moz-placeholder{color:#c4c4c4}#page-footer #s:-ms-input-placeholder{color:#c4c4c4}#page-footer #s:-moz-placeholder{color:#c4c4c4}#page-footer h1,#page-footer h2,#page-footer h3,#page-footer h4,#page-footer h5,#page-footer h6{color:#fff}.ashe-preloader-wrap{background-color:#333}.woocommerce div.product .stock,.woocommerce div.product p.price,.woocommerce div.product span.price,.woocommerce ul.products li.product .price,.woocommerce-Reviews .woocommerce-review__author,.woocommerce form .form-row .required,.woocommerce form .form-row.woocommerce-invalid label,.woocommerce .page-content div.product .woocommerce-tabs ul.tabs li a{color:#c4c4c4}.woocommerce a.remove:hover{color:#c4c4c4!important}.woocommerce a.remove,.woocommerce .product_meta,.page-content .woocommerce-breadcrumb,.page-content .woocommerce-review-link,.page-content .woocommerce-breadcrumb a,.page-content .woocommerce-MyAccount-navigation-link a,.woocommerce .woocommerce-info:before,.woocommerce .page-content .woocommerce-result-count,.woocommerce-page .page-content .woocommerce-result-count,.woocommerce-Reviews .woocommerce-review__published-date,.woocommerce .product_list_widget .quantity,.woocommerce .widget_products .amount,.woocommerce .widget_price_filter .price_slider_amount,.woocommerce .widget_recently_viewed_products .amount,.woocommerce .widget_top_rated_products .amount,.woocommerce .widget_recent_reviews .reviewer{color:#9e9e9e}.woocommerce a.remove{color:#9e9e9e!important}.woocommerce-cart #payment,#add_payment_method #payment,.woocommerce-checkout #payment,.woocommerce .woocommerce-info,.woocommerce .woocommerce-error,.woocommerce .woocommerce-message,.woocommerce div.product .woocommerce-tabs ul.tabs li{background-color:rgba(56,56,56,0.3)!important}.woocommerce-cart #payment div.payment_box::before,#add_payment_method #payment div.payment_box::before,.woocommerce-checkout #payment div.payment_box::before{border-color:rgba(56,56,56,0.5)}.woocommerce-cart #payment div.payment_box,#add_payment_method #payment div.payment_box,.woocommerce-checkout #payment div.payment_box{background-color:rgba(56,56,56,0.5)}.page-content .woocommerce input.button,.page-content .woocommerce a.button,.page-content .woocommerce a.button.alt,.page-content .woocommerce button.button.alt,.page-content .woocommerce input.button.alt,.page-content .woocommerce #respond input#submit.alt,.woocommerce .page-content .widget_product_search input[type="submit"],.woocommerce .page-content .woocommerce-message .button,.woocommerce .page-content a.button.alt,.woocommerce .page-content button.button.alt,.woocommerce .page-content #respond input#submit,.woocommerce .page-content .widget_price_filter .button,.woocommerce .page-content .woocommerce-message .button,.woocommerce-page .page-content .woocommerce-message .button,.woocommerce .page-content nav.woocommerce-pagination ul li a,.woocommerce .page-content nav.woocommerce-pagination ul li span{color:#c4c4c4;background-color:#333}.woocommerce .page-content nav.woocommerce-pagination ul li a.prev,.woocommerce .page-content nav.woocommerce-pagination ul li a.next{color:#333}.woocommerce .page-content nav.woocommerce-pagination ul li a.prev:after,.woocommerce .page-content nav.woocommerce-pagination ul li a.next:after{color:#fff}.woocommerce .page-content nav.woocommerce-pagination ul li a.prev:hover:after,.woocommerce .page-content nav.woocommerce-pagination ul li a.next:hover:after{color:#fff}.ashe-dropcaps .post-content>p:first-of-type:first-letter{color:#fff!important}.sticky{background:#2f2f2f}body.ashe-dark-mode img{filter:brightness(.8) contrast(1.2)}.widget-title h2:before,.widget-title h2:after{border-color:#969696!important}::-webkit-input-placeholder{color:#c4c4c4!important}:-ms-input-placeholder{color:#c4c4c4!important}::placeholder{color:#c4c4c4!important}#page-footer{background:#333}.woocommerce form.login,.woocommerce form.register,.woocommerce-account fieldset,.woocommerce form.checkout_coupon,.woocommerce .woocommerce-info,.woocommerce .woocommerce-error,.woocommerce .woocommerce-message,.woocommerce .widget_shopping_cart .total,.woocommerce.widget_shopping_cart .total,.woocommerce-Reviews .comment_container,.woocommerce-cart #payment ul.payment_methods,#add_payment_method #payment ul.payment_methods,.woocommerce-checkout #payment ul.payment_methods,.woocommerce div.product .woocommerce-tabs ul.tabs::before,.woocommerce div.product .woocommerce-tabs ul.tabs::after,.woocommerce div.product .woocommerce-tabs ul.tabs li,.woocommerce .woocommerce-MyAccount-navigation-link,.select2-container--default .select2-selection--single,.page-content .post-footer,[data-layout*="list"] .blog-grid>li,.page-content .author-description,.page-content .related-posts,.page-content .entry-comments,.page-content .ashe-widget li,.page-content #wp-calendar,.page-content #wp-calendar caption,.page-content #wp-calendar tbody td,.page-content .widget_nav_menu li a,.page-content .tagcloud a,.page-content select,.page-content input,.page-content textarea,.widget-title h2:before,.widget-title h2:after,.post-tags a,.gallery-caption,.wp-caption-text,table tr,table th,table td,pre,.category-description,#page-footer a,#page-footer .ashe-widget li,#page-footer #wp-calendar,#page-footer #wp-calendar caption,#page-footer #wp-calendar tbody td,#page-footer .widget_nav_menu li a,#page-footer select,#page-footer input,#page-footer textarea,#page-footer .widget-title h2:before,#page-footer .widget-title h2:after,.footer-widgets{border-color:#6d6d6d}hr,#page-footer hr{background-color:#6d6d6d}.ashe-boxed-style .page-content .woocommerce .wc-proceed-to-checkout a.button,.ashe-boxed-style.woocommerce .page-content button.button.alt,.page-content .woocommerce button.button.alt,.ashe-boxed-style .page-content .submit{background:#222}.ashe-boxed-style.woocommerce .woocommerce-message,.ashe-boxed-style .woocommerce .woocommerce-notice,.ashe-boxed-style .woocommerce-form-coupon-toggle .woocommerce-info,.ashe-boxed-style.woocommerce .woocommerce-error,.ashe-boxed-style.woocommerce .page-content #respond input#submit{color:#ccc;background:#222!important}.woocommerce table.shop_table{border-color:#6d6d6d}.woocommerce table.shop_table td,#add_payment_method .cart-collaterals .cart_totals tr td,#add_payment_method .cart-collaterals .cart_totals tr th,.woocommerce-cart .cart-collaterals .cart_totals tr td,.woocommerce-cart .cart-collaterals .cart_totals tr th,.woocommerce-checkout .cart-collaterals .cart_totals tr td,.woocommerce-checkout .cart-collaterals .cart_totals tr th,.woocommerce table.shop_table tfoot th{border-color:#6d6d6d!important}.ashe-boxed-style .related-posts,.ashe-boxed-style .author-description { border-bottom: 0;}.post-content > p:first-of-type:first-letter { color: #c4c4c4 !important;}#main-menu .sub-menu a,#top-menu .sub-menu a{border-color:rgba(255,255,255,0.15)}.ashe-dropcaps .post-content>p:first-of-type:first-letter{color:#fff!important}.woocommerce .woocommerce-message,.woocommerce .woocommerce-notice,.woocommerce-form-coupon-toggle .woocommerce-info,.woocommerce .woocommerce-error,.woocommerce .page-content #respond input#submit{color:#c4c4c4;border-color:#848383}'+ boxedBackground +'</style>';

		darkModeSwitcher.on( 'click', function() {
			var body = $( 'body' );

			if ( body.hasClass( 'ashe-dark-mode' ) ) {
				body.removeClass( 'ashe-dark-mode' );
				localStorage.setItem( 'asheDarkMode', 'off' );

				// Remove
				darkModeSwitcher.find('i').removeAttr('class').addClass('fa fa-moon-o');
				$('style#ashe_dark_mode').remove();
			} else {
				body.addClass( 'ashe-dark-mode' );
				localStorage.setItem( 'asheDarkMode', 'on' );

				// Apply
				darkModeSwitcher.find('i').removeAttr('class').addClass('fa fa-sun-o');
				$('head').append( darkModeCSS );
			}
		});

		// Apply on Load
		if ( 'on' === localStorage.getItem('asheDarkMode') ) {
			$( 'body' ).addClass( 'ashe-dark-mode' );
			darkModeSwitcher.find('i').removeAttr('class').addClass('fa fa-sun-o');
			$('head').append( darkModeCSS );
		}

	} else {
		if ( 'on' === localStorage.getItem('asheDarkMode') ) {
			localStorage.setItem( 'asheDarkMode', 'off' );
		}
	}
	


/*
** Window Resize =====
*/

	$( window ).on( 'resize', function() {

		if ( $('.mobile-menu-btn').css('display') === 'none' ) {
			$( '.mobile-menu-container' ).css({ 'display' : 'none' });
		}
		
		asheStickySidebar();

		asheAltSidebarClose();
	});


/*
** Run Functions =====
*/
	// FitVids
	$('.slider-item, .post-media').fitVids();



}); // end dom ready


/*
** Window Load =====
*/
jQuery( window ).on( 'load', function() {
	asheStickySidebar();
	ashePreloader();
});


/*
** Global Functions =====
*/
	// Preloader
	function ashePreloader() {

		if ( $('.ashe-preloader-wrap').length ) {
			setTimeout(function(){
				$('.ashe-preloader-wrap > div').fadeOut( 600 );
				$('.ashe-preloader-wrap').fadeOut( 1500 );
			}, 300);

			if ( $('body').hasClass('elementor-editor-active') ) {
				setTimeout(function(){
					$('.ashe-preloader-wrap > div').fadeOut( 600 );
					$('.ashe-preloader-wrap').fadeOut( 1500 );
				}, 300);
			}
		}

	}

	// Sticky Sidebar
	function asheStickySidebar() {
		if ( $( '.main-content' ).data('sidebar-sticky') === 1 ) {		
			var SidebarOffset = 0;

			if ( $("#main-nav").attr( 'data-fixed' ) === '1' ) {
				SidebarOffset = 40;
			}

			$('.sidebar-left,.sidebar-right').stick_in_parent({
				parent: ".main-content",
				offset_top: SidebarOffset,
				spacer: '.sidebar-left-wrap,.sidebar-right-wrap'
			});

			if ( $('.mobile-menu-btn').css('display') !== 'none' ) {
				$('.sidebar-left,.sidebar-right').trigger("sticky_kit:detach");
			}
		}
	}
;(function($){
    $.fn.validationEngineLanguage = function(){
    };
    $.validationEngineLanguage = {
        newLang: function(){
            $.validationEngineLanguage.allRules = {
                "required": {
                    "regex": "none",
                    "alertText": "* Ce champ est requis",
                    "alertTextCheckboxMultiple": "* Choisir une option",
                    "alertTextCheckboxe": "* Cette option est requise"
                },
                "requiredInFunction": { 
                    "func": function(field, rules, i, options){
                        return (field.val() == "test") ? true : false;
                    },
                    "alertText": "* Field must equal test"
                },
               "minSize": {
                    "regex": "none",
                    "alertText": "* Minimum ",
                    "alertText2": " caractères requis"
                },
				"groupRequired": {
                    "regex": "none",
                    "alertText": "* Vous devez remplir un des champs suivant"
                },
                "maxSize": {
                    "regex": "none",
                    "alertText": "* Maximum ",
                    "alertText2": " caractères requis"
                },
		        "min": {
                    "regex": "none",
                    "alertText": "* Valeur minimum requise "
                },
                "max": {
                    "regex": "none",
                    "alertText": "* Valeur maximum requise "
                },
		        "past": {
                    "regex": "none",
                    "alertText": "* Date antérieure au "
                },
                "future": {
                    "regex": "none",
                    "alertText": "* Date postérieure au "
                },
                "maxCheckbox": {
                    "regex": "none",
                    "alertText": "* Nombre max de choix excédé"
                },
                "minCheckbox": {
                    "regex": "none",
                    "alertText": "* Veuillez choisir ",
                    "alertText2": " options"
                },
                "equals": {
                    "regex": "none",
                    "alertText": "* Votre champ n'est pas identique"
                },
                "creditCard": {
                    "regex": "none",
                    "alertText": "* Numéro de carte bancaire valide"
                },
                "phone": {
                    // credit: jquery.h5validate.js / orefalo
                    "regex": /^([\+][0-9]{1,3}([ \.\-])?)?([\(][0-9]{1,6}[\)])?([0-9 \.\-]{1,32})(([A-Za-z \:]{1,11})?[0-9]{1,4}?)$/,
                    "alertText": "* Numéro de téléphone invalide"
                },
                "email": {
                    // Shamelessly lifted from Scott Gonzalez via the Bassistance Validation plugin http://projects.scottsplayground.com/email_address_validation/
                    "regex": /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
                    "alertText": "* Adresse email invalide"
                },
                "integer": {
                    "regex": /^[\-\+]?\d+$/,
                    "alertText": "* Nombre entier invalide"
                },
                "number": {
                    // Number, including positive, negative, and floating decimal. credit: orefalo
                    "regex": /^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))?([\.]([0-9]+))?$/,
                    "alertText": "* Nombre flottant invalide"
                },
                "date": {
                    "regex": /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/,
                    "alertText": "* Date invalide, format YYYY-MM-DD requis"
                },
                "ipv4": {
                	"regex": /^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))[.]){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/,
                    "alertText": "* Adresse IP invalide"
                },
                "url": {
                    "regex": /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
                    "alertText": "* URL invalide"
                },
                "onlyNumberSp": {
                    "regex": /^[0-9\ ]+$/,
                    "alertText": "* Seuls les chiffres sont acceptés"
                },
                "onlyLetterSp": {
                    "regex": /^[a-zA-Z\u00C0-\u00D6\u00D9-\u00F6\u00F9-\u00FD\ \']+$/,
                    "alertText": "* Seules les lettres sont acceptées"
                },
                "onlyLetterNumber": {
                    "regex": /^[0-9a-zA-Z\u00C0-\u00D6\u00D9-\u00F6\u00F9-\u00FD]+$/,
                    "alertText": "* Aucun caractère spécial n'est accepté"
                },
				// --- CUSTOM RULES -- Those are specific to the demos, they can be removed or changed to your likings
                "ajaxUserCall": {
                    "url": "ajaxValidateFieldUser",
                    "extraData": "name=eric",
                    "alertTextLoad": "* Chargement, veuillez attendre",
                    "alertText": "* Ce nom est déjà pris"
                },
                "ajaxNameCall": {
                    "url": "ajaxValidateFieldName",
                    "alertText": "* Ce nom est déjà pris",
                    "alertTextOk": "*Ce nom est disponible",
                    "alertTextLoad": "* Chargement, veuillez attendre"
                },
                "validate2fields": {
                    "alertText": "Veuillez taper le mot HELLO"
                }
            };
        }
    };
    $.validationEngineLanguage.newLang();
})(jQuery);
;/*
 * Inline Form Validation Engine 2.6.2, jQuery plugin
 *
 * Copyright(c) 2010, Cedric Dugas
 * http://www.position-absolute.com
 *
 * 2.0 Rewrite by Olivier Refalo
 * http://www.crionics.com
 *
 * Form validation engine allowing custom regex rules to be added.
 * Licensed under the MIT License
 */
 (function($) {

	"use strict";

	var methods = {

		/**
		* Kind of the constructor, called before any action
		* @param {Map} user options
		*/
		init: function(options) {
			var form = this;
			if (!form.data('jqv') || form.data('jqv') == null ) {
				options = methods._saveOptions(form, options);
				// bind all formError elements to close on click
				$(document).on("click", ".formError", function() {
					$(this).fadeOut(150, function() {
						// remove prompt once invisible
						$(this).parent('.formErrorOuter').remove();
						$(this).remove();
					});
				});
			}
			return this;
		 },
		/**
		* Attachs jQuery.validationEngine to form.submit and field.blur events
		* Takes an optional params: a list of options
		* ie. jQuery("#formID1").validationEngine('attach', {promptPosition : "centerRight"});
		*/
		attach: function(userOptions) {

			var form = this;
			var options;

			if(userOptions)
				options = methods._saveOptions(form, userOptions);
			else
				options = form.data('jqv');

			options.validateAttribute = (form.find("[data-validation-engine*=validate]").length) ? "data-validation-engine" : "class";
			if (options.binded) {

				// delegate fields
				form.on(options.validationEventTrigger, "["+options.validateAttribute+"*=validate]:not([type=checkbox]):not([type=radio]):not(.datepicker)", methods._onFieldEvent);
				form.on("click", "["+options.validateAttribute+"*=validate][type=checkbox],["+options.validateAttribute+"*=validate][type=radio]", methods._onFieldEvent);
				form.on(options.validationEventTrigger,"["+options.validateAttribute+"*=validate][class*=datepicker]", {"delay": 300}, methods._onFieldEvent);
			}
			if (options.autoPositionUpdate) {
				$(window).bind("resize", {
					"noAnimation": true,
					"formElem": form
				}, methods.updatePromptsPosition);
			}
			form.on("click","a[data-validation-engine-skip], a[class*='validate-skip'], button[data-validation-engine-skip], button[class*='validate-skip'], input[data-validation-engine-skip], input[class*='validate-skip']", methods._submitButtonClick);
			form.removeData('jqv_submitButton');

			// bind form.submit
			form.on("submit", methods._onSubmitEvent);
			return this;
		},
		/**
		* Unregisters any bindings that may point to jQuery.validaitonEngine
		*/
		detach: function() {

			var form = this;
			var options = form.data('jqv');

			// unbind fields
			form.find("["+options.validateAttribute+"*=validate]").not("[type=checkbox]").off(options.validationEventTrigger, methods._onFieldEvent);
			form.find("["+options.validateAttribute+"*=validate][type=checkbox],[class*=validate][type=radio]").off("click", methods._onFieldEvent);

			// unbind form.submit
			form.off("submit", methods.onAjaxFormComplete);

			// unbind form.submit
			form.off("submit", methods.onAjaxFormComplete);
			form.removeData('jqv');

			form.off("click", "a[data-validation-engine-skip], a[class*='validate-skip'], button[data-validation-engine-skip], button[class*='validate-skip'], input[data-validation-engine-skip], input[class*='validate-skip']", methods._submitButtonClick);
			form.removeData('jqv_submitButton');

			if (options.autoPositionUpdate)
				$(window).unbind("resize", methods.updatePromptsPosition);

			return this;
		},
		/**
		* Validates either a form or a list of fields, shows prompts accordingly.
		* Note: There is no ajax form validation with this method, only field ajax validation are evaluated
		*
		* @return true if the form validates, false if it fails
		*/
		validate: function() {
			var element = $(this);
			var valid = null;

			if (element.is("form") || element.hasClass("validationEngineContainer")) {
				if (element.hasClass('validating')) {
					// form is already validating.
					// Should abort old validation and start new one. I don't know how to implement it.
					return false;
				} else {
					element.addClass('validating');
					var options = element.data('jqv');
					var valid = methods._validateFields(this);

					// If the form doesn't validate, clear the 'validating' class before the user has a chance to submit again
					setTimeout(function(){
						element.removeClass('validating');
					}, 100);
					if (valid && options.onSuccess) {
						options.onSuccess();
					} else if (!valid && options.onFailure) {
						options.onFailure();
					}
				}
			} else if (element.is('form') || element.hasClass('validationEngineContainer')) {
				element.removeClass('validating');
			} else {
				// field validation
				var form = element.closest('form, .validationEngineContainer'),
					options = (form.data('jqv')) ? form.data('jqv') : $.validationEngine.defaults,
					valid = methods._validateField(element, options);

				if (valid && options.onFieldSuccess)
					options.onFieldSuccess();
				else if (options.onFieldFailure && options.InvalidFields.length > 0) {
					options.onFieldFailure();
				}
			}
			if(options.onValidationComplete) {
				// !! ensures that an undefined return is interpreted as return false but allows a onValidationComplete() to possibly return true and have form continue processing
				return !!options.onValidationComplete(form, valid);
			}
			return valid;
		},
		/**
		*  Redraw prompts position, useful when you change the DOM state when validating
		*/
		updatePromptsPosition: function(event) {

			if (event && this == window) {
				var form = event.data.formElem;
				var noAnimation = event.data.noAnimation;
			}
			else
				var form = $(this.closest('form, .validationEngineContainer'));

			var options = form.data('jqv');
			// No option, take default one
			form.find('['+options.validateAttribute+'*=validate]').not(":disabled").each(function(){
				var field = $(this);
				if (options.prettySelect && field.is(":hidden"))
				  field = form.find("#" + options.usePrefix + field.attr('id') + options.useSuffix);
				var prompt = methods._getPrompt(field);
				var promptText = $(prompt).find(".formErrorContent").html();

				if(prompt)
					methods._updatePrompt(field, $(prompt), promptText, undefined, false, options, noAnimation);
			});
			return this;
		},
		/**
		* Displays a prompt on a element.
		* Note that the element needs an id!
		*
		* @param {String} promptText html text to display type
		* @param {String} type the type of bubble: 'pass' (green), 'load' (black) anything else (red)
		* @param {String} possible values topLeft, topRight, bottomLeft, centerRight, bottomRight
		*/
		showPrompt: function(promptText, type, promptPosition, showArrow) {
			var form = this.closest('form, .validationEngineContainer');
			var options = form.data('jqv');
			// No option, take default one
			if(!options)
				options = methods._saveOptions(this, options);
			if(promptPosition)
				options.promptPosition=promptPosition;
			options.showArrow = showArrow==true;

			methods._showPrompt(this, promptText, type, false, options);
			return this;
		},
		/**
		* Closes form error prompts, CAN be invidual
		*/
		hide: function() {
			 var form = $(this).closest('form, .validationEngineContainer');
			 var options = form.data('jqv');
			 var fadeDuration = (options && options.fadeDuration) ? options.fadeDuration : 0.3;
			 var closingtag;

			 if($(this).is("form") || $(this).hasClass("validationEngineContainer")) {
				 closingtag = "parentForm"+methods._getClassName($(this).attr("id"));
			 } else {
				 closingtag = methods._getClassName($(this).attr("id")) +"formError";
			 }
			 $('.'+closingtag).fadeTo(fadeDuration, 0.3, function() {
				 $(this).parent('.formErrorOuter').remove();
				 $(this).remove();
			 });
			 return this;
		 },
		 /**
		 * Closes all error prompts on the page
		 */
		 hideAll: function() {

			 var form = this;
			 var options = form.data('jqv');
			 var duration = options ? options.fadeDuration:300;
			 $('.formError').fadeTo(duration, 300, function() {
				 $(this).parent('.formErrorOuter').remove();
				 $(this).remove();
			 });
			 return this;
		 },
		/**
		* Typically called when user exists a field using tab or a mouse click, triggers a field
		* validation
		*/
		_onFieldEvent: function(event) {
			var field = $(this);
			var form = field.closest('form, .validationEngineContainer');
			var options = form.data('jqv');
			options.eventTrigger = "field";
			// validate the current field
			window.setTimeout(function() {
				methods._validateField(field, options);
				if (options.InvalidFields.length == 0 && options.onFieldSuccess) {
					options.onFieldSuccess();
				} else if (options.InvalidFields.length > 0 && options.onFieldFailure) {
					options.onFieldFailure();
				}
			}, (event.data) ? event.data.delay : 0);

		},
		/**
		* Called when the form is submited, shows prompts accordingly
		*
		* @param {jqObject}
		*            form
		* @return false if form submission needs to be cancelled
		*/
		_onSubmitEvent: function() {
			var form = $(this);
			var options = form.data('jqv');

			//check if it is trigger from skipped button
			if (form.data("jqv_submitButton")){
				var submitButton = $("#" + form.data("jqv_submitButton"));
				if (submitButton){
					if (submitButton.length > 0){
						if (submitButton.hasClass("validate-skip") || submitButton.attr("data-validation-engine-skip") == "true")
							return true;
					}
				}
			}

			options.eventTrigger = "submit";

			// validate each field
			// (- skip field ajax validation, not necessary IF we will perform an ajax form validation)
			var r=methods._validateFields(form);

			if (r && options.ajaxFormValidation) {
				methods._validateFormWithAjax(form, options);
				// cancel form auto-submission - process with async call onAjaxFormComplete
				return false;
			}

			if(options.onValidationComplete) {
				// !! ensures that an undefined return is interpreted as return false but allows a onValidationComplete() to possibly return true and have form continue processing
				return !!options.onValidationComplete(form, r);
			}
			return r;
		},
		/**
		* Return true if the ajax field validations passed so far
		* @param {Object} options
		* @return true, is all ajax validation passed so far (remember ajax is async)
		*/
		_checkAjaxStatus: function(options) {
			var status = true;
			$.each(options.ajaxValidCache, function(key, value) {
				if (!value) {
					status = false;
					// break the each
					return false;
				}
			});
			return status;
		},

		/**
		* Return true if the ajax field is validated
		* @param {String} fieldid
		* @param {Object} options
		* @return true, if validation passed, false if false or doesn't exist
		*/
		_checkAjaxFieldStatus: function(fieldid, options) {
			return options.ajaxValidCache[fieldid] == true;
		},
		/**
		* Validates form fields, shows prompts accordingly
		*
		* @param {jqObject}
		*            form
		* @param {skipAjaxFieldValidation}
		*            boolean - when set to true, ajax field validation is skipped, typically used when the submit button is clicked
		*
		* @return true if form is valid, false if not, undefined if ajax form validation is done
		*/
		_validateFields: function(form) {
			var options = form.data('jqv');

			// this variable is set to true if an error is found
			var errorFound = false;

			// Trigger hook, start validation
			form.trigger("jqv.form.validating");
			// first, evaluate status of non ajax fields
			var first_err=null;
			form.find('['+options.validateAttribute+'*=validate]').not(":disabled").each( function() {
				var field = $(this);
				var names = [];
				if ($.inArray(field.attr('name'), names) < 0) {
					errorFound |= methods._validateField(field, options);
					if (errorFound && first_err==null)
						if (field.is(":hidden") && options.prettySelect)
										 first_err = field = form.find("#" + options.usePrefix + methods._jqSelector(field.attr('id')) + options.useSuffix);
									else
										 first_err=field;
					if (options.doNotShowAllErrosOnSubmit)
						return false;
					names.push(field.attr('name'));

					//if option set, stop checking validation rules after one error is found
					if(options.showOneMessage == true && errorFound){
						return false;
					}
				}
			});

			// second, check to see if all ajax calls completed ok
			// errorFound |= !methods._checkAjaxStatus(options);

			// third, check status and scroll the container accordingly
			form.trigger("jqv.form.result", [errorFound]);

			if (errorFound) {
				if (options.scroll) {
					var destination=first_err.offset().top;
					var fixleft = first_err.offset().left;

					//prompt positioning adjustment support. Usage: positionType:Xshift,Yshift (for ex.: bottomLeft:+20 or bottomLeft:-20,+10)
					var positionType=options.promptPosition;
					if (typeof(positionType)=='string' && positionType.indexOf(":")!=-1)
						positionType=positionType.substring(0,positionType.indexOf(":"));

					if (positionType!="bottomRight" && positionType!="bottomLeft") {
						var prompt_err= methods._getPrompt(first_err);
						if (prompt_err) {
							destination=prompt_err.offset().top;
						}
					}

					// Offset the amount the page scrolls by an amount in px to accomodate fixed elements at top of page
					if (options.scrollOffset) {
						destination -= options.scrollOffset;
					}

					// get the position of the first error, there should be at least one, no need to check this
					//var destination = form.find(".formError:not('.greenPopup'):first").offset().top;
					if (options.isOverflown) {
						var overflowDIV = $(options.overflownDIV);
						if(!overflowDIV.length) return false;
						var scrollContainerScroll = overflowDIV.scrollTop();
						var scrollContainerPos = -parseInt(overflowDIV.offset().top);

						destination += scrollContainerScroll + scrollContainerPos - 5;
						var scrollContainer = $(options.overflownDIV + ":not(:animated)");

						scrollContainer.animate({ scrollTop: destination }, 1100, function(){
							if(options.focusFirstField) first_err.focus();
						});

					} else {
						$("html, body").animate({
							scrollTop: destination
						}, 1100, function(){
							if(options.focusFirstField) first_err.focus();
						});
						$("html, body").animate({scrollLeft: fixleft},1100)
					}

				} else if(options.focusFirstField)
					first_err.focus();
				return false;
			}
			return true;
		},
		/**
		* This method is called to perform an ajax form validation.
		* During this process all the (field, value) pairs are sent to the server which returns a list of invalid fields or true
		*
		* @param {jqObject} form
		* @param {Map} options
		*/
		_validateFormWithAjax: function(form, options) {

			var data = form.serialize();
									var type = (options.ajaxFormValidationMethod) ? options.ajaxFormValidationMethod : "GET";
			var url = (options.ajaxFormValidationURL) ? options.ajaxFormValidationURL : form.attr("action");
									var dataType = (options.dataType) ? options.dataType : "json";
			$.ajax({
				type: type,
				url: url,
				cache: false,
				dataType: dataType,
				data: data,
				form: form,
				methods: methods,
				options: options,
				beforeSend: function() {
					return options.onBeforeAjaxFormValidation(form, options);
				},
				error: function(data, transport) {
					methods._ajaxError(data, transport);
				},
				success: function(json) {
					if ((dataType == "json") && (json !== true)) {
						// getting to this case doesn't necessary means that the form is invalid
						// the server may return green or closing prompt actions
						// this flag helps figuring it out
						var errorInForm=false;
						for (var i = 0; i < json.length; i++) {
							var value = json[i];

							var errorFieldId = value[0];
							var errorField = $($("#" + errorFieldId)[0]);

							// make sure we found the element
							if (errorField.length == 1) {

								// promptText or selector
								var msg = value[2];
								// if the field is valid
								if (value[1] == true) {

									if (msg == ""  || !msg){
										// if for some reason, status==true and error="", just close the prompt
										methods._closePrompt(errorField);
									} else {
										// the field is valid, but we are displaying a green prompt
										if (options.allrules[msg]) {
											var txt = options.allrules[msg].alertTextOk;
											if (txt)
												msg = txt;
										}
										if (options.showPrompts) methods._showPrompt(errorField, msg, "pass", false, options, true);
									}
								} else {
									// the field is invalid, show the red error prompt
									errorInForm|=true;
									if (options.allrules[msg]) {
										var txt = options.allrules[msg].alertText;
										if (txt)
											msg = txt;
									}
									if(options.showPrompts) methods._showPrompt(errorField, msg, "", false, options, true);
								}
							}
						}
						options.onAjaxFormComplete(!errorInForm, form, json, options);
					} else
						options.onAjaxFormComplete(true, form, json, options);

				}
			});

		},
		/**
		* Validates field, shows prompts accordingly
		*
		* @param {jqObject}
		*            field
		* @param {Array[String]}
		*            field's validation rules
		* @param {Map}
		*            user options
		* @return false if field is valid (It is inversed for *fields*, it return false on validate and true on errors.)
		*/
		_validateField: function(field, options, skipAjaxValidation) {
			if (!field.attr("id")) {
				field.attr("id", "form-validation-field-" + $.validationEngine.fieldIdCounter);
				++$.validationEngine.fieldIdCounter;
			}

           if (!options.validateNonVisibleFields && (field.is(":hidden") && !options.prettySelect || field.parent().is(":hidden")))
				return false;

			var rulesParsing = field.attr(options.validateAttribute);
			var getRules = /validate\[(.*)\]/.exec(rulesParsing);

			if (!getRules)
				return false;
			var str = getRules[1];
			var rules = str.split(/\[|,|\]/);

			// true if we ran the ajax validation, tells the logic to stop messing with prompts
			var isAjaxValidator = false;
			var fieldName = field.attr("name");
			var promptText = "";
			var promptType = "";
			var required = false;
			var limitErrors = false;
			options.isError = false;
			options.showArrow = true;

			// If the programmer wants to limit the amount of error messages per field,
			if (options.maxErrorsPerField > 0) {
				limitErrors = true;
			}

			var form = $(field.closest("form, .validationEngineContainer"));
			// Fix for adding spaces in the rules
			for (var i = 0; i < rules.length; i++) {
				rules[i] = rules[i].replace(" ", "");
				// Remove any parsing errors
				if (rules[i] === '') {
					delete rules[i];
				}
			}

			for (var i = 0, field_errors = 0; i < rules.length; i++) {

				// If we are limiting errors, and have hit the max, break
				if (limitErrors && field_errors >= options.maxErrorsPerField) {
					// If we haven't hit a required yet, check to see if there is one in the validation rules for this
					// field and that it's index is greater or equal to our current index
					if (!required) {
						var have_required = $.inArray('required', rules);
						required = (have_required != -1 &&  have_required >= i);
					}
					break;
				}


				var errorMsg = undefined;
				switch (rules[i]) {

					case "required":
						required = true;
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._required);
						break;
					case "custom":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._custom);
						break;
					case "groupRequired":
						// Check is its the first of group, if not, reload validation with first field
						// AND continue normal validation on present field
						var classGroup = "["+options.validateAttribute+"*=" +rules[i + 1] +"]";
						var firstOfGroup = form.find(classGroup).eq(0);
						if(firstOfGroup[0] != field[0]){

							methods._validateField(firstOfGroup, options, skipAjaxValidation);
							options.showArrow = true;

						}
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._groupRequired);
						if(errorMsg)  required = true;
						options.showArrow = false;
						break;
					case "ajax":
						// AJAX defaults to returning it's loading message
						errorMsg = methods._ajax(field, rules, i, options);
						if (errorMsg) {
							promptType = "load";
						}
						break;
					case "minSize":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._minSize);
						break;
					case "maxSize":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._maxSize);
						break;
					case "min":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._min);
						break;
					case "max":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._max);
						break;
					case "past":
						errorMsg = methods._getErrorMessage(form, field,rules[i], rules, i, options, methods._past);
						break;
					case "future":
						errorMsg = methods._getErrorMessage(form, field,rules[i], rules, i, options, methods._future);
						break;
					case "dateRange":
						var classGroup = "["+options.validateAttribute+"*=" + rules[i + 1] + "]";
						options.firstOfGroup = form.find(classGroup).eq(0);
						options.secondOfGroup = form.find(classGroup).eq(1);

						//if one entry out of the pair has value then proceed to run through validation
						if (options.firstOfGroup[0].value || options.secondOfGroup[0].value) {
							errorMsg = methods._getErrorMessage(form, field,rules[i], rules, i, options, methods._dateRange);
						}
						if (errorMsg) required = true;
						options.showArrow = false;
						break;

					case "dateTimeRange":
						var classGroup = "["+options.validateAttribute+"*=" + rules[i + 1] + "]";
						options.firstOfGroup = form.find(classGroup).eq(0);
						options.secondOfGroup = form.find(classGroup).eq(1);

						//if one entry out of the pair has value then proceed to run through validation
						if (options.firstOfGroup[0].value || options.secondOfGroup[0].value) {
							errorMsg = methods._getErrorMessage(form, field,rules[i], rules, i, options, methods._dateTimeRange);
						}
						if (errorMsg) required = true;
						options.showArrow = false;
						break;
					case "maxCheckbox":
						field = $(form.find("input[name='" + fieldName + "']"));
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._maxCheckbox);
						break;
					case "minCheckbox":
						field = $(form.find("input[name='" + fieldName + "']"));
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._minCheckbox);
						break;
					case "equals":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._equals);
						break;
					case "funcCall":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._funcCall);
						break;
					case "creditCard":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._creditCard);
						break;
					case "condRequired":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._condRequired);
						if (errorMsg !== undefined) {
							required = true;
						}
						break;

					default:
				}

				var end_validation = false;

				// If we were passed back an message object, check what the status was to determine what to do
				if (typeof errorMsg == "object") {
					switch (errorMsg.status) {
						case "_break":
							end_validation = true;
							break;
						// If we have an error message, set errorMsg to the error message
						case "_error":
							errorMsg = errorMsg.message;
							break;
						// If we want to throw an error, but not show a prompt, return early with true
						case "_error_no_prompt":
							return true;
							break;
						// Anything else we continue on
						default:
							break;
					}
				}

				// If it has been specified that validation should end now, break
				if (end_validation) {
					break;
				}

				// If we have a string, that means that we have an error, so add it to the error message.
				if (typeof errorMsg == 'string') {
					promptText += errorMsg + "<br/>";
					options.isError = true;
					field_errors++;
				}
			}
			// If the rules required is not added, an empty field is not validated
			if(!required && !(field.val()) && field.val().length < 1) options.isError = false;

			// Hack for radio/checkbox group button, the validation go into the
			// first radio/checkbox of the group
			var fieldType = field.prop("type");
			var positionType=field.data("promptPosition") || options.promptPosition;

			if ((fieldType == "radio" || fieldType == "checkbox") && form.find("input[name='" + fieldName + "']").size() > 1) {
				if(positionType === 'inline') {
					field = $(form.find("input[name='" + fieldName + "'][type!=hidden]:last"));
				} else {
				field = $(form.find("input[name='" + fieldName + "'][type!=hidden]:first"));
				}
				options.showArrow = false;
			}

			if(field.is(":hidden") && options.prettySelect) {
				field = form.find("#" + options.usePrefix + methods._jqSelector(field.attr('id')) + options.useSuffix);
			}

			if (options.isError && options.showPrompts){
				methods._showPrompt(field, promptText, promptType, false, options);
			}else{
				if (!isAjaxValidator) methods._closePrompt(field);
			}

			if (!isAjaxValidator) {
				field.trigger("jqv.field.result", [field, options.isError, promptText]);
			}

			/* Record error */
			var errindex = $.inArray(field[0], options.InvalidFields);
			if (errindex == -1) {
				if (options.isError)
				options.InvalidFields.push(field[0]);
			} else if (!options.isError) {
				options.InvalidFields.splice(errindex, 1);
			}

			methods._handleStatusCssClasses(field, options);

			/* run callback function for each field */
			if (options.isError && options.onFieldFailure)
				options.onFieldFailure(field);

			if (!options.isError && options.onFieldSuccess)
				options.onFieldSuccess(field);

			return options.isError;
		},
		/**
		* Handling css classes of fields indicating result of validation
		*
		* @param {jqObject}
		*            field
		* @param {Array[String]}
		*            field's validation rules
		* @private
		*/
		_handleStatusCssClasses: function(field, options) {
			/* remove all classes */
			if(options.addSuccessCssClassToField)
				field.removeClass(options.addSuccessCssClassToField);

			if(options.addFailureCssClassToField)
				field.removeClass(options.addFailureCssClassToField);

			/* Add classes */
			if (options.addSuccessCssClassToField && !options.isError)
				field.addClass(options.addSuccessCssClassToField);

			if (options.addFailureCssClassToField && options.isError)
				field.addClass(options.addFailureCssClassToField);
		},

		 /********************
		  * _getErrorMessage
		  *
		  * @param form
		  * @param field
		  * @param rule
		  * @param rules
		  * @param i
		  * @param options
		  * @param originalValidationMethod
		  * @return {*}
		  * @private
		  */
		 _getErrorMessage:function (form, field, rule, rules, i, options, originalValidationMethod) {
			 // If we are using the custon validation type, build the index for the rule.
			 // Otherwise if we are doing a function call, make the call and return the object
			 // that is passed back.
	 		 var rule_index = jQuery.inArray(rule, rules);
			 if (rule === "custom" || rule === "funcCall") {
				 var custom_validation_type = rules[rule_index + 1];
				 rule = rule + "[" + custom_validation_type + "]";
				 // Delete the rule from the rules array so that it doesn't try to call the
			    // same rule over again
			    delete(rules[rule_index]);
			 }
			 // Change the rule to the composite rule, if it was different from the original
			 var alteredRule = rule;


			 var element_classes = (field.attr("data-validation-engine")) ? field.attr("data-validation-engine") : field.attr("class");
			 var element_classes_array = element_classes.split(" ");

			 // Call the original validation method. If we are dealing with dates or checkboxes, also pass the form
			 var errorMsg;
			 if (rule == "future" || rule == "past"  || rule == "maxCheckbox" || rule == "minCheckbox") {
				 errorMsg = originalValidationMethod(form, field, rules, i, options);
			 } else {
				 errorMsg = originalValidationMethod(field, rules, i, options);
			 }

			 // If the original validation method returned an error and we have a custom error message,
			 // return the custom message instead. Otherwise return the original error message.
			 if (errorMsg != undefined) {
				 var custom_message = methods._getCustomErrorMessage($(field), element_classes_array, alteredRule, options);
				 if (custom_message) errorMsg = custom_message;
			 }
			 return errorMsg;

		 },
		 _getCustomErrorMessage:function (field, classes, rule, options) {
			var custom_message = false;
			var validityProp = methods._validityProp[rule];
			 // If there is a validityProp for this rule, check to see if the field has an attribute for it
			if (validityProp != undefined) {
				custom_message = field.attr("data-errormessage-"+validityProp);
				// If there was an error message for it, return the message
				if (custom_message != undefined)
					return custom_message;
			}
			custom_message = field.attr("data-errormessage");
			 // If there is an inline custom error message, return it
			if (custom_message != undefined)
				return custom_message;
			var id = '#' + field.attr("id");
			// If we have custom messages for the element's id, get the message for the rule from the id.
			// Otherwise, if we have custom messages for the element's classes, use the first class message we find instead.
			if (typeof options.custom_error_messages[id] != "undefined" &&
				typeof options.custom_error_messages[id][rule] != "undefined" ) {
						  custom_message = options.custom_error_messages[id][rule]['message'];
			} else if (classes.length > 0) {
				for (var i = 0; i < classes.length && classes.length > 0; i++) {
					 var element_class = "." + classes[i];
					if (typeof options.custom_error_messages[element_class] != "undefined" &&
						typeof options.custom_error_messages[element_class][rule] != "undefined") {
							custom_message = options.custom_error_messages[element_class][rule]['message'];
							break;
					}
				}
			}
			if (!custom_message &&
				typeof options.custom_error_messages[rule] != "undefined" &&
				typeof options.custom_error_messages[rule]['message'] != "undefined"){
					 custom_message = options.custom_error_messages[rule]['message'];
			 }
			 return custom_message;
		 },
		 _validityProp: {
			 "required": "value-missing",
			 "custom": "custom-error",
			 "groupRequired": "value-missing",
			 "ajax": "custom-error",
			 "minSize": "range-underflow",
			 "maxSize": "range-overflow",
			 "min": "range-underflow",
			 "max": "range-overflow",
			 "past": "type-mismatch",
			 "future": "type-mismatch",
			 "dateRange": "type-mismatch",
			 "dateTimeRange": "type-mismatch",
			 "maxCheckbox": "range-overflow",
			 "minCheckbox": "range-underflow",
			 "equals": "pattern-mismatch",
			 "funcCall": "custom-error",
			 "creditCard": "pattern-mismatch",
			 "condRequired": "value-missing"
		 },
		/**
		* Required validation
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @param {bool} condRequired flag when method is used for internal purpose in condRequired check
		* @return an error string if validation failed
		*/
		_required: function(field, rules, i, options, condRequired) {
			switch (field.prop("type")) {
				case "text":
				case "password":
				case "textarea":
				case "file":
				case "select-one":
				case "select-multiple":
				default:
					var field_val      = $.trim( field.val()                               );
					var dv_placeholder = $.trim( field.attr("data-validation-placeholder") );
					var placeholder    = $.trim( field.attr("placeholder")                 );
					if (
						   ( !field_val                                    )
						|| ( dv_placeholder && field_val == dv_placeholder )
						|| ( placeholder    && field_val == placeholder    )
					) {
						return options.allrules[rules[i]].alertText;
					}
					break;
				case "radio":
				case "checkbox":
					// new validation style to only check dependent field
					if (condRequired) {
						if (!field.attr('checked')) {
							return options.allrules[rules[i]].alertTextCheckboxMultiple;
						}
						break;
					}
					// old validation style
					var form = field.closest("form, .validationEngineContainer");
					var name = field.attr("name");
					if (form.find("input[name='" + name + "']:checked").size() == 0) {
						if (form.find("input[name='" + name + "']:visible").size() == 1)
							return options.allrules[rules[i]].alertTextCheckboxe;
						else
							return options.allrules[rules[i]].alertTextCheckboxMultiple;
					}
					break;
			}
		},
		/**
		* Validate that 1 from the group field is required
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_groupRequired: function(field, rules, i, options) {
			var classGroup = "["+options.validateAttribute+"*=" +rules[i + 1] +"]";
			var isValid = false;
			// Check all fields from the group
			field.closest("form, .validationEngineContainer").find(classGroup).each(function(){
				if(!methods._required($(this), rules, i, options)){
					isValid = true;
					return false;
				}
			});

			if(!isValid) {
		  return options.allrules[rules[i]].alertText;
		}
		},
		/**
		* Validate rules
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_custom: function(field, rules, i, options) {
			var customRule = rules[i + 1];
			var rule = options.allrules[customRule];
			var fn;
			if(!rule) {
				alert("jqv:custom rule not found - "+customRule);
				return;
			}

			if(rule["regex"]) {
				 var ex=rule.regex;
					if(!ex) {
						alert("jqv:custom regex not found - "+customRule);
						return;
					}
					var pattern = new RegExp(ex);

					if (!pattern.test(field.val())) return options.allrules[customRule].alertText;

			} else if(rule["func"]) {
				fn = rule["func"];

				if (typeof(fn) !== "function") {
					alert("jqv:custom parameter 'function' is no function - "+customRule);
						return;
				}

				if (!fn(field, rules, i, options))
					return options.allrules[customRule].alertText;
			} else {
				alert("jqv:custom type not allowed "+customRule);
					return;
			}
		},
		/**
		* Validate custom function outside of the engine scope
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_funcCall: function(field, rules, i, options) {
			var functionName = rules[i + 1];
			var fn;
			if(functionName.indexOf('.') >-1)
			{
				var namespaces = functionName.split('.');
				var scope = window;
				while(namespaces.length)
				{
					scope = scope[namespaces.shift()];
				}
				fn = scope;
			}
			else
				fn = window[functionName] || options.customFunctions[functionName];
			if (typeof(fn) == 'function')
				return fn(field, rules, i, options);

		},
		/**
		* Field match
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_equals: function(field, rules, i, options) {
			var equalsField = rules[i + 1];

			if (field.val() != $("#" + equalsField).val())
				return options.allrules.equals.alertText;
		},
		/**
		* Check the maximum size (in characters)
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_maxSize: function(field, rules, i, options) {
			var max = rules[i + 1];
			var len = field.val().length;

			if (len > max) {
				var rule = options.allrules.maxSize;
				return rule.alertText + max + rule.alertText2;
			}
		},
		/**
		* Check the minimum size (in characters)
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_minSize: function(field, rules, i, options) {
			var min = rules[i + 1];
			var len = field.val().length;

			if (len < min) {
				var rule = options.allrules.minSize;
				return rule.alertText + min + rule.alertText2;
			}
		},
		/**
		* Check number minimum value
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_min: function(field, rules, i, options) {
			var min = parseFloat(rules[i + 1]);
			var len = parseFloat(field.val());

			if (len < min) {
				var rule = options.allrules.min;
				if (rule.alertText2) return rule.alertText + min + rule.alertText2;
				return rule.alertText + min;
			}
		},
		/**
		* Check number maximum value
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_max: function(field, rules, i, options) {
			var max = parseFloat(rules[i + 1]);
			var len = parseFloat(field.val());

			if (len >max ) {
				var rule = options.allrules.max;
				if (rule.alertText2) return rule.alertText + max + rule.alertText2;
				//orefalo: to review, also do the translations
				return rule.alertText + max;
			}
		},
		/**
		* Checks date is in the past
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_past: function(form, field, rules, i, options) {

			var p=rules[i + 1];
			var fieldAlt = $(form.find("input[name='" + p.replace(/^#+/, '') + "']"));
			var pdate;

			if (p.toLowerCase() == "now") {
				pdate = new Date();
			} else if (undefined != fieldAlt.val()) {
				if (fieldAlt.is(":disabled"))
					return;
				pdate = methods._parseDate(fieldAlt.val());
			} else {
				pdate = methods._parseDate(p);
			}
			var vdate = methods._parseDate(field.val());

			if (vdate > pdate ) {
				var rule = options.allrules.past;
				if (rule.alertText2) return rule.alertText + methods._dateToString(pdate) + rule.alertText2;
				return rule.alertText + methods._dateToString(pdate);
			}
		},
		/**
		* Checks date is in the future
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_future: function(form, field, rules, i, options) {

			var p=rules[i + 1];
			var fieldAlt = $(form.find("input[name='" + p.replace(/^#+/, '') + "']"));
			var pdate;

			if (p.toLowerCase() == "now") {
				pdate = new Date();
			} else if (undefined != fieldAlt.val()) {
				if (fieldAlt.is(":disabled"))
					return;
				pdate = methods._parseDate(fieldAlt.val());
			} else {
				pdate = methods._parseDate(p);
			}
			var vdate = methods._parseDate(field.val());

			if (vdate < pdate ) {
				var rule = options.allrules.future;
				if (rule.alertText2)
					return rule.alertText + methods._dateToString(pdate) + rule.alertText2;
				return rule.alertText + methods._dateToString(pdate);
			}
		},
		/**
		* Checks if valid date
		*
		* @param {string} date string
		* @return a bool based on determination of valid date
		*/
		_isDate: function (value) {
			var dateRegEx = new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:0?[1-9]|1[0-2])(\/|-)(?:0?[1-9]|1\d|2[0-8]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(0?2(\/|-)29)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/);
			return dateRegEx.test(value);
		},
		/**
		* Checks if valid date time
		*
		* @param {string} date string
		* @return a bool based on determination of valid date time
		*/
		_isDateTime: function (value){
			var dateTimeRegEx = new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1}$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^((1[012]|0?[1-9]){1}\/(0?[1-9]|[12][0-9]|3[01]){1}\/\d{2,4}\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1})$/);
			return dateTimeRegEx.test(value);
		},
		//Checks if the start date is before the end date
		//returns true if end is later than start
		_dateCompare: function (start, end) {
			return (new Date(start.toString()) < new Date(end.toString()));
		},
		/**
		* Checks date range
		*
		* @param {jqObject} first field name
		* @param {jqObject} second field name
		* @return an error string if validation failed
		*/
		_dateRange: function (field, rules, i, options) {
			//are not both populated
			if ((!options.firstOfGroup[0].value && options.secondOfGroup[0].value) || (options.firstOfGroup[0].value && !options.secondOfGroup[0].value)) {
				return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
			}

			//are not both dates
			if (!methods._isDate(options.firstOfGroup[0].value) || !methods._isDate(options.secondOfGroup[0].value)) {
				return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
			}

			//are both dates but range is off
			if (!methods._dateCompare(options.firstOfGroup[0].value, options.secondOfGroup[0].value)) {
				return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
			}
		},
		/**
		* Checks date time range
		*
		* @param {jqObject} first field name
		* @param {jqObject} second field name
		* @return an error string if validation failed
		*/
		_dateTimeRange: function (field, rules, i, options) {
			//are not both populated
			if ((!options.firstOfGroup[0].value && options.secondOfGroup[0].value) || (options.firstOfGroup[0].value && !options.secondOfGroup[0].value)) {
				return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
			}
			//are not both dates
			if (!methods._isDateTime(options.firstOfGroup[0].value) || !methods._isDateTime(options.secondOfGroup[0].value)) {
				return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
			}
			//are both dates but range is off
			if (!methods._dateCompare(options.firstOfGroup[0].value, options.secondOfGroup[0].value)) {
				return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
			}
		},
		/**
		* Max number of checkbox selected
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_maxCheckbox: function(form, field, rules, i, options) {

			var nbCheck = rules[i + 1];
			var groupname = field.attr("name");
			var groupSize = form.find("input[name='" + groupname + "']:checked").size();
			if (groupSize > nbCheck) {
				options.showArrow = false;
				if (options.allrules.maxCheckbox.alertText2)
					 return options.allrules.maxCheckbox.alertText + " " + nbCheck + " " + options.allrules.maxCheckbox.alertText2;
				return options.allrules.maxCheckbox.alertText;
			}
		},
		/**
		* Min number of checkbox selected
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_minCheckbox: function(form, field, rules, i, options) {

			var nbCheck = rules[i + 1];
			var groupname = field.attr("name");
			var groupSize = form.find("input[name='" + groupname + "']:checked").size();
			if (groupSize < nbCheck) {
				options.showArrow = false;
				return options.allrules.minCheckbox.alertText + " " + nbCheck + " " + options.allrules.minCheckbox.alertText2;
			}
		},
		/**
		* Checks that it is a valid credit card number according to the
		* Luhn checksum algorithm.
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_creditCard: function(field, rules, i, options) {
			//spaces and dashes may be valid characters, but must be stripped to calculate the checksum.
			var valid = false, cardNumber = field.val().replace(/ +/g, '').replace(/-+/g, '');

			var numDigits = cardNumber.length;
			if (numDigits >= 14 && numDigits <= 16 && parseInt(cardNumber) > 0) {

				var sum = 0, i = numDigits - 1, pos = 1, digit, luhn = new String();
				do {
					digit = parseInt(cardNumber.charAt(i));
					luhn += (pos++ % 2 == 0) ? digit * 2 : digit;
				} while (--i >= 0)

				for (i = 0; i < luhn.length; i++) {
					sum += parseInt(luhn.charAt(i));
				}
				valid = sum % 10 == 0;
			}
			if (!valid) return options.allrules.creditCard.alertText;
		},
		/**
		* Ajax field validation
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return nothing! the ajax validator handles the prompts itself
		*/
		 _ajax: function(field, rules, i, options) {

			 var errorSelector = rules[i + 1];
			 var rule = options.allrules[errorSelector];
			 var extraData = rule.extraData;
			 var extraDataDynamic = rule.extraDataDynamic;
			 var data = {
				"fieldId" : field.attr("id"),
				"fieldValue" : field.val()
			 };

			 if (typeof extraData === "object") {
				$.extend(data, extraData);
			 } else if (typeof extraData === "string") {
				var tempData = extraData.split("&");
				for(var i = 0; i < tempData.length; i++) {
					var values = tempData[i].split("=");
					if (values[0] && values[0]) {
						data[values[0]] = values[1];
					}
				}
			 }

			 if (extraDataDynamic) {
				 var tmpData = [];
				 var domIds = String(extraDataDynamic).split(",");
				 for (var i = 0; i < domIds.length; i++) {
					 var id = domIds[i];
					 if ($(id).length) {
						 var inputValue = field.closest("form, .validationEngineContainer").find(id).val();
						 var keyValue = id.replace('#', '') + '=' + escape(inputValue);
						 data[id.replace('#', '')] = inputValue;
					 }
				 }
			 }

			 // If a field change event triggered this we want to clear the cache for this ID
			 if (options.eventTrigger == "field") {
				delete(options.ajaxValidCache[field.attr("id")]);
			 }

			 // If there is an error or if the the field is already validated, do not re-execute AJAX
			 if (!options.isError && !methods._checkAjaxFieldStatus(field.attr("id"), options)) {
				 $.ajax({
					 type: options.ajaxFormValidationMethod,
					 url: rule.url,
					 cache: false,
					 dataType: "json",
					 data: data,
					 field: field,
					 rule: rule,
					 methods: methods,
					 options: options,
					 beforeSend: function() {},
					 error: function(data, transport) {
						 methods._ajaxError(data, transport);
					 },
					 success: function(json) {

						 // asynchronously called on success, data is the json answer from the server
						 var errorFieldId = json[0];
						 //var errorField = $($("#" + errorFieldId)[0]);
						 var errorField = $("#"+ errorFieldId).eq(0);

						 // make sure we found the element
						 if (errorField.length == 1) {
							 var status = json[1];
							 // read the optional msg from the server
							 var msg = json[2];
							 if (!status) {
								 // Houston we got a problem - display an red prompt
								 options.ajaxValidCache[errorFieldId] = false;
								 options.isError = true;

								 // resolve the msg prompt
								 if(msg) {
									 if (options.allrules[msg]) {
										 var txt = options.allrules[msg].alertText;
										 if (txt) {
											msg = txt;
							}
									 }
								 }
								 else
									msg = rule.alertText;

								 if (options.showPrompts) methods._showPrompt(errorField, msg, "", true, options);
							 } else {
								 options.ajaxValidCache[errorFieldId] = true;

								 // resolves the msg prompt
								 if(msg) {
									 if (options.allrules[msg]) {
										 var txt = options.allrules[msg].alertTextOk;
										 if (txt) {
											msg = txt;
							}
									 }
								 }
								 else
								 msg = rule.alertTextOk;

								 if (options.showPrompts) {
									 // see if we should display a green prompt
									 if (msg)
										methods._showPrompt(errorField, msg, "pass", true, options);
									 else
										methods._closePrompt(errorField);
								}

								 // If a submit form triggered this, we want to re-submit the form
								 if (options.eventTrigger == "submit")
									field.closest("form").submit();
							 }
						 }
						 errorField.trigger("jqv.field.result", [errorField, options.isError, msg]);
					 }
				 });

				 return rule.alertTextLoad;
			 }
		 },
		/**
		* Common method to handle ajax errors
		*
		* @param {Object} data
		* @param {Object} transport
		*/
		_ajaxError: function(data, transport) {
			if(data.status == 0 && transport == null)
				alert("The page is not served from a server! ajax call failed");
			else if(typeof console != "undefined")
				console.log("Ajax error: " + data.status + " " + transport);
		},
		/**
		* date -> string
		*
		* @param {Object} date
		*/
		_dateToString: function(date) {
			return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
		},
		/**
		* Parses an ISO date
		* @param {String} d
		*/
		_parseDate: function(d) {

			var dateParts = d.split("-");
			if(dateParts==d)
				dateParts = d.split("/");
			if(dateParts==d) {
				dateParts = d.split(".");
				return new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
			}
			return new Date(dateParts[0], (dateParts[1] - 1) ,dateParts[2]);
		},
		/**
		* Builds or updates a prompt with the given information
		*
		* @param {jqObject} field
		* @param {String} promptText html text to display type
		* @param {String} type the type of bubble: 'pass' (green), 'load' (black) anything else (red)
		* @param {boolean} ajaxed - use to mark fields than being validated with ajax
		* @param {Map} options user options
		*/
		 _showPrompt: function(field, promptText, type, ajaxed, options, ajaxform) {
			 var prompt = methods._getPrompt(field);
			 // The ajax submit errors are not see has an error in the form,
			 // When the form errors are returned, the engine see 2 bubbles, but those are ebing closed by the engine at the same time
			 // Because no error was found befor submitting
			 if(ajaxform) prompt = false;
			 // Check that there is indded text
			 if($.trim(promptText)){
				 if (prompt)
					methods._updatePrompt(field, prompt, promptText, type, ajaxed, options);
				 else
					methods._buildPrompt(field, promptText, type, ajaxed, options);
			}
		 },
		/**
		* Builds and shades a prompt for the given field.
		*
		* @param {jqObject} field
		* @param {String} promptText html text to display type
		* @param {String} type the type of bubble: 'pass' (green), 'load' (black) anything else (red)
		* @param {boolean} ajaxed - use to mark fields than being validated with ajax
		* @param {Map} options user options
		*/
		_buildPrompt: function(field, promptText, type, ajaxed, options) {

			// create the prompt
			var prompt = $('<div>');
			prompt.addClass(methods._getClassName(field.attr("id")) + "formError");
			// add a class name to identify the parent form of the prompt
			prompt.addClass("parentForm"+methods._getClassName(field.closest('form, .validationEngineContainer').attr("id")));
			prompt.addClass("formError");

			switch (type) {
				case "pass":
					prompt.addClass("greenPopup");
					break;
				case "load":
					prompt.addClass("blackPopup");
					break;
				default:
					/* it has error  */
					//alert("unknown popup type:"+type);
			}
			if (ajaxed)
				prompt.addClass("ajaxed");

			// create the prompt content
			var promptContent = $('<div>').addClass("formErrorContent").html(promptText).appendTo(prompt);

			// determine position type
			var positionType=field.data("promptPosition") || options.promptPosition;

			// create the css arrow pointing at the field
			// note that there is no triangle on max-checkbox and radio
			if (options.showArrow) {
				var arrow = $('<div>').addClass("formErrorArrow");

				//prompt positioning adjustment support. Usage: positionType:Xshift,Yshift (for ex.: bottomLeft:+20 or bottomLeft:-20,+10)
				if (typeof(positionType)=='string')
				{
					var pos=positionType.indexOf(":");
					if(pos!=-1)
						positionType=positionType.substring(0,pos);
				}

				switch (positionType) {
					case "bottomLeft":
					case "bottomRight":
						prompt.find(".formErrorContent").before(arrow);
						arrow.addClass("formErrorArrowBottom").html('<div class="line1"><!-- --></div><div class="line2"><!-- --></div><div class="line3"><!-- --></div><div class="line4"><!-- --></div><div class="line5"><!-- --></div><div class="line6"><!-- --></div><div class="line7"><!-- --></div><div class="line8"><!-- --></div><div class="line9"><!-- --></div><div class="line10"><!-- --></div>');
						break;
					case "topLeft":
					case "topRight":
						arrow.html('<div class="line10"><!-- --></div><div class="line9"><!-- --></div><div class="line8"><!-- --></div><div class="line7"><!-- --></div><div class="line6"><!-- --></div><div class="line5"><!-- --></div><div class="line4"><!-- --></div><div class="line3"><!-- --></div><div class="line2"><!-- --></div><div class="line1"><!-- --></div>');
						prompt.append(arrow);
						break;
				}
			}
			// Add custom prompt class
			if (options.addPromptClass)
				prompt.addClass(options.addPromptClass);

            // Add custom prompt class defined in element
            var requiredOverride = field.attr('data-required-class');
            if(requiredOverride !== undefined) {
                prompt.addClass(requiredOverride);
            } else {
                if(options.prettySelect) {
                    if($('#' + field.attr('id')).next().is('select')) {
                        var prettyOverrideClass = $('#' + field.attr('id').substr(options.usePrefix.length).substring(options.useSuffix.length)).attr('data-required-class');
                        if(prettyOverrideClass !== undefined) {
                            prompt.addClass(prettyOverrideClass);
                        }
                    }
                }
            }

			prompt.css({
				"opacity": 0
			});
			if(positionType === 'inline') {
				prompt.addClass("inline");
				if(typeof field.attr('data-prompt-target') !== 'undefined' && $('#'+field.attr('data-prompt-target')).length > 0) {
					prompt.appendTo($('#'+field.attr('data-prompt-target')));
				} else {
					field.after(prompt);
				}
			} else {
				field.before(prompt);
			}

			var pos = methods._calculatePosition(field, prompt, options);
			prompt.css({
				'position': positionType === 'inline' ? 'relative' : 'absolute',
				"top": pos.callerTopPosition,
				"left": pos.callerleftPosition,
				"marginTop": pos.marginTopSize,
				"opacity": 0
			}).data("callerField", field);


			if (options.autoHidePrompt) {
				setTimeout(function(){
					prompt.animate({
						"opacity": 0
					},function(){
						prompt.closest('.formErrorOuter').remove();
						prompt.remove();
					});
				}, options.autoHideDelay);
			}
			return prompt.animate({
				"opacity": 0.87
			});
		},
		/**
		* Updates the prompt text field - the field for which the prompt
		* @param {jqObject} field
		* @param {String} promptText html text to display type
		* @param {String} type the type of bubble: 'pass' (green), 'load' (black) anything else (red)
		* @param {boolean} ajaxed - use to mark fields than being validated with ajax
		* @param {Map} options user options
		*/
		_updatePrompt: function(field, prompt, promptText, type, ajaxed, options, noAnimation) {

			if (prompt) {
				if (typeof type !== "undefined") {
					if (type == "pass")
						prompt.addClass("greenPopup");
					else
						prompt.removeClass("greenPopup");

					if (type == "load")
						prompt.addClass("blackPopup");
					else
						prompt.removeClass("blackPopup");
				}
				if (ajaxed)
					prompt.addClass("ajaxed");
				else
					prompt.removeClass("ajaxed");

				prompt.find(".formErrorContent").html(promptText);

				var pos = methods._calculatePosition(field, prompt, options);
				var css = {"top": pos.callerTopPosition,
				"left": pos.callerleftPosition,
				"marginTop": pos.marginTopSize};

				if (noAnimation)
					prompt.css(css);
				else
					prompt.animate(css);
			}
		},
		/**
		* Closes the prompt associated with the given field
		*
		* @param {jqObject}
		*            field
		*/
		 _closePrompt: function(field) {
			 var prompt = methods._getPrompt(field);
			 if (prompt)
				 prompt.fadeTo("fast", 0, function() {
					 prompt.parent('.formErrorOuter').remove();
					 prompt.remove();
				 });
		 },
		 closePrompt: function(field) {
			 return methods._closePrompt(field);
		 },
		/**
		* Returns the error prompt matching the field if any
		*
		* @param {jqObject}
		*            field
		* @return undefined or the error prompt (jqObject)
		*/
		_getPrompt: function(field) {
				var formId = $(field).closest('form, .validationEngineContainer').attr('id');
			var className = methods._getClassName(field.attr("id")) + "formError";
				var match = $("." + methods._escapeExpression(className) + '.parentForm' + formId)[0];
			if (match)
			return $(match);
		},
		/**
		  * Returns the escapade classname
		  *
		  * @param {selector}
		  *            className
		  */
		  _escapeExpression: function (selector) {
			  return selector.replace(/([#;&,\.\+\*\~':"\!\^$\[\]\(\)=>\|])/g, "\\$1");
		  },
		/**
		 * returns true if we are in a RTLed document
		 *
		 * @param {jqObject} field
		 */
		isRTL: function(field)
		{
			var $document = $(document);
			var $body = $('body');
			var rtl =
				(field && field.hasClass('rtl')) ||
				(field && (field.attr('dir') || '').toLowerCase()==='rtl') ||
				$document.hasClass('rtl') ||
				($document.attr('dir') || '').toLowerCase()==='rtl' ||
				$body.hasClass('rtl') ||
				($body.attr('dir') || '').toLowerCase()==='rtl';
			return Boolean(rtl);
		},
		/**
		* Calculates prompt position
		*
		* @param {jqObject}
		*            field
		* @param {jqObject}
		*            the prompt
		* @param {Map}
		*            options
		* @return positions
		*/
		_calculatePosition: function (field, promptElmt, options) {

			var promptTopPosition, promptleftPosition, marginTopSize;
			var fieldWidth 	= field.width();
			var fieldLeft 	= field.position().left;
			var fieldTop 	=  field.position().top;
			var fieldHeight 	=  field.height();
			var promptHeight = promptElmt.height();


			// is the form contained in an overflown container?
			promptTopPosition = promptleftPosition = 0;
			// compensation for the arrow
			marginTopSize = -promptHeight;


			//prompt positioning adjustment support
			//now you can adjust prompt position
			//usage: positionType:Xshift,Yshift
			//for example:
			//   bottomLeft:+20 means bottomLeft position shifted by 20 pixels right horizontally
			//   topRight:20, -15 means topRight position shifted by 20 pixels to right and 15 pixels to top
			//You can use +pixels, - pixels. If no sign is provided than + is default.
			var positionType=field.data("promptPosition") || options.promptPosition;
			var shift1="";
			var shift2="";
			var shiftX=0;
			var shiftY=0;
			if (typeof(positionType)=='string') {
				//do we have any position adjustments ?
				if (positionType.indexOf(":")!=-1) {
					shift1=positionType.substring(positionType.indexOf(":")+1);
					positionType=positionType.substring(0,positionType.indexOf(":"));

					//if any advanced positioning will be needed (percents or something else) - parser should be added here
					//for now we use simple parseInt()

					//do we have second parameter?
					if (shift1.indexOf(",") !=-1) {
						shift2=shift1.substring(shift1.indexOf(",") +1);
						shift1=shift1.substring(0,shift1.indexOf(","));
						shiftY=parseInt(shift2);
						if (isNaN(shiftY)) shiftY=0;
					};

					shiftX=parseInt(shift1);
					if (isNaN(shift1)) shift1=0;

				};
			};


			switch (positionType) {
				default:
				case "topRight":
					promptleftPosition +=  fieldLeft + fieldWidth - 30;
					promptTopPosition +=  fieldTop;
					break;

				case "topLeft":
					promptTopPosition +=  fieldTop;
					promptleftPosition += fieldLeft;
					break;

				case "centerRight":
					promptTopPosition = fieldTop+4;
					marginTopSize = 0;
					promptleftPosition= fieldLeft + field.outerWidth(true)+5;
					break;
				case "centerLeft":
					promptleftPosition = fieldLeft - (promptElmt.width() + 2);
					promptTopPosition = fieldTop+4;
					marginTopSize = 0;

					break;

				case "bottomLeft":
					promptTopPosition = fieldTop + field.height() + 5;
					marginTopSize = 0;
					promptleftPosition = fieldLeft;
					break;
				case "bottomRight":
					promptleftPosition = fieldLeft + fieldWidth - 30;
					promptTopPosition =  fieldTop +  field.height() + 5;
					marginTopSize = 0;
					break;
				case "inline":
					promptleftPosition = 0;
					promptTopPosition = 0;
					marginTopSize = 0;
			};



			//apply adjusments if any
			promptleftPosition += shiftX;
			promptTopPosition  += shiftY;

			return {
				"callerTopPosition": promptTopPosition + "px",
				"callerleftPosition": promptleftPosition + "px",
				"marginTopSize": marginTopSize + "px"
			};
		},
		/**
		* Saves the user options and variables in the form.data
		*
		* @param {jqObject}
		*            form - the form where the user option should be saved
		* @param {Map}
		*            options - the user options
		* @return the user options (extended from the defaults)
		*/
		 _saveOptions: function(form, options) {

			 // is there a language localisation ?
			 if ($.validationEngineLanguage)
			 var allRules = $.validationEngineLanguage.allRules;
			 else
			 $.error("jQuery.validationEngine rules are not loaded, plz add localization files to the page");
			 // --- Internals DO NOT TOUCH or OVERLOAD ---
			 // validation rules and i18
			 $.validationEngine.defaults.allrules = allRules;

			 var userOptions = $.extend(true,{},$.validationEngine.defaults,options);

			 form.data('jqv', userOptions);
			 return userOptions;
		 },

		 /**
		 * Removes forbidden characters from class name
		 * @param {String} className
		 */
		 _getClassName: function(className) {
			 if(className)
				 return className.replace(/:/g, "_").replace(/\./g, "_");
					  },
		/**
		 * Escape special character for jQuery selector
		 * http://totaldev.com/content/escaping-characters-get-valid-jquery-id
		 * @param {String} selector
		 */
		 _jqSelector: function(str){
			return str.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');
		},
		/**
		* Conditionally required field
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		* user options
		* @return an error string if validation failed
		*/
		_condRequired: function(field, rules, i, options) {
			var idx, dependingField;

			for(idx = (i + 1); idx < rules.length; idx++) {
				dependingField = jQuery("#" + rules[idx]).first();

				/* Use _required for determining wether dependingField has a value.
				 * There is logic there for handling all field types, and default value; so we won't replicate that here
				 * Indicate this special use by setting the last parameter to true so we only validate the dependingField on chackboxes and radio buttons (#462)
				 */
				if (dependingField.length && methods._required(dependingField, ["required"], 0, options, true) == undefined) {
					/* We now know any of the depending fields has a value,
					 * so we can validate this field as per normal required code
					 */
					return methods._required(field, ["required"], 0, options);
				}
			}
		},

	    _submitButtonClick: function(event) {
	        var button = $(this);
	        var form = button.closest('form, .validationEngineContainer');
	        form.data("jqv_submitButton", button.attr("id"));
	    }
		  };

	 /**
	 * Plugin entry point.
	 * You may pass an action as a parameter or a list of options.
	 * if none, the init and attach methods are being called.
	 * Remember: if you pass options, the attached method is NOT called automatically
	 *
	 * @param {String}
	 *            method (optional) action
	 */
	 $.fn.validationEngine = function(method) {

		 var form = $(this);
		 if(!form[0]) return form;  // stop here if the form does not exist

		 if (typeof(method) == 'string' && method.charAt(0) != '_' && methods[method]) {

			 // make sure init is called once
			 if(method != "showPrompt" && method != "hide" && method != "hideAll")
			 methods.init.apply(form);

			 return methods[method].apply(form, Array.prototype.slice.call(arguments, 1));
		 } else if (typeof method == 'object' || !method) {

			 // default constructor with or without arguments
			 methods.init.apply(form, arguments);
			 return methods.attach.apply(form);
		 } else {
			 $.error('Method ' + method + ' does not exist in jQuery.validationEngine');
		 }
	};



	// LEAK GLOBAL OPTIONS
	$.validationEngine= {fieldIdCounter: 0,defaults:{

		// Name of the event triggering field validation
		validationEventTrigger: "blur",
		// Automatically scroll viewport to the first error
		scroll: true,
		// Focus on the first input
		focusFirstField:true,
		// Show prompts, set to false to disable prompts
		showPrompts: true,
       // Should we attempt to validate non-visible input fields contained in the form? (Useful in cases of tabbed containers, e.g. jQuery-UI tabs)
       validateNonVisibleFields: false,
		// Opening box position, possible locations are: topLeft,
		// topRight, bottomLeft, centerRight, bottomRight, inline
		// inline gets inserted after the validated field or into an element specified in data-prompt-target
		promptPosition: "topRight",
		bindMethod:"bind",
		// internal, automatically set to true when it parse a _ajax rule
		inlineAjax: false,
		// if set to true, the form data is sent asynchronously via ajax to the form.action url (get)
		ajaxFormValidation: false,
		// The url to send the submit ajax validation (default to action)
		ajaxFormValidationURL: false,
		// HTTP method used for ajax validation
		ajaxFormValidationMethod: 'get',
		// Ajax form validation callback method: boolean onComplete(form, status, errors, options)
		// retuns false if the form.submit event needs to be canceled.
		onAjaxFormComplete: $.noop,
		// called right before the ajax call, may return false to cancel
		onBeforeAjaxFormValidation: $.noop,
		// Stops form from submitting and execute function assiciated with it
		onValidationComplete: false,

		// Used when you have a form fields too close and the errors messages are on top of other disturbing viewing messages
		doNotShowAllErrosOnSubmit: false,
		// Object where you store custom messages to override the default error messages
		custom_error_messages:{},
		// true if you want to vind the input fields
		binded: true,
		// set to true, when the prompt arrow needs to be displayed
		showArrow: true,
		// did one of the validation fail ? kept global to stop further ajax validations
		isError: false,
		// Limit how many displayed errors a field can have
		maxErrorsPerField: false,

		// Caches field validation status, typically only bad status are created.
		// the array is used during ajax form validation to detect issues early and prevent an expensive submit
		ajaxValidCache: {},
		// Auto update prompt position after window resize
		autoPositionUpdate: false,

		InvalidFields: [],
		onFieldSuccess: false,
		onFieldFailure: false,
		onSuccess: false,
		onFailure: false,
		validateAttribute: "class",
		addSuccessCssClassToField: "",
		addFailureCssClassToField: "",

		// Auto-hide prompt
		autoHidePrompt: false,
		// Delay before auto-hide
		autoHideDelay: 10000,
		// Fade out duration while hiding the validations
		fadeDuration: 0.3,
	 // Use Prettify select library
	 prettySelect: false,
	 // Add css class on prompt
	 addPromptClass : "",
	 // Custom ID uses prefix
	 usePrefix: "",
	 // Custom ID uses suffix
	 useSuffix: "",
	 // Only show one message per error prompt
	 showOneMessage: false
	}};
	$(function(){$.validationEngine.defaults.promptPosition = methods.isRTL()?'topLeft':"topRight"});
})(jQuery);


