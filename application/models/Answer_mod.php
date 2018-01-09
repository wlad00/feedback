<?php
class Answer_mod extends CI_Model {
    public $db;
    public $CI;
    public function __construct() {
        parent::__construct();
        $this->db = $this->load->database('default', true);
        $this->CI = &get_instance();
    }

    /*----------- getAnswers ------------------*/

    public function getAnswers($question_id){

        if(!$question_id)die('Empty question_id');

        $this->db->select('a.*');
        $this->db->from('Question_Answer qa');
        $this->db->join('Answer a','qa.answers_id=a.id','left');
        $this->db->where('qa.question_id',$question_id);
        $this->db->order_by('a.value','DESC');
        $res = $this->db->get();

        return $res->result_array();
    }

    /*----------- update ------------------*/

    public function update($arData){

        if(!empty($arData['id'])>0){
            $this->db->query('UPDATE Answer SET title="'.$arData['title'].'" WHERE id='.$arData['id']);
        }else{
            $this->db->query('INSERT INTO Answer SET title="'.$arData['title'].'"');

            $this->db->query('INSERT INTO Question_Answer SET Question_id="'.$arData['question_id'].'", answers_id="'.$this->db->insert_id().'"');
        }
    }


    /*----------- getQuestion ------------------*/
/*
    public function getQuestion($id){

        if(!$id)die('Empty getQuestion id');

        $this->db->select('*');
        $this->db->from('Question');
        $this->db->where('id',$id);
        $res = $this->db->get();
        return $res->row();
    }

    public function getList($id = false){
        $res = $this->db->query('SELECT * FROM Question '.($id>0 ? 'WHERE id="'.$id.'"':''));

        return $res->result_array();
    }
*/




}
