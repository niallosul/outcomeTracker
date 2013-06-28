function otrefdata () {
   
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
       for (i=0; i<data.length; i++) {
          if (data[i].dataset == 'doctype'){
             $('#provtypes').append($('<option />').val(data[i].value).text(data[i].value));
             }
          if (data[i].dataset == 'visittype'){
             $('#visittypes').append($('<option />').val(data[i].id).text(data[i].value));
             }      
       }
    });
    
 
 	 $.getJSON($apiUrlBase+"metrics",
       function(data){
       console.log (data);
       for (i=0; i<data.length; i++) {
            console.log (data[i].legalvals);
            var inputHTML = '';
            if (data[i].inputtype == "range") {
               legalvals = JSON.parse(data[i].legalvals);
               inputHTML = '<input class="metricinput" type="number" min="'+legalvals.min+'" max="'+legalvals.max+'"/>';
               console.log (JSON.parse(data[i].legalvals));
               }
            if (data[i].inputtype == "select") {
               legalvals = JSON.parse(data[i].legalvals);
               inputHTML = '<select class="metricinput">'
               for (j=0;j<legalvals.length; j++) {
                  inputHTML = inputHTML+'<option>'+legalvals[j]+'</option>';
               }
               inputHTML = inputHTML+'</select>';
               console.log (JSON.parse(data[i].legalvals));
               }
       		//var metricformlist = 'clinicvisit';
            var metricformlist = data[i].visit_type.toLowerCase().replace(/ /g, '');
			$('#'+metricformlist+'list').append($('<label></label>').text(data[i].description).attr('for', 'metric'+data[i].id))
							.append($(inputHTML).attr('id', 'metric'+data[i].id));
         }
       });
    
   //-------------------------------------------------
}
