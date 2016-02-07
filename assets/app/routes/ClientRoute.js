/**
* Client Routes
*
* Description
*/
angular.module('ClientModule')
.config(['$routeProvider',
	function ($routeProvider) {
		$routeProvider
		.when('/', {
			templateUrl: 'app/views/client.html',
			controller: 'ClientController'
		})
		.otherwise({ 
			redirectTo: '/login'
		})

	}
])