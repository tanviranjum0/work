/*Settings Panel*/
$(document).on('click', '.setting-panel-open', function (e) {
    var target = $(this).attr('data-setting-panel');
    $(target).addClass('setting-panel-toggle');
});
$(document).on('click', '.panel-close', function (e) {
    $('.hk-bldr-setting-panel').removeClass('setting-panel-toggle');
});

/*Menu Builder*/
$(document).on('mouseenter', '.hk-menu', function () {
    $(this).append('<div class="menu-setting-link position-absolute setting-panel-open" data-setting-panel="#bldr_setting_panel_2" style="z-index:3333; top:0;"><span class="feather-icon"><i data-feather="settings"></i></span></div>');
    feather.replace();
}).on('mouseleave', '.hk-menu', function () {
    $(this).find('.menu-setting-link').remove();
});
/*Builder Panel Open*/
$(document).on('click', '.menu-setting-link', function (e) {
    if( !$.trim( $('.dd').html() ).length ) {
        $('.dd').append($wrapper.find('.menu-content-wrap').html());
        $('.dd').find('.hk-callout,.hk-secondary-brand,.menu-gap').remove();
        $('.dd').attr('id','dragulla');//For Dragula activate
        $('.dd').find('.navbar-nav').addClass('dd-list').append("<li class='nav-item placeholder-list'></li>");
        $('.dd').find('.navbar-nav >li.nav-item').addClass('dd-depth-0');
        $('.dd').find('.nav-item').addClass('dd-item');
        $('.dd').find('.nav-link').addClass('dd-handle');
        $('.dd').find('.dd-depth-0 > .nav-link').prepend('<i class="ri-checkbox-blank-circle-fill"></i>');
        $('<span class="menu-editor-wrap"><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit btn-sm" data-toggle="modal" data-target="#linkDetailsEditor"><span class="btn-icon-wrap"><span class="feather-icon"><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></span></span></a><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete btn-sm"><span class="btn-icon-wrap" ><span class="feather-icon" ><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a><div></div></span>').insertAfter('.dd-handle');
        $('.dd').find('.nav').removeClass('collapse');
        $('.dd').find('.collapse-level-1 > li > ul.nav').addClass('dd-list sel-lvl-1').unwrap().unwrap();
        $('.dd').find('.sel-lvl-1').wrap('<ol class="dd-list sel-lvl-1"/>').contents().unwrap();
        $('.dd').find('.collapse-level-2 > li > ul.nav').addClass('dd-list sel-lvl-2').unwrap().unwrap();
        $('.dd').find('.sel-lvl-2').wrap('<ol class="dd-list sel-lvl-2"/>').contents().unwrap();
        $('.dd').find('.sel-lvl-1 > .dd-item').addClass('dd-depth-1');
        $('.dd').find('.sel-lvl-2 > .dd-item').addClass('dd-depth-2');
        $('.dd').find('.dd-depth-0,.dd-depth-1').find('.menu-editor-wrap').not('.placeholder-list').prepend('<a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover add-sub-link btn-sm"><span class="btn-icon-wrap"><span class="feather-icon"><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></span></span></a>');
        $('.dd').find('.nav-header').append('<div class="header-action-link"><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover save-nav-header btn-sm d-none"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg></span></span></a><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete-nav-header btn-sm"><span class="btn-icon-wrap" ><span class="feather-icon" ><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a></div>');
        $('.dd').find('.nav-header > span').attr('contenteditable','true');
        $('.dd').nestable({
            maxDepth:10 ,
           /*Before Drag Stop*/
            beforeDragStop: function (l,e, p) {
                /*Reset Individual link details Form*/
                $('.btn-cancel').trigger("click");

                /*After Drag Level and Depth Manegement*/
                setTimeout(function(){
                    $('.dd-depth-0 > ol.dd-list').each(function(){
                        if(!($(this).hasClass('.sel-lvl-1'))) {
                            $(this).addClass('sel-lvl-1');
                        }
                    });
                    $('.dd-depth-1 > ol.dd-list').each(function(){
                        if(!($(this).hasClass('.sel-lvl-2')))
                            $(this).addClass('sel-lvl-2');
                    });
                    if($(p).hasClass('sel-lvl-1')) {
                        $(e).removeClass('dd-depth-2').addClass('dd-depth-1');
                    } else if($(p).hasClass('sel-lvl-2')) {
                        $(e).removeClass('dd-depth-1').addClass('dd-depth-2');
                    }
                        
                   /*After Drag Link Creation*/
                    var idGen = Date.now().toString().substr(6);
                    if(!($(p).closest('li').find('>a.nav-link').attr('href')=='javascript:void(0);')) {
                        $(p).closest('li').find('>a.nav-link').attr({'href':'javascript:void(0);', 'data-toggle': 'collapse','data-target': '#'+idGen+'id_gen'});
                        $(document).on('click','[data-target="#'+idGen+'id_gen"]',function() {
                            if($(this).attr('aria-expanded')=='true')
                                $(this).attr('aria-expanded','false');
                            $('#'+idGen+'id_gen').collapse('toggle');
                        });
                    }
                    $(l).find('li').each(function(){
                        if(!($(this).find('>ol').length) && $(this).find('>a.dd-handle').attr('href')=='javascript:void(0);') {
                            $(this).find('>a.dd-handle').removeAttr('data-toggle data-target').attr('href','example.html');
                        }
                    });
                    /*Remove Placeholder list*/
                    $(l).find('li.placeholder-list').remove();
                    $(l).find('.navbar-nav').append('<li class="nav-item placeholder-list dd-depth-0 dd-item"></li>');
                },100);
                
                /*Drag Prevent */
                if($(p).closest('li').hasClass('placeholder-list'))
                return false;
                if(($(p).closest('ol').length>0) && ($(e).hasClass('dd-depth-0'))){
                   return false;
                }
                if((($(e).hasClass('dd-depth-0')) && ($(p).hasClass('sel-lvl-2')))||(($(e).hasClass('dd-depth-0')) && ($(p).hasClass('sel-lvl-1'))))
                    return false;
                    else if((($(e).hasClass('dd-depth-1')) && ($(p).hasClass('navbar-nav')))||(($(e).hasClass('dd-depth-2')) && ($(p).hasClass('navbar-nav'))))
                        return false;
            }
        });
    }

   
    /*Group Creation form menu*/
    $('.dd').find('.menu-group').each(function() {
        if(!($(this).find(".group-header").length > 0)) {
            $(this).prepend('<div class="group-header"><span>Group</span><div class="group-action-link"><a href="#" class="btn btn-icon btn-flush-light btn-rounded flush-soft-hover add-main-link btn-sm text-white" ><span class="btn-icon-wrap"><span class="feather-icon"><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></span></span></a><a href="#" class="btn btn-icon btn-flush-light btn-rounded flush-soft-hover add-nav-header btn-sm text-white" ><span class="btn-icon-wrap"><span class="feather-icon"><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg></span></span></a><a href="#" class="btn btn-sm btn-icon btn-flush-light text-white btn-rounded flush-soft-hover delete-group" ><span class="btn-icon-wrap"><span class="feather-icon"><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a></div></div>');
        }
        if(!($(this).hasClass(".bldr-menu-group"))) 
            $(this).addClass('bldr-menu-group');
    });
    /*Group Suffle*/
    dragula([document.getElementById("dragulla")], {moves: function (el, container, handle) {
		return handle.classList.contains('group-header');
		}
	});

     /*Remove empty nav header*/
     $('.dd').find('.nav-header').each(function(){
        if($(this).find('span').text()=="") {
            $(this).closest('.menu-group').find('.add-nav-header').removeClass('disabled').removeAttr('disabled');
            $(this).remove();
        }
        else {
            $(this).closest('.menu-group').find('.add-nav-header').addClass('disabled');
        }
            
    });
    return false;
});

