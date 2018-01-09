<?
defined('BASEPATH') OR exit('No direct script access allowed');

class Analysis_lib
{
    protected $CI;


    // We'll use a constructor, as you can't directly call a function
    // from a property definition.
    public function __construct($questionary_id = false, $startDate = false, $endDate = false, $group = false, $username = false)
    {
        // Assign the CodeIgniter super-object
        $this->CI =& get_instance();
        $this->CI->load->model("Analysis");

        $this->questionary_id = $questionary_id;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->group = $group;
        $this->username = $username;
    }

    public function getResults(){

        $arResult['NPSMeasur'] = $this->NPS();
        $arResult['personalTreatment'] = $this->calculateByQuestionIndex([6,8,11]);
        $arResult['professionalization'] = $this->calculateByQuestionIndex([7,10,12]);
        $arResult['serviceTime'] = $this->calculateByQuestionIndex([5,9]);

        $arResult['calculatedScore'] = sprintf('%.1f',($arResult['personalTreatment']+$arResult['professionalization']+$arResult['serviceTime'])/3);

        if($this->group || $this->username) {
            $arResult['noOfRespondents'] = $this->noOfRespondents();
        }

        return $arResult;
    }

    /*
     * Calculate NPS score only for QuestionIndex = 1 (!!!): NPS Score=Promoter Percent (rate 5) - Detractor Percent (rate: 0,1,2,3)
     * params: $results - array with user_id
     *
     *
     *  TO DO сделать результаты не только по всем, но и по части юзеров
     *
     */

    public function NPS(){
        $NPS = 0;

        /*
         * 1. получить ИД вопрос с index = 1
         * 2. получить ответы для вопроса 1
         * 3. сгруппировать их по оценками
         * 4. посчитать NPS
         */
        $arNeededQuestions = $this->getQuestionIdByIndex([1]);
        $NPSquestion_id = $arNeededQuestions[0]['id'];

        if(!$NPSquestion_id)
            return $NPS;

        $arAnswers = $this->CI->answer_mod->getAnswers($NPSquestion_id);

        // works if answer value order from desc to asc (100 -> 0)
        $goodAnswerId = $arAnswers[0]['id'];
        $badAnswerIds = [$arAnswers[2]['id'],$arAnswers[3]['id'],$arAnswers[4]['id'],$arAnswers[5]['id']];

        // results group by answer_id
        $arAnswersResults = $this->CI->surveyuser->getQuantityAnswersResults($NPSquestion_id, $this->questionary_id, $this->startDate, $this->endDate, $this->group, $this->username);

        $total = 0;
        foreach ($arAnswersResults as $result){
            $total += $result;
        }

        $goodResult = $badResult = 0;
        if(array_key_exists($goodAnswerId, $arAnswersResults)){
            $goodResult = ($arAnswersResults[$goodAnswerId] * 100)/$total;
        }

        $badResult = 0;
        foreach ($badAnswerIds as $answer_id){
            if(array_key_exists($answer_id,$arAnswersResults)){
                $badResult += ($arAnswersResults[$answer_id] * 100)/$total;
            }
        }

        $NPS = round($goodResult - $badResult);

        return $NPS;
    }

    // умножаем сумму ответов на вопросы 5,6,7,8,9,10,11,12 каждый на их коефф
    public function calculateByQuestionIndex($arIndexes){
        $arNeededQuestions = $this->getQuestionIdByIndex($arIndexes);

        if(!$arNeededQuestions)
            return 0;

        $arAnswers = [];
        foreach ($arNeededQuestions as $question){

            $answers = $this->CI->answer_mod->getAnswers($question['id']);

            foreach ($answers as $answer){
                $arAnswers[$question['id']][$answer['id']] = $answer['value'];
            }
        }

        // results group by answer_id
        foreach ($arNeededQuestions as $question) {
            $tmp = $this->CI->surveyuser->getSumAnswersResults($question['id'], $this->questionary_id, $this->startDate, $this->endDate, $this->group, $this->username);
            $arAnswersResults[$question['id']] = $tmp[0];
        }

        $result = 0;
        foreach ($arNeededQuestions as $question){

            if($arAnswersResults[$question['id']]['cnt']>0) {
                $result += ($arAnswersResults[$question['id']]['sum'] * $question['coef']) / $arAnswersResults[$question['id']]['cnt'];

                //$this->noOfRespondents += $arAnswersResults[$question['id']]['cnt'];
            }
        }

        return sprintf('%.1f',$result);
    }

    public function noOfRespondents(){
        $result = 0;



        return $result;
    }

    // service method: get Question Number By Index
    private function getQuestionIdByIndex($questionIndex = []){
        $arQuestions = $this->CI->question_mod->getQuestions($this->questionary_id);

        $arQuestionsIds = [];
        foreach ($arQuestions as $question){
            if(in_array($question['questionIndex'],$questionIndex)){
                $arQuestionsIds[] = $question;
            }
        }

        return $arQuestionsIds;
    }

}