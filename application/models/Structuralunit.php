<?php
class Structuralunit extends CI_Model {
    public $db;
    public $CI;
    public function __construct() {
        parent::__construct();
        $this->db = $this->load->database('default', true);
        $this->CI = &get_instance();
    }

    public function getCustomers() {
        $this->db->select('*');
        $this->db->from('StructuralUnit');
        $this->db->where('level',1);
        $res = $this->db->get();
        return $res->result_array();
    }

    public function getProjectsByCustomer($customer_id){
        $this->db->select('*');
        $this->db->from('StructuralUnit');
        $this->db->where('level',2);
        $this->db->where('structuralUnitUp_id',$customer_id);
        $res = $this->db->get();
        return $res->result_array();
    }

    public function getProjects($customer_id){
        $this->db->select('*');
        $this->db->from('StructuralUnit');
        $this->db->where('manager_id',$customer_id);
        $res = $this->db->get();
        return $res->result_array();
    }

    public function getProject($id){
        $this->db->select('*');
        $this->db->from('StructuralUnit');
        $this->db->where('id',$id);
        $res = $this->db->get();
        return $res->row();
    }
}


//echo $this->db->last_query();