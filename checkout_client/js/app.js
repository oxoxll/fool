var app = angular.module('App', ['ngRoute', 'ngCookies', 'ngResource']);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/test', {
			templateUrl: 'views/test.html'
			//controller: 'MainCtrl'
		})
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainCtrl'
		})
		.when('/register',{
			templateUrl: 'views/register.html',
			controller: 'RegisterCtrl'
		})
		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'LoginCtrl'
		})
		.when('/dashboard', {
			templateUrl: 'views/dashboard.html',
			controller: 'DashbordCtrl'
		})
		.when('/account',{
			templateUrl: 'views/account.html',
			controller: 'AccountCtrl'
		})
		.when('/groups/new',{
			templateUrl: 'views/new_group.html',
			controller: 'NewGroupCtrl'
		})
		.when('/group/:group_id',{
			templateUrl: 'views/group.html',
			controller: 'GroupCtrl'
		})
		.when('/groups',{
			templateUrl: 'views/groups.html',
			controller: 'GroupCtrl'
		})
		.otherwise({
			redirectTo: '/login'
		});
	})
	.run([
	'$rootScope', '$location', $http, 'Auth', 'Config', function($rootScope, $location, Auth, Config) {
		$rootScope.$on("$routeChangeSuccess", function () {
			$rootScope.message = null;
		});
		return $rootScope.$on('$locationChangeStart', function() {
			var isInOuterPathList;
			isInOuterPathList = (function() {
				var outerPathList, pth, reg, url, _i, _len;
				outerPathList = Config.path.outer;
				for (_i = 0, _len = outerPathList.length; _i < _len; _i++) {
					pth = outerPathList[_i];
					url = $location.url();
					reg = new RegExp(pth);
					if (reg.test(url)) {
						return true;
					}
				}
				return false;
			})();
			if (Auth.isLogin()) {
				if (isInOuterPathList) {
					return $location.path('/');
				}
			} else {
				if (!isInOuterPathList) {
					return $location.path('/login');
				}
			}
		});
	}
]);