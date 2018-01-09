(function () {
    'use strict';
    angular.module('panelsApp')
        .service('getChartData', ['$http', '$rootScope', '$q', '$filter', function ($http, $rootScope, $q, $filter) {

            var url = $rootScope.dev_url;
            var authorizationData = $rootScope.authorizationData;
            var config = {
                headers: {
                    "Authorization": "Basic " + authorizationData
                }
            };
            var analisysData = {};
            var questionary = {};
            if (authorizationData == undefined) {
                console.log(authorizationData);
                console.log("Companies auth data lost");
                // $state.go("auth");
                $rootScope.logout();
            }
            if (authorizationData == "") {
                // console.log(authorizationData);
                // console.log("Companies auth data empty");
                // $state.go("auth");
                $rootScope.logout();
            }

            return {
                getQuestionary: function (projectID) {

                    return questionary
                        ? $http.get(url + '/common/getQuestionary/' + projectID, config).then(function (response) {
                            questionary = response.data;
                            return response.data;
                        })
                        : questionary;
                },
                getAnalisys: function (questionaryID, startDate, endDate) {
                    if (endDate instanceof Date) {
                        endDate = $filter("date")(endDate, 'yyyy-MM-dd');
                    }
                    if (startDate instanceof Date) {
                        startDate = $filter("date")(startDate, 'yyyy-MM-dd');
                    }
                    if (analisysData[questionaryID]) {
                        return $q(function (resolve) {
                            resolve(analisysData[questionaryID]);
                        });
                    } else {
                        // here useud ajax request because the angular $http.post do not work (takes null) with server
                        return $.ajax({
                            url: url + '/common/getAnalysis/' + questionaryID,
                            type: 'post',
                            data: {
                                startDate: startDate,
                                endDate: endDate
                            },
                            headers: {
                                'Content-Type': undefined,
                                'Authorization': 'Basic ' + authorizationData
                            },
                            dataType: 'json',
                            success: function (response) {
                                analisysData[questionaryID] = response.data;
                                return response.data;
                            }
                        });

                    }
                },
                getAnalisysDrillDown: function (questionID, startDate, endDate, city, group, answerID) {
                    if (endDate instanceof Date){
                        endDate = $filter("date")(endDate, 'yyyy-MM-dd');
                    }
                    if (startDate instanceof Date) {
                        startDate = $filter("date")(startDate, 'yyyy-MM-dd');
                    }
                    return $.ajax({
                        // url: url + '/common/getAnalysisDrillDown/' + questionID,
                        url: url + '/common/getAnalysisDrillDown/',
                        type: 'post',
                        data: {
                            idQuestion: questionID,
                            idAnswer: answerID,
                            startDate: $rootScope.date.from,
                            endDate: $rootScope.date.to,
                            city: city,
                            group: group
                        },
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Basic ' + authorizationData
                        },
                        dataType: 'json',
                        success: function (response, req) {
                            // console.log(req);
                            // analisysData[questionaryID] = response.data;
                            // console.log(response);
                            return response;
                        },
                        error: function (error) {
                            console.log(error);
                        }

                    });
                },
                getAnalisysDrillDownDickla: function (group, startDate, endDate) {
                    if (endDate instanceof Date) {
                        endDate = $filter("date")(endDate, 'yyyy-MM-dd');
                    }
                    if (startDate instanceof Date) {
                        startDate = $filter("date")(startDate, 'yyyy-MM-dd');
                    }
                    return $.ajax({
                        url: url + '/common/getAnalysisDrillDownDikla/',
                        type: 'post',
                        data: {
                            startDate: startDate,
                            endDate: endDate,
                            group: group
                        },
                        headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Basic ' + authorizationData
                        },
                        dataType: 'json',
                        success: function (response, req) {
                            return response;
                        },
                        error: function (error) {
                            console.log(error);
                        }

                    });

                },
            };

        }])

}());
