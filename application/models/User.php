<?php
class User extends CI_Model {
    public $db;
    public $CI;
    public function __construct() {
        parent::__construct();
        $this->db = $this->load->database('default', true);
        $this->CI = &get_instance();
    }

    public function checkLogin($login,$password) {
        $this->db->select('id,type');
        $this->db->from('User');
        $this->db->where('login',$login);
        $this->db->where('password',$password);

        if($res = $this->db->get()){
            return $res->result_array();
        }else{
            return false;
        }
    }

    public function getManagerByStructureUnitId($structure_id){
        $this->db->select('id,type,name');
        $this->db->from('User');
        $this->db->where('structuralUnit_id',$structure_id);
        $res = $this->db->get();
        return $res->row();
    }
}