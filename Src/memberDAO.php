<?php
namespace IntMgr;
use \PDO as PDO;
/**
 * DAO Implementation of the members table
 */
 class memberDAO
 {
 	private $db;
 	private $dsn;
 	private $user;
 	private $pass;
 	
 	public function __construct(){
       $params = json_decode(file_get_contents('dbconnect.json', FILE_USE_INCLUDE_PATH));
       $this->dsn = $params->dsn;
       $this->user = $params->user;
       $this->pass = $params->pass;
 	}
 	
 	public function connect() {
       //echo($this->dsn); 
       $this->db  = new PDO($this->dsn, $this->user, $this->pass);
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
    

    //Add new Patient Condition
    public function addpatientcond ($patid, $provid, $conditiontext, $conditiondate) {
        $this->connect();
		$stmt = $this->db->prepare("call addpatcond (:patid, :provid, :condtext, :conddate, @reply)");
		$stmt->bindValue(':patid', $patid, PDO::PARAM_INT);
		$stmt->bindValue(':provid', $provid, PDO::PARAM_INT);
		$stmt->bindValue(':condtext', strip_tags($conditiontext), PDO::PARAM_STR);
		$stmt->bindValue(':conddate', strip_tags($conditiondate), PDO::PARAM_STR);
        $stmt->execute();
        $repstmt = $this->db->prepare ("select @reply as repstring");
        $repstmt->execute();
        $resarr = $repstmt->fetchAll(PDO::FETCH_OBJ);
	    return ($resarr[0]->repstring);
	}

    //Delete Patient Condition
    public function delpatientcond ($condid) {
        $this->connect();
		$stmt = $this->db->prepare("update patient_condition set active_ind = false where id = :condid");
		$stmt->bindValue(':condid', $condid, PDO::PARAM_INT);
        $stmt->execute();
	    return ("Condition ".$condid." deleted");
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
 
 
 
    //Returns visits by condition id
    public function getcondvisits($condid) {
        $sql = "SELECT cv.* ".
        	   "FROM condition_visit cv ".
        	   "where cv.pat_cond_id =:condid ".
        	   "order by cv.visitdate desc";
    	$this->connect();
		$stmt = $this->db->prepare($sql);
		$stmt->bindValue(':condid', $condid, PDO::PARAM_INT);
		$stmt->execute();
		return($stmt->fetchAll(PDO::FETCH_OBJ));
    }
 
 
    //Add new condition visit
    public function addcondvisit($condid, $visittype, $visitdate, $visittime, $visitdur, $visitprov) {
        $this->connect();
		$stmt = $this->db->prepare("CALL addcondvisit (:condid,:visittype,:visitdate,:visittime,:visitdur,:visitprov, @reply)");
		$stmt->bindValue(':visitdate', $visitdate, PDO::PARAM_STR);
		$stmt->bindValue(':condid', $condid, PDO::PARAM_INT);
		$stmt->bindValue(':visittype', $visittype, PDO::PARAM_STR);
		$stmt->bindValue(':visittime', $visittime, PDO::PARAM_STR);
		$stmt->bindValue(':visitdur', $visitdur, PDO::PARAM_INT);
		$stmt->bindValue(':visitprov', $visitprov, PDO::PARAM_INT);
        $stmt->execute();
        $repstmt = $this->db->prepare ("select @reply as repstring");
        $repstmt->execute();
        $resarr = $repstmt->fetchAll(PDO::FETCH_OBJ);
	    return ($resarr[0]->repstring);
    } 


    //Add new metric list
    public function addvisitmetrics($metriclist) {
    	$this->connect();
    	foreach ($metriclist as $metric) {
    	   $sql = "insert into visit_details (visitid, metricid, value, created_by, create_dt_tm) ".
    	   	      "values (:visitid,:metricid,:metricval,:userid, now())";
		   $stmt = $this->db->prepare($sql);

		   $stmt->bindValue(':visitid', $metric->visitid, PDO::PARAM_INT);
		   $stmt->bindValue(':metricid', $metric->metricid, PDO::PARAM_INT);
		   $stmt->bindValue(':metricval', $metric->metricval, PDO::PARAM_INT);
		   $stmt->bindValue(':userid', $metric->userid, PDO::PARAM_INT);

		   $stmt->execute();
		}
		return ($metric->visitid);
    }
    //Returns all metrics
    public function getmetriclist () {
        $sql = "SELECT m.*, vm.visit_type ".
        	   "FROM metrics m, visit_metrics vm ".
        	   "WHERE vm.metric_id=m.id ";
    	$this->connect();
		$stmt = $this->db->prepare($sql);
		$stmt->bindValue(':visitid', $visitid, PDO::PARAM_INT);
		$stmt->execute();
		return($stmt->fetchAll(PDO::FETCH_OBJ));
    }
    
    
    //Returns metrics by visit id
    public function getvisitmetrics($visitid) {
        $sql = "SELECT vd.*, m.description ".
        	   "FROM visit_details vd, metrics m ".
        	   "WHERE vd.visitid=:visitid and m.id = vd.metricid ";
    	$this->connect();
		$stmt = $this->db->prepare($sql);
		$stmt->bindValue(':visitid', $visitid, PDO::PARAM_INT);
		$stmt->execute();
		return($stmt->fetchAll(PDO::FETCH_OBJ));
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

        return($patlist);
    }


    //Returns conditions by patient id
    public function getpatcondlist($patid) {
        $sql = "SELECT * FROM patient_condition where patient_id =:id and active_ind = 1 order by date desc";
    	$this->connect();
		$stmt = $this->db->prepare($sql);
		$stmt->bindValue(':id', $patid, PDO::PARAM_INT);
		$stmt->execute();
		return($stmt->fetchAll(PDO::FETCH_OBJ));
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

    //Add new condition note
    public function addcondnote($condid, $notetype, $notetext, $userid) {
        $this->connect();
		$stmt = $this->db->prepare("CALL addnote (:condid,:notetype,:notetext, :userid, @reply)");
		$stmt->bindValue(':condid', $condid, PDO::PARAM_INT);
		$stmt->bindValue(':notetype', strip_tags($notetype), PDO::PARAM_STR);
		$stmt->bindValue(':notetext', strip_tags($notetext), PDO::PARAM_STR);
		$stmt->bindValue(':userid', $userid, PDO::PARAM_INT);
        $stmt->execute();
        $repstmt = $this->db->prepare ("select @reply as repstring");
        $repstmt->execute();
        $resarr = $repstmt->fetchAll(PDO::FETCH_OBJ);
	    return ($resarr[0]->repstring);
    } 

    //Returns notes by condition id
    public function getcondnotes($condid) {
        $sql = "SELECT n.* ".
        	   "FROM notes n ".
        	   "where n.condition_id =:condid ".
        	   "order by n.create_dt_tm desc";
    	$this->connect();
		$stmt = $this->db->prepare($sql);
		$stmt->bindValue(':condid', $condid, PDO::PARAM_INT);
		$stmt->execute();
		return($stmt->fetchAll(PDO::FETCH_OBJ));
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