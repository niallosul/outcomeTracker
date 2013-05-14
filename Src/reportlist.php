<?php
namespace IntMgr;
use \PDO as PDO;
/**
 * Object containing each report available in the OutcomeTracker DB
 */
 class reportlist
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
       //echo ("Parsed Connect File");
 	}
 	
 	public function connect() {
       //echo($this->dsn); 
       $this->db  = new PDO($this->dsn, $this->user, $this->pass);
 	   $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    //Returns procedure counts by diagnosis id
    public function getproccounts($diagid) {
        $sql = "select p.description, count(cd.diagnosis_id) as 'count'
				from condition_diagnosis cd
				join condition_procedure cp on (cp.pat_cond_id = cd.pat_cond_id)
				join procedures p on (cp.procedure_id = p.id)  
				where cd.diagnosis_id = :diagid
				group by cp.procedure_id; ";
    	$this->connect();
		$stmt = $this->db->prepare($sql);
		$stmt->bindValue(':diagid', $diagid, PDO::PARAM_INT);
		$stmt->execute();
		return($stmt->fetchAll(PDO::FETCH_OBJ));
    }


 }    
?>