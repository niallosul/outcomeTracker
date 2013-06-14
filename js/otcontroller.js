function otcontroller () {


   //------------------- Add Dialogs -------------------------
	var wWidth = $(window).width();
    var wHeight = $(window).height();


	$( "#dialog-proj" ).dialog({
		autoOpen: false,
		height: wHeight * 0.8,
		width: wWidth * 0.9,
		modal: true
		});
		
	$( "#dialog-cond" ).dialog({
		autoOpen: false,
		width: wWidth * 0.7,
		modal: true
		});

	$( "#visitdate" ).datepicker({ 
	     dateFormat: 'yy-mm-dd'
	    });
	    	
	$( "#visitdate" ).datepicker("setDate", new Date() );
	//----------------------------------------------------------------





     //Add event Handlers
     $( "#diagdiv" ).find('.newItemText').on ('click',function() {
         $( "#diagsearch").slideToggle();
	 });
	 
	 $( "#procdiv" ).find('.newItemText').on ('click',function() {
         $( "#procsearch").slideToggle();
	 });
	 
	 $( "#provdiv" ).find('.newItemText').on ('click',function() {
         $( "#provsearch").slideToggle();
	 });
	 
	 $( "#visitdiv" ).find('.newItemText').on ('click',function() {
         $( "#visitsearch").slideToggle();
	 });

	 $( "#closegraph" ).on ('click',function() {
         $('#graphdiv').toggle();
	 });

     //$( "#patList").on('click', '.patlink', displayCondDetails);
     $( "#patList").on('click', '.patlink',function() {
         //console.log ($(this).data('condinfo')) ;
         displayCondDetails($(this).data('condinfo'), $(this).parents().find('.condlist').data('patinfo'));
	 });
     
     $( "#patList").on('click', '.newItemText', displayNewCondForm);	

	 $( "#octloginbutt" ).on ('click',function() {
        	var logonobj = new Object();
            logonobj.username=$( "#username" ).val();
            logonobj.password=$( "#password" ).val();

			/*-----Testing the Password Hash-----
			var testobj = new Object();
			var pwraw = $( "#password" ).val();
			var pwhash = CryptoJS.SHA3(pwraw);
			testobj.username = "TEST";
			testobj.password = pwhash.toString(CryptoJS.enc.Hex);
			console.log (JSON.stringify(testobj));
			console.log (testobj.password.length);
			/-----------------------------------*/
			
            var reqbody = JSON.stringify(logonobj);
			//console.log (reqbody);
			$.post("Src/login.php", reqbody)
			  .done(function(data) {
			    //console.log("REPLY-"+loginrep);
			    //var loginrep = $.parseJSON(data);
  			    //console.log(data);
  			    if (data == "No User found") {
			      alert ("Invalid Login");
		         }	
		        else {
			      loginuser (data);
		      }
		   });
	 });
	 
	 $( "#logoutbutt" ).on ('click',function() {
	 	    $( "#username" ).val("");
            $( "#password" ).val("");
        	$.post("Src/logout.php");
	        alert ("You're Logged Out");
	        showLoginPage();
	 });

	 $( "#dialog-cond" ).find('.savebutt').on ('click',function() {
	     var patinfo = $('#dialog-cond').data('patinfo');
         var condobj = new Object();
         condobj.patid=patinfo.id;
         condobj.condtext=$( "#newcond" ).val();
         var reqbody = JSON.stringify(condobj);
         console.log (reqbody);
         $.post($apiUrlBase+"patcond", reqbody )
			.done(function(data) {
			   console.log (data);
			   if (data == "Patient Condition Added"){
  			      var activeacc =  $('#pat-accord').accordion( "option", "active" );
  			      displayPatients($('#userscreen').data('userid'));
  			      //console.log (activeacc);
  			      $( "#newcond" ).val('');
  			      $( "#dialog-cond" ).dialog('close');
  			      //Listen for accordion completion and programatically open the previously open patient
  			      //and click the latest condition for that patient 
  			      $('#patList').one('dataModelChanged',function() { 
		             $('#pat-accord').accordion( "option", "active", activeacc );
		             $('#pat-accord').find('.condlist:eq('+activeacc+')').find('.patlink:eq(0)').trigger('click');
	              });
	           }
	           else {
	              alert (data);
	           }  
		 });        
	 });

	 $( '#savediag').on('click',function() {
         var diagobj = new Object();
         diagobj.condid=$('#diags').data('condid');
         diagobj.diagid=$('#diags').data('dbid');
         diagobj.provid=$('#userscreen').data('userid');
         var reqbody = JSON.stringify(diagobj);
         $.post($apiUrlBase+"conddiag", reqbody )
			.done(function(data) {
  			alert(data);
  			displayDiags($('#diags').data('condid'));
		 });
         $( '#diags' ).val('');
         $( "#diagsearch").slideToggle();
	 });
	 
	 
	 $( '#saveproc').on('click',function() {
         var procobj = new Object();
         procobj.condid=$('#procs').data('condid');
         procobj.procid=$('#procs').data('dbid');
         procobj.provid=$('#userscreen').data('userid');
         var reqbody = JSON.stringify(procobj);
         $.post($apiUrlBase+"condproc", reqbody )
			.done(function(data) {
  			alert(data);
  			displayProcs($('#procs').data('condid'));
		 });
         $( '#procs' ).val('');
         $( "#procsearch").slideToggle();
	 });
	 
	 
	 $( '#saveprov').on('click',function() {
         var reqobj = new Object();
         reqobj.condid=$('#provs').data('condid');
         reqobj.provid=$('#provs').data('dbid');
         reqobj.provtype=$('#provtypes').val();
         console.log (reqobj);
         var reqbody = JSON.stringify(reqobj);
         $.post($apiUrlBase+"condprov", reqbody )
			.done(function(data) {
  			alert(data);
  			displayProvs($('#provs').data('condid'));
		 });
         $( '#provs' ).val('');
         $( "#provsearch").slideToggle();
	 });
	 
	 
	 $( '#savevisit').on('click',function() {
         var reqobj = new Object();
         reqobj.condid=$('#provs').data('condid');
         reqobj.visittype=$("#visittypes").find(":selected").text();
         reqobj.visitdate=$("#visitdate").val();
         reqobj.visittime=$("#visittime").val();
         reqobj.visitdur=$("#visitdur").val();
         reqobj.visitprov=$("#visitprov").val();
         //console.log (reqobj);
         var reqbody = JSON.stringify(reqobj);
         $.post($apiUrlBase+"condvisit", reqbody )
			.done(function(data) {
  			alert(data);
  			displayVisits($('#provs').data('condid'));
		 });
         $( "#visitsearch").slideToggle();
         displayCalendar($('#userscreen').data('userid'));
	 });
	 
	 
	 
	 
	 $( '#patsearch').on ('keyup',function() {
	    var searString = this.value.toUpperCase();
		$('#pat-accord').find('h3').each(function(){
		   if ($(this).find('.patinfo').text().toUpperCase().indexOf( searString)<0) {
			 $(this).hide();
			}
			else {
			 $(this).show();
		   }
		  });
	});
 
}
