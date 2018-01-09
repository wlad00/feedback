function table_events() {

    document.getElementById('table-questionary-checkbox').style.display = "none";
    document.getElementById('table-events').style.display = "block";
}

/**
 * Created by Gladkov Kirill on 12/11/2016.
 */

angular.module('panelsApp')

    .controller('EventsCtrl',
        ['$rootScope',
            '$scope',
            '$q',
            '$http',
            'EventsService',
            '$state',
            'helperService',
            function ($rootScope, $scope, $q, $http, EventsService, $state, helperService) {

                EventsService.then(function (result) {

                    $scope.events = result;

                });


                $scope.getQuestionary = function(){

                    var url = $rootScope.dev_url + "/events/";
                    var eventQuestionaries = [];

                    $http({
                        method: 'GET',
                        url: url + 'getEventQuestionaries/' + $scope.event_id
                    }).success(function (result) {

                        result.forEach(function (element, index) {

                        });

                        eventQuestionaries = result;

                        url = $rootScope.dev_url + "/questionary/";

                        $http({
                            method: 'GET',
                            url: url + 'getList'
                        }).success(function (result) {

                            result.forEach(function (elementList, index) {

                                eventQuestionaries.forEach(function (elementEvent, index) {

                                    if (elementEvent.id == elementList.id) {

                                        elementList.inEvent = "1";
                                    }
                                });

                            });

                            $scope.questionary = result;

                        }).error(function (data) {
                            alert('Unable to get');
                        });
                    });

                    console.log("getquestionary()");
                };

                $scope.saveCheckbox = function (questionary_id, inEvent) {

                    var url = $rootScope.dev_url + "/events/addQuestionaryToEvent";
                    console.log("inEvent = " + inEvent);
                    if (inEvent=="0")
                        url = $rootScope.dev_url + "/events/removeQuestionaryFromEvent";

                    $http({
                        method: "POST",
                        url: url,
                        data: 'event_id=' + $scope.event_id + '&questionary_id=' + questionary_id,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}

                    }).success(function (response) {

                        console.log(response);

                    }).error(function (response) {

                        alert('This is embarassing. An error has occured. Please check the log for details');
                    });
                };

                $scope.toTableQuestionary = function (id, title) {

                    $scope.event_title = title;
                    $scope.event_id = id;

                    $scope.getQuestionary();

                    document.getElementById('table-events').style.display = "none";
                    document.getElementById('table-questionary-checkbox').style.display = "block";
                };

                /*-------------------- Add New --------------------*/

                $scope.addNew = function () {

                    $scope.editRow = {};
                    $scope.events.push({});
                };

                /*-------------------- Edit --------------------*/

                $scope.editRow = '';

                $scope.copyRow = function (row) {

                    $scope.editRow = angular.copy(row);
                };

                $scope.getIdHtml = function (row) {
                    if (row.id === $scope.editRow.id) return 'edit';
                    else return 'view';
                };

                $scope.saveData = function (indx) {

                    var url = $rootScope.dev_url + "/events/";

                    if(!$scope.editRow.event_number) $scope.editRow.event_number="0";

                    $http({
                        method: "POST",
                        url: url + 'update',
                        data: 'title=' + $scope.editRow.title + '&event_number=' + $scope.editRow.event_number + '&id=' + $scope.editRow.id,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}

                    }).success(function (response) {

                        console.log(response);
                        $scope.events = response;

                    }).error(function (response) {

                        alert('This is embarassing. An error has occured. Please check the log for details');
                    });

                    $scope.reset();
                };

                $scope.reset = function () {
                    $scope.editRow = [];

                    var indexToRemove = $scope.events.findIndex(obj => obj.id == null);

                    if (indexToRemove >= 0)
                        $scope.events.splice(indexToRemove, 1);
                };
            }])

    .service('EventsService', ['$rootScope', '$http', function ($rootScope, $http) {

        $rootScope.showLoader = true;
        var url = $rootScope.dev_url + "/events/";

        var authorizationData = $rootScope.authorizationData;
        var config = {
            headers: {
                "Authorization": "Basic " + authorizationData
            }
        };

        if (authorizationData == undefined) {
            console.log(authorizationData);
            console.log("Companies auth data lost");
            // $state.go("auth");
            $rootScope.logout();
        }
        if (authorizationData == "") {
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
