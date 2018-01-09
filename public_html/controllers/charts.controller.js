/**
 * Created by Gladkov Kirill on 12/12/2016.
 */

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function reverseString(str) {
    // Step 1. Use the split() method to return a new array
    var splitString = str.split(""); // var splitString = "hello".split("");
    // ["h", "e", "l", "l", "o"]

    // Step 2. Use the reverse() method to reverse the new created array
    var reverseArray = splitString.reverse(); // var reverseArray = ["h", "e", "l", "l", "o"].reverse();
    // ["o", "l", "l", "e", "h"]

    // Step 3. Use the join() method to join all elements of the array into a string
    var joinArray = reverseArray.join(""); // var joinArray = ["o", "l", "l", "e", "h"].join("");
    // "olleh"

    //Step 4. Return the reversed string
    return joinArray; // "olleh"
}

angular.module('panelsApp')
    .controller('ChartsCtrl',
        ['$scope',
            '$rootScope',
            '$state',
            '$filter',
            'fileUpload',
            '$stateParams',
            'getChartData',
            '$mdDialog',
            'serviceButtons',
            'dialogChartService',
            'modalService',
            'helperService',
            function ($scope,
                      $rootScope,
                      $state,
                      $filter,
                      fileUpload,
                      $stateParams,
                      getChartData,
                      $mdDialog,
                      serviceButtons,
                      dialogChartService,
                      modalService,
                      helperService) {

                $scope.loginProcess = true;
                $scope.currentCompanyId = helperService.getCurrentCompany();
                $scope.diklaId = helperService.getDiklaID();

                generateChartFromObject = function (qResultsFormatted) {
                    var chartsGridContainer = document.getElementById("gridedCharts");
                    var chartsGridContainerAngulared = angular.element(chartsGridContainer);
                    chartsGridContainerAngulared.html("");

                    console.log(qResultsFormatted)

                    for (var key = 0; key < qResultsFormatted.length; key++) {
                        {
                            var newDiv = angular.element('<div></div>');
                            newDiv.addClass('mdl-cell--' + qResultsFormatted[key].size + '-col');
                            // newDiv.addClass('mdl-card');
                            newDiv.addClass('chartsCard');
                            newDiv.addClass('mdl-grid');
                            newDiv.addClass('mdl-shadow--2dp');
                            newDiv.addClass('chartsBack');
                            newDiv.addClass(qResultsFormatted[key].backColor);



                            // newDiv.addClass('mdl-button');
                            var newHead = angular.element('<div dir="rtl"></div>');
                            var textHead = qResultsFormatted[key].title;
                            if(textHead === undefined)  textHead="ציון ממוצע";
                            newHead.text(textHead);

                            newHead.addClass('mdl-cell--' + qResultsFormatted[key].titleSize + '-col');
                            newHead.addClass('mdl-layout-title');
                            newHead.addClass('header-border-bottom');

                            // newHead.addClass('diklaHeader');
                            var newId = 'chartNum_' + key
                            var newChart = angular.element('<div id = "' + newId + '" ></div>');
                            newChart.text(qResultsFormatted[key].value);
                            newChart.addClass('mdl-cell--' + qResultsFormatted[key].contentSize + '-col');
                            newChart.addClass('mdl-layout-title');
                            newChart.addClass('diklaHeader');
                            newHead.addClass(qResultsFormatted[key].textColor);
                            newHead.addClass(qResultsFormatted[key].backColor);

                            newChart.addClass(qResultsFormatted[key].backColor);


                            var qChart = qResultsFormatted[key];
                            var gaugeQuastionId = qChart.questionID;




                            var newDivider = angular.element('<div></div>');
                            if (qResultsFormatted[key].titleSize > qResultsFormatted[key].contentSize) {
                                newDiv.append(newChart);
                                newHead.addClass("diklaHeaderLabel");
                                newDiv.append(newHead);
                            }
                            else {
                                newDiv.append(newHead);
                                newHead.addClass("diklaHeaderLabel1");
                                newDiv.append(newChart);
                            }
                            if (qChart.type == 'pie') {
                                newChart.on("click", function () {
                                    gaugeQuastionId = qChart.typeDrill == 'Dikla' ? qChart.group : gaugeQuastionId;
                                    var funcDrill = qChart.typeDrill == 'Dikla' ? getChartData.getAnalisysDrillDownDickla : getChartData.getAnalisysDrillDown;

                                    funcDrill(gaugeQuastionId, $scope.createDate, $scope.userDate, undefined, undefined, qChart.answerID)
                                        .then(function (response) {
                                            var citiesNames = dialogChartService.getModalChartData(response).namesArr;
                                            var citiesValues = dialogChartService.getModalChartData(response).valuesArr;
                                            c3.generate({
                                                bindto: '#chart2_1',
                                                title: {
                                                    text: 'אחוז מקבלי מענה מלא'
                                                },
                                                data: {
                                                    x: 'x',
                                                    columns: [citiesNames, citiesValues],
                                                    labels: {
                                                        format: function (v, id, i, j) {
                                                            return (v).toFixed(2);
                                                        }
                                                    },
                                                    type: 'bar',
                                                    selection: {
                                                        enabled: true
                                                    },
                                                    onclick: function (d, i) {
                                                        var currCityID = arguments[0].x + 1;
                                                        getChartData.getAnalisysDrillDown(gaugeQuastionId, $scope.createDate, $scope.userDate, citiesNames[currCityID],undefined,qChart.answerID)
                                                            .then(function (response) {
                                                                var groupNames = dialogChartService.getModalChartData(response).namesArr;
                                                                var groupValues = dialogChartService.getModalChartData(response).valuesArr;
                                                                c3.generate({
                                                                    bindto: '#chart2_2',
                                                                    title: {
                                                                        text: 'אחוז מקבלי מענה מלא - צוותים'
                                                                    },
                                                                    data: {
                                                                        x: 'x',
                                                                        columns: [groupNames, groupValues],
                                                                        type: 'bar',
                                                                        selection: {
                                                                            enabled: true
                                                                        },
                                                                        labels: {
                                                                            format: function (v, id, i, j) {
                                                                                return (v).toFixed(2);
                                                                            }
                                                                        },
                                                                        onclick: function (d, i) {
                                                                            var currGroupID = arguments[0].x + 1;
                                                                            getChartData.getAnalisysDrillDown(gaugeQuastionId, $scope.createDate, $scope.userDate, citiesNames[currCityID], groupNames[currGroupID])
                                                                                .then(function (response) {

                                                                                    var data = [];
                                                                                    $("#table").html("");

                                                                                    for (var key in response) {
                                                                                        data[0] = ["NAME"];
                                                                                        data.push([]);
                                                                                        data[data.length - 1].unshift(key);
                                                                                        for (var innerKey in response[key]) {
                                                                                            data[0].unshift(innerKey.toUpperCase());
                                                                                            data[data.length - 1].unshift(response[key][innerKey]);
                                                                                        }
                                                                                    }

                                                                                    var cityTable = makeTable($("#table"), data);
                                                                                });
                                                                        }
                                                                    },
                                                                    axis: {
                                                                        x: {
                                                                            type: 'category'
                                                                        },
                                                                        y: {
                                                                            max: 100,
                                                                            min: 0,
                                                                            padding: {
                                                                                top: 0,
                                                                                bottom: 0
                                                                            }
                                                                        }
                                                                    },
                                                                    bar: {
                                                                        width: {
                                                                            ratio: 0.3
                                                                        }
                                                                    },
                                                                    size: {
                                                                        width: 600,
                                                                        height: 300
                                                                    },
                                                                    color: {
                                                                        pattern: ['#00C0AD']
                                                                    },
                                                                    legend: {
                                                                        show: false
                                                                    }
                                                                });
                                                            });
                                                    }
                                                },
                                                axis: {
                                                    x: {
                                                        type: 'category'
                                                    },
                                                    y: {
                                                        max: qChart.typeDrill == 'Dikla' ? 10 : 100,
                                                        min: 0,
                                                        padding: {
                                                            top: 0,
                                                            bottom: 0
                                                        }
                                                    }
                                                },
                                                bar: {
                                                    width: {
                                                        ratio: 0.3
                                                    }
                                                },
                                                size: {
                                                    height: 300,
                                                    width: 600
                                                },
                                                color: {
                                                    pattern: ['#00C0AD']
                                                },
                                                legend: {
                                                    show: false
                                                }
                                            });
                                        });
                                    $scope.showChartDialog();
                                });
                            }


                        }


                        chartsGridContainerAngulared.append(newDiv);
                        generateSingleChart(qResultsFormatted[key], newId);

                    }
                };
                generateSingleChart = function (qChart, newId) {
                    if (qChart.type == 'gauge') {
                        var gaugeQuastionId = qChart.questionID;
                        var chart = c3.generate({
                            bindto: '#' + newId,
                            data: {
                                columns: [
                                    ['data', qChart.value]
                                ],
                                type: 'gauge',
                                onclick: function (d, i) {
                                    if (qChart.typeDrill == 'Dikla') {
                                        return;
                                    }
                                    gaugeQuastionId = gaugeQuastionId;
                                    //var funcDrill = qChart.typeDrill == 'Dikla' ? getChartData.getAnalisysDrillDownDickla : getChartData.getAnalisysDrillDown;
                                    getChartData.getAnalisysDrillDown(gaugeQuastionId, $scope.createDate, $scope.userDate)
                                        .then(function (response) {
                                            var citiesNames = dialogChartService.getModalChartData(response).namesArr;
                                            var citiesValues = dialogChartService.getModalChartData(response).valuesArr;
                                            var text = ""
                                            switch (gaugeQuastionId) {
                                                case 19:
                                                case 26:
                                                case 40:
                                                case 33: text = "שביעות רצון כללית  - מוקדים";break;
                                                case 20:
                                                case 27:
                                                case 41:
                                                case 34: text = "שביעות רצון מזמן המתנה - מוקדים";break;
                                                default:text="שביעות רצון ממוצעת - מוקדים";
                                            }
                                            var c3graph2_1 = c3.generate({
                                                bindto: '#chart2_1',
                                                title: {
                                                    text: text
                                                },
                                                data: {
                                                    x: 'x',
                                                    columns: [citiesNames, citiesValues],
                                                    labels: {
                                                        format: function (v, id, i, j) {
                                                            return (v).toFixed(2);
                                                        }
                                                    },
                                                    type: 'bar',
                                                    selection: {
                                                        enabled: true
                                                    },
                                                    onclick: function (d, i) {
                                                        $(i).siblings().removeClass("_selected_");
                                                        $(i).siblings().removeClass("_expanded_");
                                                        $(i).siblings().css("opacity", 0.3);
                                                        $(i).css("opacity", 1);
                                                        $(i).css("stroke", "red", "!important");

                                                        var currCityID = arguments[0].x + 1;
                                                        getChartData.getAnalisysDrillDown(gaugeQuastionId, $scope.createDate, $scope.userDate, citiesNames[currCityID])
                                                            .then(function (response) {
                                                                var groupNames = dialogChartService.getModalChartData(response).namesArr;
                                                                var groupValues = dialogChartService.getModalChartData(response).valuesArr;
                                                                var text = ""
                                                                switch (gaugeQuastionId) {
                                                                    case 19:
                                                                    case 26:
                                                                    case 40:
                                                                    case 33: text = "שביעות רצון כללית - צוותים";break;
                                                                    case 20:
                                                                    case 27:
                                                                    case 41:
                                                                    case 34: text = "שביעות רצון מזמן המתנה - צוותים";break;
                                                                    default:text="שביעות רצון ממוצעת - צוותים";
                                                                }
                                                                c3.generate({
                                                                    bindto: '#chart2_2',
                                                                    title: {
                                                                        text: text
                                                                    },
                                                                    data: {
                                                                        x: 'x',
                                                                        columns: [groupNames, groupValues],
                                                                        type: 'bar',
                                                                        selection: {
                                                                            enabled: true
                                                                        },
                                                                        labels: {
                                                                            format: function (v, id, i, j) {
                                                                                return (v).toFixed(2);
                                                                            }
                                                                        },
                                                                        onclick: function (d, i) {
                                                                            $(i).siblings().removeClass("_selected_");
                                                                            $(i).siblings().removeClass("_expanded_");
                                                                            $(i).siblings().css("opacity", 0.3);
                                                                            $(i).css("opacity", 1);
                                                                            $(i).css("stroke", "red", "!important");

                                                                            var currGroupID = arguments[0].x + 1;
                                                                            getChartData.getAnalisysDrillDown(gaugeQuastionId, $scope.createDate, $scope.userDate, citiesNames[currCityID], groupNames[currGroupID])
                                                                                .then(function (response) {

                                                                                    var data = [];
                                                                                    $("#table").html("");

                                                                                    for (var key in response) {
                                                                                        data[0] = ["NAME"];
                                                                                        data.push([]);
                                                                                        data[data.length - 1].unshift(key);
                                                                                        for (var innerKey in response[key]) {
                                                                                            data[0].unshift(innerKey.toUpperCase());
                                                                                            data[data.length - 1].unshift(response[key][innerKey]);
                                                                                        }
                                                                                    }

                                                                                    var cityTable = makeTable($("#table"), data);
                                                                                });
                                                                        }
                                                                    },
                                                                    axis: {
                                                                        x: {
                                                                            type: 'category'
                                                                        },
                                                                        y: {
                                                                            max: 10,
                                                                            min: 0,
                                                                            padding: {
                                                                                top: 0,
                                                                                bottom: 0
                                                                            }
                                                                        }
                                                                    },
                                                                    bar: {
                                                                        width: {
                                                                            ratio: 0.3
                                                                        }
                                                                    },
                                                                    size: {
                                                                        width: 600,
                                                                        height: 300
                                                                    },
                                                                    color: {
                                                                        pattern: ['#c01109']
                                                                    },
                                                                    legend: {
                                                                        show: false
                                                                    }
                                                                });
                                                            });
                                                    }
                                                },
                                                axis: {
                                                    x: {
                                                        type: 'category'
                                                    },
                                                    y: {
                                                        max: qChart.typeDrill == 'Dikla' ? 10 : 5,
                                                        min: 0,
                                                        padding: {
                                                            top: 0,
                                                            bottom: 0
                                                        }
                                                    }
                                                },
                                                bar: {
                                                    width: {
                                                        ratio: 0.3
                                                    }
                                                },
                                                size: {
                                                    height: 300,
                                                    width: 600
                                                },
                                                color: {
                                                    pattern: ['#c0b210']
                                                },
                                                legend: {
                                                    show: false
                                                }
                                            });
                                        });
                                    $scope.showChartDialog();
                                }
                            },

                            gauge: {
                                label: {
                                    format: function (value, ratio) {
                                        return value.toFixed(1);
                                    },
                                    show: false // to turn off the min/max labels.
                                },
                                min: qChart.minValue, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
                                max: qChart.maxValue, // 100 is default
                                units: qChart.units
                                //    width: 39 // for adjusting arc thickness
                            },
                            color: {
                                pattern: [
                                    '#9b59b6',
                                    '#FF0000',
                                    '#F97600',
                                    '#F6C600',
                                    '#60B044'], // the three color levels for the percentage values.
                                threshold: {
                                    //            unit: 'value', // percentage is default
                                    max: qChart.maxValue, // 100 is default
                                    values: [15, 30, 60, 90, 100]
                                }
                            },
                            size: {
                                height: 200
                            }
                        });
                    }
                    if (qChart.type == 'bar') {
                        var colorScale = d3.scale.category10();

                        var chart = c3.generate({
                            legend: { show: false },
                            bindto: '#' + newId,
                            axis: {
                                x: {
                                    type: 'category'
                                },
                                y: {
                                    tick: {
                                        format: d3.format('%'),
                                        values: [0.25, 0.5, 0.75, 1]
                                    },

                                    padding: {
                                        top: 10,
                                        bottom: 0
                                    },
                                    min: 0,
                                    max: 1
                                }
                            },
                            color: {
                                pattern: ['#00C0AD']
                            },
                            data: {
                                x: "x",
                                columns: [
                                    qChart.answerTitles,
                                    qChart.answerValues
                                ],
                                labels: {
                                    format: function (v, id, i, j) {
                                        return (v * 100).toFixed(0) + "%"
                                    },
                                    font: '20px'
                                },
                                type: 'bar',

                                selection: { enabled: true },
                                color: qChart.color
                            },
                            bar: {
                                width: { ratio: 0.8 }            //width: 100 // this makes bar width 100px
                            },
                            size: {
                                height: 180
                            }
                        });
                    }
                    if (qChart.type == 'pie') {
                        var chart = c3.generate({
                            bindto: '#' + newId,
                            data: {
                                // iris data from R
                                columns: qChart.answerValues,
                                type: 'pie',
                                onclick: function (d, i) {}
                            },
                            size: {
                                height: 250
                            },
                            color: {
                                pattern: [
                                    "#01B8AA",
                                    '#FD625E',
                                    "#6E33B8"]
                            }
                        });
                    }

                    return chart
                };

                $scope.chartsArray = [];
                $rootScope.headerTitle = "charts";
                $rootScope.layout = $state.current.data.layout; //-> show left side menu
                $rootScope.isUpload = false;
                $rootScope.employee = {};

                var stats = {};
                if ($stateParams.projectID) {
                    var projectId = $stateParams.projectID;
                } // <-- take this projectID from project template and use it into request below

                if ($stateParams.projectName) {
                    $scope.$parent.$parent.projectName = $stateParams.projectName;
                } // <-- if add this to root scope will be problems

                $scope.$on("$destroy", function () {
                    $scope.$parent.$parent.projectName = "";
                });

                $scope.openDrillDown = function (name) {
                    if (name) {
                        getChartData.getAnalisysDrillDownDickla(name, $rootScope.date.from, $rootScope.date.to)                                .then(function (response) {
                            if (response) {
                                modalService.showTableInModal($scope.translation, response);
                            }
                        })
                    }
                }

                $scope.$watchGroup(['createDate', 'userDate'], function (newValues, oldValues) { //<-- watch input "to date". if it changed - send new req with a new date
                    if (newValues[1] && newValues[0] && !oldValues[0] && !oldValues[1]) {
                        return;
                    }
                    if (newValues[1] && oldValues[1] && newValues[1].valueOf() === oldValues[1].valueOf()
                        && newValues[0] && oldValues[0] && newValues[0].valueOf() === oldValues[0].valueOf()) {
                        return;
                    }
                    getChartData.getQuestionary(projectId)
                        .then(function (response) {
                            $scope.createDate = new Date(newValues[0] || response.fromDate);
                            $scope.userDate = new Date(newValues[1] || Date.now());
                            $scope.minFromDate = $filter("date")(response.createDate, 'yyyy-MM-dd');
                            $scope.maxFromDate = $scope.userDate;
                            $scope.minToDate = $scope.createDate;
                            $scope.maxToDate = $filter("date")(response.endDate || Date.now(), 'yyyy-MM-dd');
                            $scope.exportToXLS = function () {
                                return serviceButtons.exportToXLS($scope.createDate, $scope.userDate, response.id)
                            };
                            $rootScope.exportToXLS = $scope.exportToXLS;
                            $scope.showtimeLineChart = function () {
                                var names = [],
                                    val = [];
                                if ($scope.currentCompanyId === $scope.diklaId) {
                                    serviceButtons.getGeneralIndicatorsDikla(response.id).then(function (res) {
                                        names = dialogChartService.getModalChartData(res[0].date).namesArr;
                                        res.forEach(function (data, i) {

                                            val = dialogChartService.getModalChartData(data.date).valuesArr.map(function (item, i, arr) {
                                                return typeof item === "string" ? data.title : item ;
                                            });
                                            testBarChartDraw(names, val, "4_" + (i+1),1,data.title);
                                        });
                                    });

                                }
                                else {
                                    serviceButtons.getScheduleIsFullyAnswered(response.id).then(function (res) {
                                        names = dialogChartService.getModalChartData(res[0].date).namesArr;
                                        res.forEach(function (data, i) {

                                            val = dialogChartService.getModalChartData(data.date).valuesArr.map(function (item, i, arr) {
                                                return typeof item === "string" ? data.title : item ;
                                            });
                                            testBarChartDraw(names, val, "4_" + (i+1),1,data.title);
                                        })
                                    });
                                }

                                modalService.showChartDialogDatesModal();
                            };
                            $rootScope.showtimeLineChart = $scope.showtimeLineChart;
                            return response;
                        })
                        .then(function (response) {
                            var userDate = $filter("date")($scope.userDate, 'yyyy-MM-dd'),
                                createDate = $filter("date")(newValues[0] || $scope.createDate, 'yyyy-MM-dd');
                            $rootScope.date = {};
                            $rootScope.date.from = createDate;
                            $rootScope.date.to = userDate;
                            return getChartData.getAnalisys(response.id, createDate, userDate);
                        }).then(function (response) {
                        $rootScope.groupsDikla = [];
                        if (response.questionaryResult && response.questionaryResult.groups) {
                            $rootScope.groupsDikla = response.questionaryResult.groups;
                        }

                        $scope.loginProcess = false;
                        $scope.totalIntroduced = response.questionary.statistics.usersRespondented;
                        stats = response.questionary.statistics;
                        $rootScope.stats = response.questionary.statistics;
                        // this is a big plug
                        // TODO : Need to reformat output from server to structured JSON
                        // DOING NOW IS MOCKUP !!!
                        var qResultsFormatted = [];
                        var chartsOnPage = [];

                        var questions = response.questionary.questions;
                        if (questions) {
                            if (questions.length != 0) {
                                for (key in questions) {
                                    if (questions[key].questionType == 1 || (
                                            questions[key].questionType == 2 &&
                                            questions[key].answers.length > 2
                                        )) {
                                        var resultType = "";
                                        var answerTitles = ["x"];
                                        var answerValues = [""];
                                        var question = response.questionary.questions[key];
                                        var answersCount = 0;
                                        var answersAvg = 0;
                                        var answersSum = 0;
                                        for (answer in question.answers) {
                                            answerTitles[answer] = question.answers[answer].title
                                            answerValues[answer] = question.answers[answer].usersRespondented / response.countUserByDate;
                                            answersCount++;
                                            answersSum += question.answers[answer].usersRespondented * answersCount;
                                        }
                                        answerTitles.unshift("x");
                                        answerValues.unshift("");
                                        answersAvg = (answersSum / response.countUserByDate).toFixed(2);
                                        var qResultsFormattedNew = {
                                            // size following to grid
                                            "size": 8,
                                            // size following to inner grid
                                            "titleSize": 12,
                                            "contentSize": 12,
                                            "type": "bar",
                                            "title": question.title,
                                            "value": question.value,
                                            "answerTitles": answerTitles,
                                            "answerValues": answerValues,

                                            "minValue": 0.0,
                                            "maxValue": 100.0,
                                            "units": '%',
                                            "questionID": question.id,
                                            "answerID": question.answers[0].id
                                        };
                                        if (question.questionType == 2) {
                                            var colorScale = d3.scale.category10();
                                            qResultsFormattedNew.color = function (inColor, data) {
                                                if (data.index != undefined) {
                                                    return colorScale(data.index)
                                                }
                                                return inColor;
                                            }
                                        }
                                        qResultsFormatted.push(qResultsFormattedNew);

                                        if (question.questionType != 2) {
                                            var qResultsFormattedNewGauge = {};
                                            {
                                                qResultsFormattedNewGauge.size = 4;
                                                qResultsFormattedNewGauge.titleSize = 12;
                                                qResultsFormattedNewGauge.contentSize = 12;
                                                qResultsFormattedNewGauge.value = answersAvg;
                                                qResultsFormattedNewGauge.type = "gauge";
                                                qResultsFormattedNewGauge.minValue = 1;
                                                qResultsFormattedNewGauge.maxValue = answersCount;
                                                qResultsFormattedNewGauge.units = "";
                                                qResultsFormattedNewGauge.questionID = question.id;
                                                qResultsFormatted.push(qResultsFormattedNewGauge);
                                            }
                                        }
                                    }

                                    if (response.questionary.questions[key].questionType == 4) {
                                        // console.log(response.questionary.questions[key].questionType);
                                    }
                                    if (response.questionary.questions[key].questionType == 3) {
                                        // console.log(response.questionary.questions[key].questionType);
                                    }
                                    if (response.questionary.questions[key].questionType == 2 && response.questionary.questions[key].answers.length == 2) {
                                        // console.log(response.questionary.questions[key].questionType);
                                        var question = response.questionary.questions[key]
                                        // var answerTitles =["x"];
                                        var answerValues = [];
                                        for (answer in question.answers) {
                                            answerValues[answer] = [
                                                question.answers[answer].title,
                                                (question.answers[answer].usersRespondented / response.countUserByDate).toFixed(2) - 0
                                            ];// + " \n(" + question.answers[answer].usersRespondented + ")";
                                            // answerValues[answer] = question.answers[answer].usersRespondented / response.countUserByDate ;
                                        }

                                        var qResultsFormattedNew = {
                                            // size following to grid
                                            "size": 4,
                                            // size following to inner grid
                                            "titleSize": 12,
                                            "contentSize": 12,
                                            "type": "pie",
                                            "title": question.title,
                                            "answerValues": answerValues,
                                            "questionID": question.id,
                                            "answerID": question.answers[0].id
                                        };

                                        qResultsFormatted.push(qResultsFormattedNew);
                                    }


                                }
                                // console.log(JSON.stringify(qResultsFormatted));
                                // console.log(JSON.stringify(qResultsFormatted));
                                generateChartFromObject(qResultsFormatted);
                            }
                        }
                        if (response.questionaryResult && response.questionaryResult.general != null) {
                            var chartsCount = 0;
                            $scope.diklaProjectID = response.questionary.id;
                            for (key in response.questionaryResult.general) {
                                qResultsFormatted[chartsCount] = {
                                    // size following to grid
                                    "size": 4,
                                    // size following to inner grid
                                    "titleSize": 12,
                                    "contentSize": 12,

                                    "type": "gauge",
                                    "title": $scope.translation[key],
                                    "value": response.questionaryResult.general[key],

                                    "minValue": 0.0,
                                    "maxValue": 10.0,
                                    "units": '',
                                    "typeDrill": 'Dikla',
                                    "id": $scope.diklaProjectID

                                };
                                chartsCount++
                            }
                            qResultsFormatted.length = chartsCount;
                            //// console.log(JSON.stringify(qResultsFormatted));

                            qResultsFormatted[0].size = 6;
                            qResultsFormatted[0].type = 'simpleNumber';
                            //qResultsFormatted[0].textColor = 'textColor1';


                            qResultsFormatted[1].size = 6;
                            //qResultsFormatted[1].textColor = 'textColor1';



                            //qResultsFormatted[2].backColor = 'backColor2';
                            //qResultsFormatted[2].size = 12
                            //qResultsFormatted[2].titleSize = 8
                            //qResultsFormatted[2].contentSize = 4
                            //qResultsFormatted[2].type = 'simpleNumber'

                            //markov commented
                            //qResultsFormatted[2].value = qResultsFormatted[2].value.toFixed(2)


                            //qResultsFormatted[3].backColor = 'backColor2';

                            //qResultsFormatted[4].backColor = 'backColor2';
                            //qResultsFormatted[4].textColor = 'textColor2';

                            //qResultsFormatted[5].backColor = 'backColor2';



                            //qResultsFormatted[6].backColor = 'backColor3';



                            //qResultsFormatted[7].backColor = 'backColor3';
                            //qResultsFormatted[8].backColor = 'backColor3';
                            //qResultsFormatted[9].backColor = 'backColor3';

                            //qResultsFormatted[8].textColor = 'textColor3';
                            //qResultsFormatted[11].textColor = 'textColor4';


                            //qResultsFormatted[6].size = 12;
                            //qResultsFormatted[6].titleSize = 8;
                            //qResultsFormatted[6].contentSize = 4;
                            //qResultsFormatted[6].type = 'simpleNumber';

                            //qResultsFormatted[10].size = 12;
                            //qResultsFormatted[10].titleSize = 8;
                            //qResultsFormatted[10].contentSize = 4;
                            //qResultsFormatted[10].type = 'simpleNumber';

                            //qResultsFormatted[11].size = 6;

                            //qResultsFormatted[12].size = 6


                            //qResultsFormatted[10].backColor = 'backColor2'
                            //qResultsFormatted[11].backColor = 'backColor2'
                            //qResultsFormatted[12].backColor = 'backColor2'



                            chartsCount = 0;
                            generateChartFromObject(qResultsFormatted)
                        }
                    });
                });

                function makeTable(container, data) {
                    var table = $("<table/>").addClass('mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp');
                    $.each(data, function (rowIndex, r) {
                        var row = $("<tr/>").addClass("tableTextCenter");
                        $.each(r, function (colIndex, c) {
                            row.append($("<t" + (rowIndex == 0 ? "h" : "d") + "/>").text(c));
                        });
                        table.append(row);
                    });
                    return container.append(table);
                }

                $scope.exportToPDF = function () {
                    serviceButtons.exportToPDF();
                };
                $scope.showStat = function () {
                    modalService.showModal($scope.translation, stats);
                };


                //-----------show dialogs functions----------//

                $scope.showChartDialog = function () {
                    $mdDialog.show({
                        controller: ChartsDialogController,
                        templateUrl: 'templates/diagramsPage2.html',
                        parent: angular.element(document.body),
                        // targetEvent: d,
                        clickOutsideToClose: true,
                        fullscreen: false // Only for -xs, -sm breakpoints.

                    });
                };
                $scope.showChartDialogDates = function () {
                    $mdDialog.show({
                        controller: ChartsDialogController,
                        templateUrl: 'templates/diagramsTimeLinePage.html',
                        parent: angular.element(document.body),
                        // targetEvent: d,
                        clickOutsideToClose: true,
                        fullscreen: false // Only for -xs, -sm breakpoints.

                    });
                };

                //-----------draw charts function----------//
                function barChartDraw(namesArr, dataArr, questionaryType) {
                    var colorScale = d3.scale.category10();

                    var obj = {};
                    obj.title = {};
                    obj.data = {};
                    obj.data.labels = {};
                    obj.data.color;
                    obj.axis = {};
                    obj.axis.x = {};
                    obj.axis.y = {};
                    obj.axis.y.tick = {};
                    obj.bindto = '#chart' + $scope.chartsArray.length;
                    obj.title.text = 'התפלגות שביעות רצון מהשירות';
                    obj.data.x = 'x';
                    obj.data.columns = [namesArr, dataArr];
                    obj.data.type = 'bar';
                    obj.data.labels.format = function (v, id, i, j) {
                        return (v * 100).toFixed(0) + '%'
                    };
                    obj.axis.x.type = 'category';
                    obj.axis.y.tick.format = d3.format('%');
                    obj.axis.y.tick.values = [0.25, 0.5, 0.75, 1];
                    obj.axis.y.padding = {};
                    obj.axis.y.max = 1;
                    obj.axis.y.min = 0;
                    obj.axis.y.padding.top = 0;
                    obj.axis.y.padding.bottom = 0;
                    obj.bar = {};
                    obj.bar.width = {};
                    obj.bar.width.ratio = 0.6;
                    obj.size = {};
                    obj.legend = {};
                    obj.color = {};
                    obj.color.pattern = ['#3AAEF2'];
                    obj.size.height = 215;
                    obj.legend.show = false;
                    // console.log(obj);
                    if (questionaryType == 3) {
                        obj.data.color = function (inColor, data) {
                            if (data.index !== undefined) {
                                return colorScale(data.index);
                            }
                            return inColor;
                        };
                    }
                    var chart = c3.generate(obj);
                    $scope.chartsArray.push(obj);
                    return chart;
                }

                function testBarChartDraw(namesArr, dataArr, bindto, chartType, questionaryType) {

                    var title = questionaryType;
                    var max = 0;
                    var min = 0;
                    dataArr.forEach(function (data, i) {
                        if(data>max) max = data;
                        if(data<min) min = data;
                    });

                    var obj = {};
                    obj.title = {};
                    obj.data = {};
                    obj.data.labels = {};
                    obj.axis = {};
                    obj.axis.x = {};
                    obj.axis.y = {};
                    obj.axis.y.tick = {};
                    obj.bindto = '#chart' + bindto;
                    obj.title.text = title!=undefined?title:'התפלגות שביעות רצון מהשירות' ;
                    obj.data.x = 'x';
                    var negativeNumber;

                    // console.log(dataArr.find(el => el < 0));
                    for (var i = 0; i < dataArr.length; i++) {
                        if(dataArr[i]<0) {
                            negativeNumber = dataArr[i];
                            break;
                        }
                        // ещё какие-то выражения
                    }
                    console.log(negativeNumber);

                    obj.data.columns = [namesArr, dataArr];
                    // obj.data.type = chartType;
                    obj.data.labels.format = function (v, id, i, j) {
                        var titlePercent = "אחוזי קבלת מענה מלא";
                        var percent = titlePercent==title?"%":"";
                        return (v).toFixed(max>10 ? 0:1)+percent;
                    };
                    obj.axis.x.type = 'category';
                    // obj.axis.y.tick.format = d3.format('');
                    // obj.axis.y.tick.values = negativeNumber ?
                    //     [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1]
                    //     : [0, 0.25, 0.5, 0.75, 1];
                    obj.axis.y.padding = {};
                    var point =  chartType==1?5:10;
                    obj.axis.y.max = max>point ? 100:point;
                    obj.axis.y.min = min<0 ? -100:0;

                    obj.grid = {};
                    obj.grid.y = {};
                    obj.grid.y.lines = {};
                    obj.grid.y.lines = [{ value: 0 }];
                    obj.bar = {};
                    obj.bar.width = {};
                    obj.bar.width.ratio = 0.6;
                    obj.size = {};
                    obj.legend = {};
                    obj.color = {};
                    obj.color.pattern = ['#3AAEF2',"#01B8AA", '#FD625E', "#6E33B8", "#F7C223"];
                    obj.size.height = 215;
                    obj.legend.show = false;

                    var chart = c3.generate(obj);
                    if (questionaryType == 3) {
                        setColumnBarColors(obj.bindto);
                    }
                    $scope.chartsArray.push(obj);
                    return chart;
                }

                //-----------dialog window controllers----------//

                function ChartsDialogController($scope, $mdDialog) {
                    $scope.hide = function () {
                        $mdDialog.hide();
                    };
                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };
                    $scope.answer = function (answer) {
                        $mdDialog.hide(answer);
                    };
                }
            }])
    .service('serviceButtons', ['$rootScope', '$http', 'fileUpload', '$filter', function ($rootScope, $http, fileUpload, $filter) {

        var url;
        var authorizationData = $rootScope.authorizationData;
        var config = {
            headers: {
                "Authorization": "Basic " + authorizationData
            }
        };
        return {
            setUrl: function (data) {
                url = data;
            },
            setAuthorizationData: function (data) {
                authorizationData = data;
                config = { headers: { "Authorization": "Basic " + authorizationData } };
            },

            getScheduleIsFullyAnswered: function (questionaryID) {
                return $http.get(url + "/common/getScheduleIsFullyAnswered/" + questionaryID, config).then(function (response) {
                    return response.data;
                })
            },
            getGeneralIndicatorsDikla: function (questionaryID) {
                return $http.get(url + "/common/getGeneralIndicatorsDikla/" + questionaryID, config).then(function (response) {
                    return response.data;
                });
            },
            exportToPDF: function () {
                var allDivs = $('.chartsBack')
                var divsContainer = $('#toExportToPDF').find(allDivs)
                // var divsContainer = angular.element( document.querySelector( '#toExportToPDF' ) );
                var divs = divsContainer
                var newTable = "<table><tr>"
                var counter = 0;
                for (var i = 0; i < divs.length; i++) {
                    var myClass = divs[i].getAttribute('class');
                    console.log(myClass);

                    newTable = newTable + "<td class='" + "" + "'"
                    if (myClass.includes("mdl-cell--8")) {
                        counter += 8
                        newTable = newTable + " colspan=8>"
                    }
                    if (myClass.includes("mdl-cell--4")) {
                        counter += 4
                        newTable = newTable + " colspan=4>"
                    }
                    if (myClass.includes("mdl-cell--6")) {
                        counter += 6
                        newTable = newTable + " colspan=6>"
                    }

                    if (myClass.includes("mdl-cell--3")) {
                        counter += 3
                        newTable = newTable + " colspan=3>"
                    }

                    if (myClass.includes("mdl-cell--12")) {
                        counter += 12
                        newTable = newTable + " colspan=12>'"
                    }
                    newTable = newTable + "<div chartsCard mdl-grid mdl-shadow--2dp chartsBack>"

                    var subDivs = $(document).find(divs[i], 'div').children()

                    var subTable = "<table class='fullWidth'><tr><td class = '" + subDivs[0].getAttribute('class')
                            .replace("mdl-", "")
                            .replace("mdl-", "") + "'>"

                    subTable = subTable + subDivs[0].innerHTML
                    subTable = subTable + "</td>"
                    if (subDivs[0].className.includes("mdl-cell--12")) {
                        subTable = subTable + "</tr><tr>"
                    }
                    subTable = subTable + "<td class = '" + subDivs[1].getAttribute('class')
                            .replace("mdl-", "")
                            .replace("mdl-", "") + "'>"
                    subTable = subTable + subDivs[1].innerHTML
                    console.log(subDivs[1].getAttribute('class'))


                    subTable = subTable + "</td></tr></table>"
                    newTable = newTable + subTable


                    if (myClass.includes("12")) {
                        counter += 12
                        newTable = newTable + "</div>'"
                    }

                    newTable = newTable + "</td>"
                    if (counter >= 12) {
                        newTable = newTable + "<td>_</td></tr><tr>"
                        counter = 0
                    }
                }
                newTable = newTable + "</tr></table>"


                {
                    var mywindow = window.open('', '', 'left=50,top=50,width=800,height=640,toolbar=0,scrollbars=1,status=0');
                    mywindow.id = "printMeToPDF";
                    mywindow.document.write('<html>');
                    // mywindow.document.write('<html><head><title>' + document.title + '</title>');
                    mywindow.document.write('    <style type="text/css" media="print"> @page { size: A3 landscape; } </style>');

                    mywindow.document.write('<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">        <link rel="stylesheet" href="./resources/mdl/material.css">        <link rel="shortcut icon" type="image/x-icon" href="favicon.ico?">        <link rel="stylesheet" href="./assets/styles/style.css">        <link rel="stylesheet" href="assets/styles/paletteBlueGreyMD.css">    <link rel="stylesheet" href="resources/mdl/mdl-date/mdl-date-textfield.min.css">        <link rel="stylesheet" href="resources/c3/c3.min.css">        <link rel="stylesheet" href="assets/styles/auth.css">        <link rel="stylesheet" href="assets/styles/bootloader.css">        <link rel="stylesheet" href="assets/styles/loginLoaderProcessBar.css">        <link rel="stylesheet" href="assets/styles/attachExcelAnimation.css">        <link rel="stylesheet" href="assets/styles/statsTableStyle.css">        <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.css">');
                    // mywindow.document.write('</head><body >');
                    mywindow.document.write('<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"> <link rel="stylesheet" href="./resources/mdl/material.css"> <link rel="shortcut icon" type="image/x-icon" href="favicon.ico?"> <link rel="stylesheet" href="assets/styles/style.css"> <link rel="stylesheet" href="assets/styles/paletteBlueGreyMD.css"> <link rel="stylesheet" href="resources/mdl/mdl-date/mdl-date-textfield.min.css"> <link rel="stylesheet" href="resources/c3/c3.min.css"> <link rel="stylesheet" href="assets/styles/auth.css"> <link rel="stylesheet" href="assets/styles/bootloader.css"> <link rel="stylesheet" href="assets/styles/loginLoaderProcessBar.css"> <link rel="stylesheet" href="assets/styles/attachExcelAnimation.css"> <link rel="stylesheet" href="assets/styles/statsTableStyle.css"> <link href="assets/styles/table.css" rel="stylesheet" /> <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.css">')

                    mywindow.document.write('<body onload=printMe()>');
                    // mywindow.document.write('<h1>' + document.title + '</h1>');

                    // this thing need to be exported
                    mywindow.document.write('<div id="pdfMe">');
                    // mywindow.document.write($('.header-row').html());
                    mywindow.document.write($('.mdl-layout').html());
                    // mywindow.document.write($('.WTF').html());
                    // mywindow.document.write($('#toExportToPDF').html());
                    mywindow.document.write('</div>');
                    // ==============================

                    mywindow.document.write('<script> function printMe() {window.print(); } </script>');
                    mywindow.document.write('</body></html>');

                    mywindow.document.close(); // necessary for IE >= 10
                    mywindow.focus(); // necessary for IE >= 10*/

                    // mywindow.print();
                    // mywindow.close();
                }
                return true;

            },

            exportToXLS: function (startDate, endDate, questionaryID) {

                if (endDate instanceof Date) {
                    endDate = $filter("date")(endDate, 'yyyy-MM-dd');
                }
                if (startDate instanceof Date) {
                    startDate = $filter("date")(startDate, 'yyyy-MM-dd');
                }

                var dates = $.param({
                    startDate: startDate,
                    endDate: endDate
                });

                window.open(url + '/common/getReport3/' + questionaryID + '/?startDate=' + startDate + '&endDate=' + endDate);
                window.close();
/*
                $http({
                    url: url + '/common/getReport3/' + questionaryID + '/xls',
                    method: "POST",
                    data: dates, //this is your json data string
                    headers: {
                        "Authorization": "Basic " + authorizationData,
                        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8;"
                    },
                    responseType: 'arraybuffer'
                })
                    .then(function (resolve) {
                        console.log(resolve)
                        var blob = new Blob([resolve.data], {
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        });
                        saveAs(blob, "Report.xls");
                        window.close();
                    }, function (reject) {
                        console.log('excel error DATA: -->:', reject)
                    })*/

            },
            uploadFile: function (myFile, projectID, index) {
                var file = myFile;
                var uploadUrl = $rootScope.url + "/admin/uploadUsers/" + projectID;
                // var uploadUrl = $rootScope.url + "/test/uploadOldUsers/" + projectID;
                fileUpload.uploadFileToUrl(file, uploadUrl, index);
                $rootScope.isUpload = true;
            }
        }
    }])
    .service('dialogChartService', [function () {
        return {
            getModalChartData: function (response) {
                var namesArr = ['x'];
                var valuesArr = [''];
                for (var element in response) {
                    namesArr.push(element);
                    valuesArr.push((response[element] * 100) / 100);
                }
                return {
                    namesArr: namesArr,
                    valuesArr: valuesArr
                }
            }
        }
    }]);