/*Individual Link Details Edit*/
$(document).on('click','.menu-editor-wrap .edit',function() {
    /*Ignore element */
    $.fn.ignore = function(sel){
        return this.clone().find(sel||">*").remove().end();
    };
    $('.link-details-editor').empty();
    var valueBadge,
    idGen = Date.now().toString().substr(6);
    $(this).attr('data-link-target',idGen+'dlt');
    $('.link-details-editor').attr('data-link-detail',idGen+'dlt')
    if($('.link-details-editor').html()=="") {
        if($(this).closest('li').hasClass('dd-depth-0')) {
            $('.link-details-editor').append('<form class="form-menu-editor"><div class="form-group"> <label>Rename</label> <input class="form-control link-name" type="text"></div><div class="form-group"> <label>Href</label> <input class="form-control link-address" type="text"></div><div class="form-group"> <label>Icon</label><div class="icon-prev-block form-control w-60p" data-toggle="modal" data-target="#iconPickerModal"> <span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-flag"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg></span></div></div><div class="form-group"> <label>Primary Link Type</label> <select class="form-control custom-select pr-link-type"><option selected value="0">Default link</option><option value="1">Link with indicator</option><option value="2">Link with indicator on icon</option><option value="3">Link with badge</option><option value="4">Link with badge on right</option><option value="5">Link with badge on icon</option> </select></div><div class="form-indicator-option collapse"><div class="form-group"> <label>Indicator color</label> <select class="form-control custom-select indicator-color"><option selected value="primary">primary</option><option value="secondary">secondary</option><option value="success">success</option><option value="warning">warning</option><option value="info">info</option><option value="danger">danger</option> </select></div></div><div class="form-badge-option collapse"><div class="form-group"> <label>Badge Text</label> <input class="form-control badge-text" type="text" required><div class="invalid-feedback"> Please provide a badge-text. </div></div><div class="form-group"> <label>Badge Type</label> <select class="form-control custom-select badge-type"><option selected="" value="badge-soft">badge soft</option><option value="badge">badge filled</option> </select></div><div class="form-group"> <label>Badge Color</label> <select class="form-control custom-select badge-color"><option selected value="primary">primary</option><option value="secondary">secondary</option><option value="success">success</option><option value="warning">warning</option><option value="danger">danger</option><option value="info">info</option><option value="light">light</option><option value="dark">dark</option><option value="red">red</option><option value="green">green</option><option value="pink">pink</option><option value="purple">purple</option><option value="violet">violet</option><option value="indigo">indigo</option><option value="blue">blue</option><option value="sky">sky</option><option value="cyan">cyan</option><option value="teal">teal</option><option value="neon">neon</option><option value="lime">lime</option><option value="sun">sun</option><option value="yellow">yellow</option><option value="orange">orange</option><option value="pumpkin">pumpkin</option><option value="brown">brown</option><option value="grey">grey</option><option value="gold">gold</option><option value="smoke">smoke</option><option value="charcoal">charcoal</option> </select></div></div></form></div><div class="d-flex justify-content-end"> <a class="btn btn-light btn-cancel mr-15" data-dismiss="modal" href="#">cancel</a> <a class="btn btn-theme btn-save" href="#">save</a>');
            $('.link-details-editor form input.link-name').val($(this).closest('li').find('>a.dd-handle .nav-link-text').ignore(".badge").text().replace(/\s+/g, " "));
            $('.link-details-editor form .icon-prev-block').html($(this).closest('li').find('>a.dd-handle .nav-icon-wrap').html());
            $('.link-details-editor form .icon-prev-block').find('.badge').remove();
            var $this = $(this);
            setTimeout(function(){
                if($this.closest('li').find('>a.dd-handle .nav-link-text').hasClass('badge-on-text')) { 
                    $(".link-details-editor select.pr-link-type").val("1").trigger('change'); 
                        valueBadge = $this.closest('li').find('>a.dd-handle .nav-link-text.badge-on-text .badge').attr("class").replace(new RegExp('badge-indicator', 'g'),"").replace(new RegExp('badge', 'g'),"").replace(new RegExp('-soft-', 'g'),"").replace(new RegExp('-', 'g'),"");
                        valueBadge = valueBadge.toString().replace(/\s/g, '');
                        $(".link-details-editor select.indicator-color").val(valueBadge).trigger('change');
                }
                else if($this.closest('li').find('>a.dd-handle .nav-icon-wrap > span').hasClass('badge-on-icon') && ($this.closest('li').find('>a.dd-handle .nav-icon-wrap > span > .badge').hasClass('badge-indicator'))) { 
                    $(".link-details-editor select.pr-link-type").val("2").trigger('change'); 
                        valueBadge = $this.closest('li').find('>a.dd-handle .nav-icon-wrap .badge-on-icon .badge').attr("class").replace(new RegExp('badge-indicator', 'g'),"").replace(new RegExp('badge', 'g'),"").replace(new RegExp('-soft-', 'g'),"").replace(new RegExp('-', 'g'),"");
                        valueBadge = valueBadge.toString().replace(/\s/g, '');
                        $(".link-details-editor select.indicator-color").val(valueBadge).trigger('change');
                }
                else if($this.closest('li').find('>a.dd-handle .nav-link-text').hasClass('badge-on-text-right')) { 
                    $(".link-details-editor select.pr-link-type").val("3").trigger('change'); 
                    if($this.closest('li').find('>a.dd-handle .nav-link-text.badge-on-text-right .badge').is('[class*=badge-soft-]'))
                        $(".link-details-editor select.badge-type").val("badge-soft").trigger('change');
                        else
                            $(".link-details-editor select.badge-type").val("badge").trigger('change');
                        valueBadge = $this.closest('li').find('>a.dd-handle .nav-link-text.badge-on-text-right .badge').attr("class").replace(new RegExp('badge-indicator', 'g'),"").replace(new RegExp('badge', 'g'),"").replace(new RegExp('-soft-', 'g'),"").replace(new RegExp('-', 'g'),"");
                        valueBadge = valueBadge.toString().replace(/\s/g, '');
                        $(".link-details-editor input.badge-text").val($this.closest('li').find('>a.dd-handle .nav-link-text.badge-on-text-right .badge').text());
                        $(".link-details-editor select.badge-color").val(valueBadge).trigger('change');
                    
                }
                else if($this.closest('li').find('>a.dd-handle').hasClass('link-badge-right')) { 
                    $(".link-details-editor select.pr-link-type").val("4").trigger('change'); 
                    if($this.closest('li').find('>a.dd-handle.link-badge-right .badge').is('[class*=badge-soft-]'))
                        $(".link-details-editor select.badge-type").val("badge-soft").trigger('change');
                        else
                            $(".link-details-editor select.badge-type").val("badge").trigger('change');
                        valueBadge = $this.closest('li').find('>a.dd-handle.link-badge-right .badge').attr("class").replace(new RegExp('badge-indicator', 'g'),"").replace(new RegExp('badge', 'g'),"").replace(new RegExp('-soft-', 'g'),"").replace(new RegExp('-', 'g'),"");
                        valueBadge = valueBadge.toString().replace(/\s/g, '');
                        $(".link-details-editor input.badge-text").val($this.closest('li').find('>a.dd-handle.link-badge-right .badge').text());
                        $(".link-details-editor select.badge-color").val(valueBadge).trigger('change');
                    
                }
                else if($this.closest('li').find('>a.dd-handle .nav-icon-wrap > span').hasClass('badge-on-icon') && !($this.closest('li').find('>a.dd-handle .nav-icon-wrap > span > .badge').hasClass('badge-indicator'))) { 
                    $(".link-details-editor select.pr-link-type").val("5").trigger('change'); 
                    if($this.closest('li').find('>a.dd-handle .nav-icon-wrap > span > .badge').is('[class*=badge-soft-]'))
                    $(".link-details-editor select.badge-type").val("badge-soft").trigger('change');
                    else
                        $(".link-details-editor select.badge-type").val("badge").trigger('change');
                    valueBadge = $this.closest('li').find('>a.dd-handle .nav-icon-wrap > span > .badge').attr("class").replace(new RegExp('badge-indicator', 'g'),"").replace(new RegExp('badge', 'g'),"").replace(new RegExp('-soft-', 'g'),"").replace(new RegExp('-', 'g'),"").replace(new RegExp('-soft-', 'g'),"").replace(new RegExp('sm', 'g'),"");
                    valueBadge = valueBadge.toString().replace(/\s/g, '');
                    $(".link-details-editor input.badge-text").val($this.closest('li').find('>a.dd-handle .nav-icon-wrap > span > .badge').text());
                    $(".link-details-editor select.badge-color").val(valueBadge).trigger('change');
                }
                else
                    $(".link-details-editor select.pr-link-type").val("0").trigger('change'); 
            },200);
        }
        else {
            $('.link-details-editor').append('<form class="form-menu-editor"><div class="form-group"> <label>Rename</label> <input class="form-control link-name" type="text"></div><div class="form-group"> <label>Href</label> <input class="form-control link-address" type="text"></div></form></div><div class="d-flex justify-content-end"> <a class="btn btn-light btn-cancel mr-15" href="#" data-dismiss="modal">cancel</a> <a class="btn btn-theme btn-save"  href="#">save</a>');
            $('.link-details-editor form input.link-name').val($(this).closest('li').find('>a.dd-handle').text().replace(/\s+/g, " "));
        }
        $('.link-details-editor form input.link-address').val($(this).closest('li').find('>a.dd-handle').attr('href'));
        if($('.link-details-editor form input.link-address').val()=='javascript:void(0);') {
            $('.link-details-editor form input.link-address').closest('.form-group').hide();
        }
        else
            $('.link-details-editor form input.link-address').closest('.form-group').show();
        
    }
});

