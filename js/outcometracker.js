

//-----------------------------------------------------------
function showLoginPage() {
	$("#userscreen").hide();
	$('#userheaderright').hide();
	
	$("#loginscreen").show();
    $('#loginheaderright').show();
}
//-----------------------------------------------------------




//-----------------------------------------------------------
function loginuser(meminfo){
    var userobj = $.parseJSON(meminfo); 
    var memid = userobj.id;
    //console.log (userobj);
	$('#loginscreen').hide();
	$('#loginheaderright').hide();
	
	$('#userscreen').data('userid', memid).show();
	$('#userheaderright').show();

	imglink = "imgs/silhouette96.png"
	$('#membername').html(userobj.prefix+" "+userobj.firstname+ " "+userobj.lastname);
	if (userobj.picture) {
	  imglink = userobj.picture;
	}
	$('#memberimg').html('<img style="vertical-align:middle; padding:.6em; height:30px; width:30px" src="'+imglink+'"/>');

    displayPatients(memid);

    displayCalendar(memid);

}
//-----------------------------------------------------------
	



//-----------------------------------------------------------
function displayPatients(memid){

	var patListAccord = $('<div id="pat-accord"></div>');
	$.getJSON($apiUrlBase+"getpatsbyprov/"+memid,
    function(data){
       
       for (i=0; i<data.length; i++) {
          var patdisp = data[i].firstname+" "+data[i].middlename.substring(0,1)+". "+data[i].lastname;
          patListAccord.append($('<h3></h3>').append($('<a href="#"></a>')
								.append('<span class="patinfo">'+patdisp+'</span>')
								.append('<span class="patdets">DOB: '+data[i].dob+'</span>'))
								);
		  var condListId = 'condList'+data[i].id;
		  var condListHTML = $('<div class="condlist"></div>').attr('id', condListId).data('patinfo',data[i]);	  
		 patListAccord.append($('<div></div>')
		 			.append($('<div></div>').addClass('ui-corner-all smallholder')
		 				.append($('<div></div>').addClass('omwidgeheader ui-corner-top')
		 									.append('<span>Condition List</span>')
		 									.append($('<button></button>').addClass('newItemText').text('Add').button()))
		 				.append(condListHTML)
		 			));
		 displayPatConds(data[i].id);
       }

     $('#patList').html(patListAccord);
     $('#pat-accord').accordion({collapsible: true,autoHeight:false,active:false});
     //$(".newItemText").button();
	 //console.log("DONE CREATING ACCORDION");
	 //$('#patList').trigger('dataModelChanged');
	 
    });
}
//-----------------------------------------------------------



//-----------------------------------------------------------
function displayPatConds (patId){
    //console.log ("In pat conds function"+patId);
    $('div#condList'+patId).html('');
    $.getJSON($apiUrlBase+"patientconds/"+patId,
    function(data){
       //console.log (data);
       for (i=0; i<data.length; i++) {
            var condid = 'patcond'+data[i].id;
		    $('div#condList'+patId).append($('<div class="ui-state-default ui-corner-all patlink" style="font-size:.75em"></div>')
		    					.attr('id', condid)
								.data('condinfo',data[i])
								.append('<span class="ui-icon ui-icon-newwin" style="margin: 0 5px 0 0;position: absolute;left: .2em;top: 50%;margin-top: -8px;"></span>')
								.append('<span class="patinfo">'+data[i].description+'</span>')
								.append('<span style="float:right; font-size:.75em;">Date:'+data[i].date+'</span>')
								);
		  }
   });

}
//-----------------------------------------------------------

