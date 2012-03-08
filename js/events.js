/***
 * Events Module - JS
 * Some jQuery functions for the forms
 ***/

$(document).ready(function () {

	$('table td').css('vertical-align','middle');

	//Init forms datepickers
	$('.datepicker').datepicker({
		dateFormat: 'dd-mm-yy',
		minDate: 0
	});

	//Init forms timepickers
	$('.timepicker').timepicker({
		'timeFormat': 'H:i'
	});

	//Checks if allday option is already checked(edit event) to hides timepickers
	if($('#form_allday').is(':checked')){
		$('#form_start_time_min').hide();
		$('#form_end_time_min').hide();
	}

	//Display or hide timepickers when allday is checked
	$('#form_allday').change(function() {
		if($('#form_allday').is(':checked')==true){
			$('#form_start_time_min').hide();
			$('#form_end_time_min').hide();
		}
		if($('#form_allday').is(':checked')==false){
			$('#form_start_time_min').show();
			$('#form_end_time_min').show();
		}
	});

	//Adapt enddate when startdate changes
	$('#form_start_time').change(function() {
		$('#form_end_time').val($('#form_start_time').val());
	});

	//Disable buttons when click on save
	$('form').submit(function(){
		$('#save').attr('class','btn active disabled btn-primary');
		$('#save').html('Saving ...');
		$('#cancel').hide();
	});

});