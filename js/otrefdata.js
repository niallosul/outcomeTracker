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
       var doctypelist = [];
       for (i=0; i<data.length; i++) {
          if (data[i].dataset == 'doctype'){
             //doctypelist.push(data[i]);
             //doctypelist[doctypelist.length-1].label=data[i].value;
             $('#provtypes').append($('<option />').val(data[i].value).text(data[i].value));
             }
          if (data[i].dataset == 'visittype'){
             $('#visittypes').append($('<option />').val(data[i].id).text(data[i].value));
             }      
       }
    });
    
    
   //-------------------------------------------------
}
