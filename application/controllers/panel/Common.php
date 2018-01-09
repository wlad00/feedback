<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Common extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model("user");
        $this->load->model("questionary_mod");
        $this->load->model("structuralunit");
        $this->load->model("question_mod");
        $this->load->model("answer_mod");
        $this->load->model("alerts");
        $this->load->model("surveyuser");
    }

    public function Login()
    {
        if (isset($_SERVER['PHP_AUTH_USER'])){
            $login = $this->input->server('PHP_AUTH_USER');
            $password = $this->input->server('PHP_AUTH_PW');

            if($response = $this->user->checkLogin($login,$password)){
                $this->output
                    ->set_content_type('application/json', 'utf-8')
                    ->set_output(json_encode(current($response)))
                    ->_display();
                exit();
            }else{
                $this->output->set_status_header('401');
            }
        }else{
            $this->output->set_status_header('401');
        }
    }

    public function getQuestionary($project_id){

        $project = $this->structuralunit->getProject($project_id);

        $response = $this->getQuestionaryDetails($project->questionary_id);

        $this->output
            ->set_content_type('application/json', 'utf-8')
            ->set_output(json_encode($response))
            ->_display();
        exit();
    }

    public function getQuestionaryDetails($questionary_id){

        $this->load->library('statistics_lib');

        // Questionary
        $response = $this->questionary_mod->getQuestionary($questionary_id);

        $response->fromDate = '01.'.date('m.Y');
        $response->toDate = strtotime(date('d.m.Y'));
        $response->smsRules['countSms'] = $response->countSms;
        $response->smsRules['delay'] = $response->delay;

        //Questionary statistica
        $statistics = new Statistics_lib($response->id,$response->createDate,date('Y-m-d H:i:s'));
        $response->statistics = $statistics->fillStatistics();

        // Questions
        $response->questions = $this->question_mod->getQuestions($response->id);

        foreach ($response->questions as &$question){
            $question['answers'] = $this->answer_mod->getAnswers($question['id']);
        }

        return $response;
    }

    public function getAnalysis($questionary_id){

        $this->load->library('analysis_lib');

        $response = new stdClass();
        $response->questionary = $this->getQuestionaryDetails($questionary_id);

        $response->statistics = $response->questionary->statistics;
        $response->infoOfAlerts['allAlerts'] = 0;
        $response->infoOfAlerts['openAlerts'] = 0;

        $startDate = $this->input->post('startDate') ? $this->input->post('startDate') : date('Y-m-d',$response->questionary->createDate);
        $endDate = $this->input->post('endDate') ? $this->input->post('endDate') : date('Y-m-d');

        // users, who took a part in survey
        $usersSurvey = $this->surveyuser->getAllUsersByDate($questionary_id, $startDate, $endDate);

        // quantity of users
        $response->countUserByDate = count($usersSurvey);

        $analysis = new Analysis_lib($questionary_id, $startDate, $endDate);

        $response->questionaryResult['general'] = $analysis->getResults();
        $response->questionaryResult['groups'] = [];

        $groups = $this->surveyuser->getSurveyUsergroups($questionary_id, $startDate, $endDate);

        foreach ($groups as $key=>$item){
            $analysis = new Analysis_lib($questionary_id, $startDate, $endDate, $item['group']);

            $response->questionaryResult['groups'][$key] = $analysis->getResults();
            $response->questionaryResult['groups'][$key]['name'] = $item['group'];
        }
        //debug($response->questionaryResult['general']);
        //debug($response->questionaryResult['groups']);

        $this->output
            ->set_content_type('application/json', 'utf-8')
            ->set_output(json_encode($response))
            ->_display();
        exit();
    }

    public function getAnalysisDrillDownDikla(){

        $this->load->library('analysis_lib');

        $response = [];
        $group = strip_tags($this->input->post('group'));
        //$group = 'צוות עדי';
        //$startDate = '2017-10-01';
        $startDate = $this->input->post('startDate') ? $this->input->post('startDate') : date('Y-m-d');
        $endDate = $this->input->post('endDate') ? $this->input->post('endDate') : date('Y-m-d');

        if(!$group)return 'no group';

        $groupUsers = $this->surveyuser->getGroupUsers($group, $startDate, $endDate);

        if($groupUsers) {
            $arUserNames = [];
            foreach ($groupUsers as $key => $user) {
                $name = $this->surveyuser->getSurveyUserName($user['id'])->data;
                $arUserNames[$name] = $name;
            }

            foreach ($arUserNames as $surveyUsername){
                $analysis = new Analysis_lib($user['questionary_id'], $startDate, $endDate, $group, $surveyUsername);
                $response[$surveyUsername] = $analysis->getResults();
                $response[$surveyUsername]['name'] = $surveyUsername;
            }
        }
//        $response[] = ['calculatedScore'=>'1','name'=>'person 1','noOfRespondents'=>'1','npsmeasur'=>'1','personalTreatment'=>'1','professionalization'=>'1','serviceTime'=>'1'];
//debug($response);
        $this->output
            ->set_content_type('application/json', 'utf-8')
            ->set_output(json_encode($response))
            ->_display();
        exit();
    }

    public function getGeneralIndicatorsDikla(){
        $response[] = ['title'=>'שביעות רצון מהשירות', 'date'=>['01-2018'=>1,'12-2017'=>2,'11-2017'=>3]];
        $response[] = ['title'=>'NPS', 'date'=>['01-2018'=>1,'12-2017'=>2,'11-2017'=>3]];
        $response[] = ['title'=>'זמן לקוח', 'date'=>['01-2018'=>1,'12-2017'=>2,'11-2017'=>3]];
        $response[] = ['title'=>'יחס אישי', 'date'=>['01-2018'=>1,'12-2017'=>2,'11-2017'=>3]];
        $response[] = ['title'=>'מקצועיות', 'date'=>['01-2018'=>1,'12-2017'=>2,'11-2017'=>3]];

        $this->output
            ->set_content_type('application/json', 'utf-8')
            ->set_output(json_encode($response))
            ->_display();
        exit();
    }
    


    public function getReport3($questionary_id){
        // Подключаем класс для работы с excel
        require_once(APPPATH . 'third_party/PHPExcel.php');

        $startDate = $this->input->get('startDate') ? $this->input->get('startDate') : date('Y-m-d');
        $endDate = $this->input->get('endDate') ? $this->input->get('endDate') : date('Y-m-d');


        //$arQuestions = $this->question_mod->getQuestions($questionary_id);

        // variable with content for XLS
        $content = '<html><body><table border="1">
<tr>
<td>phone</td>
<td>ת"ז</td>
<td>NAME</td>
<td>תאריך טיפול</td>
<td>יום טיפול בשבוע</td>
<td>USERNUMBER</td>
<td>קוד משתמש דקלה</td>
<td>קוד צוות מטפל</td>
<td>קוד חטיבה</td>
<td>קוד תוכנית</td>
<td>קוד נושא</td>
<td>קוד תחום</td>
<td>Employee</td>
<td>GROUP</td>
<td>חטיבה</td>
<td>נושא</td>
<td>תחום</td>
<td>shem_pone</td>
<td>תאריך סקר</td>
<td>Dikla NPS Score</td>
<td>מדוע לא תמליץ?</td>
<td>מה יכול לגרום לך להמליץ?</td>
<td>מה גרם לך להמליץ?</td>
<td>שביעות רצון כללית</td>
<td>ממה לא היית שבע רצון?</td>
<td>ממה היית שבע רצון?</td>
<td>זמן המתנה</td>
<td>ברור צרכים</td>
<td>ידע ובקיאות הנציג</td>
<td>יחס אישי</td>
<td>מהירות ויעילות טיפול</td>
<td>מקצועיות</td>
<td>הנציג עשה המקסימום</td>
<td>כלים וסמכויות</td>
<td>מדד מקצועיות</td>
<td>מדד יחס אישי</td>
<td>מדד זמן לקוח</td>
<td>ציון משוקלל </td>
</tr>';

        $usersSurvey = $this->surveyuser->getAllUsersByDate($questionary_id, $startDate, $endDate);

        foreach ($usersSurvey as $user){
            $userDetails_tmp = $this->surveyuser->getSurveyUserDetails($user['id']);
            $userDetails = [];
            foreach ($userDetails_tmp as $item){
                $userDetails[$item['data_KEY']] = $item['data'];
            }

            $content .= '<tr>
<td>'.$user['number'].'</td>
<td>'.$userDetails['ת"ז'].'</td>
<td>'.$userDetails['NAME'].'</td>
<td>'.$userDetails['תאריך טיפול'].'</td>
<td>'.$userDetails['יום טיפול בשבוע'].'</td>
<td>'.$userDetails['USERNUMBER'].'</td>
<td>'.$userDetails['קוד משתמש דקלה'].'</td>
<td>'.$userDetails['קוד צוות מטפל'].'</td>
<td>'.$userDetails['קוד חטיבה'].'</td>
<td>'.$userDetails['קוד תוכנית'].'</td>
<td>'.$userDetails['קוד נושא'].'</td>
<td>'.$userDetails['קוד תחום'].'</td>
<td>'.$userDetails['EMPLOYEE'].'</td>
<td>'.$userDetails['GROUP'].'</td>
<td>'.$userDetails['חטיבה'].'</td>
<td>'.$userDetails['נושא'].'</td>
<td>'.$userDetails['תחום'].'</td>
<td>'.$userDetails['shem_pone'].'</td>
<td>'.$user['dateOfPassingSurvey'].'</td>
<td>Dikla NPS Score</td>
<td>מדוע לא תמליץ?</td>
<td>מה יכול לגרום לך להמליץ?</td>
<td>מה גרם לך להמליץ?</td>
<td>שביעות רצון כללית</td>
<td>ממה לא היית שבע רצון?</td>
<td>ממה היית שבע רצון?</td>
<td>זמן המתנה</td>
<td>ברור צרכים</td>
<td>ידע ובקיאות הנציג</td>
<td>יחס אישי</td>
<td>מהירות ויעילות טיפול</td>
<td>מקצועיות</td>
<td>הנציג עשה המקסימום</td>
<td>כלים וסמכויות</td>
<td>מדד מקצועיות</td>
<td>מדד יחס אישי</td>
<td>מדד זמן לקוח</td>
<td>ציון משוקלל </td>
</tr>';
        }
        $content .= '</table></body></html>';

        // save $table inside temporary file that will be deleted later
        $tmpfile = tempnam(sys_get_temp_dir(), 'html');
        file_put_contents($tmpfile, $content);

        // insert $table into $objPHPExcel's Active Sheet through $excelHTMLReader
        $objPHPExcel     = new PHPExcel();
        $excelHTMLReader = PHPExcel_IOFactory::createReader('HTML');
        $excelHTMLReader->loadIntoExisting($tmpfile, $objPHPExcel);
        $objPHPExcel->getActiveSheet()->setTitle('Report'); // Change sheet's title if you want

        unlink($tmpfile); // delete temporary file because it isn't needed anymore

        // Creates a writer to output the $objPHPExcel's content

        $filename = 'report_'.date('d_m_Y').'.xlsx';
        $full_filename = $_SERVER['DOCUMENT_ROOT'].'/export/'.$filename;

        $writer = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        $writer->save($full_filename);

        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); // header for .xlxs file
        header('Content-Disposition: attachment;filename='.$filename); // specify the download file name
        header('Cache-Control: max-age=0');

        $writer->save('php://output');
    }
}