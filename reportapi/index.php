<?php
require '../Vendors/autoload.php';

session_start();

$app = new \Slim\Slim();

$reportlist = new \IntMgr\reportlist();

// Get Procedure Count By diagnosis id  
$app->get('/proccounts/:id', function ($id) use($reportlist){
    echo (json_encode($reportlist->getproccounts($id))); 
});

// Get Average metrics by procedure  
$app->get('/avgmetrics/:procid/:metricid', function ($procid, $metricid) use($reportlist){
    echo (json_encode($reportlist->getavgmetrics($procid, $metricid))); 
});

// Get Appointments by providerid  
$app->get('/provappts/:provid', function ($provid) use($reportlist){
    echo (json_encode($reportlist->getprovappts($provid))); 
});
$app->run();
