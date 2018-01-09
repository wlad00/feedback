/**
 * Created by Gladkov Kirill on 12/11/2016.
 */
angular.module('panelsApp')
    .controller('CompaniesCtrl',
    ['$rootScope',
     '$scope',
     '$http',
     'CompaniesService',
     '$state',
     'helperService',
        function ($rootScope, $scope, $http, CompaniesService, $state, helperService) {

            $rootScope.headerTitle = "companies";
            $scope.companies = [];
            $rootScope.layout = $state.current.data.layout;

            CompaniesService.then(function (result) {
                $scope.companies = result;
                $rootScope.companies = result;
                var idDikla ;
                // console.log(result)
                // var resFind = result.find(e => e.typeOfCustomer);
                // console.log(resFind)
                for (var i = 0; i < result.length; i++) {
                    if(result[i]) {
                        idDikla = result[i].id;
                        break;
                    }
                    // ещё какие-то выражения
                }
                helperService.setDiklaID(idDikla);
            });

            helperService.setCurrentCompany();

            $scope.goToProjects = function (companyID) {
                helperService.setCurrentCompany(companyID);
                $state.go('projects', {companyID: companyID})
            };
        }])

    .service('CompaniesService', ['$rootScope', '$http', function ($rootScope, $http) {
        $rootScope.showLoader = true;
        var url = $rootScope.dev_url + "/admin/";
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

        return $http.get(url + 'getCustomers', config).then(function (result) {
            $rootScope.showLoader = false;
            return result.data;
        })
    }]);
