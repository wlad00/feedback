/**
 * Created by Gladkov Kirill on 12/11/2016.
 */

angular.module('panelsApp')

    .controller('LecturersCtrl',
        ['$rootScope',
            '$scope',
            '$http',
            'LecturersService',
            '$state',
            'helperService',
            function ($rootScope, $scope, $http, LecturersService, $state, helperService) {

                LecturersService.then(function (result) {

                    $scope.lecturers = result;

                });

                $scope.confirmDelete = function(data) {

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
                };
                /*----------------------------------------------*/
                /*-------------------- Add New --------------------*/
                /*----------------------------------------------*/

                $scope.addNew = function() {

                    $scope.editRow = {};
                    $scope.lecturers.push({});
                }

                /*----------------------------------------------*/
                /*-------------------- Edit --------------------*/
                /*----------------------------------------------*/

                $scope.editRow = '';

                $scope.copyRow = function (row) {

                    $scope.editRow = angular.copy(row);
                }

                $scope.getIdHtml = function (row) {
                    if (row.id === $scope.editRow.id) return 'edit';
                    else return 'view';
                }

                $scope.saveData = function(indx){

                    var url = $rootScope.dev_url + "/lecturers/";

                    $http({
                        method: "POST",
                        url: url + 'updateLector',
                        data: 'name='+ $scope.editRow.name + '&id=' + $scope.editRow.id,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}

                    }).success(function(response) {

                        $scope.lecturers = response;

                    }).error(function(response) {

                        alert('This is embarassing. An error has occured. Please check the log for details');
                    });

                    $scope.reset();
                }

                $scope.reset = function(){
                    $scope.editRow = [];

                    var indexToRemove = $scope.lecturers.findIndex(obj => obj.id == null);

                    if (indexToRemove >= 0)
                    $scope.lecturers.splice(indexToRemove , 1);
                }
            }])

    .service('LecturersService', ['$rootScope', '$http', function ($rootScope, $http) {

        $rootScope.showLoader = true;
        var url = $rootScope.dev_url + "/lecturers/";

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
