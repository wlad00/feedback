

angular.module('panelsApp')
    .controller('QuestionsCtrl',
        ['$rootScope',
            '$scope',
            'mySharedService',
            '$http',
            '$state',
            'helperService',
            function ($rootScope, $scope, mySharedService, $http, $state, helperService) {

                /*$scope.roles = [
                    {id: 1, text: 'guest', multiple: 1},
                    {id: 2, text: 'user', multiple: 0},
                    {id: 3, text: 'customer', multiple: 1},
                    {id: 4, text: 'admin', multiple: 1}
                ];

                $scope.user = {
                    roles: [2, 4]
                };

                $scope.a = "AAAAA";*/

                $scope.checkAll = function() {
                    $scope.user.roles = $scope.roles.map(function(item) { return item.id; });
                };

                $scope.styleFunction = function(type){

                    if (type == "dropdown")
                        return "goTo";
                }

                $scope.toSharedService = function (id, title, type){

                    if (type == "dropdown"){

                        mySharedService.idQuestionBroadcast(id, title);
                    }
                };

                $scope.$on('broadcastQuestions', function(){

                    $scope.title = mySharedService.titleQuestionary;

                    $scope.getQuestions();

                    document.getElementById('table-questionary').style.display = "none";
                    document.getElementById('table-questions').style.display = "block";
                });

                $scope.getQuestions = function() {

                    var url = $rootScope.dev_url + "/questions/";

                    $http({
                        method: 'GET',
                        url: url + 'getQuestions/' + mySharedService.questionary_id
                    }).success(function (result) {

                        $scope.questions = result;

                    }).error(function (data) {
                        alert('Unable to delete');
                    });
                }
                /*----------------------------------------------*/
                /*-------------------- Delete --------------------*/
                /*----------------------------------------------*/

                /*$scope.confirmDelete = function(data) {

                    var url = $rootScope.dev_url + "/lecturers/";

                    var isConfirmDelete = confirm('Are you sure you want Delete?');
                    if (isConfirmDelete) {
                        $http({
                            method: 'GET',
                            url: url + 'deleteLector/' + data.id
                        }).
                        success(function(data) {

                            $scope.lecturers = data;

                        }).
                        error(function(data) {
                            alert('Unable to delete');
                        });
                    } else {
                        return false;
                    }
                };*/

                /*----------------------------------------------*/
                /*-------------------- Add New --------------------*/
                /*----------------------------------------------*/

                $scope.addNew = function() {

                    $scope.editRow = {};
                    $scope.questions.push({});
                }

                $scope.saveCheckBox = function (row) {

                    $scope.editRow = angular.copy(row);
                    $scope.saveData(0);
                }
                /*----------------------------------------------*/
                /*-------------------- Edit --------------------*/
                /*----------------------------------------------*/

                $scope.editRow = '';

                $scope.copyRow = function (row) {

                    $scope.editRow = angular.copy(row);
                }

                $scope.getIdHtml = function (row) {
                    if (row.id === $scope.editRow.id) return 'edit-2';
                    else return 'view-2';
                }

                $scope.saveData = function(){

                    var url = $rootScope.dev_url + "/questions/";

                    $http({
                        method: "POST",
                        url: url + 'updateQuestions',
                        data: 'type='+ $scope.editRow.type + '&questionIndex='+ $scope.editRow.questionIndex + '&coef='+ $scope.editRow.coef + '&active='+ $scope.editRow.active + '&sort='+ $scope.editRow.sort + '&multiple='+ $scope.editRow.multiple + '&title='+ $scope.editRow.title + '&id=' + $scope.editRow.id + '&questionary_id=' + mySharedService.questionary_id,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}

                    }).success(function(response) {

                         $scope.questions = response;

                    }).error(function(response) {

                        alert('This is embarassing. An error has occured. Please check the log for details');
                    });

                    $scope.getQuestions();

                    $scope.reset();
                }

                $scope.reset = function(){
                    $scope.editRow = [];

                    var indexToRemove = $scope.questions.findIndex(obj => obj.id == null);

                    if (indexToRemove >= 0)
                    $scope.questions.splice(indexToRemove , 1);
                }
            }]);
