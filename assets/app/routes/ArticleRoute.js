'use strict';

/**
* Article Route
*
* Description
*/
angular.module('ArticleModule').config(['$routeProvider',
	function ($routeProvider) {
		$routeProvider
		.when('/article/new', {
			templateUrl: '/app/views/article/new.html',
			controller: 'ArticleController'
		})
		.when('/article', {
			templateUrl: '/app/views/article/list.html',
			controller: 'ArticleController'
		})
		.when('/article/:articleId', {
			templateUrl: '/app/views/article/view.html',
			controller: 'ArticleController'
		})
		.when('/article/edit/:articleId', {
			templateUrl: '/app/views/article/edit.html',
			controller: 'ArticleController'
		});
	}
]);