//-----------------------------------------------------------
function displayCalendar(memid){
    $('#apptList').html("");
    $.getJSON("reportapi/provappts/"+memid,
    function(data){
       //console.log (data);
       calevents = new Array;
       for (i=0; i<data.length; i++) {
          calevent = new Object;

          calevent.id = data[i].id;
          calevent.title = data[i].type;
          calevent.start = data[i].visitdate+" "+data[i].start_time;
          calevent.end = data[i].visitdate+" "+data[i].end_time;
          calevent.condid = data[i].pat_cond_id;
          calevent.coddesc = data[i].description;
          calevent.patln = data[i].lastname;
          calevent.patfn = data[i].firstname;
          switch (data[i].type)
			{
			  case "Surgery":
  				calevent.backgroundColor = '#FF704D';
  				break;
			  case "Follow Up":
  				calevent.backgroundColor = '#a6c96a';
 				break;
 			  case "Clinic Visit":
  				calevent.backgroundColor = '#FFCC00';
 				break;
 			  case "PreOp":
  				calevent.backgroundColor = '#CC9900';
 				break;
			}

/*highcharts colors			
   '#2f7ed8', 
   '#0d233a', 
   '#8bbc21', 
   '#910000', 
   '#1aadce', 
   '#492970',
   '#f28f43', 
   '#77a1e5', 
   '#c42525', 
   '#a6c96a'
   */
          calevents.push(calevent);
       }
       //console.log (calevents);
       var calheight = $('#apptList').height();
       $('#apptList').fullCalendar({
        defaultView: 'agendaWeek',
        allDaySlot:false,
        allDayDefault:false,
        height:calheight,
        events: calevents,
       
        eventClick: function(calEvent, jsEvent, view) {
           condobj = new Object;
           patobj = new Object;
           condobj.id = calEvent.condid;
           condobj.description = calEvent.coddesc;
           patobj.firstname = calEvent.patfn;
           patobj.lastname = calEvent.patln
           displayCondDetails(condobj,patobj);

           //When Condition list is displayed, programmatically open the visit corresponding to the calendar event
           $('#visitlist').one('accordionDone',function() { 
              var visid = $('a#visit'+calEvent.id);
              //console.log (visid);
              //console.log ($('#visit-accord a'));
              var visidx = $('#visit-accord a').index(visid);
              //console.log (visidx);
		      $('#visit-accord').accordion("option", "active",visidx);
	        });
          }
      });
   });

	
}
//-----------------------------------------------------------




//-----------------------------------------------------------
function displayDiags(condId){
    $('#diags').data('condid',condId);
	var diagListHTML = $('<div></div>');
	$.getJSON($apiUrlBase+"conddiags/"+condId,
    function(data){
       //console.log (data);
       for (i=0; i<data.length; i++) {
          diagListHTML.append($('<div class="ui-state-default ui-corner-all tasklink" style="overflow:auto; font-size:.75em;"></div>')
          						.append($('<div style="float:left; width:15%;margin-right:5px"></div>').text(data[i].code))
								.append($('<div style="float:left; width:65%;font-size:.9em;"></div>').text(data[i].description))
								.append($('<button class="graphviewer" style="font-size:.3em; float:right;width:15%;">Graph</button>').data('diaginfo',data[i]).button())
								);
       }
       $('#diaglist').html(diagListHTML);
   });

}
//-----------------------------------------------------------


//-----------------------------------------------------------
function displayNotes(condId){
    //$('#diagnote').data('condid',condId);
    $('#diagnote').html('');
    $('#procnote').html('');
    $( "#diagdesc" ).find('.newItemText').show();
    $( "#procdesc" ).find('.newItemText').show();
	$.getJSON($apiUrlBase+"condnotes/"+condId,
    function(data){
       //console.log (data);
       for (i=0; i<data.length; i++) {
          var notedisp = $('<span class="issStamp">'+data[i].note_text+'</span>')
          if (data[i].note_type == "diagtext") {
             //console.log (notedisp);
             $('#diagnote').append(notedisp);
             $('#diagdesc').find('.newItemText').hide();
             $('#diagdesc').find('.editItemText').show();
		  }
		  if (data[i].note_type == "proctext") {
             //console.log (notedisp);
             $('#procnote').append(notedisp);
             $('#procdesc').find('.newItemText').hide();
             $('#procdesc').find('.editItemText').show();
		  }
       }
   });	
}
//-----------------------------------------------------------