/*Modal Stacking */
$(document).on('show.bs.modal', '.modal', function (event) {
    var zIndex = 1050 + (10 * $('.modal:visible').length);
    $(this).css('z-index', zIndex);
    setTimeout(function() {
        $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
    }, 0);
});

/*Individual Link Delete*/
$(document).on('click','.menu-editor-wrap .delete',function() {
    if($(this).closest('ol').find('>li').length < 2)  {
       $(this).closest('ol').parent().find('.dd-collapse,.dd-expand').remove();
       $(this).closest('ol').remove();
       $(this).closest('li').remove();
    }
    else
    $(this).closest('li').remove();
    /*Link Reset */
    $('.dd').find('li').each(function(){
        if(!($(this).find('>ol').length)) {
            $(this).find('>a.dd-handle').removeAttr('data-toggle data-target').attr('href','example.html');
        }
    }); 
    
    /*Reset Individual link details Form*/
    $('.btn-cancel').trigger("click");
    return false;
});

/*Individual Icon Picker Click event*/
$(document).on('click','.icon-prev-block',function() {
    var idGen = Date.now().toString().substr(6);
    $(this).attr('data-icon-prev',idGen+'dip');
    $($(this).attr('data-target')).find('.hk-icon-picker').attr('data-icon-pick',idGen+'dip');
    return false;
});
$(document).on('click','.hk-icon-picker >span.feather-icon',function() {
    var selId = $(this).closest('.hk-icon-picker').attr('data-icon-pick');
    $('[data-icon-prev="'+selId+'"]').find('.feather-icon').html($(this).html());
    $(this).closest('.modal').modal('hide');
    return false;
});
var prLinkSel,indiColor,badgeType,badgeColor;
$(document).on('change','.pr-link-type', function(e) {
    if(this.value == 1 || this.value == 2) {
        $('.form-indicator-option').collapse('show');
        $('.form-badge-option').collapse('hide');
        $('.indicator-color').trigger("change");
    }
    else if(this.value == 3 || this.value == 4 || this.value == 5) {
        $('.form-indicator-option').collapse('hide');
        $('.form-badge-option').collapse('show');
        $('.badge-type,.badge-color').trigger("change");
    }
    else {
        $('.form-indicator-option').collapse('hide');
        $('.form-badge-option').collapse('hide');
    }
    prLinkSel =  this.value;    
  });
  $(document).on('change','.indicator-color', function(e) {
    indiColor = this.value;
  });
  $(document).on('change','.badge-type', function(e) {
    badgeType = this.value;
  });
  $(document).on('change','.badge-color', function(e) {
    badgeColor = this.value;
  });
  
 /*Individual Link Details Save*/
