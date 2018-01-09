<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Lecturers extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model("lecturers_mod");
    }

    public function updateLector(){
	$arData = [];

	if($this->input->post('id')){
		$arData['id'] = intval($this->input->post('id'));
	}
	if(!empty($this->input->post('name'))){
		$arData['name'] = strip_tags($this->input->post('name'));
	}

	if($arData)
	        $this->lecturers_mod->update($arData);

	$this->getList();

    }

    public function deleteLector($id){

	if(intval($id)>0)	
	        $this->lecturers_mod->delete($id);

        $this->getList();
    }

    public function getList($id = false){
        $response = $this->lecturers_mod->getList($id);

        $this->output
            ->set_content_type('application/json', 'utf-8')
            ->set_output(json_encode($response))
            ->_display();
        exit();
    }

}