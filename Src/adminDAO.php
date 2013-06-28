<?php
namespace IntMgr;
use \PDO as PDO;
/**
 * DAO Implementation of the members table
 */
 class adminDAO
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
 
   	//Add new member 
    public function addmember($ln, $fn, $mn, $dob) {
    	$this->connect();
		$stmt = $this->db->prepare("insert into members (lastname, firstname,  middlename, dob) values (:ln, :fn, :mn, :dob)");
		$stmt->bindValue(':ln', strip_tags($ln), PDO::PARAM_STR);
		$stmt->bindValue(':fn', strip_tags($fn), PDO::PARAM_STR);
		$stmt->bindValue(':mn', strip_tags($mn), PDO::PARAM_STR);
		$stmt->bindValue(':dob', strip_tags($dob), PDO::PARAM_STR);
		$stmt->execute();
    }

   	//Return all members 
    public function getallmembers() {
    	$this->connect();
		$stmt = $this->db->prepare("SELECT id, prefix, firstname, middlename, lastname, suffix, dob  FROM members order by lastname, firstname");
		$stmt->execute();
		return($stmt->fetchAll(PDO::FETCH_OBJ));
    }

    public function getallproviders() {
    	$this->connect();
		$stmt = $this->db->prepare("SELECT id, prefix, firstname, middlename, lastname, suffix, dob  FROM providers order by lastname, firstname");
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
	
	//Add a new Provider Patient Relationship
	public function addprovpatrel($provid, $patid) {
        $this->connect();
		$stmt = $this->db->prepare("CALL addppreltn (:provid, :patid, @reply)");
		$stmt->bindValue(':provid', $provid, PDO::PARAM_INT);
		$stmt->bindValue(':patid', $patid, PDO::PARAM_INT);
        $stmt->execute();
        $repstmt = $this->db->prepare ("select @reply as repstring");
        $repstmt->execute();
        $resarr = $repstmt->fetchAll(PDO::FETCH_OBJ);
	}



	//Add a new member type
	public function addmemtype($memid, $memtype) {
        $this->connect();
		$stmt = $this->db->prepare("insert into member_type (member_id, type) values (:memid, :memtype)");
		$stmt->bindValue(':memid', $memid, PDO::PARAM_INT);
		$stmt->bindValue(':memtype', strip_tags($memtype), PDO::PARAM_STR);
        $stmt->execute();
	}
	
}

?>