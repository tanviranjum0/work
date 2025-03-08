'use strict';
/*****Ready function start*****/
$(document).ready(function() {
	var navColor,topNavColor,scrollHeader;
	if(getCookie('sidenav-color')=='nav-light')
		$nav.removeClass('hk-nav-dark').addClass('hk-nav-light');
		else if(getCookie('sidenav-color')=='nav-dark')
			$nav.removeClass('hk-nav-light').addClass('hk-nav-dark');
	if(getCookie('topnav-color')=='topnav-light')
	$navbar.removeClass('navbar-dark').addClass('navbar-light');
	else if(getCookie('topnav-color')=='topnav-dark')
		$navbar.removeClass('navbar-light').addClass('navbar-dark');
	
	/*Builder Data*/
	$(document).on('click', '#nav_light_select', function (e) {
		navColor = 'nav-light';
		setCookie('sidenav-color',navColor);
		return false;
	});
	$(document).on('click', '#nav_dark_select', function (e) {
		navColor = 'nav-dark';
		setCookie('sidenav-color',navColor);
		return false;
	});
	$(document).on('click', '#navtop_light_select', function (e) {
		topNavColor = 'topnav-light';
		setCookie('topnav-color',topNavColor);
		return false;
	});
	$(document).on('click', '#navtop_dark_select', function (e) {
		topNavColor = 'topnav-dark';
		setCookie('topnav-color',topNavColor);
		return false;
	});
	$(document).on('click', '#preview_settings', function (e) {
		location.reload();
		return false;
	});
	$(document).on('click', '#export_settings', function (e) {
		$.ajax({
			type: 'POST',
			url: 'builder.php',
			data: ({
				send_color : navColor
			}),
			success: function(response){
				window.location = response;
				//alert(response);
			}
		})
		.always(
			//location.reload()
		)
		.done(done_func)
		.fail(fail_func);
		return false;
	});
	$(document).on('click', '#reset_settings', function (e) {
		deleteCookie('sidenav-color');
		deleteCookie('topnav-color');
		location.reload();
		return false;
	});
	$(document).on('click', '#menu_1', function (e) {
		menuType = 'nav-dark';
		setCookie('sidenav-color',navColor);
		return false;
	});
	/*Data Store*/
	if( $('.scroll-nav-switch').length > 0 ){
		$('.scroll-nav-switch').toggles({
			drag: true, // allow dragging the toggle between positions
			click: true, // allow clicking on the toggle
			text: {
			on: '', // text for the ON position
			off: '' // and off
			},
			on: false, // is the toggle ON on init
			animate: 250, // animation time (ms)
			easing: 'swing', // animation transition easing function
			checkbox: null, // the checkbox to toggle (for use in forms)
			clicker: null, // element that can be clicked on to toggle. removes binding from the toggle itself (use nesting)
			
			type: 'compact' // if this is set to 'select' then the select style toggle will be used
		});
		$('.scroll-nav-switch.toggle').on('toggle', function(e, active) {
			if (active) {
				$wrapper.addClass('scrollable-nav');
			} else {
				$wrapper.removeClass('scrollable-nav');
			}
		});
	}
	
	/*Delete Cookies*/
	function deleteCookie(cname) {
		document.cookie = cname+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	};
	
	/*Get Cookies*/
	function getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
		  c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
		  return c.substring(name.length, c.length);
		}
		}
		return "";
	}
	
	/*Set Cookies*/
	function setCookie(cname,cvalue,days) {
		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days*24*60*60*1000));
			expires = "; expires=" + date.toUTCString();
		}
		document.cookie = cname + "=" + (cvalue || "")  + expires + "; path=/";
	}
	/*Check Cookies*/
	function checkCookie(cname) {
	  var chkCookie = getCookie("cname");
	  if (chkCookie == null || chkCookie == "")  return 0;
		else return 1;
	}
	
	// Success function
	function done_func(response) {
	}

	// fail function
	function fail_func(data) {
	}
	
	/*form.submit(function (e) {
		e.preventDefault();
		form_data = $(this).serialize();
		$.ajax({
			type: 'POST',
			url: form.attr('action'),
			data: form_data,
			success: function(response){
				window.location = response;
			}
		})
		.done(done_func)
		.fail(fail_func);
	});*/
});
/*****Ready function end*****/

