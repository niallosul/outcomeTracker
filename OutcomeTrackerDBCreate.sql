SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS `sulincde_outcometracker` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `sulincde_outcometracker` ;

-- -----------------------------------------------------
-- Table `sulincde_outcometracker`.`members`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `sulincde_outcometracker`.`members` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `username` VARCHAR(45) NULL ,
  `password` VARCHAR(45) NULL ,
  `lastname` VARCHAR(45) NOT NULL ,
  `firstname` VARCHAR(45) NOT NULL ,
  `middlename` VARCHAR(45) NULL ,
  `prefix` VARCHAR(45) NULL ,
  `suffix` VARCHAR(45) NULL ,
  `dob` DATE NOT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) ,
  UNIQUE INDEX `person` (`lastname` ASC, `firstname` ASC, `dob` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sulincde_outcometracker`.`provider_patient`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `sulincde_outcometracker`.`provider_patient` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `provider_id` INT NOT NULL ,
  `patient_id` INT NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `patid_idx` (`patient_id` ASC) ,
  UNIQUE INDEX `ppreltn` (`provider_id` ASC, `patient_id` ASC) ,
  INDEX `provid_idx` (`provider_id` ASC) ,
  CONSTRAINT `provid`
    FOREIGN KEY (`provider_id` )
    REFERENCES `sulincde_outcometracker`.`members` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `patid`
    FOREIGN KEY (`patient_id` )
    REFERENCES `sulincde_outcometracker`.`members` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sulincde_outcometracker`.`diagnoses`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `sulincde_outcometracker`.`diagnoses` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `code` VARCHAR(10) NOT NULL ,
  `description` VARCHAR(100) NOT NULL ,
  `version` VARCHAR(10) NULL ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sulincde_outcometracker`.`procedures`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `sulincde_outcometracker`.`procedures` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `code` VARCHAR(10) NOT NULL ,
  `description` VARCHAR(100) NOT NULL ,
  `version` VARCHAR(10) NULL ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sulincde_outcometracker`.`patient_condition`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `sulincde_outcometracker`.`patient_condition` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `patient_id` INT NOT NULL ,
  `description` VARCHAR(45) NULL ,
  `date` TIMESTAMP NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `memberid_idx` (`patient_id` ASC) ,
  CONSTRAINT `memberid`
    FOREIGN KEY (`patient_id` )
    REFERENCES `sulincde_outcometracker`.`members` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sulincde_outcometracker`.`legalvalues`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `sulincde_outcometracker`.`legalvalues` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `dataset` VARCHAR(10) NOT NULL ,
  `value` VARCHAR(20) NOT NULL ,
  UNIQUE INDEX `setval` (`dataset` ASC, `value` ASC) ,
  PRIMARY KEY (`id`) ,
  INDEX `lvvalue` (`value` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sulincde_outcometracker`.`condition_provider`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `sulincde_outcometracker`.`condition_provider` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `pat_cond_id` INT NOT NULL ,
  `provider_id` INT NOT NULL ,
  `provider_type` VARCHAR(20) NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `patcondid_idx` (`pat_cond_id` ASC) ,
  INDEX `cpprovtype_idx` (`provider_type` ASC) ,
  UNIQUE INDEX `provtypereltn` (`provider_id` ASC, `provider_type` ASC, `pat_cond_id` ASC) ,
  CONSTRAINT `patcondid`
    FOREIGN KEY (`pat_cond_id` )
    REFERENCES `sulincde_outcometracker`.`patient_condition` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `cpprovtype`
    FOREIGN KEY (`provider_type` )
    REFERENCES `sulincde_outcometracker`.`legalvalues` (`value` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sulincde_outcometracker`.`condition_diagnosis`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `sulincde_outcometracker`.`condition_diagnosis` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `pat_cond_id` INT NOT NULL ,
  `diagnosis_id` INT NOT NULL ,
  `diag_dt_tm` DATETIME NOT NULL ,
  `createdby` INT NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `diagid_idx` (`diagnosis_id` ASC) ,
  INDEX `cdpatconid_idx` (`pat_cond_id` ASC) ,
  UNIQUE INDEX `conddiagreltn` (`pat_cond_id` ASC, `diagnosis_id` ASC) ,
  CONSTRAINT `diagid`
    FOREIGN KEY (`diagnosis_id` )
    REFERENCES `sulincde_outcometracker`.`diagnoses` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `cdpatconid`
    FOREIGN KEY (`pat_cond_id` )
    REFERENCES `sulincde_outcometracker`.`patient_condition` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sulincde_outcometracker`.`condition_procedure`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `sulincde_outcometracker`.`condition_procedure` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `pat_cond_id` INT NOT NULL ,
  `procedure_id` INT NOT NULL ,
  `proc_dt_tm` DATETIME NOT NULL ,
  `createdby` INT NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `procid_idx` (`procedure_id` ASC) ,
  INDEX `procpatcondid_idx` (`pat_cond_id` ASC) ,
  UNIQUE INDEX `condprocreltn` (`pat_cond_id` ASC, `procedure_id` ASC) ,
  CONSTRAINT `procid`
    FOREIGN KEY (`procedure_id` )
    REFERENCES `sulincde_outcometracker`.`procedures` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `procpatcondid`
    FOREIGN KEY (`pat_cond_id` )
    REFERENCES `sulincde_outcometracker`.`patient_condition` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sulincde_outcometracker`.`condition_visit`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `sulincde_outcometracker`.`condition_visit` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `pat_cond_id` INT NOT NULL ,
  `type` VARCHAR(20) NOT NULL COMMENT 'Type of Visit - clinic, ER, Surgery, etc' ,
  `date` DATETIME NOT NULL ,
  `createdby` INT NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `condid_idx` (`pat_cond_id` ASC) ,
  INDEX `cvtype_idx` (`type` ASC) ,
  CONSTRAINT `condid`
    FOREIGN KEY (`pat_cond_id` )
    REFERENCES `sulincde_outcometracker`.`patient_condition` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `cvtype`
    FOREIGN KEY (`type` )
    REFERENCES `sulincde_outcometracker`.`legalvalues` (`value` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sulincde_outcometracker`.`metrics`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `sulincde_outcometracker`.`metrics` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `description` VARCHAR(45) NULL ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sulincde_outcometracker`.`visit_details`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `sulincde_outcometracker`.`visit_details` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `visitid` INT NULL ,
  `metricid` INT NULL ,
  `value` FLOAT NULL ,
  `createdby` INT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `visitid_idx` (`visitid` ASC) ,
  INDEX `metricid_idx` (`metricid` ASC) ,
  CONSTRAINT `visitid`
    FOREIGN KEY (`visitid` )
    REFERENCES `sulincde_outcometracker`.`condition_visit` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `metricid`
    FOREIGN KEY (`metricid` )
    REFERENCES `sulincde_outcometracker`.`metrics` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sulincde_outcometracker`.`member_type`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `sulincde_outcometracker`.`member_type` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `member_id` INT NOT NULL ,
  `type` VARCHAR(45) NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `memid` (`member_id` ASC) ,
  UNIQUE INDEX `memrel` (`member_id` ASC, `type` ASC) ,
  CONSTRAINT `memid`
    FOREIGN KEY (`member_id` )
    REFERENCES `sulincde_outcometracker`.`members` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

USE `sulincde_outcometracker` ;

-- -----------------------------------------------------
-- Placeholder table for view `sulincde_outcometracker`.`providers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sulincde_outcometracker`.`providers` (`id` INT, `username` INT, `password` INT, `lastname` INT, `firstname` INT, `middlename` INT, `prefix` INT, `suffix` INT, `dob` INT);

-- -----------------------------------------------------
-- Placeholder table for view `sulincde_outcometracker`.`patients`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sulincde_outcometracker`.`patients` (`id` INT, `username` INT, `password` INT, `lastname` INT, `firstname` INT, `middlename` INT, `prefix` INT, `suffix` INT, `dob` INT);

-- -----------------------------------------------------
-- procedure addppreltn
-- -----------------------------------------------------

DELIMITER $$
USE `sulincde_outcometracker`$$
CREATE PROCEDURE `sulincde_outcometracker`.`addppreltn` 
(IN provid INT, IN patid INT, OUT result VARCHAR(100))
BEGIN
  DECLARE EXIT HANDLER FOR SQLSTATE '23000' 
  BEGIN 
    SET result = "Duplicate Relationship Found";
  END;
  IF !ispat(patid) THEN 
    SET result = "Invalid Patient Id";
  ELSEIF !isprov(provid) THEN 
	SET result = "Invalid Provider Id";
  ELSE
	insert into provider_patient (provider_id, patient_id) 
    values 
      (provid,patid);
	SET result = "New Relationship Created";
  END IF; 
END$$

DELIMITER ;

-- -----------------------------------------------------
-- function isprov
-- -----------------------------------------------------

DELIMITER $$
USE `sulincde_outcometracker`$$
CREATE FUNCTION `sulincde_outcometracker`.`isprov` (provid INT)
RETURNS boolean
READS SQL DATA
BEGIN
  DECLARE isprov INT DEFAULT 0;

  SELECT count(*) INTO isprov FROM providers where id = provid;
  RETURN isprov;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- function ispat
-- -----------------------------------------------------

DELIMITER $$
USE `sulincde_outcometracker`$$
CREATE FUNCTION `sulincde_outcometracker`.`ispat` (patid INT)
RETURNS boolean
READS SQL DATA
BEGIN
  DECLARE ispat INT DEFAULT 0;

  SELECT count(*) INTO ispat FROM patients where id = patid;
  RETURN ispat;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure addconddiag
-- -----------------------------------------------------

DELIMITER $$
USE `sulincde_outcometracker`$$
CREATE PROCEDURE `sulincde_outcometracker`.`addconddiag` 
(IN condid INT, IN diagid INT, IN provid INT, OUT result VARCHAR(100))
BEGIN
  DECLARE EXIT HANDLER FOR SQLSTATE '23000' 
  BEGIN 
    SET result = "Duplicate Diagnosis Found";
  END;
  IF !isdiag(diagid) THEN 
	SET result = "Invalid Diagnosis Id";
  ELSEIF !iscond(condid) THEN 
	SET result = "Invalid Condition Id";
  ELSEIF !isprov(provid) THEN 
	SET result = "Invalid Provider Id";
  ELSE
      insert into condition_diagnosis (pat_cond_id, diagnosis_id, diag_dt_tm, createdby)
       values
		(condid, diagid,now(),provid);

	SET result = "Diagnosis Added";
  END IF; 
END$$

DELIMITER ;

-- -----------------------------------------------------
-- function isdiag
-- -----------------------------------------------------

DELIMITER $$
USE `sulincde_outcometracker`$$
CREATE FUNCTION `sulincde_outcometracker`.`isdiag` (diagid INT)
RETURNS boolean
READS SQL DATA
BEGIN
  DECLARE isdiag INT DEFAULT 0;

  SELECT count(id) INTO isdiag FROM diagnoses where id = diagid;
  RETURN isdiag;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- function iscond
-- -----------------------------------------------------

DELIMITER $$
USE `sulincde_outcometracker`$$
CREATE FUNCTION `sulincde_outcometracker`.`iscond` (condid INT)
RETURNS boolean
READS SQL DATA
BEGIN
  DECLARE iscond INT DEFAULT 0;

  SELECT count(id) INTO iscond FROM patient_condition where id = condid;
  RETURN iscond;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- function isproc
-- -----------------------------------------------------

DELIMITER $$
USE `sulincde_outcometracker`$$
CREATE FUNCTION `sulincde_outcometracker`.`isproc` (procid INT)
RETURNS boolean
READS SQL DATA
BEGIN
  DECLARE isproc INT DEFAULT 0;

  SELECT count(id) INTO isproc FROM procedures where id = procid;
  RETURN isproc;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure addcondproc
-- -----------------------------------------------------

DELIMITER $$
USE `sulincde_outcometracker`$$
CREATE PROCEDURE `sulincde_outcometracker`.`addcondproc` 
(IN condid INT, IN procid INT, IN provid INT, OUT result VARCHAR(100))
BEGIN
  DECLARE EXIT HANDLER FOR SQLSTATE '23000' 
  BEGIN 
    SET result = "Duplicate Procedure Found";
  END;
  IF !isproc(procid) THEN 
	SET result = "Invalid Procedure Id";
  ELSEIF !iscond(condid) THEN 
	SET result = "Invalid Condition Id";
  ELSEIF !isprov(provid) THEN 
	SET result = "Invalid Provider Id";
  ELSE
      insert into condition_procedure (pat_cond_id, procedure_id, proc_dt_tm, createdby)
       values
		(condid, procid,now(),provid);

	SET result = "Procedure Added";
  END IF; 
END$$

DELIMITER ;

-- -----------------------------------------------------
-- function islegalval
-- -----------------------------------------------------

DELIMITER $$
USE `sulincde_outcometracker`$$
CREATE FUNCTION `sulincde_outcometracker`.`islegalval` 
(idataset VARCHAR (10), ivalue VARCHAR(20))
RETURNS boolean
READS SQL DATA
BEGIN
  DECLARE islegal INT DEFAULT 0;

  SELECT count(id) INTO islegal FROM legalvalues where dataset = idataset AND value=ivalue;
  RETURN islegal;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure addcondprov
-- -----------------------------------------------------

DELIMITER $$
USE `sulincde_outcometracker`$$
CREATE PROCEDURE `sulincde_outcometracker`.`addcondprov` 
(IN condid INT, IN provtype VARCHAR(20), IN provid INT, OUT result VARCHAR(100))
BEGIN
  DECLARE EXIT HANDLER FOR SQLSTATE '23000' 
  BEGIN 
    SET result = "Duplicate Provider of this type";
  END;
  IF !islegalval('doctype', provtype) THEN 
	SET result = "Invalid Provider Type";
  ELSEIF !iscond(condid) THEN 
	SET result = "Invalid Condition Id";
  ELSEIF !isprov(provid) THEN 
	SET result = "Invalid Provider Id";
  ELSE
      insert into condition_provider (pat_cond_id, provider_id, provider_type)
       values
		(condid,provid,provtype);

	SET result = "Provider Added";
  END IF; 
END$$

DELIMITER ;

-- -----------------------------------------------------
-- View `sulincde_outcometracker`.`providers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sulincde_outcometracker`.`providers`;
USE `sulincde_outcometracker`;
CREATE  OR REPLACE VIEW `sulincde_outcometracker`.`providers` AS select m.* from members m, member_type mt 
where mt.type = 'Provider' and m.id = mt.member_id;
;

-- -----------------------------------------------------
-- View `sulincde_outcometracker`.`patients`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sulincde_outcometracker`.`patients`;
USE `sulincde_outcometracker`;
CREATE  OR REPLACE VIEW `sulincde_outcometracker`.`patients` AS select m.* from members m, member_type mt 
where mt.type = 'Patient' and m.id = mt.member_id;
;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
