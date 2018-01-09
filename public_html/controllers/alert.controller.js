angular.module('panelsApp')
    .controller('AlertCtrl', ['$scope', '$rootScope', '$http', '$mdDialog', function ($scope, $rootScope, $http, $mdDialog) {

        $scope.sortType = 'humanDate';   // set the default sort type
        $scope.sortReverse = false;
        $scope.id = $rootScope.id;

        $scope.isCurrentSuperviser = function () {
            return $rootScope.curAlert.supervisoryManager ? $rootScope.curAlert.supervisoryManager.id == $rootScope.id : false;
        }

        $scope.getCompanies = function () {
            return $rootScope.companies
        }

        $scope.sendCustomAlert = function () {

            var url = $rootScope.url + "/admin/sendTextToGeneralOfProject/" + $scope.company;
            var data = $scope.textAlert;

            var config = {
                headers: {"Authorization": "Basic " + $rootScope.authorizationData},
                params: {"text": data}
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

            $http.post(url, data, config).then(function (response) {
                console.log(response)
            })
        };

        $scope.getCurAlert = function () {
            return $rootScope.curAlert
        };

        $scope.getHumanDate = function (dateRobotic) {
            var dateHuman = new Date(dateRobotic)
            return dateHuman
        }

        $scope.id = $rootScope.id;

        $scope.getCurAlertDate = function () {

            var normalDate = new Date($rootScope.curAlert.createDate);

            return normalDate
        };

        $scope.closeAlert = function () {
            var url = $rootScope.url + "/managers/closeAlert/" + $rootScope.curAlert.id;
            console.log(url);
            var config = {
                headers: {
                    "Authorization": "Basic " + $rootScope.authorizationData
                }
            };
            $http.get(url, config).then(function (response) {
                // console.log(response);
                // console.log($rootScope.curAlert.index);
                $rootScope.openAlerts.splice($rootScope.curAlert.index,1);
                $rootScope.openAlertCount--;
                $scope.hide();
            });
            $scope.hide()
        };

        $scope.setText = function () {
            var url = $rootScope.url + "/managers/setTextInAlert/" + $rootScope.curAlert.id;

            var data = $rootScope.curAlert.text;

            var config = {
                headers: {"Authorization": "Basic " + $rootScope.authorizationData},
                params: { "text": data }
            };

            $http.post(url, data, config).then(function (response) {
                console.log(response)
            });

           $scope.hide()

        }

    }]);
