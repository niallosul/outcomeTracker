function otcontroller () {


   //------------------- Add Dialogs -------------------------
	var wWidth = $(window).width();
    var wHeight = $(window).height();


	$( "#dialog-proj" ).dialog({
		autoOpen: false,
		height: wHeight * 0.9,
		width: wWidth * 0.9,
		modal: true,
		resizable: false
		});
		
	$( "#dialog-cond" ).dialog({
		autoOpen: false,
		width: wWidth * 0.7,
		modal: true
		});

	$( "#visitdate" ).datepicker({ 
	     dateFormat: 'yy-mm-dd'
	    });
	 
	 $( "#conddate" ).datepicker({ 
	     dateFormat: 'yy-mm-dd'
	    });
	    	
	$( "#visitdate" ).datepicker("setDate", new Date() );
	$( "#conddate" ).datepicker("setDate", new Date() );
	
	$("button").button();
	//----------------------------------------------------------------





     //Add event Handlers
     $( "#icddiv" ).find('.newItemText').on ('click',function() {
         $( "#diagsearch").slideToggle();
	 });

     $( "#diagdesc" ).find('.newItemText').on ('click',function() {
         $( "#diagdescform").slideToggle();
	 });
	 
	 $( "#cptdiv" ).find('.newItemText').on ('click',function() {
         $( "#procsearch").slideToggle();
	 });

     $( "#procdesc" ).find('.newItemText').on ('click',function() {
         $( "#procdescform").slideToggle();
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
	 

	 $( "#conddel" ).on ('click',function() {
         $( "#dialog-confirm" ).dialog({
          resizable: false,
          height:140,
          modal: true,
          buttons: {
            "Delete Condition": function() {
                var urlstr = $apiUrlBase+"patcond/"+$('#diags').data('condid');
                $.ajax({
    			  url: urlstr,
   				  type: 'DELETE',
    			  success: function(result) {
    			    $( "#dialog-proj" ).dialog("close")
    			    //alert (result);
		            $('div#patcond'+$('#diags').data('condid')).slideUp('slow');
    			}
				});
          
          $( this ).dialog( "close" );
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      }
    });
	 });

	$('#dialog-proj').on("click", ".savemetrics", function(event){
  		     var reqarr=new Array;
         	 //metricDiv.find('input').each(function () {
         	 $(this).parent().find('.metricinput').each(function () {
             if (($(this).val() != "") && ($(this).prop('disabled') != true)) {
           		var metricobj=new Object;
           		metricobj.visitid = $(this).parents().find('.visitmetrics').data('visitid');
           		metricobj.metricid = $(this).attr('id').replace('metric', '');
           		metricobj.metricval = $(this).val();
           		metricobj.userid= $('#userscreen').data('userid');
           		reqarr.push(metricobj);
           //console.log ($(this).attr('id')+":");
           //console.log ($(this).val())
          	  }
         	});
         	if (reqarr.length > 0) {
         	  var reqbody = JSON.stringify(reqarr);
         	  console.log (reqbody);
        	  $.post($apiUrlBase+"metrics", reqbody )
				.done(function(data) {
  					//alert(data);
  					displayMetrics (data);
		    	});
		    }
            //console.log (destdiv.find('.metriclist'));
            //alert ("Clicked"+visitId);
	});



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
        	showLoginPage();
	        alert ("You're Logged Out");
	        
	 });

	 $( "#dialog-cond" ).find('.savebutt').on ('click',function() {
	     var patinfo = $('#dialog-cond').data('patinfo');
         var condobj = new Object();
         condobj.patid=patinfo.id;
         condobj.provid=$('#userscreen').data('userid');
         condobj.condtext=$( "#newcond" ).val();
         condobj.conddate=$( "#conddate" ).val();
         
         var reqbody = JSON.stringify(condobj);
         console.log (reqbody);
         $.post($apiUrlBase+"patcond", reqbody )
			.done(function(data) {
			   console.log (data);
			   if (data == "Patient Condition Added"){
  			      var activeacc =  $('#pat-accord').accordion( "option", "active" );
  			      //displayPatients($('#userscreen').data('userid'));
  			      //console.log (activeacc);
  			      $( "#newcond" ).val('');
  			      $( "#dialog-cond" ).dialog('close');
  			      //console.log (patinfo.id)
  			      displayPatConds(patinfo.id);
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

	 

	 $( '#savediagtext').on('click',function() {
         var reqobj = new Object();
         reqobj.condid=$('#provs').data('condid');
         reqobj.notetype='diagtext';
         reqobj.notetext=$("#diagtext").val();
         reqobj.userid=$('#userscreen').data('userid');
         console.log (reqobj);
         var reqbody = JSON.stringify(reqobj);
         $.post($apiUrlBase+"condnote", reqbody )
			.done(function(data) {
  			alert(data);
  			displayNotes($('#provs').data('condid'));
		 });
         $( "#diagdescform").slideToggle();
	 });	 


	 $( '#saveproctext').on('click',function() {
         var reqobj = new Object();
         reqobj.condid=$('#provs').data('condid');
         reqobj.notetype='proctext';
         reqobj.notetext=$("#proctext").val();
         reqobj.userid=$('#userscreen').data('userid');
         console.log (reqobj);
         var reqbody = JSON.stringify(reqobj);
         $.post($apiUrlBase+"condnote", reqbody )
			.done(function(data) {
  			alert(data);
  			displayNotes($('#provs').data('condid'));
		 });
         $( "#procdescform").slideToggle();
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


	    //$('#diaglist').find( '.graphviewer' ).on ('click',function() {
	$('#dialog-proj').on("click", ".graphviewer", function(event){

	 	    //console.log($(this).data('diagid'));
	 	$('#graphdiv').toggle();
	 	var chart;    
	 	var diaginfo = $(this).data('diaginfo');
 		$.getJSON("reportapi/proccounts/"+diaginfo.diagnosis_id,
    	    function(data){
        graphopts = new Object;
        //console.log (data); 
        diagproclist = data;
        var proclist = [];
        for (i=0; i<data.length; i++) {
          var proccount = parseFloat(data[i].count);
          var elem = [];
          elem.push (data[i].description);
          elem.push (parseFloat(proccount));
          proclist.push (elem);
          }
   
        //console.log (proclist);
        graphopts.dest = 'graphloc';
        graphopts.title = 'Procedures Performed for Diagnosis '+diaginfo.code;
        graphopts.series = [{
                type: 'pie',
                name: 'Percentage',
                data: proclist
            }];
        
       drawpie(graphopts);
       
      }).done(function(){     

    var proclist = [];
    procgraphopts = new Object;
    procgraphopts.cats = [];

    proclist[0]=new Object;
    proclist[0].data=new Array;
    proclist[0].name = "Before Surgery";
    proclist[1]=new Object;
    proclist[1].data=new Array;
    proclist[1].name = "After Surgery";

    var metricid = 2;

    var deferreds = [];
    //console.log(diagproclist);
    for ( var i = 0; i < diagproclist.length; ++i ) {
	   deferreds.push($.getJSON("reportapi/avgmetrics/"+diagproclist[i].id+"/"+metricid));
    }
	
    $.when.apply($,deferreds).done(function() {
        //console.log( arguments );
        var argcnt = arguments.length;
        //console.log (argcnt);
        if (arguments[1] == "success") {
          argcnt = 1;
          console.log (argcnt);
        }
		for ( var i = 0; i < argcnt;i++ ) {
		  if (argcnt>1) {
		    var replyelem = arguments[i][0][0];
		  } else {
		    var replyelem = arguments[0][0];
		  }
		  if ((replyelem.procdesc) && ((replyelem.postopavg) || (replyelem.preopavg) )){
			   proclist[0].data.push(parseFloat(replyelem.preopavg));
               proclist[1].data.push(parseFloat(replyelem.postopavg));
               procgraphopts.cats.push (replyelem.procdesc);
          }  
          procgraphopts.yvalname = replyelem.metricdesc+" (0-10)";
          procgraphopts.title = replyelem.metricdesc+" change for each procedure";
		} 

		//console.log (proclist);
        procgraphopts.dest = 'barloc';
    	procgraphopts.series = proclist; 
    	//procgraphopts.yvalname = data[0].metricdesc+" (0-10)";
    	drawcol(procgraphopts);
	});
		
   });

	   });


 
}
