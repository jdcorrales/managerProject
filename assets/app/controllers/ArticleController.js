/**
* Article Controller
*
* Description
*/
'use strict';

angular.module('ArticleModule').controller('ArticleController', 
	[
		'$scope', 
		'$routeParams', 
		'$location', 
		'Authentication', 
		'ArticleService',

		function ($scope, $routeParams, $location, Authentication, ArticleService) {
			$scope.authentication = Authentication;

			$scope.find = function ()
			{
				$scope.articles = ArticleService.query();
			};

			$scope.findOne = function () 
			{
				ArticleService.get({articleId : $routeParams.articleId}, function (response) {					
				    $scope.article = response[0];
				});				
			};

			$scope.create = function () 
			{					
				var article = new ArticleService({
					title   : this.title,
					content : this.content,
					creator : $scope.authentication.id
				});

				article.$save(function (response) {
					$location.path('article/' + response.id);

				}, function (errorResponse) {										
					$scope.error = errorResponse.data.message;
				});
			};

			$scope.update = function () 
			{				
				var article = new ArticleService({
					title : $scope.article.title,
					content : $scope.article.content
				});				

				article.$update({articleId : $routeParams.articleId}, function () {		
					
				}, function (errorResponse) {					
					$scope.error = errorResponse.data.message;
				});

				$location.path('/article/' + $scope.article.id);

			};

			$scope.delete = function (article) 
			{
				$scope.article.$remove({articleId : $scope.article.id}, function () {
					$location.path('/article');
				});				
			};
		}
	]
);