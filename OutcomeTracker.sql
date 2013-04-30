SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS `outcomeTracker` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `outcomeTracker` ;

-- -----------------------------------------------------
-- Table `outcomeTracker`.`members`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `outcomeTracker`.`members` (
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
-- Table `outcomeTracker`.`provider_patient`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `outcomeTracker`.`provider_patient` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `provider_id` INT NOT NULL ,
  `patient_id` INT NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `patid_idx` (`patient_id` ASC) ,
  UNIQUE INDEX `ppreltn` (`provider_id` ASC, `patient_id` ASC) ,
  INDEX `provid_idx` (`provider_id` ASC) ,
  CONSTRAINT `provid`
    FOREIGN KEY (`provider_id` )
    REFERENCES `outcomeTracker`.`members` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `patid`
    FOREIGN KEY (`patient_id` )
    REFERENCES `outcomeTracker`.`members` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `outcomeTracker`.`diagnoses`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `outcomeTracker`.`diagnoses` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `code` VARCHAR(10) NOT NULL ,
  `description` VARCHAR(100) NOT NULL ,
  `version` VARCHAR(10) NULL ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `outcomeTracker`.`procedures`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `outcomeTracker`.`procedures` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `code` VARCHAR(10) NOT NULL ,
  `description` VARCHAR(100) NOT NULL ,
  `version` VARCHAR(10) NULL ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `outcomeTracker`.`patient_condition`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `outcomeTracker`.`patient_condition` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `patient_id` INT NOT NULL ,
  `description` VARCHAR(45) NULL ,
  `date` DATE NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `memberid_idx` (`patient_id` ASC) ,
  CONSTRAINT `memberid`
    FOREIGN KEY (`patient_id` )
    REFERENCES `outcomeTracker`.`members` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `outcomeTracker`.`condition_provider`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `outcomeTracker`.`condition_provider` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `pat_cond_id` INT NULL ,
  `provider_id` INT NULL ,
  `provider_type` VARCHAR(20) NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `patcondid_idx` (`pat_cond_id` ASC) ,
  CONSTRAINT `patcondid`
    FOREIGN KEY (`pat_cond_id` )
    REFERENCES `outcomeTracker`.`patient_condition` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `outcomeTracker`.`condition_diagnosis`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `outcomeTracker`.`condition_diagnosis` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `pat_cond_id` INT NULL ,
  `diagnosis_id` INT NULL ,
  `diag_dt_tm` DATETIME NULL ,
  `createdby` INT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `diagid_idx` (`diagnosis_id` ASC) ,
  INDEX `cdpatconid_idx` (`pat_cond_id` ASC) ,
  CONSTRAINT `diagid`
    FOREIGN KEY (`diagnosis_id` )
    REFERENCES `outcomeTracker`.`diagnoses` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `cdpatconid`
    FOREIGN KEY (`pat_cond_id` )
    REFERENCES `outcomeTracker`.`patient_condition` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `outcomeTracker`.`condition_procedure`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `outcomeTracker`.`condition_procedure` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `pat_cond_id` INT NULL ,
  `procedure_id` INT NULL ,
  `proc_dt_tm` DATETIME NULL ,
  `createdby` INT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `procid_idx` (`procedure_id` ASC) ,
  INDEX `procpatcondid_idx` (`pat_cond_id` ASC) ,
  CONSTRAINT `procid`
    FOREIGN KEY (`procedure_id` )
    REFERENCES `outcomeTracker`.`procedures` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `procpatcondid`
    FOREIGN KEY (`pat_cond_id` )
    REFERENCES `outcomeTracker`.`patient_condition` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `outcomeTracker`.`condition_visit`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `outcomeTracker`.`condition_visit` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `pat_cond_id` INT NULL ,
  `type` VARCHAR(20) NULL COMMENT 'Type of Visit - clinic, ER, Surgery, etc' ,
  `date` DATETIME NULL ,
  `createdby` INT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `condid_idx` (`pat_cond_id` ASC) ,
  CONSTRAINT `condid`
    FOREIGN KEY (`pat_cond_id` )
    REFERENCES `outcomeTracker`.`patient_condition` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `outcomeTracker`.`metrics`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `outcomeTracker`.`metrics` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `description` VARCHAR(45) NULL ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `outcomeTracker`.`visit_details`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `outcomeTracker`.`visit_details` (
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
    REFERENCES `outcomeTracker`.`condition_visit` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `metricid`
    FOREIGN KEY (`metricid` )
    REFERENCES `outcomeTracker`.`metrics` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `outcomeTracker`.`member_type`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `outcomeTracker`.`member_type` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `member_id` INT NOT NULL ,
  `type` VARCHAR(45) NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `memid` (`member_id` ASC) ,
  UNIQUE INDEX `memrel` (`member_id` ASC, `type` ASC) ,
  CONSTRAINT `memid`
    FOREIGN KEY (`member_id` )
    REFERENCES `outcomeTracker`.`members` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

USE `outcomeTracker` ;

-- -----------------------------------------------------
-- Placeholder table for view `outcomeTracker`.`providers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `outcomeTracker`.`providers` (`id` INT, `username` INT, `password` INT, `lastname` INT, `firstname` INT, `middlename` INT, `prefix` INT, `suffix` INT, `dob` INT);

-- -----------------------------------------------------
-- Placeholder table for view `outcomeTracker`.`patients`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `outcomeTracker`.`patients` (`id` INT, `username` INT, `password` INT, `lastname` INT, `firstname` INT, `middlename` INT, `prefix` INT, `suffix` INT, `dob` INT);

-- -----------------------------------------------------
-- procedure addppreltn
-- -----------------------------------------------------

DELIMITER $$
USE `outcomeTracker`$$
CREATE PROCEDURE `outcomeTracker`.`addppreltn` 
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
USE `outcomeTracker`$$
CREATE FUNCTION `outcomeTracker`.`isprov` (provid INT)
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
USE `outcomeTracker`$$
CREATE FUNCTION `outcomeTracker`.`ispat` (patid INT)
RETURNS boolean
READS SQL DATA
BEGIN
  DECLARE ispat INT DEFAULT 0;

  SELECT count(*) INTO ispat FROM patients where id = patid;
  RETURN ispat;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- View `outcomeTracker`.`providers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `outcomeTracker`.`providers`;
USE `outcomeTracker`;
CREATE  OR REPLACE VIEW `outcomeTracker`.`providers` AS select m.* from members m, member_type mt 
where mt.type = 'Provider' and m.id = mt.member_id;
;

-- -----------------------------------------------------
-- View `outcomeTracker`.`patients`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `outcomeTracker`.`patients`;
USE `outcomeTracker`;
CREATE  OR REPLACE VIEW `outcomeTracker`.`patients` AS select m.* from members m, member_type mt 
where mt.type = 'Patient' and m.id = mt.member_id;
;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
