
function table_questionary() {

    document.getElementById('table-answers').style.display = "none";
    document.getElementById('table-questions').style.display = "none";
    document.getElementById('table-questionary').style.display = "block";
}
function table_questions() {

    document.getElementById('table-answers').style.display = "none";
    document.getElementById('table-questions').style.display = "block";
}

angular.module('panelsApp')
    .factory('mySharedService', function($rootScope){
        
        var sharedService = {};
        
        sharedService.questionary_id = '';
        sharedService.titleQuestionary = '';

        sharedService.question_id = '';
        sharedService.titleQuestion = '';

        sharedService.idQuestionaryBroadcast = function (id, title) {
            this.questionary_id = id;
            this.titleQuestionary = title;
            this.broadcastQuestions();
        }

        sharedService.idQuestionBroadcast = function (id, title) {
            this.question_id = id;
            this.titleQuestion = title;
            this.broadcastAnswers();
        }
        
        sharedService.broadcastQuestions = function () {
            $rootScope.$broadcast('broadcastQuestions');
        };

        sharedService.broadcastAnswers = function () {
            $rootScope.$broadcast('broadcastAnswers');
        };

        return sharedService;
    })
    .controller('QuestionaryCtrl',
        ['$rootScope',
            '$scope',
            'mySharedService',
            '$http',
            'QuestonaryService',
            '$state',
            'helperService',
            function ($rootScope, $scope, mySharedService, $http, QuestonaryService, $state, helperService) {

                $scope.toSharedService = function (id, title){
                    
                    mySharedService.idQuestionaryBroadcast(id, title);
                };
        
                QuestonaryService.then(function (result) {

                        $scope.questionary = result;
                        console.log("Questionary Service");
                });

                /*-------------------- Add New --------------------*/

                $scope.addNew = function() {

                    $scope.editRow = {};
                    $scope.questionary.push({});
                }

                /*-------------------- Edit --------------------*/

                $scope.editRow = '';

                $scope.copyRow = function (row) {

                    $scope.editRow = angular.copy(row);
                }

                $scope.getIdHtml = function (row) {
                    if (row.id === $scope.editRow.id) return 'edit-1';
                    else return 'view-1';
                }

                $scope.saveData = function(indx){

                    var url = $rootScope.dev_url + "/questionary/";

                    $http({
                        method: "POST",
                        url: url + 'updateQuestionary',
                        data: 'title='+ $scope.editRow.title + '&id=' + $scope.editRow.id,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}

                    }).success(function(response) {

                        $scope.questionary = response;

                    }).error(function(response) {

                        alert('This is embarassing. An error has occured. Please check the log for details');
                    });

                    $scope.reset();
                }

                $scope.reset = function(){

                    $scope.editRow = [];

                    var indexToRemove = $scope.questionary.findIndex(obj => obj.id == null);

                    if (indexToRemove >= 0)
                    $scope.questionary.splice(indexToRemove , 1);
                }
            }])

    .service('QuestonaryService', ['$rootScope', '$http', function ($rootScope, $http) {

        $rootScope.showLoader = true;
        var url = $rootScope.dev_url + "/questionary/";

        var authorizationData = $rootScope.authorizationData;
        var config = {
            headers: {
                "Authorization": "Basic " + authorizationData
            }
        };

        if (authorizationData == undefined){
            console.log(authorizationData);
            console.log("Companies auth data lost");
            // $state.go("auth");
            $rootScope.logout();
        }
        if (authorizationData == ""){
            console.log(authorizationData);
            console.log("Companies auth data empty");
            // $state.go("auth");
            $rootScope.logout();
        }
        //

        return $http.get(url + 'getList', config).then(function (result) {
            $rootScope.showLoader = false;
            return result.data;

        })
    }]);

/*function table_questions(indx) {

    console.log('indx=' + indx);

    var scope_questions = angular.element($("#table-questions")).scope();
    var scope_questionary = angular.element($("#table-questionary")).scope();

    scope_questionary.$apply(function(){

        scope_questionary.setIdQuestionary(indx);
    });

    scope_questions.$apply(function(){

        scope_questions.openQuestions();
    });

    document.getElementById('table-questionary').style.display = "none";
    document.getElementById('table-questions').style.display = "block";
}

function table_questionary() {

    document.getElementById('table-questions').style.display = "none";
    document.getElementById('table-questionary').style.display = "block";
}*/