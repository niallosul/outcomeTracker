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
        $sql = "select p.description,p.id, count(cd.diagnosis_id) as 'count'
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

    //Returns average value of given metric for given procedure id
    public function getavgmetrics($procid, $metricid) {
        $sql = "select count(distinct(cp.id)) as 'proccount', p.description as 'procdesc' ,
        		m.description as 'metricdesc', 
        		ROUND(AVG(vd1.value),2) as 'preopavg', ROUND(AVG(vd2.value),2) as 'postopavg'
				from condition_procedure cp
				join procedures p on (cp.procedure_id = p.id) 
				LEFT join condition_visit cv1 on 
						(cv1.pat_cond_id = cp.pat_cond_id and cv1.visitdate < cp.proc_dt_tm)
				LEFT join visit_details vd1 on 
						(vd1.visitid = cv1.id and vd1.metricid = :metricid) 
				LEFT join condition_visit cv2 on 
						(cv2.pat_cond_id = cp.pat_cond_id and cv2.visitdate > cp.proc_dt_tm) 
				LEFT join visit_details vd2 on 
						(vd2.visitid = cv2.id and vd2.metricid = :metricid) 
				join metrics m on  (m.id = :metricid) 
				where cp.procedure_id = :procid";
    	$this->connect();
		$stmt = $this->db->prepare($sql);
		$stmt->bindValue(':procid', $procid, PDO::PARAM_INT);
		$stmt->bindValue(':metricid', $metricid, PDO::PARAM_INT);
		$stmt->execute();
		return($stmt->fetchAll(PDO::FETCH_OBJ));
    }

    //Returns appointment schedule by provider id
    public function getprovappts($provid) {
        $sql = "select  pc.patient_id, m.firstname, m.lastname, pc.description, cv.* 
				from condition_visit cv, members m, patient_condition pc
				where cv.providerid = :provid
				and cv.start_time is not null AND cv.end_time is not null
				and cv.pat_cond_id = pc.id and pc.patient_id = m.id; ";
    	$this->connect();
		$stmt = $this->db->prepare($sql);
		$stmt->bindValue(':provid', $provid, PDO::PARAM_INT);
		$stmt->execute();
		return($stmt->fetchAll(PDO::FETCH_OBJ));
    }

 }    
?>