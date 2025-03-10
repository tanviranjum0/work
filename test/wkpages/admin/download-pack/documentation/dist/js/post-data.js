/*DataTable Init*/

"use strict"; 

$(document).ready(function() {
		/*Select2*/
		$("#input_tags_1").select2({
			tags: true,
			tokenSeparators: [',', ' ']
		});
		
		/*Checkbox Add*/
		var tdCnt=0;
		$('table tr').each(function(){
			$('<span class="form-check form-check-theme"><input type="checkbox" class="form-check-input check-select" id="chk_sel_'+tdCnt+'"><label class="form-check-label" for="chk_sel_'+tdCnt+'"></label></span>').insertBefore($(this).find("td > .d-flex").eq(0));
			tdCnt++;
		});
		
		/*DataTable Init*/
		var targetDt = $('#datable_1').DataTable({
			"dom": '<"row"<"col-sm-12 col-md-6"<"post-toolbar-left">><"col-sm-12 col-md-6"<"post-toolbar-right"flip>>><"row"<"col-sm-12"t>><"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
			responsive: true,
			autoWidth: false,
			"ordering": true,
			"columnDefs": [ {
				"searchable": false,
				"orderable": false,
				"targets": [0,1,3,4,5,6,7,8,9]
			} ],
			"order": [2, 'asc' ],
			language: { search: "",
				searchPlaceholder: "Search Posts",
				"info": "_START_ - _END_ of _TOTAL_",
				sLengthMenu: "View  _MENU_",
				paginate: {
				  next: '<i class="ri-arrow-right-s-line"></i>', // or '→'
				  previous: '<i class="ri-arrow-left-s-line"></i>' // or '←' 
				}
			},
			"drawCallback": function () {
				$('.dataTables_paginate > .pagination').addClass('custom-pagination pagination-simple active-theme');
			}
		});
		var targetDt2 = $('#datable_2').DataTable({
			"dom": '<"row"<"col-sm-12 col-md-6"<"post-toolbar-left">><"col-sm-12 col-md-6"<"post-toolbar-right"flip>>><"row"<"col-sm-12"t>><"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
			responsive: true,
			autoWidth: false,
			"ordering": true,
			"columnDefs": [ {
				"searchable": false,
				"orderable": false,
				"targets": [0,1,3,4,5,6,7,8,9]
			} ],
			"order": [2, 'asc' ],
			language: { search: "",
				searchPlaceholder: "Search Posts",
				"info": "_START_ - _END_ of _TOTAL_",
				sLengthMenu: "View  _MENU_",
				paginate: {
				  next: '<i class="ri-arrow-right-s-line"></i>', // or '→'
				  previous: '<i class="ri-arrow-left-s-line"></i>' // or '←' 
				}
			},
			"drawCallback": function () {
				$('.dataTables_paginate > .pagination').addClass('custom-pagination pagination-simple active-theme');
			}
		});
		var targetDt3 = $('#datable_3').DataTable({
			"dom": '<"row"<"col-sm-12 col-md-6"<"post-toolbar-left">><"col-sm-12 col-md-6"<"post-toolbar-right"flip>>><"row"<"col-sm-12"t>><"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
			responsive: true,
			autoWidth: false,
			"ordering": true,
			"columnDefs": [ {
				"searchable": false,
				"orderable": false,
				"targets": [0,1,3,4,5,6,7,8,9]
			} ],
			"order": [2, 'asc' ],
			language: { search: "",
				searchPlaceholder: "Search Posts",
				"info": "_START_ - _END_ of _TOTAL_",
				sLengthMenu: "View  _MENU_",
				paginate: {
				  next: '<i class="ri-arrow-right-s-line"></i>', // or '→'
				  previous: '<i class="ri-arrow-left-s-line"></i>' // or '←' 
				}
			},
			"drawCallback": function () {
				$('.dataTables_paginate > .pagination').addClass('custom-pagination pagination-simple active-theme');
			}
		});
		
		$("div.post-toolbar-left").html('<div class="d-flex align-items-center form-group mb-0"> <select class="form-control custom-select custom-select-sm w-120p"><option selected>Bulk actions</option><option value="1">One</option><option value="2">Two</option><option value="3">Three</option> </select> <button class="btn btn-sm btn-light ms-10">Apply</button></div><div class="d-flex align-items-center form-group mb-0"> <label class="flex-shrink-0 mb-0 me-10">Sort by:</label> <select class="form-control custom-select custom-select-sm w-130p"><option selected>Date Created</option><option value="1">One</option><option value="2">Two</option><option value="3">Three</option> </select></div> <select class="d-flex align-items-center w-120p form-control custom-select custom-select-sm"><option selected>All Categories</option><option value="1">One</option><option value="2">Two</option><option value="3">Three</option> </select>');
		
		/*Select all using checkbox*/
		var  DT1 = $('#datable_1').DataTable();
		$(".check-select-all").on( "click", function(e) {
			$('.check-select').attr('checked', true);
			if ($(this).is( ":checked" )) {
				DT1.rows().select();    
				$('.check-select').prop('checked', true);			
			} else {
				DT1.rows().deselect(); 
				$('.check-select').prop('checked', false);
			}
		});
		var  DT2 = $('#datable_2').DataTable();
		$(".check-select-all").on( "click", function(e) {
			$('.check-select').attr('checked', true);
			if ($(this).is( ":checked" )) {
				DT2.rows().select();    
				$('.check-select').prop('checked', true);			
			} else {
				DT2.rows().deselect(); 
				$('.check-select').prop('checked', false);
			}
		});
		var  DT3 = $('#datable_3').DataTable();
		$(".check-select-all").on( "click", function(e) {
			$('.check-select').attr('checked', true);
			if ($(this).is( ":checked" )) {
				DT3.rows().select();    
				$('.check-select').prop('checked', true);			
			} else {
				DT3.rows().deselect(); 
				$('.check-select').prop('checked', false);
			}
		});
		$(".check-select").on( "click", function(e) {
			if ($(this).is( ":checked" )) {
				$(this).closest('tr').addClass('selected');        
			} else {
				$(this).closest('tr').removeClass('selected');
			}
		});
});