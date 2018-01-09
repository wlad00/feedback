<?php
class Surveyuser extends CI_Model
{
    public $db;
    public $CI;

    public function __construct()
    {
        parent::__construct();
        $this->db = $this->load->database('default', true);
        $this->CI = &get_instance();
    }

    public function getAllUsersByDate($questionary_id,$startDate,$endDate){

        $this->db->select('*');
        $this->db->from('SurveyUser');
        $this->db->where('questionary_id',$questionary_id);
        $this->db->where('dateOfPassingSurvey BETWEEN "'.$startDate.'" AND "'.$endDate.'"');
        $this->db->where('allAnswers', 1);
        $res = $this->db->get();
//echo $this->db->last_query();
        return $res->result_array();
    }

    public function getSurveyUserGroups($questionary_id,$startDate, $endDate, $group = false){
        $this->db->select('sd.data as group');
        $this->db->distinct();
        $this->db->from('SurveyUser su');
        $this->db->join('SurveyUser_data sd','su.id=sd.SurveyUser_id', 'left');
        $this->db->where('su.questionary_id',$questionary_id);
        $this->db->where('sd.data_KEY','GROUP');
        $this->db->where('su.dateOfPassingSurvey BETWEEN "'.$startDate.'" AND "'.$endDate.'"');
        $this->db->where('su.allAnswers', 1);

        if($group){
            $this->db->where('sd.data',$group);
        }

        //$this->db->group_by('sd.data');
        $res = $this->db->get();
        //echo $this->db->last_query();
        //echo '<br>';
        return $res->result_array();
    }

    public function getGroupUsers($group,$startDate, $endDate){
        $this->db->select('su.*');
        $this->db->from('SurveyUser su');
        $this->db->join('SurveyUser_data sd','su.id=sd.SurveyUser_id', 'left');
        $this->db->where('sd.data',$group);
        $this->db->where('su.dateOfPassingSurvey BETWEEN "'.$startDate.'" AND "'.$endDate.'"');
        $this->db->where('su.allAnswers', 1);
        $res = $this->db->get();
        //echo $this->db->last_query();
        return $res->result_array();
    }

    public function getQuantityAnswersResults($question_id, $questionary_id, $startDate, $endDate, $group = false, $username = false){

        $this->db->select('ua_id.idAnswers answer_id, COUNT(ua_id.idAnswers) as cnt');
        $this->db->from('SurveyUser su');

        if($group){
            $this->db->join('SurveyUser_data sd','su.id=sd.SurveyUser_id', 'left');
        }

        $this->db->join('UserAnswer ua','su.id=ua.user_id', 'left');
        $this->db->join('UserAnswer_idAnswers ua_id','ua.id=UserAnswer_id ', 'left');
        $this->db->join('Answer a','ua_id.idAnswers = a.id ', 'left');

        $this->db->where('su.questionary_id',$questionary_id);
        $this->db->where('su.dateOfPassingSurvey BETWEEN "'.$startDate.'" AND "'.$endDate.'"');
        $this->db->where('su.allAnswers', 1);

        if($username){
            $this->db->where('sd.data',$username);
        }
        elseif($group){
            $this->db->where('sd.data',$group);
            $this->db->where('sd.data_KEY','GROUP');
        }

        $this->db->where('ua.idQuestion',$question_id);
        $this->db->group_by('answer_id');

        $res = $this->db->get();
//echo $this->db->last_query();
//echo '<br>';
        $res = $res->result_array();

        $arr = [];
        foreach ($res as $value){
            $arr[$value['answer_id']] = $value['cnt'];
        }

        return $arr;
    }

    public function getSumAnswersResults($question_id, $questionary_id, $startDate, $endDate, $group = false, $username = false){

        $this->db->select('SUM(a.value) sum, COUNT(*) cnt');
        $this->db->from('SurveyUser su');

        if($group){
            $this->db->join('SurveyUser_data sd','su.id=sd.SurveyUser_id', 'left');
        }

        $this->db->join('UserAnswer ua','su.id=ua.user_id', 'left');
        $this->db->join('UserAnswer_idAnswers ua_id','ua.id=UserAnswer_id ', 'left');
        $this->db->join('Answer a','ua_id.idAnswers = a.id ', 'left');

        $this->db->where('su.questionary_id',$questionary_id);

        if($username){
            $this->db->where('sd.data',$username);
        }
        elseif($group){
            $this->db->where('sd.data',$group);
            $this->db->where('sd.data_KEY','GROUP');
        }

        $this->db->where('su.dateOfPassingSurvey BETWEEN "'.$startDate.'" AND "'.$endDate.'"');
        $this->db->where('su.allAnswers', 1);
        $this->db->where('ua.idQuestion',$question_id);

        $res = $this->db->get();
        //echo $this->db->last_query();
        $res = $res->result_array();
        return $res;
    }

    public function getSurveyUserName($user_id){
        $this->db->select('sd.data');
        $this->db->from('SurveyUser su');
        $this->db->join('SurveyUser_data sd','su.id=sd.SurveyUser_id', 'left');
        $this->db->where('sd.data_KEY','EMPLOYEE');
        $this->db->where('su.allAnswers', 1);
        $this->db->where('su.id', $user_id);
        $res = $this->db->get();

        return $res->row();
    }

    /*public function getUsersCount(){
        $this->db->query('SELECT COUNT(sd.data) FROM SurveyUser su LEFT JOIN `SurveyUser_data` sd ON su.id=sd.`SurveyUser_id` AND sd.data_KEY="EMPLOYEE" GROUP BY sd.data');
    }*/

    public function getSurveyUserDetails($user_id){
        $this->db->select('*');
        $this->db->from('SurveyUser_data');
        $this->db->where('SurveyUser_id', $user_id);
        $res = $this->db->get();

        return $res->result_array();
    }
}