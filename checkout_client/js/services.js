/* Services */

(function (angular) {

/* Interceptor */
app.factory('requestInterceptor', ['$q', '$cookieStore', '$location', 'Alert',
	function ($q, $cookieStore, $location, Alert) {
		return {
			request: function (request) {
				request.headers = request.headers || {};
				if ($cookieStore.get('auth')) {
					request.headers.Authorization = 'Bearer ' + $cookieStore.get('auth');
				}
				Alert.hide();
				return request;
			},
			response: function (response) {
				return response || $q.when(response);
			},
			responseError: function (rejection) {
				if (rejection.data) {
					Alert.show(rejection.data.errmsg);
				}
				console.log(rejection.data);
				return $q.reject(rejection);
			}
		};
	}]);

app.config(['$httpProvider',
	function ($httpProvider) {
		$httpProvider.interceptors.push('requestInterceptor');
	}]);


app.factory('Config', function () {
		return {
			host: 'localhost:5000',
			token: 'Authorization',
			path: {
				'outer': ['/', 'register', '/login', '/introduce']
			}
		};
	})
	.factory('Alert', function ($rootScope) {
		return {
			show: function (message) {
				if(!message){
					return
				}
				$rootScope.message = message;
			},
			hide: function () {
				$rootScope.message = false;
			}
		};
	})
	.factory('Auth', function ($cookieStore) {
		return {
			isLogin: function () {
				if ($cookieStore.get(config.token)){
					return true;
				}
				else{
					return false;
				}
			},
			getToken: function () {
				return $cookieStore.get(config.token)
			},
			setToken: function (token) {
				$cookieStore.put(config.token, token)
			},
			removeToken: function () {
				$cookieStore.remove(config.token)
			}
		};
	});

})(angular);