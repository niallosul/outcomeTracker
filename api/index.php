<?php
require '../Vendors/autoload.php';

session_start();

$app = new \Slim\Slim();

//Register local DAOs 
$userDAO = new \IntMgr\memberDAO();

$app->get('/session/:val', function ($val) {
  echo($_SESSION[$val]); 
});

// Get All Users from local db
$app->get('/users', function () use($userDAO) {
  echo (json_encode($userDAO->getall('members')));      
});

// Get Specific User from local db 
$app->get('/users/:id', function ($id) use($userDAO){
  echo (json_encode($userDAO->get($id))); 
});

// Get diagnosis list 
$app->get('/diags', function () use($userDAO){
  echo (json_encode($userDAO->getall('diagnoses'))); 
});

// Get Procedure list 
$app->get('/procs', function () use($userDAO){
  echo (json_encode($userDAO->getall('procedures'))); 
});

// Get Provider list 
$app->get('/provs', function () use($userDAO){
  echo (json_encode($userDAO->getall('providers'))); 
});

// Get legal values list 
$app->get('/legalvalues', function () use($userDAO){
  echo (json_encode($userDAO->getall('legalvalues'))); 
});


// Post metrics list 
$app->post('/metrics', function () use($app, $userDAO){
    $bodyobj = json_decode ($app->request()->getBody());
    echo ($userDAO->addvisitmetrics($bodyobj));
});

// Get metrics list 
$app->get('/metrics', function () use($userDAO){
  echo (json_encode($userDAO->getmetriclist())); 
});

// Get Specific Users Patient List 
$app->get('/getpatsbyprov/:id', function ($id) use($userDAO){
    echo (json_encode($userDAO->getpatsbyprov($id))); 
});


// Get Patient's Condition List 
$app->get('/patientconds/:id', function ($id) use($userDAO){
    echo (json_encode($userDAO->getpatcondlist($id))); 
});


// Post new Patient Condition
$app->post('/patcond', function () use($app, $userDAO){
    $bodyobj = json_decode ($app->request()->getBody());
    echo ($userDAO->addpatientcond($bodyobj->patid, $bodyobj->provid, $bodyobj->condtext, $bodyobj->conddate));
 });

// Delete a Patient Condition
$app->delete('/patcond/:id', function ($id) use($app, $userDAO){
    //$bodyobj = json_decode ($app->request()->getBody());
    echo ($userDAO->delpatientcond($id));
 });


// Get Condition Diagnoses 
$app->get('/conddiags/:id', function ($id) use($userDAO){
    echo (json_encode($userDAO->getconddiags($id))); 
});

//Post new Condition Diagnoses
$app->post('/conddiag', function () use($app, $userDAO){
    $bodyobj = json_decode ($app->request()->getBody());
    echo ($userDAO->addconddiag($bodyobj->condid, $bodyobj->diagid, $bodyobj->provid));
 });

// Get Condition Procedures 
$app->get('/condprocs/:id', function ($id) use($userDAO){
    echo (json_encode($userDAO->getcondprocs($id))); 
});

//Post new Condition Procedure
$app->post('/condproc', function () use($app, $userDAO){
    $bodyobj = json_decode ($app->request()->getBody());
    echo ($userDAO->addcondproc($bodyobj->condid, $bodyobj->procid, $bodyobj->provid));
 });

// Get Condition Providers 
$app->get('/condprovs/:id', function ($id) use($userDAO){
    echo (json_encode($userDAO->getcondprovs($id))); 
});

//Post new Condition Provider
$app->post('/condprov', function () use($app, $userDAO){
    $bodyobj = json_decode ($app->request()->getBody());
    echo ($userDAO->addcondprov($bodyobj->condid, $bodyobj->provtype, $bodyobj->provid));
 });


// Get Condition visits 
$app->get('/condvisits/:id', function ($id) use($userDAO){
    echo (json_encode($userDAO->getcondvisits($id))); 
});

//Post new Condition visit
$app->post('/condvisit', function () use($app, $userDAO){
    $bodyobj = json_decode ($app->request()->getBody());
    echo ($userDAO->addcondvisit($bodyobj->condid, $bodyobj->visittype, $bodyobj->visitdate, $bodyobj->visittime, $bodyobj->visitdur, $bodyobj->visitprov));
 });

// Get Visits Metrics  
$app->get('/visitmetrics/:id', function ($id) use($userDAO){
    echo (json_encode($userDAO->getvisitmetrics($id))); 
});

//Post new Condition note
$app->post('/condnote', function () use($app, $userDAO){
    $bodyobj = json_decode ($app->request()->getBody());
    echo ($userDAO->addcondnote($bodyobj->condid, $bodyobj->notetype, $bodyobj->notetext, $bodyobj->userid));
 });

// Get Condition notes
$app->get('/condnotes/:id', function ($id) use($userDAO){
    echo (json_encode($userDAO->getcondnotes($id))); 
});


// PUT route
$app->put('/put', function () {
    echo 'This is a PUT route';
});

// DELETE route
$app->delete('/delete', function () {
    echo 'This is a DELETE route';
});

$app->run();
