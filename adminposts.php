<?php
namespace IntMgr;
require 'Vendors/autoload.php';

//Register local DAOs 
$adminDAO = new adminDAO();

if (isset ($_POST['lastname']) AND isset ($_POST['firstname'])) {
    $adminDAO->addmember($_POST['lastname'], $_POST['firstname'], $_POST['middlename'], $_POST['dob']);
    unset($_POST);
    header('Location: admin.php');
}  
  
if (isset ($_POST['memid']) AND isset ($_POST['memtype'])) {
    $adminDAO->addmemtype($_POST['memid'], $_POST['memtype']);
    unset($_POST);
    //echo ($_POST['memtype']);
    header('Location: admin.php');
}  
  

if (isset ($_POST['provid']) AND isset ($_POST['patid'])) {
    echo ("Provider id ->".$_POST['provid']);
    $retval = $adminDAO->addprovpatrel($_POST['provid'], $_POST['patid']); 
    echo ($retval);
    unset($_POST);
    header('Location: admin.php');

}    

  
?>  
