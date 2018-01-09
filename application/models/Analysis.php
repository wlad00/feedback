<?php
class Analysis extends CI_Model {

    public $db;
    public $CI;

    public function __construct() {
        parent::__construct();
        $this->db = $this->load->database('default', true);
        $this->CI = &get_instance();
    }

    public function getCountIntroducePerDay($questionary_id,$startDate,$endDate){
       // $res = $this->db->query('SELECT * FROM StatisticsIntroducePerDay WHERE questionary_id="'.$questionary_id.'" AND date BETWEEN "'.$startDate.'" AND "'.$endDate.'"');
        //return $res->result_array();
    }
}


//echo $this->db->last_query();