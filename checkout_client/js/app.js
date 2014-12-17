var app = angular.module('App', ['ngRoute', 'ngCookies', 'ngResource']);

app.config(function ($routeProvider) {
	$routeProvider
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
		//.otherwise({
		//	redirectTo: '/login'
		//});
	});

var config = {};
app.run(function($location){
	Date.prototype.yyyymmdd = function () {
		var yyyy = this.getFullYear().toString();
		var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
		var dd = this.getDate().toString();
		return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]);
	};

	config.supmice = 'http://api.supmice.com';
	config.login_key = 'julolologin';
	config.auth_key = 'juloloauth';
	config.host = 'localhost:5000';
});