<?php
namespace IntMgr;
require 'Vendors/autoload.php';


//Register local DAOs 
$userDAO = new memberDAO();
//$projDAO = new projectDAO($intmgrdb);
        
$patlist = $userDAO->getall('patients');
$doclist = $userDAO->getall('providers');

$provpatlist = $userDAO->getpatsbyprov(4);
echo (json_encode($provpatlist));
//$projlist = $projDAO->getall();

//var_dump($userlist);
//var_dump($projlist);
  
?>  
<html>
<head>
  <title>Integration Manager Admin Page</title>
  <link rel="stylesheet" type="text/css" href="http://sulincdesign.com/ocm/css/ui-lightness.css"/>
  <link rel="stylesheet" type="text/css" href="css/admin.css"/>

</head>
<body>

<div id='header' class="ui-widget-header" style='overflow:auto;'>
	<div id='headerleft' style="width:50%; float:left; margin-left:10px">
			<h1 style="display:inline-block;vertical-align:middle">Integration Manager Admin Tool</h1>
	</div>
</div>

<div id='userscreen' style='height:80%; width:99%'>		
  <div id="left" style='height:100%; width:40%; float:left;'>

   <div id='tools' class='toolholder ui-corner-all'>
     <h2>Database Tools</h2>
     <div style='height:450px; overflow:auto;'>
     <form class="bigform" action="adminposts.php" method="post">
       <p>Add New Project</p>
       <label>Project Mnemonic:</label>
       <input type="text" name="projmnem" maxlength="25" />
       <br/>
       <label>Project Name:</label>
       <input type="text" name="projname" maxlength="25" />
       <br/>
      <button type="submit">Add Project</button>
     </form>

     <form class="bigform" action="adminposts.php" method="post">
       <p>Add New Team Member</p>
       <label>Project Id:</label>
       <input type="text" name="projid" />
       <br/>
       <label>Member Id:</label>
       <input type="text" name="memid"  />
       <br/>
      <button type="submit">Add Member</button>
     </form>
     
     <form class="bigform" action="adminposts.php" method="post">
       <p>Assign Patient to Provider</p>
       <label>Provider Id:</label>
       <input type="text" name="provid" />
       <br/>
       <label>Patient Id:</label>
       <input type="text" name="patid"  />
       <br/>
      <button type="submit">Assign Relationship</button>
     </form>
     
     </div>
    </div>  

  </div>
  
  <div id='right' style='height:100%; width:55%; float:right'>
    <div id='top' style='height:50%; width:90%;margin:auto'>

       <div id='users' class='smallholder ui-corner-all'>
        <div><h2>Patient List:</h2></div>
        <div style='height:180px; overflow:auto;'>
        <?php
        foreach ($patlist as $patient) {
         $userdisp = $patient->firstname." ". $patient->lastname." - ".$patient->dob;
         print "<div class='ui-state-default ui-corner-all tasklink'>";
         print "<span><img src='{$patient->img}' style='height:30px;width:30px'></span>";
         print "<span style = 'color:grey; margin-left:15px '>{$userdisp}</span>";
         print "<span style = 'font-size:.25em; margin-left:15px '>{$patient->id}</span>";
         print "</div>";
        }
        ?>
        </div>   
      </div>	

  
    </div>   

    <div id='bottom' style='height:50%; width:90%;margin:auto'>


    <div id='projects' class='smallholder ui-corner-all'>
        <div><h2>Provider List:</h2></div>
        <div style='height:180px; overflow:auto;'>
        <?php
        foreach ($doclist as $doc) {
         $docdisp = $doc->prefix." ". $doc->firstname." ".$doc->lastname;
         print "<div class='ui-state-default ui-corner-all tasklink'>";
         print "<span><img src='{$doc->img}' style='height:30px;width:30px'></span>";
         print "<span style = 'color:grey; margin-left:15px '>{$docdisp}</span>";
         print "<span style = 'font-size:.25em; margin-left:15px '>{$doc->id}</span>";
         print "</div>";
        }
        ?>
        </div>
	
    </div>   
</div>	

</body>

</html>