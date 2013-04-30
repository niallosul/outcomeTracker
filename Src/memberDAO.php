<?php
namespace IntMgr;
use \PDO as PDO;
/**
 * DAO Implementation of the members table
 */
 class memberDAO
 {
 	private $db;
 	
 	public function connect() {
 	   $this->db  = new PDO('mysql:dbname=sulincde_outcometracker;host=127.0.0.1', 'guest', 'guest');
 	   $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    
   	//Returns all from given table 
    public function getall($table) {
    	$this->connect();
		$stmt = $this->db->prepare("SELECT * FROM ".$table);
		$stmt->execute();
		return($stmt->fetchAll(PDO::FETCH_OBJ));
    }

    
	//Returns member by id
    public function get($id) {
    	$this->connect();
		$stmt = $this->db->prepare("SELECT * FROM members where id =:id");
		$stmt->bindValue(':id', $id, PDO::PARAM_INT);
		$stmt->execute();
		return($stmt->fetchAll(PDO::FETCH_OBJ));
    }
    
    
	//Returns diagnoses by condition id
    public function getconddiags($condid) {
        $sql = "SELECT cd.*, d.code, d.description ".
        	   "FROM condition_diagnosis cd, diagnoses d ".
        	   "where cd.pat_cond_id =:condid AND cd.diagnosis_id = d.id ".
        	   "order by cd.diag_dt_tm desc";
    	$this->connect();
		$stmt = $this->db->prepare($sql);
		$stmt->bindValue(':condid', $condid, PDO::PARAM_INT);
		$stmt->execute();
		return($stmt->fetchAll(PDO::FETCH_OBJ));
    }
    
    //Add new condition diagnosis
    public function addconddiag($condid, $diagid, $provid) {
        $this->connect();
		$stmt = $this->db->prepare("CALL addconddiag (:condid,:diagid,:provid, @reply)");
		$stmt->bindValue(':provid', $provid, PDO::PARAM_INT);
		$stmt->bindValue(':condid', $condid, PDO::PARAM_INT);
		$stmt->bindValue(':diagid', $diagid, PDO::PARAM_INT);
        $stmt->execute();
        $repstmt = $this->db->prepare ("select @reply as repstring");
        $repstmt->execute();
        $resarr = $repstmt->fetchAll(PDO::FETCH_OBJ);
	    return ($resarr[0]->repstring);
    } 

	//Returns procedures by condition id
    public function getcondprocs($condid) {
        $sql = "SELECT cp.*, p.code, p.description ".
        	   "FROM condition_procedure cp, procedures p ".
        	   "where cp.pat_cond_id =:condid AND cp.procedure_id = p.id ".
        	   "order by cp.proc_dt_tm desc";
    	$this->connect();
		$stmt = $this->db->prepare($sql);
		$stmt->bindValue(':condid', $condid, PDO::PARAM_INT);
		$stmt->execute();
		return($stmt->fetchAll(PDO::FETCH_OBJ));
    }
 
 
    //Add new condition procedure
    public function addcondproc($condid, $procid, $provid) {
        $this->connect();
		$stmt = $this->db->prepare("CALL addcondproc (:condid,:procid,:provid, @reply)");
		$stmt->bindValue(':provid', $provid, PDO::PARAM_INT);
		$stmt->bindValue(':condid', $condid, PDO::PARAM_INT);
		$stmt->bindValue(':procid', $procid, PDO::PARAM_INT);
        $stmt->execute();
        $repstmt = $this->db->prepare ("select @reply as repstring");
        $repstmt->execute();
        $resarr = $repstmt->fetchAll(PDO::FETCH_OBJ);
	    return ($resarr[0]->repstring);
    } 
   

	//Returns providers by condition id
    public function getcondprovs($condid) {
        $sql = "SELECT cp.*, p.prefix, p.lastname, p.firstname, p.suffix ".
        	   "FROM condition_provider cp, providers p ".
        	   "where cp.pat_cond_id =:condid AND cp.provider_id = p.id ";
    	$this->connect();
		$stmt = $this->db->prepare($sql);
		$stmt->bindValue(':condid', $condid, PDO::PARAM_INT);
		$stmt->execute();
		return($stmt->fetchAll(PDO::FETCH_OBJ));
    }
 
 
    //Add new condition provider
    public function addcondprov($condid, $provtype, $provid) {
        $this->connect();
		$stmt = $this->db->prepare("CALL addcondprov (:condid,:provtype,:provid, @reply)");
		$stmt->bindValue(':provid', $provid, PDO::PARAM_INT);
		$stmt->bindValue(':condid', $condid, PDO::PARAM_INT);
		$stmt->bindValue(':provtype', $provtype, PDO::PARAM_STR);
        $stmt->execute();
        $repstmt = $this->db->prepare ("select @reply as repstring");
        $repstmt->execute();
        $resarr = $repstmt->fetchAll(PDO::FETCH_OBJ);
	    return ($resarr[0]->repstring);
    } 
    
    //Returns providers patients by id
    public function getpatsbyprov($id) {
        $provpatlist = array();
		$querysql = "select m.* from provider_patient pp, members m ".
	    			"where pp.provider_id =:id and m.id = pp.patient_id ".
	    			"order by m.lastname";
		$this->connect();
		$stmt = $this->db->prepare($querysql);
		$stmt->bindValue(':id', $id, PDO::PARAM_INT);
		$stmt->execute();
		$patlist = $stmt->fetchAll(PDO::FETCH_OBJ);
		foreach ($patlist as $pat){
		   $stmt = $this->db->prepare("SELECT * FROM patient_condition where patient_id =:id order by date desc");
		   $stmt->bindValue(':id', $pat->id, PDO::PARAM_INT);
		   $stmt->execute();
		   $condlist = $stmt->fetchAll(PDO::FETCH_OBJ);
		   $patinfo = array();
		   $patinfo['Patient']=$pat;
		   $patinfo['Conditions']= $condlist;
		   $provpatlist[]=$patinfo;
		}
		return($provpatlist);
    }


    public function addpatientcond($patid, $conditiontext) {
        $this->connect();
		$stmt = $this->db->prepare("insert into patient_condition (patient_id, description, date) values (:patid, :condtext, now())");
		$stmt->bindValue(':condtext', $conditiontext, PDO::PARAM_STR);
		$stmt->bindValue(':patid', $patid, PDO::PARAM_INT);
        $stmt->execute();
	    return ($this->db->lastInsertId());
	}


    public function addprovpatrel($provid, $patid) {
        $this->connect();
		$stmt = $this->db->prepare("CALL addppreltn (:provid, :patid, @reply)");
		$stmt->bindValue(':provid', $provid, PDO::PARAM_INT);
		$stmt->bindValue(':patid', $patid, PDO::PARAM_INT);
        $stmt->execute();
        $repstmt = $this->db->prepare ("select @reply as repstring");
        $repstmt->execute();
        $resarr = $repstmt->fetchAll(PDO::FETCH_OBJ);
	    return ($resarr[0]->repstring);
	}
	
    // Add a new member to the db 
    public function add($member) {
      $ln = filter_var($member->getlastname(), FILTER_SANITIZE_FULL_SPECIAL_CHARS);
      $this->db->connect();
      $insertSql = "INSERT INTO members (lastname, firstname, token, img) "
      			."VALUES ('".$member->getid()."','".$ln."','".$member->getfirstname()."','".$member->gettoken()."','".$member->getimg()."')";
      echo ("INSERT:".$insertSql);
	  return ($this->db->insert($insertSql));
    }


    //Delete member by id
    public function delete($id) {
        $this->db->connect();
		$deletesql = "DELETE FROM `member` WHERE id =".$id;		
		return ($this->db->delete($querysql));
    }
  
  
    
 }    
?>