$(document).on('click','.link-details-editor .btn.btn-save',function(e) {
    var modalOp = 1,
    targetLink = $('[data-link-target="'+$(this).closest('.link-details-editor').attr('data-link-detail')+'"]');
    if((prLinkSel == 3 || prLinkSel == 4 || prLinkSel == 5) && $(".link-details-editor input.badge-text").val()=="") {
        if($(".link-details-editor input.badge-text").val()=="") {
            modalOp = 0;
            $(".link-details-editor input.badge-text").addClass('is-invalid').trigger('focus');
        }
    }
    else {
        if(targetLink.closest('li').hasClass('dd-depth-0'))
            targetLink.closest('li').find('>a.dd-handle .nav-link-text').text($(this).closest('.link-details-editor').find('input.link-name').val());
            else//For sub link text
                targetLink.closest('li').find('>a.dd-handle').html($(this).closest('.link-details-editor').find('input.link-name').val());
        targetLink.closest('li').find('>a.dd-handle').attr('href',$(this).closest('.link-details-editor').find('input.link-address').val());
        targetLink.closest('li').find('>a.dd-handle .nav-icon-wrap').html($(this).closest('.link-details-editor').find('.icon-prev-block').html());
        if(prLinkSel == 1) {
            targetLink.closest('li').find('>a.dd-handle .badge').remove();
            targetLink.closest('li').find('>a.dd-handle').removeClass('link-badge-right');
            targetLink.closest('li').find('>a.dd-handle .nav-link-text').removeClass('badge-on-text-right').addClass('badge-on-text').append('<span class="badge badge-'+indiColor+' badge-indicator"></span>');
        }
        else if(prLinkSel == 2) {
            targetLink.closest('li').find('>a.dd-handle .badge').remove();
            targetLink.closest('li').find('>a.dd-handle').removeClass('link-badge-right');
            targetLink.closest('li').find('>a.dd-handle .nav-link-text').removeClass('badge-on-text badge-on-text-right');
            targetLink.closest('li').find('>a.dd-handle .nav-icon-wrap > .feather-icon').addClass('badge-on-icon').append('<span class="badge badge-'+indiColor+' badge-indicator"></span>');
        }
        else if(prLinkSel == 3) {
            targetLink.closest('li').find('>a.dd-handle .badge').remove();
            targetLink.closest('li').find('>a.dd-handle').removeClass('link-badge-right');
            targetLink.closest('li').find('>a.dd-handle .nav-link-text').removeClass('badge-on-text').addClass('badge-on-text-right').append('<span class="badge '+badgeType+'-'+badgeColor+'">'+$(this).closest('.link-details-editor').find('input.badge-text').val()+'</span>');
        }
        else if(prLinkSel == 4) {
            targetLink.closest('li').find('>a.dd-handle .badge').remove();
            targetLink.closest('li').find('>a.dd-handle').removeClass('link-badge-right');
            targetLink.closest('li').find('>a.dd-handle .nav-link-text').removeClass('badge-on-text badge-on-text-right');
            targetLink.closest('li').find('>a.dd-handle').addClass('link-badge-right').append('<span class="badge '+badgeType+'-'+badgeColor+'">'+$(this).closest('.link-details-editor').find('input.badge-text').val()+'</span>');
        }
        else if(prLinkSel == 5) {
            targetLink.closest('li').find('>a.dd-handle .badge').remove();
            targetLink.closest('li').find('>a.dd-handle').removeClass('link-badge-right');
            targetLink.closest('li').find('>a.dd-handle .nav-link-text').removeClass('badge-on-text badge-on-text-right');
            targetLink.closest('li').find('>a.dd-handle .nav-icon-wrap > .feather-icon').addClass('badge-on-icon').append('<span class="badge '+badgeType+'-'+badgeColor+' badge-sm">'+$(this).closest('.link-details-editor').find('input.badge-text').val()+'</span>');
        }
        else {
            targetLink.closest('li').find('>a.dd-handle .badge').remove();
            targetLink.closest('li').find('>a.dd-handle').removeClass('link-badge-right');
            targetLink.closest('li').find('>a.dd-handle .nav-link-text').removeClass('badge-on-text badge-on-text-right');
        }
    }   
    if ( modalOp == 1)
        $(this).closest('.modal').modal('hide');    
    return false;
});
 /*Individual Link Details Cancel*/
