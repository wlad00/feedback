

angular.module('panelsApp')
    .controller('AnswersCtrl',
        ['$rootScope',
            '$scope',
            'mySharedService',
            '$http',
            '$state',
            'helperService',
            function ($rootScope, $scope, mySharedService, $http, $state, helperService) {


                $scope.$on('broadcastAnswers', function(){

                    $scope.titleQ = mySharedService.titleQuestionary;
                    $scope.title = mySharedService.titleQuestion;

                    $scope.getAnswers();

                    document.getElementById('table-questions').style.display = "none";
                    document.getElementById('table-answers').style.display = "block";
                });

                $scope.getAnswers = function() {

                    var url = $rootScope.dev_url + "/answers/";

                    $http({
                        method: 'GET',
                        url: url + 'getAnswers/' + mySharedService.question_id
                    }).success(function (result) {

                        $scope.answers = result;

                    }).error(function (data) {
                        alert('Unable to delete');
                    });
                }
                /*----------------------------------------------*/
                /*-------------------- Delete --------------------*/
                /*----------------------------------------------*/

                $scope.confirmDelete = function(data) {

                    var url = $rootScope.dev_url + "/answers/";

                    var isConfirmDelete = confirm('Are you sure you want Delete?');
                    if (isConfirmDelete) {
                        $http({
                            method: 'GET',
                            url: url + 'deleteAnswer/' + data.id
                        }).
                        success(function(data) {

                            $scope.answers = data;

                        }).
                        error(function(data) {
                            alert('Unable to delete');
                        });
                    } else {
                        return false;
                    }
                };

                /*----------------------------------------------*/
                /*-------------------- Add New --------------------*/
                /*----------------------------------------------*/

                $scope.addNew = function() {

                    $scope.editRow = {};
                    $scope.answers.push({});
                }

                /*----------------------------------------------*/
                /*-------------------- Edit --------------------*/
                /*----------------------------------------------*/

                $scope.editRow = '';

                $scope.copyRow = function (row) {

                    $scope.editRow = angular.copy(row);
                }

                $scope.getIdHtml = function (row) {
                    if (row.id === $scope.editRow.id) return 'edit-3';
                    else return 'view-3';
                }

                $scope.saveData = function(indx){

                    var url = $rootScope.dev_url + "/answers/";

                    $http({
                        method: "POST",
                        url: url + 'updateAnswer',
                        data: 'title='+ $scope.editRow.title + '&id=' + $scope.editRow.id + '&question_id=' + mySharedService.question_id,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}

                    }).success(function(response) {

                        $scope.answers = response;

                    }).error(function(response) {

                        alert('This is embarassing. An error has occured. Please check the log for details');
                    });

                    $scope.getAnswers();

                    $scope.reset();
                }

                $scope.reset = function(){
                    $scope.editRow = [];

                    var indexToRemove = $scope.answers.findIndex(obj => obj.id == null);

                    if (indexToRemove >= 0)
                        $scope.answers.splice(indexToRemove , 1);
                }
            }]);
