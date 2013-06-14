<?php

$params = json_decode(file_get_contents('dbconnect.json', FILE_USE_INCLUDE_PATH));
$db  = new PDO($params->dsn, $params->user, $params->pass);

$userinfo = json_decode (file_get_contents('php://input'));

$user = $userinfo->username;
$pass = $userinfo->password;

$stmt = $db->prepare("SELECT * FROM members where username =:user and password= :pass");
$stmt->bindValue(':user', $user, PDO::PARAM_STR);
$stmt->bindValue(':pass', $pass, PDO::PARAM_STR);
$stmt->execute();

$loginreply = $stmt->fetchAll(PDO::FETCH_OBJ);

if($loginreply[0]) {
    $userinfo = json_encode($loginreply[0]);
	session_start();
	$_SESSION['userinfo'] = $userinfo;
	//$_SESSION['id']=$loginreply[0]->id;
	//$_SESSION['title']=$row['title'];
	echo ($userinfo);
 }	
else {
    echo ("No User found");
}
?>