$(document).on('click','.link-details-editor .btn.btn-cancel',function(e) {
    $(this).closest('.link-details-editor').collapse('hide');
    $(this).closest('.link-details-editor').find('.card').remove();
    return false;
});
/*Add New Group*/
$(document).on('click','.add-new-group',function(e) {
    $('.dd').append('<div class="menu-group bldr-menu-group"><div class="group-header"><span>Group</span><div class="group-action-link"><a href="#" class="btn btn-icon btn-flush-light btn-rounded flush-soft-hover add-main-link btn-sm text-white" ><span class="btn-icon-wrap"><span class="feather-icon"><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></span></span></a><a href="#" class="btn btn-icon btn-flush-light btn-rounded flush-soft-hover add-nav-header btn-sm text-white" ><span class="btn-icon-wrap"><span class="feather-icon"><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg></span></span></a><a href="#" class="btn btn-sm btn-icon btn-flush-light text-white btn-rounded flush-soft-hover delete-group" ><span class="btn-icon-wrap"><span class="feather-icon"><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a></div></div><ul class="navbar-nav flex-column dd-list"></div>');
    return false;
});

/*Add Main Link*/
$(document).on('click', '.add-main-link', function (e) {
    $(this).closest('.menu-group').find('>.navbar-nav.dd-list').append('<li class="nav-item dd-depth-0 dd-item"> <a class="nav-link dd-handle" href="example.html"><i class="ri-checkbox-blank-circle-fill"></i> <span class="nav-icon-wrap"><span class="feather-icon"><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></span></span> <span class="nav-link-text">New Primary Link</span> </a><span class="menu-editor-wrap"><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover add-sub-link btn-sm"><span class="btn-icon-wrap"><span class="feather-icon"><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></span></span></a><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit btn-sm" data-toggle="modal" data-target="#linkDetailsEditor"><span class="btn-icon-wrap"><span class="feather-icon"><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></span></span></a><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete btn-sm"><span class="btn-icon-wrap" ><span class="feather-icon" ><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a><div></div></span></li>');
    /*Remove Placeholder list*/
    $(this).closest('.menu-group').find('li.placeholder-list').remove();
    $(this).closest('.menu-group').find('.navbar-nav').append('<li class="nav-item placeholder-list dd-depth-0 dd-item"></li>');

    return false;
});

/*Delete Group*/
$(document).on('click', '.delete-group', function (e) {
    $(this).closest('.menu-group').remove();
    return false;
});

