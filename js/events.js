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
		timeFormat: 'H:i'
	});

	//Checks if allday option is already checked(edit event) to hides timepickers
	if($('#form_allday').is(':checked')){
		$('#form_start_time_min').hide();
		$('#form_end_time_min').hide();
	}

	//Display or hide timepickers when allday is checked
	$('#form_allday').change(function() {
		if($('#form_allday').is(':checked') == true){
			$('#form_start_time_min').hide();
			$('#form_end_time_min').hide();
		}
		if($('#form_allday').is(':checked') == false){
			$('#form_start_time_min').show();
			$('#form_end_time_min').show();
		}
	});

	//Adapt enddate when startdate changes
	$('#form_start_time').change(function() {
		$('#form_end_time').val($('#form_start_time').val());
		$('#form_repeat_ends_date').datepicker( "option", "minDate",$('#form_start_time').datepicker("getDate")); //Restrict end repeating date
		alert('in');
	});

	//Display or hide timepickers when allday is checked
	$('#form_repeat').change(function() {
		if($('#form_repeat').is(':checked') == true){
			$('#repeatModal').modal('show');
			$('#repeat_edit').show();
		}
		if($('#form_repeat').is(':checked') == false){
			$('#repeat_edit').hide();
			//Enable submit in case user untick an invalid reccurence
			$('#save').removeAttr('disabled');
		}
	});

	//Disable buttons when click on save
	$('form').submit(function(){
		$('#save').attr('class','btn disabled btn-primary');
		$('#save').attr('disabled','disabled');
		$('#save').html('Saving ...');
		$('#cancel').hide();
	});

	$('#modal-save-only').click(function(){
		$('form').submit();
	});

	$('#modal-save-all').click(function(){
		$("#id-save-all").prop("checked", true);
		$('form').submit();
	});


	
	

	// ---------------------------
	// Handling all repeat options
	// Generate summary string
	// cf: Weekly, on wednesday, until 9 Mar, 2013
	// ---

	$('#repeatModal fieldset').change(function() {

		var start = new XDate($('#form_start_time').datepicker("getDate"));
		var base = $('#form_repeat_base').val();
		var every = null;
		var each = ", on ";
		var end = "";

		//Weekly
		if(base == "weekly")
		{
			base = "week";
			every = $('#form_repeat_weekly_every option:selected').text();
			$("input:checkbox[class='repeat_days']:checked").each(function()
				{
					each += $(this).val() + ", ";
				});
			//each = each.substr(0,each.length-2);
		}
		//Monthly
		else if(base == "monthly")
		{
			base = "month";
			every = $('#form_repeat_monthly_every option:selected').text();
			if($('input:radio[name=repeat_monthly_by]:checked').val() == "month")
			{
				each += "the " + get_dayOfMonth(start) + ", ";
			}
			if($('input:radio[name=repeat_monthly_by]:checked').val() == "week")
			{
				each += "the " + get_dayOfWeek(start) + ", ";
			}
		}

		if($('input:radio[name=repeat_ends]:checked').val() == "on")
		{
			end = new XDate($('#form_repeat_ends_date').datepicker("getDate"));
			end = "until the " + end.toString("d MMM, yyyy");
		}
		if($('input:radio[name=repeat_ends]:checked').val() == "after")
		{
			end = $('#form_repeat_ends_occurences').val() + " times";
		}

		//Add plural
		if(every != 1)
		{
			base  = " " + base + "s";
		}
		else
		{
			every = "";
		}

		//Throw error msg if no repeating days are selected
		if(each.length <= 5)
		{
			console.log("catch!!");
		}

		console.log("Every " + every + base + each + end);
	});


	//DELETE OLD !!
	//DELETE OLD !!
	//DELETE OLD !!
	$('#repeatModal').css('max-height','600px')

	var part_1 = null;
	var part_2 = null;
	var end = null;
	var summary = null;

	var start = null;

	var valid = true;

	var first_modal_open = true;

	//When the modal opens
	$('#repeatModal').on('show', function () {

		//Get starting date
		start = new XDate($('#form_start_time').datepicker("getDate"));

		//Set it
		set_startsOn(start);

		//If modal is open for the first time, check 'Repeat on'
		if(first_modal_open){
			$('input:checkbox[name=repeat_weekly_'+start.toString("dddd").toLowerCase()+']').prop("checked", true);
			$('#form_repeat_ends_date').datepicker( "setDate" , '+1y' );
			first_modal_open = false;
		}

		process(start);

	});

	$('#repeatModal fieldset').change(function(){
		start = new XDate($('#form_start_time').datepicker("getDate"));
		process(start);
	});

	//Change Weekly/Monthly Display
	$('#form_repeat_base').change(function() {
		if($('#form_repeat_base').val() == "weekly"){
			$('.form_monthly').hide();
			$('.form_weekly').show();
		}
		if($('#form_repeat_base').val() == "monthly"){
			$('.form_weekly').hide();
			$('.form_monthly').show();
		}
	});

	function set_startsOn(start){
		
		$('#repeat_start').html(start.toString("d MMM, yyyy '('dddd')'"));

	}

	function get_dayOfMonth(start){

		return day_of_month = start.toString("dS");

	}

	//..magic
	function get_dayOfWeek(start){
		
		var days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
		var prefixes = ['first', 'second', 'third', 'fourth', 'last'];

		var weekNum = 0 | start.getDate() / 7;
		weekNum = ( start.getDate() % 7 === 0 ) ? weekNum - 1 : weekNum;

		return day_of_the_week = prefixes[ weekNum ] + ' ' + days[ start.getDay() ];

	}


	function process(start){

		//init valid to true and go through the process
		valid = true;

		if($('#form_repeat_base option:selected').val() == "weekly"){

			if($('#form_repeat_weekly_every').val()==1){
				part_1 = "Every week";
			}else{
				part_1 = "Every " + $('#form_repeat_weekly_every option:selected').text() + " weeks";
			}

			part_2 = ", on ";

			if($('#form_repeat_weekly_monday').is(':checked')){
				part_2 += $('#form_repeat_weekly_monday').val() + ", ";
			}
			if($('#form_repeat_weekly_tuesday').is(':checked')){
				part_2 += $('#form_repeat_weekly_tuesday').val() + ", ";
			}
			if($('#form_repeat_weekly_wednesday').is(':checked')){
				part_2 += $('#form_repeat_weekly_wednesday').val() + ", ";
			}
			if($('#form_repeat_weekly_thursday').is(':checked')){
				part_2 += $('#form_repeat_weekly_thursday').val() + ", ";
			}
			if($('#form_repeat_weekly_friday').is(':checked')){
				part_2 += $('#form_repeat_weekly_friday').val() + ", ";
			}
			if($('#form_repeat_weekly_saturday').is(':checked')){
				part_2 += $('#form_repeat_weekly_saturday').val() + ", ";
			}
			if($('#form_repeat_weekly_sunday').is(':checked')){
				part_2 += $('#form_repeat_weekly_sunday').val() + ", ";
			}

			//If days are selected, delete last comma
			if(part_2.length > 5){
				part_2 = part_2.substr(0,part_2.length-2);
			}else{
				valid = false;
				part_2 = ", <span class='label label-important'>select repeating days</span> ";
			}

		}//endif weekly

		//console.log($('#form_repeat_base option:selected').val());
		
		if($('#form_repeat_base option:selected').val() == "monthly"){
			
			if($('#form_repeat_monthly_every').val()==1){
				part_1 = "Every month";
			}else{
				part_1 = "Every " + $('#form_repeat_monthly_every option:selected').text() + " months";
			}

			//console.log($('input:radio[name=repeat_monthly_by]:checked').val());

			if($('input:radio[name=repeat_monthly_by]:checked').val() == "month"){

				part_2 = ", on the " + get_dayOfMonth(start);
			}
			if($('input:radio[name=repeat_monthly_by]:checked').val() == "week"){
				part_2 = ", on the " + get_dayOfWeek(start);
			}

		}//endif monthly

		if($('input:radio[name=repeat_ends]:checked').val() == "on"){
				//TODO GET start date
				end = new XDate($('#form_repeat_ends_date').datepicker("getDate"));
				end = ", until " + end.toString("d MMM, yyyy");
			}
			if($('input:radio[name=repeat_ends]:checked').val() == "after"){
				//TODO GET start date
				end = ", " + $('#form_repeat_ends_occurences').val() + " times";
			}

		summary = part_1 + part_2 + end;
		$('.repeat_summary').html(summary);
		$('input[name=repeat_rule]').val(summary);

		//Alert user if repeating days might not exists (31Feb...)
		var start_day = start.toString("d");
		if( $('#form_repeat_base option:selected').val() == "monthly"
			&& $('input:radio[name=repeat_monthly_by]:checked').val() == "month"
			&& start_day>28){
			$('#alert_dayExist').html("<span class='label label-important'>The event will not repeat on months having less than " +start_day+ " days.</span>");
		}else{
			$('#alert_dayExist').empty();
		}


		//Valid? If not disable save submit
		if(!valid){
			$('#modal_done').attr('disabled','disabled');
			$('#save').attr('disabled','disabled');
		}else{
			$('#modal_done').removeAttr('disabled');
			$('#save').removeAttr('disabled');
		}

	}//end process

});