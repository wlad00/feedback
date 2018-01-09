<?php
class Questionary_mod extends CI_Model {
    public $db;
    public $CI;
    public function __construct() {
        parent::__construct();
        $this->db = $this->load->database('default', true);
        $this->CI = &get_instance();
    }
    /*----------- getList ------------------*/

    public function getList($id = false){
        $res = $this->db->query('SELECT * FROM Questionary '.($id>0 ? 'WHERE id="'.$id.'"':''));

        return $res->result_array();
    }
    /*----------- update ------------------*/

    public function update($arData){

        if(!empty($arData['id'])>0){
            $this->db->query('UPDATE Questionary SET title="'.$arData['title'].'" WHERE id='.$arData['id']);
        }else{
            $this->db->query('INSERT INTO Questionary SET title="'.$arData['title'].'"');
        }
    }

    public function getQuestionary($id){
        $this->db->select('*, UNIX_TIMESTAMP(createDate) createDate');
        $this->db->from('Questionary');
        $this->db->where('id',$id);
        $res = $this->db->get();
        return $res->row();
    }

    
}


//echo $this->db->last_query();