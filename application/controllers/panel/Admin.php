<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Admin extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model("structuralunit");
        $this->load->model("questionary_mod");
        $this->load->model("user");
        $this->load->model("alerts");
    }

    public function getCustomers()
    {
        $response = $this->structuralunit->getCustomers();

        $this->output
            ->set_content_type('application/json', 'utf-8')
            ->set_output(json_encode($response))
            ->_display();
        exit();
    }

    public function getProjectsByIdCustomer($customer_id){

        if(!$customer_id)die('Empty customer');

        $this->load->library('statistics_lib');

        // Project
        $projects = $this->structuralunit->getProjectsByCustomer($customer_id);

        foreach ($projects as &$response) {
            // Manager
            $response['manager'] = $this->user->getManagerByStructureUnitId($response['id']);

            // Manager Alerts
            $response['manager']->responsibleAlerts = $this->alerts->getCntResponsibleAlertsByManager($response['manager']->id);
            $response['manager']->supervisoryAlerts = $this->alerts->getCntSupervisoryAlertsByManager($response['manager']->id);

            // Questionary
            $response['questionary'] = $this->questionary_mod->getQuestionary($response['questionary_id']);

            //Questionary statistica
            $statistics = new Statistics_lib($response['questionary_id'],date('Y-m-d',$response['questionary']->createDate),date('Y-m-d'));
            $response['questionary']->statistics = $statistics->fillStatistics();
        }
        
        $this->output
            ->set_content_type('application/json', 'utf-8')
            ->set_output(json_encode($projects))
            ->_display();
        exit();
    }

    public function uploadUsers(){
        
    }
}