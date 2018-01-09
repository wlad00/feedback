angular.module('Route', ['ui.router'])
    .config(['$stateProvider','$urlRouterProvider',function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('auth', {
                url: '/login',
                templateUrl: 'templates/authorization.html'

            })
            .state('createAlert',{
                url: '/createAlert',
                templateUrl:'templates/createAlert.html',
                controller:'AlertCtrl'
            })
            .state('alerts', {
                url: '/alerts',
                templateUrl: 'templates/alerts.html',
                controller: 'AlertCtrl'
            })
            .state('projects', {
                url: '/projects/:companyID/:managerID',
                templateUrl: 'templates/projects.html',
                data: {
                    layout: "mdl-layout--fixed-drawer"
                }
            })
            .state('diagrams', {
                url: '/diagrams/:projectID/:projectName',
                templateUrl: 'templates/diagrams.html',
                data: {
                    layout: "mdl-layout--fixed-drawer"
                }
            })
            .state('diagramsPage2', {
                url: '/diagrams2/:projectID',
                templateUrl: 'templates/diagramsPage2.html',
                data: {
                    layout: "mdl-layout--fixed-drawer"
                }
            })
            .state('diagramsPage2.diagramsPage3', {
                url: '/diagrams3',
                templateUrl: 'templates/diagramsTimeLinePage.html',
                data: {
                    layout: "mdl-layout--fixed-drawer"
                }
            })
            .state('createproject', {
                url: '/createProject',
                templateUrl: 'templates/createProject.html',
                controller: 'ProjectCtrl',
                data: {
                    layout: "mdl-layout--fixed-drawer"
                }
            })
            .state('createcompany', {
                url: '/createCompany',
                templateUrl: 'templates/createCompany.html',
                controller: 'CompaniesCtrl',
                data: {
                    layout: "mdl-layout--fixed-drawer"
                }
            })
            .state('companies', {
                url: '/companies',
                templateUrl: 'templates/companies.html',
                controller: 'CompaniesCtrl',
                data: {
                    layout: "mdl-layout--fixed-drawer"
                }
            })
            .state('events', {
                url: '/events',
                templateUrl: 'templates/events.html',
                controller: 'EventsCtrl',
                data: {
                    layout: "mdl-layout--fixed-drawer"
                }
            })
            .state('lecturers', {
                url: '/lecturers',
                templateUrl: 'templates/lecturers.html',
                controller: 'LecturersCtrl',
                data: {
                    layout: "mdl-layout--fixed-drawer"
                }
            })
            .state('questionary', {
                url: '/questionary',
                templateUrl: 'templates/questionary.html',
                controller: 'QuestionaryCtrl',
                data: {
                    layout: "mdl-layout--fixed-drawer"
                }
            })
    }]);
