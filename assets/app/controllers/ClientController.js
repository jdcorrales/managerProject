/**
* Clien Module
*
* Description
*/


angular.module('ClientModule').controller('ClientController', ['$scope', 'Authentication',
	function ($scope, Authentication) {
		$scope.authentication = Authentication;
	}
]);