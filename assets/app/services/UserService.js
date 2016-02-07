/**
* User Services
*
* Description
*/
angular.module('UserModule').factory('Authentication', [
	function () {
		this.user = window.user;
		return {
			user : this.user
		};
	}
]);