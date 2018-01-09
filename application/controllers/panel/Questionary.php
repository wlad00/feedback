<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Questionary extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model("questionary_mod");
    }
    /*----------- getList ------------------*/

    public function getList($id = false){
        $response = $this->questionary_mod->getList($id);

        $this->output
            ->set_content_type('application/json', 'utf-8')
            ->set_output(json_encode($response))
            ->_display();
        exit();
    }
    /*----------- update ------------------*/

    public function updateQuestionary(){
        $arData = [];
        
        if($this->input->post('id')){
            $arData['id'] = intval($this->input->post('id'));
        }
        if(!empty($this->input->post('title'))){
            $arData['title'] = strip_tags($this->input->post('title'));
        }

        if($arData)
            $this->questionary_mod->update($arData);

        $this->getList();

    }

    public function deleteLector($id){
        $this->questionary_mod->delete($id);
    }
    
}