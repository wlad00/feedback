<?php
class Lecturers_mod extends CI_Model
{
    public $db;
    public $CI;

    public function __construct()
    {
        parent::__construct();
        $this->db = $this->load->database('default', true);
        $this->CI = &get_instance();
    }

    public function update($arData){

        if(!empty($arData['id'])>0){
            $this->db->query('UPDATE lecturers SET name="'.$arData['name'].'" WHERE id='.$arData['id']);
        }else{
            $this->db->query('INSERT INTO lecturers SET name="'.$arData['name'].'"');
        }

    }

    public function getList($id = false){
        $res = $this->db->query('SELECT * FROM lecturers '.($id>0 ? 'WHERE id="'.$id.'"':'').' ORDER BY name ASC');

        return $res->result_array();
    }

    public function delete($id){
	if(intval($id)>0){
	        $res = $this->db->query('DELETE FROM lecturers WHERE id='.$id);
        }
    }
}