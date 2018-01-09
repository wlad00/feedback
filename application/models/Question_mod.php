<?php
class Question_mod extends CI_Model {
    public $db;
    public $CI;
    public function __construct() {
        parent::__construct();
        $this->db = $this->load->database('default', true);
        $this->CI = &get_instance();
    }

    /*----------- update ------------------*/

    public function update($arData){

        if(!empty($arData['id'])>0){
            $this->db->query('UPDATE Question SET 
                title="'.$arData['title'].'", 
                multiple="'. $arData['multiple'].'", 
                sort="'. $arData['sort'].'", 
                active="'. $arData['active'].'", 
                type="'. $arData['type'].'",
                questionIndex = "'.$arData['questionIndex'].'",
                coef = "'.$arData['coef'].'"                
                WHERE id='.$arData['id']);
        }else{
            $this->db->query('INSERT INTO Question SET 
                title="'. $arData['title'].'", 
                multiple="'. $arData['multiple'].'", 
                sort="'. $arData['sort'].'", 
                active="'. $arData['active'].'",
                type="'. $arData['type']. '",
                questionIndex = "'.$arData['questionIndex'].'",
                coef = "'.$arData['coef'].'"');

            $this->db->query('INSERT INTO Questionary_Question SET 
                                Questionary_id="'. $arData['questionary_id'].'", 
                                questions_id="'. $this->db->insert_id().'"');
        }
    }
    /*----------- getQuestions ------------------*/
    public function getQuestions($questionary_id){

        if(!$questionary_id)die('Empty questionary_id');

        $this->db->select('q.*');
        $this->db->from('Questionary_Question qq');
        $this->db->join('Question q','qq.questions_id=q.id','left');
        $this->db->where('qq.questionary_id',$questionary_id);
        $this->db->order_by('q.sort','DESC');
        $this->db->order_by('q.id','ASC');
        $res = $this->db->get();

        return $res->result_array();
    }

    /*public function getQuestion($id){

        if(!$id)die('Empty getQuestion id');

        $this->db->select('*');
        $this->db->from('Question');
        $this->db->where('id',$id);
        $res = $this->db->get();
        return $res->row();
    }*/
    /*----------- getList ------------------*/

    /*public function getList($id = false){
        $res = $this->db->query('SELECT * FROM Question '.($id>0 ? 'WHERE id="'.$id.'"':''));

        return $res->result_array();
    }*/

}
