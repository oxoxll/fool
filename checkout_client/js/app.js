var app = angular.module('App', ['ngRoute', 'ngCookies', 'ngResource']);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/index.html',
			controller: 'MainCtrl'
		})
		.when('/register',{
			templateUrl: '/views/register.html',
			controller: 'RegisterCtrl'
		})
		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'LoginCtrl'
		})
		.when('/logout', {
			templateUrl: 'views/logout.html',
			controller: 'LogoutCtrl'
		})
		.when('/dashboard', {
			templateUrl: '/views/dashboard.html',
			controller: 'GroupsCtrl'
		})
		.when('/groups/new',{
			templateUrl: '/views/new_group.html',
			controller: 'NewGroupCtrl'
		})
		.when('/group/:group_alias',{
			templateUrl: '/views/group.html',
			controller: 'GroupCtrl'
		})
		.when('/group/:group_alias/edit',{
			templateUrl: '/views/edit_group.html',
			controller: 'GroupCtrl'
		})
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
	config.lang_key = 'julololang';

	if ($location.host() == '127.0.0.1'){
		config.host = 'http://localhost:5000';
	}else{
		config.host = 'http://api.itmg.io';
	}
});