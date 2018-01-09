<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Questions extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model("question_mod");

    }

    /*----------- getQuestions ------------------*/

    public function getQuestions($questionary_id){

        $response = $this->question_mod->getQuestions($questionary_id);

        $this->output
            ->set_content_type('application/json', 'utf-8')
            ->set_output(json_encode($response))
            ->_display();
        exit();
    }

    /*----------- update ------------------*/

    public function updateQuestions(){
        $arData = [];
        $arData['id'] = intval($this->input->post('id'))>0 ? $this->input->post('id') : 0;
        $arData['questionary_id'] = intval($this->input->post('questionary_id'))>0 ? $this->input->post('questionary_id') : 0;
        $arData['sort'] = intval($this->input->post('sort'))>0 ? $this->input->post('sort') : 0;
        $arData['questionIndex'] = intval($this->input->post('questionIndex'))>0 ? $this->input->post('questionIndex') : 0;
        $arData['coef'] = $this->input->post('coef') ? $this->input->post('coef') : 0;
        $arData['active'] = intval($this->input->post('active'))>0 ? 1 : 0;
        $arData['multiple'] = intval($this->input->post('multiple'))>0 ? 1 : 0;
        $arData['title'] = $this->input->post('title') ? strip_tags($this->input->post('title')) : 'text';
        $arData['type'] = $this->input->post('type') ? strip_tags($this->input->post('type')) : 'text';

        $this->question_mod->update($arData);

        $this->getQuestions( $arData['questionary_id']);
    }


    /*----------- getList ------------------*/

    /*public function getList($id = false){
        $response = $this->question_mod->getList($id);

        $this->output
            ->set_content_type('application/json', 'utf-8')
            ->set_output(json_encode($response))
            ->_display();
        exit();
    }

    public function deleteLector($id){
        $this->question_mod->delete($id);
    }*/


}