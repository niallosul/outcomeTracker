//-------------------------------------------------
$apiUrlBase = "http://localhost/weblamp443/OutcomeTracker/api/";
$(document).ready(function() {

	$("#dialog:ui-dialog").dialog( "destroy" );
	//$.ajaxSetup ({cache: false});

		
	//$.get("http://localhost/weblamp442/IntMgr/api/session/userid",
	$.get($apiUrlBase+"users/4",
		function(data){
		if (data) {
		//console.log(data[0].id);
			loginuser (data[0].id);
		}	
		else {
			showLoginPage();
		}
	},"json");


	var wWidth = $(window).width();
    var wHeight = $(window).height();

  
    //---------- Load all Reference data ----------
	$.getJSON($apiUrlBase+"diags",
    function(data){
       var diaglist = [];
       for (i=0; i<data.length; i++) {
          diaglist.push(data[i])
          diaglist[i].label=diaglist[i].code+" - "+diaglist[i].description;
       }
       creatautocomplete($('#diags'), diaglist);
    });
    
    $.getJSON($apiUrlBase+"procs",
    function(data){
       var diaglist = [];
       for (i=0; i<data.length; i++) {
          diaglist.push(data[i])
          diaglist[i].label=diaglist[i].code+" - "+diaglist[i].description;
       }
       creatautocomplete($('#procs'), diaglist);
    });
    
    $.getJSON($apiUrlBase+"provs",
    function(data){
       var diaglist = [];
       for (i=0; i<data.length; i++) {
          diaglist.push(data[i])
          diaglist[i].label=diaglist[i].firstname+" "+diaglist[i].lastname;
       }
       creatautocomplete($('#provs'), diaglist);
    });
    
    
    $.getJSON($apiUrlBase+"legalvalues",
    function(data){
       var doctypelist = [];
       for (i=0; i<data.length; i++) {
          if (data[i].dataset == 'doctype'){
             doctypelist.push(data[i]);
             doctypelist[doctypelist.length-1].label=data[i].value;
             }
       }
       console.log (doctypelist);
       creatautocomplete($('#provtypes'), doctypelist);
    });
   //-------------------------------------------------



   //------------------- Add Dialogs -------------------------

	$( "#dialog-proj" ).dialog({
		autoOpen: false,
		height: wHeight * 0.8,
		width: wWidth * 0.8,
		modal: true
		});
		
	$( "#dialog-cond" ).dialog({
		autoOpen: false,
		width: wWidth * 0.4,
		modal: true
		});

		
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
	 
	 $( "#dialog-cond" ).find('.savebutt').on ('click',function() {
	     var patinfo = $('#dialog-cond').data('patinfo');
         var condobj = new Object();
         condobj.patid=patinfo.id;
         condobj.condtext=$( "#newcond" ).val();
         var reqbody = JSON.stringify(condobj);
         $.post($apiUrlBase+"patcond", reqbody )
			.done(function(data) {
  			var activeacc =  $('#pat-accord').accordion( "option", "active" );
  			displayPatients($('#userscreen').data('userid'));
  			console.log (activeacc);
  			$( "#newcond" ).val('');
  			$( "#dialog-cond" ).dialog('close');
  			//Listen for accordion completion and programatically open the previously open patient
  			//and click the latest condition for that patient 
  			$('#fullsection').one('dataModelChanged',function() { 
		         $('#pat-accord').accordion( "option", "active", activeacc );
		         $('#pat-accord').find('.condlist:eq('+activeacc+')').find('.tasklink:eq(0)').trigger('click');
	        });
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
         var procobj = new Object();
         procobj.condid=$('#provs').data('condid');
         procobj.provid=$('#provs').data('dbid');
         procobj.provtype=$('#provtypes').val();
         console.log (procobj);
         var reqbody = JSON.stringify(procobj);
         $.post($apiUrlBase+"condprov", reqbody )
			.done(function(data) {
  			alert(data);
  			displayProvs($('#provs').data('condid'));
		 });
         $( '#provs' ).val('');
         $( "#provsearch").slideToggle();
	 });
});
//-----------------------------------------------------------


//-----------------------------------------------------------
function logoutuser() {
	$.get("http://sulincdesign.com/cim/ws/endsession.php");
	alert ("You're Logged Out");
	showLoginPage();
	$("#admindiv").hide();
}
//-----------------------------------------------------------


//-----------------------------------------------------------
function showLoginPage() {
	$("#userscreen").hide();
	$('#userheaderright').hide();
	
	$("#loginscreen").show();
    $('#loginheaderright').show();
}
//-----------------------------------------------------------




//-----------------------------------------------------------
function loginuser(memid){
	$('#loginscreen').hide();
	$('#loginheaderright').hide();
	
	$('#userscreen').data('userid', memid).show();
	$('#userheaderright').show();

	displayUserInfo(memid);
	//displayTasks();
	displayPatients(memid);

}
//-----------------------------------------------------------
	

//-----------------------------------------------------------
function displayUserInfo(memid){
    var userHTML = "";
	$.get($apiUrlBase+"users/"+memid,
	function(data){
		console.log (data);
		imglink = "imgs/silhouette96.png"
		$('#membername').html(data[0].prefix+" "+data[0].firstname+ " "+data[0].lastname);
		if (data.picture) {
		  imglink = data.picture;
		}
		$('#memberimg').html('<img style="vertical-align:middle; padding:.6em; height:30px; width:30px" src="'+imglink+'"/>');
	},"json");
}
//-----------------------------------------------------------


//-----------------------------------------------------------
function displayPatients(memid){
    var patListHTML=$('<div></div>')
        .append($('<h2></h2>').text('Patient List')
		   .append($('<input></input>').addClass('searchbox')));

	var patListAccord = $('<div id="pat-accord"></div>');
	$.get($apiUrlBase+"getpatsbyprov/"+memid,
    function(data){
       
       var targetdiv = $('#fullsection');
       for (i=0; i<data.length; i++) {
          var patdisp = data[i]['Patient'].firstname+" "+data[i]['Patient'].lastname;
          patListAccord.append($('<h3></h3>').append($('<a href="#"></a>')
								.append('<span class="patinfo">'+patdisp+'</span>')
								.append('<span style="float:right; font-size:.75em;">DOB:'+data[i]['Patient'].dob+'</span>')));
		  var condListHTML = $('<div class="condlist"></div>');
		  for (j=0; j<data[i]['Conditions'].length; j++) {
		    var cond = data[i]['Conditions'][j];
		    //console.log (cond);
		    condListHTML.append($('<div class="ui-state-default ui-corner-all tasklink" style="font-size:.75em"></div>')
								.data('condinfo',cond)
								.data('patinfo',data[i]['Patient'])
								.append('<span class="ui-icon ui-icon-newwin" style="margin: 0 5px 0 0;position: absolute;left: .2em;top: 50%;margin-top: -8px;"></span>')
								.append('<span class="patinfo">'+cond.description+'</span>')
								.append('<span style="float:right; font-size:.75em;">Date:'+cond.date+'</span>')
								);
		  }
		 patListAccord.append($('<div></div>')
		 			.append($('<div></div>').append('<span>Condition List</span>')
		 									.append('<span class="newItemText">+Add New</span>'))
		 			.append(condListHTML));
       }
       
     patListHTML.append(patListAccord);
     targetdiv.html(patListHTML);
     $('#pat-accord').accordion({
			collapsible: true,
			autoHeight:false,
			active:false
		});
		//console.log("DONE CREATING ACCORDION");
		targetdiv.trigger('dataModelChanged');
     }, "json");
     
     //Add event Handlers
     patListHTML.find('.searchbox').on ('keyup',function() {
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
	
	patListHTML.on('click', '.tasklink', displayCondDetails);
	//patListHTML.find('.tasklink').on ('click',function() {
    //    displayCondDetails($(this).data('condinfo'), $(this).data('patinfo'));
	// });	
    patListHTML.on('click', '.newItemText', displayNewCondForm);	
}
//-----------------------------------------------------------




//-----------------------------------------------------------
function displayDiags(condId){
    $('#diags').data('condid',condId);
	var diagListHTML = $('<div></div>');
	$.get($apiUrlBase+"conddiags/"+condId,
    function(data){
       console.log (data);
       for (i=0; i<data.length; i++) {
          diagListHTML.append($('<div class="ui-state-default ui-corner-all tasklink" style="font-size:.75em"></div>')
								.data('condid',data[i].id)
								.append('<span>'+data[i].code+' - '+data[i].description+'</span>'));
       }
       $('#diaglist').html(diagListHTML);
   }, "json");

}
//-----------------------------------------------------------




//-----------------------------------------------------------
function displayProcs(condId){
    $('#procs').data('condid',condId);
	var procListHTML = $('<div></div>');
	$.get($apiUrlBase+"condprocs/"+condId,
    function(data){
       console.log (data);
       for (i=0; i<data.length; i++) {
          procListHTML.append($('<div class="ui-state-default ui-corner-all tasklink" style="font-size:.75em"></div>')
								.data('condid',data[i].id)
								.append('<span>'+data[i].code+' - '+data[i].description+'</span>'));
       }
       $('#proclist').html(procListHTML);
   }, "json");	
}
//-----------------------------------------------------------


//-----------------------------------------------------------
function displayProvs(condId){
    $('#provs').data('condid',condId);
	var procListHTML = $('<div></div>');
	$.get($apiUrlBase+"condprovs/"+condId,
    function(data){
       console.log (data);
       for (i=0; i<data.length; i++) {
          var provdisp = data[i].prefix+" "+data[i].firstname+" "+data[i].lastname;
          procListHTML.append($('<div class="ui-state-default ui-corner-all tasklink" style="font-size:.75em"></div>')
								.data('condid',data[i].id)
								.append('<span>'+data[i].provider_type+': </span>')
								.append('<span>'+provdisp+'</span>'));
       }
       $('#provlist').html(procListHTML);
   }, "json");	
}
//-----------------------------------------------------------




//-----------------------------------------------------------
function displayCondDetails(){
    var condinfo = $(this).data('condinfo');
    var patinfo = $(this).data('patinfo');
	displayDiags(condinfo.id);
	displayProcs(condinfo.id);
	displayProvs(condinfo.id);
	var diagheader = condinfo.description+" - "+patinfo.firstname+" "+patinfo.lastname;
	$('#dialog-proj').dialog('option', 'title', diagheader);
	$('#dialog-proj').dialog('open');
}
//-----------------------------------------------------------



//-----------------------------------------------------------
function displayNewCondForm(){
    var patinfo = $(this).parents().find('.tasklink').data('patinfo');
	var condheader = "Add New Condition - "+patinfo.firstname+" "+patinfo.lastname;
	$('#dialog-cond').data('patinfo',patinfo);
	$('#dialog-cond').dialog('option', 'title', condheader);
	$('#dialog-cond').dialog('open');
}
//-----------------------------------------------------------



//-----------------------------------------------------------
function creatautocomplete(divId, datasource) {
        divId.autocomplete({
		source: datasource,
		focus: function( event, ui ) {
			divId.val( ui.item.label );
			return false;
			},
		select: function( event, ui ) {
		    divId.val(ui.item.label );
		    divId.data ('dbid', ui.item.id);
		    divId.siblings('.savebutt').fadeIn();
			return false;
			}
		  }).data( 'autocomplete' )._renderItem = function( ul, item ) {
			return $( "<li></li>" )
			.data( 'item.autocomplete', item )
			.append( '<a>'+item.label+'</a>')
			.appendTo( ul );
	     };	
}
//-----------------------------------------------------------