//-----------------------------------------------------------
function displayProcs(condId){
    $('#procs').data('condid',condId);
	var procListHTML = $('<div></div>');
	$.get($apiUrlBase+"condprocs/"+condId,
    function(data){
       //console.log (data);
       for (i=0; i<data.length; i++) {
          procListHTML.append($('<div class="ui-state-default ui-corner-all tasklink" style="font-size:.75em"></div>')
								//.data('condid',data[i].id)
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
       //console.log (data);
       for (i=0; i<data.length; i++) {
          var provdisp = data[i].prefix+" "+data[i].firstname+" "+data[i].lastname;
          procListHTML.append($('<div style="font-size:.75em"></div>').addClass("ui-state-default ui-corner-all tasklink")
								.data('condid',data[i].id)
								.append('<span>'+data[i].provider_type+': </span>')
								.append('<span>'+provdisp+'</span>'));
       }
       $('#provlist').html(procListHTML);
   }, "json");	

}
//-----------------------------------------------------------



//-----------------------------------------------------------
function displayVisits(condId){
    //var condId = $('#dialog-proj').data('condid');
    //console.log (condId);
	$.get($apiUrlBase+"condvisits/"+condId,
    function(data){
       //console.log (data);
       var vistListHTML  = $('<div id="visit-accord"></div>');
       for (i=0; i<data.length; i++) {
          var visitid = 'visit'+data[i].id;
          vistListHTML.append($('<h3></h3>').append($('<a id="'+visitid+'" href="#"></a>')
								.append('<span class="patinfo">'+data[i].type+'</span>')
								//.append('<span class="patinfo">'+data[i].id+'</span>')
								.append('<span style="float:right; font-size:.75em;">Date:'+data[i].visitdate+'</span>')));
							
		  var metricDiv = $('<div></div>').attr('id', 'visitmetrics'+data[i].id)
		  								  .addClass('smallholder visitmetrics ui-corner-all')
		  								  .data('visitid',data[i].id)
		  								  .append($('<div></div>').text('Metric List')
		  								  						  .addClass('omwidgesubheader ui-corner-top'));
          vistListHTML.append($('<div></div>').attr('id', 'visitdetails'+data[i].id)
          									  .append(metricDiv)
          						);
          						
          var visitypeformname = data[i].type.toLowerCase().replace(/ /g, '');
          //console.log (visitypeformname);
          //console.log ($('#'+visitypeformname+'form'));
		  $('#'+visitypeformname+'form').clone().appendTo(metricDiv);
		  //displayMetrics (metricDiv, data[i].id);
		  displayMetrics (data[i].id);
			
		  }
       $('#visitlist').html(vistListHTML);
       $('#visit-accord').accordion({
			collapsible: true,
			autoHeight:false,
			active:false
		});
	   $( '.savemetrics').button();
	   $('#visitlist').trigger('accordionDone');
   }, "json");	

}
//-----------------------------------------------------------

//-----------------------------------------------------------
function displayMetrics (visitId){

	$.getJSON($apiUrlBase+"visitmetrics/"+visitId,
    function(data){
       //console.log (data);
          
       for (i=0; i<data.length; i++) {
         $('#visitmetrics'+visitId).find("#metric"+data[i].metricid).val(data[i].value);
         $('#visitmetrics'+visitId).find("#metric"+data[i].metricid).prop('disabled', true);
       }
     
    });

}
//-----------------------------------------------------------





//-----------------------------------------------------------
function displayCondDetails(condinfo, patinfo){
    //var condinfo = $(this).data('condinfo');
    //console.log (condinfo);
    //var patinfo = $(this).parents().find('.condlist').data('patinfo');
    $('#dialog-proj').find(':input').val('');
    $('#dialog-proj').find('.addform').hide();
    $('#dialog-proj').data('condid',condinfo.id);
    if (condinfo.created_by == $('#userscreen').data('userid')){
        $('#condtoolbar').show();
    }
    else {
        $('#condtoolbar').hide();
    }
    displayNotes(condinfo.id);
	displayDiags(condinfo.id);
	displayProcs(condinfo.id);
	displayProvs(condinfo.id);
	displayVisits(condinfo.id);
	var diagheader = condinfo.description+" - "+patinfo.firstname+" "+patinfo.lastname;
	    
	$('#dialog-proj').dialog('option', 'title', diagheader);
	$('#dialog-proj').dialog('open');
	var dialogheight = $('#dialog-proj').dialog( "option", "height" );
	var holderheight = Math.ceil(dialogheight*.8);
	$('.condinfoholder').height(holderheight);
	$('#visitlist').height(Math.ceil(holderheight*.75));

}
//-----------------------------------------------------------



//-----------------------------------------------------------
function displayNewCondForm(){
    var patinfo = $(this).parents().find('.condlist').data('patinfo');
    //console.log (patinfo);
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



//--------------------------------------------------------------
function drawpie (graphopts) {
        chart = new Highcharts.Chart({
            chart: {
                renderTo: graphopts.dest,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: graphopts.title
            },
            tooltip: {
        	    pointFormat: '{series.name}: <b>{point.percentage}%</b>',
            	percentageDecimals: 1
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ this.y;
                        }
                    }
                }
            },
            series: graphopts.series
        });
}
//-----------------------------------------------------------


//-----------------------------------------------------------
function drawcol (graphopts) {
        chart = new Highcharts.Chart({
            chart: {
                type: 'column',
                renderTo: graphopts.dest,
            },
            title: {
                text: graphopts.title
            },
            xAxis: {
                categories: graphopts.cats
            },
            yAxis: {
                min: 0,
                title: {
                    text: graphopts.yvalname
                }
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: graphopts.series
        });
}
//-----------------------------------------------------------