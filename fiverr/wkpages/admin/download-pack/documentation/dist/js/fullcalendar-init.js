/*Full Calendar JS*/

//Small Calendar
$('input[name="calendar"]').daterangepicker({
	singleDatePicker: true,
	showDropdowns: false,
	minYear: 1901,
	"cancelClass": "btn-secondary",
	autoApply :true,
	parentEl: "#inline_calendar",
});
$('input[name="calendar"]').trigger("click");


var curYear = moment().format('YYYY'), 
curMonth = moment().format('MM');

document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar'),
 calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    initialDate: curYear+'-'+curMonth+'-07',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
	themeSystem: 'bootstrap',
	height: 'parent',
	droppable: true,	
	editable: true,
	events: [
      {
		backgroundColor: '#FFC400',
		borderColor: '#FFC400',
        title: '9:30 AM - 8:00 PM Awwards Conference',
		start: curYear+'-'+curMonth+'-04',
		end: curYear+'-'+curMonth+'-06',
	  },
      {
		backgroundColor: '#da82f8',
		borderColor: '#da82f8',
        title: 'Jampack Team Meet',
        start: curYear+'-'+curMonth+'-13',
        end: curYear+'-'+curMonth+'-15'
      },
      {
		backgroundColor: '#da82f8',
		borderColor: '#da82f8',
        title: 'Project meeting with delegates',
        start: curYear+'-'+curMonth+'-19'
      },
      {
		backgroundColor: '#298DFF',
		borderColor: '#298DFF',
        title: 'Conference',
        start: curYear+'-'+curMonth+'-11',
        end: curYear+'-'+curMonth+'-13'
      },
      {
		title: 'Call back to Morgan Freeman',
        start: curYear+'-'+curMonth+'-27T10:30:00',
      },
      {
		title: 'Grocery Day',
        start: curYear+'-'+curMonth+'-27T12:00:00'
      },
      {
		title: 'Follow-up call with client',
        start: curYear+'-'+curMonth+'-7T14:30:00'
      },
      {
		title: 'Follow-up call with client',
        start: curYear+'-'+curMonth+'-07T07:00:00',
	  },
	  {
		title: 'Grocery Day',
        start: curYear+'-'+curMonth+'-02T07:00:00',
	  },
      {
		backgroundColor: '#298DFF',
		borderColor: '#298DFF',
        title: '<i class="ri-plane-fill"></i><span>2:35 PM  Flight to Indonesia</span>',
        url: 'http://google.com/',
		start: curYear+'-'+curMonth+'-13',
		extendedProps:{
			toHtml: 'convert'
		}
	  },
	  {
		backgroundColor: '#007D88',
		borderColor: '#007D88',
        title: "<i class='ri-cake-line'></i><span>Boss's Birthday</span>",
        start: curYear+'-'+curMonth+'-29',
		extendedProps:{
			toHtml: 'convert'
		}
	  }
    ],
	eventContent: function(arg) {
	  if (arg.event.extendedProps.toHtml) {
			return { html: arg.event.title }
	  } 
	}
  });
  calendar.render();
});

/*Extra Costomization*/
setTimeout(function(){
	$('.fc-header-toolbar').append('<div class="hk-sidebar-togglable"></div>');
	$('.fc-today-button').removeClass('btn-primary').addClass('btn-outline-light');
	$('.fc-dayGridMonth-button,.fc-timeGridWeek-button,.fc-timeGridDay-button').removeClass('btn-primary').addClass('btn-outline-light');
	$('.fc-prev-button,.fc-next-button').addClass('btn-icon btn-flush-dark btn-rounded flush-soft-hover').find('.fa').addClass('btn-icon-wrap');
	$('.fc-toolbar-chunk:nth-child(3)').append('<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover hk-navbar-togglable" href="#" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Collapse"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-up"><polyline points="18 15 12 9 6 15"></polyline></svg></span><span class="feather-icon d-none"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg></span></span></a>');
	$('.fc-prev-button,.fc-next-button').addClass('btn-icon btn-flush-dark btn-rounded flush-soft-hover').find('.fa').addClass('btn-icon-wrap');
},100);
	
$(document).on("click",".add-event",function (e) {
	setTimeout(function(){
		$('.alert.alert-dismissible .close').addClass('btn-close').removeClass('close');
	},100);
	$.notify({
		icon: 'ri-checkbox-line mr-5',
		message: "Event has been created",
	},{	
		type: "dismissible alert alert-inv alert-inv-primary",
		placement: {
			from: "bottom",
			align: "center"
		},
		animate: {
			enter: 'animated fadeInUp',
			exit: 'animated fadeOutUp'
		},
		delay: 1000,
	});
	return false;
});
