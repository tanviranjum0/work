/*Full Calendar JS*/
var curYear = moment().format('YYYY'), 
curMonth = moment().format('MM'),
preMonth = moment().subtract(1, 'months').format('MM'),
nxtMonth = moment().add(1, 'months').format('MM');

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
		backgroundColor: '#DADDE1',
		borderColor: '#DADDE1',
        title: '<span class="text-charcoal-dark-3">Thanksgiving Weekend</span>',
        start: curYear+'-'+curMonth+'-09',
        end: curYear+'-'+curMonth+'-11',
		extendedProps:{
			toHtml: 'convert'
		}
      },
	  {
		backgroundColor: '#DADDE1',
		borderColor: '#DADDE1',
        title: '<span class="text-charcoal-dark-3">Thanksgiving Weekend</span>',
        start: curYear+'-'+curMonth+'-11',
		extendedProps:{
			toHtml: 'convert'
		}
      },
	  {
		backgroundColor: '#DADDE1',
		borderColor: '#DADDE1',
        title: '<span class="text-charcoal-dark-3">Onam Festival</span>',
        start: curYear+'-'+curMonth+'-12',
		extendedProps:{
			toHtml: 'convert'
		}
      },
	  {
		backgroundColor: '#da82f8',
		borderColor: '#da82f8',
         title: '<div class="avatar avatar-xs"><img src="dist/img/avatar7.jpg" alt="user" class="avatar-img rounded-circle"></div><span>Tom Cruz</span>',
        start: curYear+'-'+curMonth+'-05',
        classNames:'has-avatar',
		extendedProps:{
			toHtml: 'convert'
		}
      },
	   {
		backgroundColor: '#da82f8',
		borderColor: '#da82f8',
         title: '<div class="avatar avatar-xs"><img src="dist/img/avatar9.jpg" alt="user" class="avatar-img rounded-circle"></div><span>Katherine Jones</span>',
        start: curYear+'-'+curMonth+'-27',
        classNames:'has-avatar',
		extendedProps:{
			toHtml: 'convert'
		}
      },
	  {
		backgroundColor: '#ffc400',
		borderColor: '#ffc400',
         title: '<div class="avatar avatar-xs"><img src="dist/img/avatar13.jpg" alt="user" class="avatar-img rounded-circle"></div><span>Tyrian Lannister</span>',
        start: curYear+'-'+curMonth+'-28',
        classNames:'has-avatar',
		extendedProps:{
			toHtml: 'convert'
		}
      },
	  {
		backgroundColor: '#ffc400',
		borderColor: '#ffc400',
         title: '<div class="avatar avatar-xs"><img src="dist/img/avatar11.jpg" alt="user" class="avatar-img rounded-circle"></div><span>John Snow</span>',
        start: curYear+'-'+curMonth+'-28',
        classNames:'has-avatar',
		extendedProps:{
			toHtml: 'convert'
		}
      },
	   {
		backgroundColor: '#ffc400',
		borderColor: '#ffc400',
         title: '<div class="avatar avatar-xs"><img src="dist/img/avatar5.jpg" alt="user" class="avatar-img rounded-circle"></div><span>Jack Bower</span>',
        start: curYear+'-'+curMonth+'-16',
        classNames:'has-avatar',
		extendedProps:{
			toHtml: 'convert'
		}
      },
	  {
		backgroundColor: '#298DFF',
		borderColor: '#298DFF',
         title: '<div class="avatar avatar-xs"><img src="dist/img/avatar2.jpg" alt="user" class="avatar-img rounded-circle"></div><span>Morgan Freeman</span>',
        start: curYear+'-'+curMonth+'-06',
        end: curYear+'-'+curMonth+'-08',
        classNames:'has-avatar',
		extendedProps:{
			toHtml: 'convert'
		}
      },
	   {
		backgroundColor: '#298DFF',
		borderColor: '#298DFF',
         title: '<div class="avatar avatar-xs"><img src="dist/img/avatar3.jpg" alt="user" class="avatar-img rounded-circle"></div><span>Jaquiline Joker</span>',
        start: curYear+'-'+curMonth+'-19',
        end: curYear+'-'+curMonth+'-21',
        classNames:'has-avatar',
		extendedProps:{
			toHtml: 'convert'
		}
      },
	  {
		backgroundColor: '#da82f8',
		borderColor: '#da82f8',
         title: '<div class="avatar avatar-xs"><img src="dist/img/avatar10.jpg" alt="user" class="avatar-img rounded-circle"></div><span>Jim Carry</span>',
        start: curYear+'-'+curMonth+'-06',
        classNames:'has-avatar',
		extendedProps:{
			toHtml: 'convert'
		}
      },
      {
		backgroundColor: '#298DFF',
		borderColor: '#298DFF',
        title: '<div class="avatar avatar-xs"><span class="avatar-text avatar-text-success rounded-circle"><span class="initial-wrap"><span>C</span></span></span></div><span>Charlie Chaplin</span>',
        start: curYear+'-'+nxtMonth+'-04',
        end: curYear+'-'+nxtMonth+'-07',
		classNames:'has-avatar',
		extendedProps:{
			toHtml: 'convert'
		}
	  },
	   {
		backgroundColor: '#ffc400',
		borderColor: '#ffc400',
        title: '<div class="avatar avatar-xs"><img src="dist/img/avatar4.jpg" alt="user" class="avatar-img rounded-circle"></div><span>Mrs. Martina Hingis</span>',
        start: curYear+'-'+preMonth+'-31',
        end: curYear+'-'+curMonth+'-02',
		classNames:'has-avatar',
		extendedProps:{
			toHtml: 'convert'
		}
	  },
	  {
		backgroundColor: '#298DFF',
		borderColor: '#298DFF',
        title: '<div class="avatar avatar-xs"><span class="avatar-text avatar-text-primary rounded-circle"><span class="initial-wrap"><span>H</span></span></span></div><span>Hencework</span>',
        start: curYear+'-'+curMonth+'-14',
        end: curYear+'-'+curMonth+'-16',
		classNames:'has-avatar',
		extendedProps:{
			toHtml: 'convert'
		}
	  },
	  {
		backgroundColor: '#298DFF',
		borderColor: '#298DFF',
        title: '<div class="avatar avatar-xs"><span class="avatar-text avatar-text-danger rounded-circle"><span class="initial-wrap"><span>D</span></span></span></div><span>Danial Craig</span>',
        start: curYear+'-'+curMonth+'-02',
        end: curYear+'-'+curMonth+'-04',
		classNames:'has-avatar',
		extendedProps:{
			toHtml: 'convert'
		}
	  },
      {
		backgroundColor: '#298DFF',
		borderColor: '#298DFF',
        title: '<div class="avatar avatar-xs"><img src="dist/img/avatar8.jpg" alt="user" class="avatar-img rounded-circle"></div><span>Huma Therman</span>',
        start: curYear+'-'+curMonth+'-14',
		classNames:'has-avatar',
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
	$('.fc-today-button').removeClass('btn-primary').addClass('btn-outline-light');
	$('.fc-prev-button,.fc-next-button').addClass('btn-icon btn-flush-dark btn-rounded flush-soft-hover').find('.fa').addClass('btn-icon-wrap');
},100);
	