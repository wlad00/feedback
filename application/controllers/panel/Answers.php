<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Answers extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model("answer_mod");

    }

    /*----------- getAnswers ------------------*/

    public function getAnswers($question_id){

        $response = $this->answer_mod->getAnswers($question_id);

        $this->output
            ->set_content_type('application/json', 'utf-8')
            ->set_output(json_encode($response))
            ->_display();
        exit();
    }

    public function deleteAnswer($id){
        $this->answer_mod->delete($id);
    }

    /*----------- update ------------------*/

    public function updateAnswer(){
        $arData = [];

        if($this->input->post('id')){
            $arData['id'] = intval($this->input->post('id'));
        }
        if(!empty($this->input->post('title'))){
            $arData['title'] = strip_tags($this->input->post('title'));
        }
        if($this->input->post('question_id')){
            $arData['question_id'] = intval($this->input->post('question_id'));
        }
        if($arData)
            $this->answer_mod->update($arData);

        $this->getAnswers( $arData['question_id']);
    }


    /*----------- getList ------------------*/

    public function getList($id = false){
        $response = $this->question_mod->getList($id);

        $this->output
            ->set_content_type('application/json', 'utf-8')
            ->set_output(json_encode($response))
            ->_display();
        exit();
    }

}