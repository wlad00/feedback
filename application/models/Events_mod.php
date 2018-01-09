<?php
class Events_mod extends CI_Model
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
            $this->db->query('UPDATE Events SET 
              title="'.$arData['title'].'",
            event_number="'.$arData['event_number'].
                '" WHERE id='.$arData['id']);
        }else{
            $this->db->query('INSERT INTO Events SET 
                title="'. $arData['title'].'",                
                event_number="'.$arData['event_number']. '"');
        }
    }

    public function getList(){
        $res = $this->db->query('SELECT * FROM Events ORDER BY title ASC');

        return $res->result_array();
    }

    public function delete($id){
        if(intval($id)>0){
            $res = $this->db->query('DELETE FROM Events WHERE id='.$id);
        }
    }

    public function getQuestionaries($event_id){

        $this->db->select('eq.event_id, q.*');
        $this->db->from('Events_Questionaries eq');
        $this->db->join('Questionary q','eq.questionary_id=q.id','left');
        $this->db->where('eq.event_id',$event_id);
        $this->db->order_by('q.title','ASC');
        $res = $this->db->get();

        return $res->result_array();
    }

    public function addQuestionaryToEvent($arData){
        $this->db->query('INSERT INTO Events_Questionaries SET event_id="'.$arData['event_id'].'", questionary_id="'.$arData['questionary_id'].'"');
    }

    public function removeQuestionaryFromEvent($arData){
        $this->db->query('DELETE FROM Events_Questionaries WHERE event_id="'.$arData['event_id'].'" AND questionary_id="'.$arData['questionary_id'].'"');
    }
}