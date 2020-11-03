var app = angular.module("pixel", ['pixel.services',
  'pixel.controllers']);


/*config(function ($compileProvider) {
      $compileProvider.preAssignBindingsEnabled(true);
  });
  /*.config(['$routeProvider', '$locationProvider',
          function ($routeProvider, $locationProvider) {
              $routeProvider
              .when('/index', {
                  templateUrl: 'templates/index.html',
                  controller: 'HomeController'
              })
                .when('/payment', {
                    templateUrl: 'templates/payment.html',
                    controller: 'ContactController'
                })
                .when('/todos', {
                    templateUrl: 'templates/todos.html',
                    controller: 'TodoController'
                })
                .otherwise({
                    redirectTo: 'home'
                });
          }]);
//Routing if the application*/