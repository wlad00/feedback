<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Events extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model("events_mod");
    }

    public function update(){
        $arData = [];
        $arData['event_number']=(string)time();

        if($this->input->post('id')){
            $arData['id'] = intval($this->input->post('id'));
        }
        if(!empty($this->input->post('title'))){
            $arData['title'] = strip_tags($this->input->post('title'));
        }
        if(!empty($this->input->post('event_number'))){
            $arData['event_number'] = strip_tags($this->input->post('event_number'));
        }

        if($arData)
            $this->events_mod->update($arData);

        $this->getList();
    }

    public function delete($id){

        if(intval($id)>0)
            $this->events_mod->delete($id);

        $this->getList();
    }

    public function getList($id = false){
        $response = $this->events_mod->getList($id);

        $this->output
            ->set_content_type('application/json', 'utf-8')
            ->set_output(json_encode($response))
            ->_display();
        exit();
    }

    // get list of Questionaries for Event
    public function getEventQuestionaries($event_id){
        
        $response = $this->events_mod->getQuestionaries($event_id);

        $this->output
            ->set_content_type('application/json', 'utf-8')
            ->set_output(json_encode($response))
            ->_display();
        exit();
    }

    public function addQuestionaryToEvent(){
        $arData = ['event_id','questionary_id'];

        if(intval($this->input->post('event_id'))>0){
           $arData['event_id'] = $this->input->post('event_id');
        }

        if(intval($this->input->post('questionary_id'))>0){
            $arData['questionary_id'] = $this->input->post('questionary_id');
        }

        if($arData['questionary_id'] && $arData['event_id']){
            $this->events_mod->addQuestionaryToEvent($arData);
        }else{
            die('Empty event_id or questionary_id');
        }
    }

    public function removeQuestionaryFromEvent(){
        $arData = ['event_id','questionary_id'];

        if(intval($this->input->post('event_id'))>0){
            $arData['event_id'] = $this->input->post('event_id');
        }

        if(intval($this->input->post('questionary_id'))>0){
            $arData['questionary_id'] = $this->input->post('questionary_id');
        }

        if($arData['questionary_id'] && $arData['event_id']){
            $this->events_mod->removeQuestionaryFromEvent($arData);
        }else{
            die('Empty event_id or questionary_id');
        }
    }
}