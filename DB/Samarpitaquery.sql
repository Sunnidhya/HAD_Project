CREATE SCHEMA `kavachdb` ;
use kavachdb;
select * from doctorl;
INSERT INTO `kavachdb`.`doctorl` (`id`, `doctor_id`, `logged_in`, `password`, `user_name`) VALUES ('1', '100',0,'1234','dr_sam_b');

select * from patientl;
INSERT INTO `kavachdb`.`patientl` (`id`, `logged_in`, `password`, `patient_id`, `user_name`) VALUES ('1', 0, '1234', '1001', 'pt_mo_l');

select * from doctor;