/*Add Sub Link*/
$(document).on('click', '.add-sub-link', function (e) {
    if($(this).closest('li').find('.dd-collapse').length <= 0)
        $(this).closest('li').prepend('<button class="dd-collapse" data-action="collapse" type="button">Collapse</button><button class="dd-expand" data-action="expand" type="button">Expand</button>');
    if($(this).closest('li').find('>ol.dd-list').length <= 0)
        if($(this).closest('li').hasClass('dd-depth-0'))
            $(this).closest('li').append('<ol class="dd-list sel-lvl-1"><li class="nav-item dd-item dd-depth-1"> <a class="nav-link dd-handle" href="example.html">New Sub Link </a><span class="menu-editor-wrap"><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover add-sub-link btn-sm"><span class="btn-icon-wrap"><span class="feather-icon"><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></span></span></a><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit btn-sm" data-toggle="modal" data-target="#linkDetailsEditor"><span class="btn-icon-wrap"><span class="feather-icon"><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></span></span></a><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete btn-sm"><span class="btn-icon-wrap" ><span class="feather-icon" ><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a><div></div></span></li></ol>');
            else
                $(this).closest('li').append('<ol class="dd-list sel-lvl-2"><li class="nav-item dd-item dd-depth-2"> <a class="nav-link dd-handle" href="example.html">New Sub Link </a><span class="menu-editor-wrap"><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover add-sub-link btn-sm"><span class="btn-icon-wrap"><span class="feather-icon"><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></span></span></a><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit btn-sm" data-toggle="modal" data-target="#linkDetailsEditor"><span class="btn-icon-wrap"><span class="feather-icon"><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></span></span></a><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete btn-sm"><span class="btn-icon-wrap" ><span class="feather-icon" ><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a><div></div></span></li></ol>');
        else if($(this).closest('li').hasClass('dd-depth-1'))
            $(this).closest('li').find('>ol.dd-list').append('<li class="nav-item dd-item dd-depth-2"> <a class="nav-link dd-handle" href="example.html">New Sub Link </a><span class="menu-editor-wrap"><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover add-sub-link btn-sm"><span class="btn-icon-wrap"><span class="feather-icon"><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></span></span></a><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit btn-sm" data-toggle="modal" data-target="#linkDetailsEditor"><span class="btn-icon-wrap"><span class="feather-icon"><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></span></span></a><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete btn-sm"><span class="btn-icon-wrap" ><span class="feather-icon" ><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a><div></div></span></li>');
        else
            $(this).closest('li').find('>ol.dd-list').append('<li class="nav-item dd-item dd-depth-1"> <a class="nav-link dd-handle" href="example.html">New Sub Link </a><span class="menu-editor-wrap"><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover add-sub-link btn-sm"><span class="btn-icon-wrap"><span class="feather-icon"><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></span></span></a><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit btn-sm" data-toggle="modal" data-target="#linkDetailsEditor"><span class="btn-icon-wrap"><span class="feather-icon"><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></span></span></a><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete btn-sm"><span class="btn-icon-wrap" ><span class="feather-icon" ><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a><div></div></span></li>');
        /*After Link Creation collapse creation */
        var idGen = Date.now().toString().substr(6);
        if(!($(this).closest('li').find('>a.nav-link').attr('href')=='javascript:void(0);')){
            $(this).closest('li').find('>a.nav-link').attr({'href':'javascript:void(0);', 'data-toggle': 'collapse','data-target': '#'+idGen+'id_gen'});
            $(document).on('click','[data-target="#'+idGen+'id_gen"]',function() {
                if($(this).attr('aria-expanded')=='true')
                    $(this).attr('aria-expanded','false');
                    else
                    $(this).attr('aria-expanded','true');
                $('#'+idGen+'id_gen').collapse('toggle');
            });
        } 
});
/*Add Nav Header*/
$(document).on('click', '.add-nav-header', function (e) {
    if(!($(this).closest('.menu-group').find('.nav-header').length>0)){
        $( '<div class="nav-header"><span contenteditable="true">Header</span><div class="header-action-link"><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete-nav-header btn-sm" ><span class="btn-icon-wrap"><span class="feather-icon"><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a></div>' ).insertAfter($(this).closest('.menu-group').find('.group-header'));
        $(this).closest('.menu-group').find('.nav-header > span').trigger('focus');
    }
    $(this).addClass('disabled').attr('disabled','true').trigger('blur');
    return false;
});
/*Delete Nav Header*/
$(document).on("click",'.delete-nav-header', function(e){ 
    $(this).closest('.menu-group').find('.add-nav-header').removeClass('disabled').removeAttr('disabled');
    $(this).closest('.nav-header').remove();
    return false;
});
/*Save Menu*/
$(document).on('click', '.save-menu', function (e) {
    var newMenu = $($('.dd').html());
    newMenu.find('ol').each(function(){
        $(this).wrap('<ul id="'+$(this).closest('li').find('a').attr('data-target').substring(1)+'" class="nav flex-column  secondary-nav hk-vertical-line collapse show"><li class="nav-item">');
    });
    /*Replacing all ol to ul */
    var olCount = newMenu.find('ol').length;
    for(var i=0; i<olCount; i++) 
    {
        newMenu.find('ol').each(function(){
            $( this ).replaceWith( "<ul class='nav flex-column'>" + $( this ).html() + "</ul>" );
        });
    }
    newMenu.find('.dd-collapse,.dd-expand,.link-details-editor,.ri-checkbox-blank-circle-fill,.menu-editor-wrap,.placeholder-list,.add-sub-link').remove();
    newMenu.find('a.nav-link').removeAttr('aria-expanded');
    newMenu.find('.nav-header').each(function(){
        if($(this).find('span').text()=="")
            $(this).remove();
    });
        
    newMenu.find('.nav-header > span').removeAttr('contenteditable');
    newMenu.find('ul.secondary-nav').removeClass('show');
    newMenu.find('.group-header,.header-action-link').remove();
    $wrapper.find('.hk-menu .menu-group,.hk-menu .menu-gap').remove();
    $(newMenu).prependTo('.menu-content-wrap');
    $wrapper.find('li,a,ul').removeClass('dd-item dd-handle dd-list dd-depth-0 dd-depth-1 dd-depth-2 dd-collapsed');
    $wrapper.find('.navbar-nav > .nav-item > ul.secondary-nav').addClass('collapse-level-1');
    $wrapper.find('.navbar-nav > .nav-item > ul.secondary-nav > li > ul > li  ul.secondary-nav').addClass('collapse-level-2');
    $wrapper.find('.menu-group').removeClass('bldr-menu-group').after( "<div class='menu-gap'></div>" );
    $wrapper.find('div.menu-gap').filter(':last').remove();
    saveStorage();
});

/*SimpleBar Init*/
var simpleBarInit = function(){
    const simpleBar = new SimpleBar(document.querySelector('.ns1'));
    const simpleBar1 = new SimpleBar(document.querySelector('.dropdown-body'));
    const simpleBar2 = new SimpleBar(document.querySelector('.ns2'));
}

// Check for Previous Work
var saved = localStorage.getItem('savePage');
var savedFav = localStorage.getItem('favIcon');

