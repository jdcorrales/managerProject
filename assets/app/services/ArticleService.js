/**
* Article Services
*
* Description
*/
angular.module('ArticleModule').factory('ArticleService', ['$resource',
	function ($resource) {
		this.user = window.user;
		return $resource('/api/article/:articleId', {
			articleId : '@articleId'
		},{
			update : {
				method : 'PUT',
				isArray: true
			},
			get: {        
				method: 'GET',
                isArray: true
            }
		});
	}
]);