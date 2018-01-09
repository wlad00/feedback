<?
defined('BASEPATH') OR exit('No direct script access allowed');

class Statistics_lib {

    protected $CI;
    private $questionary_id;
    private $startDate;
    private $endDate;

    // We'll use a constructor, as you can't directly call a function
    // from a property definition.
    public function __construct($questionary_id = false ,$startDate = false,$endDate = false)
    {

        // Assign the CodeIgniter super-object
        $this->CI =& get_instance();
        $this->CI->load->model("statistica");

        $this->questionary_id = $questionary_id;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function fillStatistics(){
        $res = [];
        $res['usersIntroduced'] = $this->getUsersIntroduced();

        $arUsersReceivedSms = $this->usersReceivedSms();

        $res['usersReceivedSms'] = count($arUsersReceivedSms);
        $res['usersRespondented'] = 0;
        $res['usersDidnotAnswerAll'] = 0;
        foreach ($arUsersReceivedSms as $k=>$v){
            if($v['allAnswers']){
                $res['usersRespondented']++;
            }
            else{
                $res['usersDidnotAnswerAll']++;
            }
        }

        $res['responseRate'] = 100;
        if($res['usersReceivedSms']>0 && $res['usersRespondented']>0){
            $res['responseRate'] = sprintf("%.2f",($res['usersReceivedSms']*100)/$res['usersRespondented']);
        }else if($res['usersRespondented']==0){
            $res['responseRate'] = 0;
        }

        $res['alertsStarted'] = 0;

        return $res;
    }

    private function getCountIntroducePerDay(){
        $res = $this->CI->statistica->getCountIntroducePerDay($this->questionary_id,$this->startDate,$this->endDate);

        return $res;
    }

    private function getUsersIntroduced(){
        $res = $this->CI->statistica->getUsersIntroduced($this->questionary_id,$this->startDate,$this->endDate);

        return $res;
    }

    private function usersReceivedSms(){
        $res = $this->CI->statistica->usersReceivedSms($this->questionary_id,$this->startDate,$this->endDate);
        return $res;
    }
}