$(document).on('click', '#pre_work', function (e) {
    $(this).addClass('d-none');
    if(saved) {
        $('body').find('.hk-wrapper').remove();
        $(saved).prependTo('body');
        $wrapper = $(".hk-wrapper");
        $wrapper.find('.simplebar-content').children().unwrap().unwrap().unwrap().unwrap().unwrap();
        $wrapper.find('div[class^="simplebar-"]').remove();
        $wrapper.find('[data-simplebar]').attr('data-simplebar','');
        horNavigation();
        simpleBarInit();
    }	
    if(savedFav)
        $("link[rel~='icon']").attr("href",savedFav);
});
if (saved || savedFav) {
    $("#pre_work").removeClass('d-none');
}
    
/*Save Changes*/
var saveStorage = function(e){
    var savePage = "";
    savePage = $.trim($('.page-wrap .active-bpage').text());
    localStorage.setItem(savePage, $wrapper.clone().wrap("<div />").parent().html());
}
/*Page Save*/
$(document).on('click', '#create_page', function (e) {
    var flag,
    pageName = $('#page_name_text').val();
    $(".page-wrap .page-name").each(function(){
        if($(this).text()==pageName)
            flag = 1;
    });
    if(!flag==1) {
        $('.page-wrap .page-name').removeClass('active-bpage');
        $('<div class="page-name active-bpage"><span>'+pageName+'</span><div class="page-editor-wrap"><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover download-indi-page btn-sm"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></span></span></a><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover rename-indi-page btn-sm" data-toggle="modal" data-target="#linkDetailsEditor"><span class="btn-icon-wrap"><span class="feather-icon"><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></span></span></a><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete-indi-page btn-sm"><span class="btn-icon-wrap"><span class="feather-icon"><svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a><div></div></div></div>').appendTo('.page-wrap');
    }
    else
        alert("dont use same name");
});
/*Export Jamp file*/
$(document).on('click', '.download-indi-page', function (e) {
    var savePage = $.trim($(this).closest('.page-name').find('>span').text());alert(savePage);
    var saved = localStorage.getItem(savePage);
    alert(saved);
    if(!saved) {alert();
        saved = $wrapper.clone().wrap("<div />").parent().html(); 
    }
        
    var savedFav = localStorage.getItem('favIcon');
    var n;
    if(savedFav) {//checking for favicon
        var favLink = '<link id="fav_icon" rel="icon" href="'+savedFav+'" type="image/x-icon">';
        n = JSON.stringify(saved + favLink);
    }
    else
        n = JSON.stringify(saved);
    var j = he.encode(n,{
      'encodeEverything': true,
    });
    var blob = new Blob([n], {
        type: "base64"
    });
    saveAs(blob, savePage+".jamp");
});  
/*Layout Switch*/
$(document).on('click', '.layout-1', function (e) {
    $wrapper.find('.bldr-vrt-component,.bldr-hrz-component,.bldr-brz-component,.bldr-irt-component,.hk-menu,.hk-navbar').remove();
    $wrapper.removeClass('hk__horizontal__menu hk__sub__menu__toggle hk__icon__menu').addClass('hk__sidebar__menu');
    $($('.hk-bldr-vrn').html()).prependTo('.hk-wrapper');
    simpleBarInit();
    saveStorage();
});
$(document).on('click', '.layout-2', function (e) {
    $wrapper.find('.bldr-vrt-component,.bldr-hrz-component,.bldr-brz-component,.bldr-irt-component,.hk-menu,.hk-navbar').remove();
    $wrapper.removeClass('hk__sidebar__menu hk__sub__menu__toggle hk__icon__menu').addClass('hk__horizontal__menu');
    $($('.hk-bldr-hrn').html()).prependTo('.hk-wrapper');
    horNavigation();
    simpleBarInit();
    saveStorage();
});

$(document).on('click', '.layout-3', function (e) {
    $wrapper.find('.bldr-vrt-component,.bldr-hrz-component,.bldr-brz-component,.bldr-irt-component,.hk-menu,.hk-navbar').remove();
    $wrapper.removeClass('hk__sidebar__menu hk__horizontal__menu hk__sub__menu__toggle hk__icon__menu');
    $($('.hk-bldr-brn').html()).prependTo('.hk-wrapper');
    simpleBarInit();
    saveStorage();
});

$(document).on('click', '.layout-4', function (e) {
    $wrapper.find('.bldr-vrt-component,.bldr-hrz-component,.bldr-brz-component,.bldr-irt-component,.hk-menu,.hk-navbar').remove();
    $wrapper.removeClass('hk__sidebar__menu hk__horizontal__menu').addClass('hk__icon__menu hk__sub__menu__toggle');
    $($('.hk-bldr-irn').html()).prependTo('.hk-wrapper');
    simpleBarInit();
    saveStorage();
});

/*Layout Switch*/ 
$(document).on('click', '.theme-switch-wrap a', function (e) {
    $wrapper.removeClass(function (index, className) {
        return (className.match (/\hk__theme__\S+/g) || []).join(' ');
    });
    $wrapper.addClass($(this).attr('class'));
    saveStorage();
    return false;
});

/*Beautify Option*/
options = {
    indent_inner_html: !0,
    indent_size: 4,
    indent_char: " ",
    wrap_line_length: 0,
    brace_style: "expand",
    preserve_newlines: !1,
    max_preserve_newlines: 0,
    indent_handlebars: !1,
    extra_liners: ["/html", "/head","/a", "/body"]
}

