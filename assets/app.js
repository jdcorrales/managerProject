'use strict';

/**
 * @ngdoc overview
 * @name managerProjectApp
 * @description
 * # prototipoApp
 *
 * Main module of the application.
 */

var mainAppModuleName = 'managerProjectApp';

var mainAppModule = angular.module(mainAppModuleName, 
  [
    'ngRoute',
    'ngResource',
    'ClientModule',
    'UserModule',
    'ArticleModule'
  ]
);

mainAppModule.config(['$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);

angular.element(document).ready(function () {
  angular.bootstrap(document, [mainAppModuleName]);
});
