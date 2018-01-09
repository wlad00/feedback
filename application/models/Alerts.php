<?php
class Alerts extends CI_Model
{
    public $db;
    public $CI;

    public function __construct()
    {
        parent::__construct();
        $this->db = $this->load->database('default', true);
        $this->CI = &get_instance();
    }

    public function getCntResponsibleAlertsByManager($manager_id){
        $this->db->select('*');
        $this->db->from('Alert');
        $this->db->where('responsibleManager_id',$manager_id);
        $res = $this->db->get();
        return $res->result_array();
    }

    public function getCntSupervisoryAlertsByManager($manager_id){
        $this->db->select('*');
        $this->db->from('Alert_User');
        $this->db->where('supervisoryManager_id',$manager_id);
        $res = $this->db->get();
        return $res->result_array();
    }

    public function getAllAlertOpenAlertBeforeDate($date){
        $this->db->select('*');
        $this->db->from('Alert');
        $this->db->where('createDate<',$date);
        $this->db->where('createDat','IS NULL');
        $res = $this->db->get();
        return $res->result_array();
    }

    public function getAlertByUser($user_id){
        $this->db->select('*');
        $this->db->from('Alert');
        $this->db->where('user_id',$user_id);
        $res = $this->db->get();
        return $res->result_array();
    }
}