$(document).on('click', '#export', function (e) {
    /*Clone*/
    var blockContent = $('.block-content-join');
    blockContent.empty();
    blockContent.append($wrapper.clone().wrap("<div />").parent().html()).find('.simplebar-content').children().unwrap().unwrap().unwrap().unwrap().unwrap();
    blockContent.find('div[class^="simplebar-"]').remove();
    blockContent.find('[data-simplebar]').attr('data-simplebar','');
    blockContent.find('.bldr-vrt-component,.bldr-hrz-component,.bldr-brz-component,.bldr-irt-component').children().unwrap();
    blockContent.find('.hk-pg-wrapper').removeAttr('style');
    
    /*Feather Icons*/
    $(".block-content-join .feather-icon").each(function(){
        var className = $(this).find('svg').attr("class").match(/feather-[\w-]*\b/).toString();
        var ret = className.slice(8); 
        $(this).find('svg').replaceWith('<i data-feather="'+ret+'"></i>')
    });
    
    /*Download Zip file*/
    var htmlString,zip, 
    $this = $(this);
    $this.text('wait').attr('disabled','disabled')
    htmlString = $('#hkt code').text() + html_beautify($(".block-content-join").html(), options) + $('#hkf code').text();
    /*Check FavIcon*/
    if(savedFav)
        htmlString = htmlString.replace(/favicon.ico/gi, savedFav);
    zip = new JSZip();
    zip.file("test.html", htmlString);
    zip.generateAsync({type:"blob"})
    .then(function(content) {
        //see FileSaver.js
        saveAs(content, "test.zip");
        setTimeout(function(){
            $this.text('export').removeAttr('disabled')
        },5000);
    });
});    

/*Export Jamp file*/
$(document).on('click', '#export_jamp', function (e) {
    var saved = localStorage.getItem('savePage');
    if(!saved) 
        saved = $wrapper.clone().wrap("<div />").parent().html(); 
    var savedFav = localStorage.getItem('favIcon');
    var n;
    if(savedFav) {//checking for favicon
        var favLink = '<link id="fav_icon" rel="icon" href="'+savedFav+'" type="image/x-icon">';
        n = JSON.stringify(saved + favLink);
    }
    else
        n = JSON.stringify(saved);
    var j = he.encode(n,{
      'encodeEverything': true,
    });
    var blob = new Blob([n], {
        type: "base64"
    });
    saveAs(blob, $('#page_name').val()+".jamp");
}); 

/*After Import file*/
function onFileLoad(elementId, event) {
    var h = he.decode(event.target.result);
    var pString = JSON.parse(h);
    localStorage.setItem('savePage', pString);
    $('body').find('.hk-wrapper').remove();
    $(pString).prependTo('body');
    $wrapper = $(".hk-wrapper");
    $wrapper.find('.simplebar-content').children().unwrap().unwrap().unwrap().unwrap().unwrap();
    $wrapper.find('div[class^="simplebar-"]').remove();
    $wrapper.find('[data-simplebar]').attr('data-simplebar','');
    var srcFav = $('#fav_icon').attr('href');
    if (srcFav) {//checking for favicon
        var link = $("link[rel~='icon']");
        link.attr("href",srcFav);
    }
    horNavigation();
    simpleBarInit();
}

function onChooseFile(event, onLoadFileHandler) {
    if (typeof window.FileReader !== 'function')
        throw ("The file API isn't supported on this browser.");
    let input = event.target;
    if (!input)
        throw ("The browser does not properly implement the event object");
    if (!input.files)
        throw ("This browser does not support the `files` property of the file input.");
    if (!input.files[0])
        return undefined;
    let file = input.files[0];
    let fr = new FileReader();
    fr.onload = onLoadFileHandler;
    fr.readAsText(file);
}
$(document).on('change', '.file-upload', function (e) {
    onChooseFile(event, onFileLoad.bind(this, "contents"));
});

/*Imgs Prev Gallery*/
var imgUploader = function(dir,target){
    var e = "";
    e = $(target).find(".prev-img-gallery").attr("data-imgs").split(",");
    $('.prev-img-gallery').empty();
    e.forEach(function(e) {
        var imgW = '<div class="img-wrap"><img class="img-fluid" src="'+dir+'' + e + '" "/>';
        $('.prev-img-gallery').append(imgW);
    })
    $(document).on('change', '.img-upload-trigger', function (e) {
        var filename = $(this).val();
        for (var i = 0; i < this.files.length; i++)
        {
            var imgW = '<div class="img-wrap"><img class="img-fluid" src="'+dir+'' + this.files.item(i).name + '"/>';
            $('.prev-img-gallery').append(imgW);
            $('.prev-img-gallery img').on("error", function () {
                $(this).parent().remove();
            });
        }
    });
}
$(document).on('click', '.img-wrap', function (e) {
    var srcImg = $(this).find('img').attr('src');
    $(this).closest('.hk-img-upl-prev').find('.prev-img img').attr('src',srcImg);
});

/*Brand Img Gallery Init*/
$(document).on('click', '.btn-brand-pick ,.navbar-brand', function (e) {
    e.preventDefault();
    imgUploader("dist/img/","#exampleModalImg");
    $('#exampleModalImg').modal('show');
    return false;
});
$(document).on('click', '.btn-img-save', function (e) {
    var srcImg = $(this).closest('.hk-img-upl-prev').find('.prev-img img').attr('src');
    $('.navbar-brand').find('img').attr('src',srcImg);
    saveStorage();
});

/*Fav Icon Gallery Init*/
$(document).on('click', '.btn-fav-pick', function (e) {
    imgUploader("",$(this).attr('data-target'));
});
$(document).on('click', '.btn-fav-save', function (e) {
    var srcFav = $(this).closest('.hk-img-upl-prev').find('.prev-img img').attr('src');
    var link = $("link[rel~='icon']");
    link.attr("href",srcFav);
    localStorage.setItem('favIcon',srcFav);
});

