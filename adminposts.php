<?php
namespace IntMgr;
require 'Vendors/autoload.php';

//Register local DAOs 
$userDAO = new memberDAO();

if (isset ($_POST['projname']) AND isset ($_POST['projmnem'])) {
    $projDAO->add($_POST['projmnem'], $_POST['projname']);
    unset($_POST);
    header('Location: admin.php');
}  
  

if (isset ($_POST['memid']) AND isset ($_POST['projid'])) {
    $projDAO->addmember($_POST['projid'], $_POST['memid']);
    unset($_POST);
    header('Location: admin.php');
}    


if (isset ($_POST['provid']) AND isset ($_POST['patid'])) {
    echo ("Provider id ->".$_POST['provid']);
    $retval = $userDAO->addprovpatrel($_POST['provid'], $_POST['patid']); 
    echo ($retval);
    unset($_POST);
    //header('Location: admin.php');

}    

  
?>  
