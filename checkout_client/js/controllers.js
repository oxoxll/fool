app.controller('AccountCtrl',
	function ($scope, $http, $location, $routeParams) {
		$scope.email = "";
		$scope.nickname = "";
		$scope.password = "";
		$scope.password_confirm = "";

		//$http.get(config.host + "/account")
		//	.success(function (data, status, headers, config) {
		//		$scope.account = data;
		//		if ($scope.account) {
		//			$scope.email = $scope.account.email || "";
		//			$scope.address = $scope.account.address || "";
		//			$scope.contact = $scope.account.contact || "";
		//			$scope.description = $scope.account.description || "";
		//			$scope.alias = $scope.account.alias;
		//		}
		//	});


		$scope.update_account = function () {
			var account_info = {
				'address': $scope.address,
				'contact': $scope.contact,
				'description': $scope.description
			};

			$http.put(config.host + "/account/" + $routeParams.alias, data = account_info)
				.success(function (response, status) {
					$scope.response = response;
					$scope.status = status;
//                    console.log(response);
					$location.path("/account");
				});
		};

		$scope.update_email = function () {
			var account_info = {};
			account_info.profile = $scope.user;
			account_info.profile.email = $scope.email;

			$http.put(config.supmice + "/user/profile", data = account_info)
				.success(function (response, status) {
					$scope.response = response;
					$scope.status = status;
					console.log(response);
					$location.path('/account');
				});
		};

		$scope.update_password = function () {
			var pwd_info = {
				'pwd': $scope.password,
				'pwd2': $scope.password_confirm
			};

			$http.put(config.supmice + "/user/security/update_pwd", data = pwd_info)
				.success(function (response, status) {
					$scope.response = response;
					$scope.status = status;
					console.log(response);
					$location.path('/account');
				});
		};

	})
	.controller('GroupsCtrl', function ($scope, $http) {
		$scope.groups = [];


		$http.get(config.host + "/group")
			.success(function (data, status, headers, config) {
				$scope.groups = data;
			})
	})
	.controller('GroupCtrl', function ($scope, $http, $location, flashService, $routeParams) {
		$scope.group_alias = $routeParams.group_alias;

		$http.get(config.host + "/group/" + $routeParams.group_alias)
			.success(function (data, status, headers, config) {
				$scope.group = data;
				$scope.alias = $scope.group.alias,
					$scope.name = $scope.group.name;
				$scope.address = $scope.group.address;
				$scope.contact = $scope.group.contact;
				$scope.email = $scope.group.email;
				$scope.description = $scope.group.description;
				$scope.supmice = '';
				if(Object.keys($scope.group.supmice).length != 0){
					$scope.supmice = $scope.group.supmice;
				}
			});

		$scope.update_group = function () {
			var group_info = {
				'name': $scope.name,
				'alias': $scope.alias,
				'address': $scope.address,
				'contact': $scope.contact,
				'email': $scope.email,
				'description': $scope.description,
				'supmice': {}
			};

			$http.put(config.host + "/group/" + $scope.group_alias, data = group_info)
				.success(function (response, status) {
					$scope.response = response;
					$scope.status = status;
					console.log(response);
					$location.path('/group/' + $scope.group_alias);
				});
		};

		$scope.delete_group = function () {
			$http.delete(config.host + "/group/" + $scope.group_alias)
				.success(function (response, status) {
					$scope.response = response;
					$scope.status = status;
					console.log(response);
					$location.path('/groups/new')
				});
		};
	})
	.controller('NewGroupCtrl', function ($scope, $http, $location, flashService) {
		$scope.name = "";
		$scope.alias = "";
		$scope.address = "";
		$scope.contact = "";
		$scope.email = "";
		$scope.description = "";

		$scope.new_group = function () {
			var group_info = {
				'name': $scope.name,
				'alias': $scope.alias,
				'address': $scope.address,
				'contact': $scope.contact,
				'email': $scope.email,
				'description': $scope.description,
				'supmice': {}
			};

			$http.post(config.host + "/group", data = group_info)
				.success(function (response, status) {
					$scope.response = response;
					$scope.status = status;
					console.log(response);
					$location.path('/dashboard');
				})
				.error(function (response, status) {
					$scope.response = response;
					$scope.status = status;
					console.log(response.msg);
					flashService.addMessage(response.msg);
				});
		};


	})
	.controller('MainCtrl', function ($scope, $http, $location, cookieService) {
		$scope.isLogin = cookieService.isLogin();
		if($scope.isLogin){
			$location.path("/dashboard");
		}
	})
	.controller('MemberCtrl', function ($scope, $http, $route, flashService, $routeParams) {
		$scope.group_alias = $routeParams.group_alias;

		$http.get(config.host + "/member/" + $scope.group_alias)
			.success(function (data, status, headers, config) {
				$scope.members = data;
			});

		$scope.delete_member = function (alias) {
			$http.delete(config.host + "/member/" + alias)
				.success(function (response, status) {
					$scope.response = response;
					$scope.status = status;
					console.log(response);
					$route.reload();
				});
		};
	})
	.controller('NewMemberCtrl', function ($scope, $http, $location, flashService, $routeParams) {
		$scope.name = "";
		$scope.email = "";
		$scope.group_alias = $routeParams.group_alias;

		$scope.invit = function () {
			var member_info = {
				'group_alias': $scope.group_alias,
				'role': '',
				'name': $scope.name,
				'email': $scope.email
			};

			$http.post(config.host + "/member", data = member_info)
				.success(function (response, status) {
					$scope.response = response;
					$scope.status = status;
					console.log(response);
					$location.path('/member/' + $routeParams.group_alias);
				});
		};
	})
	.controller('NotificationCtrl', function ($scope, $route, $http, $location, flashService) {

		$http.get(config.host + "/notification")
			.success(function (data, status, headers, config) {
				$scope.notifications = data;
			})

		$scope.handle_invitation = function (index, accept) {
			var accept_info = {
				'id': $scope.notifications[index]['_id'],
				'group_alias': $scope.notifications[index]['group_alias'],
				'sender_id': $scope.notifications[index]['sender_id'],
				'receiver_id': $scope.notifications[index]['receiver_id'],
				'accept': accept
			};

			$http.post(config.host + "/member/response", data = accept_info)
				.success(function (response, status) {
					$scope.response = response;
					$scope.status = status;
					$route.reload();
				});
		};
	})
	.controller('LoginCtrl', function ($scope, $http, $location, $cookieStore, flashService, cookieService) {
		$scope.password = "";
		$scope.isLogin = cookieService.isLogin;
		if ($cookieStore.get(config.login_key)) {
			$scope.email = $cookieStore.get(config.login_key);
		}
		if ($cookieStore.get('enablerem')) {
			$scope.remember = $cookieStore.get('enablerem');
		}
		$scope.login = function () {
			if ($scope.remember) {
				$cookieStore.put(config.login_key, $scope.email);
				$cookieStore.put('enablerem', true);
			} else {
				$cookieStore.remove(config.login_key);
				$cookieStore.remove('enablerem');
			}

			var data = {
				'log': $scope.email,
				'pwd': $scope.password
			};

			$http.post(config.host + "/user/login", data)
				.success(function (response, status) {
					$scope.response = response;
					$scope.status = status;
//                console.log(response);
					$cookieStore.put(config.auth_key, response.token);
					$location.path('/dashboard');
				});
		};
	})
	.controller('LogoutCtrl', function ($scope, $http, $location, $cookieStore) {
		$scope.logout = function () {
			$cookieStore.remove(config.auth_key);
			$location.path('/');
		};
	})
	.controller('RegisterCtrl', function ($scope, $http, $location, flashService) {
		$scope.nickname = '';
		$scope.email = '';
		$scope.pwd = '';
		$scope.pwd2 = '';
		$scope.register = function () {
			var data = {
				'nickname': $scope.nickname,
				'email': $scope.email,
				'pwd': $scope.pwd,
				'pwd2': $scope.pwd2
			};
			$http.post(config.host + "/user/register", data)
				.success(function (response, status) {
					$scope.response = response;
					$scope.status = status;
					$location.path('/login');
				})
				.error(function (response, status) {
					$scope.response = response;
					$scope.status = status;
//                    console.log(response.msg);
					flashService.addMessage(response.msg);
				});
		};
	})
	.controller('JobsCtrl', function ($scope, $http, $location, $routeParams) {
		$scope.jobs = [];
		$scope.group_alias = $routeParams.group_alias;

		$http.get(config.host + "/job/" + $routeParams.group_alias)
			.success(function (data, status, headers, config) {
				$scope.jobs = data["jobs"];
				$scope.classes = data["classes"];
				$scope.class_num = data["class_num"];
				$scope.total = data["total"];
			})

		$scope.searchKey = null;
		$scope.job_class = 'all';
		$scope.sortKey = "job_class";
		$scope.searchFilter = function (job) {
			var keyword = new RegExp($scope.searchKey, 'i');
			return (!$scope.searchKey || keyword.test(job.job_title))
				&& ($scope.job_class == 'all' || $scope.job_class == job.job_class);
		};

		$scope.setClass = function(job){
			$scope.job_class = job;
		}

		$scope.setSortKey = function(key){
			$scope.sortKey = key;
		}
	})
	.controller('JobCtrl', function ($scope, $http, $location, $routeParams, translateService) {
		$scope.group_alias = $routeParams.group_alias;
		$scope.job_classes = translateService.getJobClasses();
		$scope.required_educations = translateService.getRequiredEducation();
		$scope.required_work_time = translateService.getRequiredWorkExperience();
		$scope.genders = translateService.getGenders();
		var d = new Date();

		$scope.job = {
			'update_time': d.yyyymmdd(),
			'job_class': $scope.job_classes[0],
			'job_title': "",
			'education': $scope.required_educations[0],
			'work_time': $scope.required_work_time[0],
			'gender': $scope.genders[0],
			'census_register': "",
			'salary': {
				'min': 0,
				'max': 0
			},
			'responsibility': "",
			'requirement': ""
		}

		if($routeParams.job_id){
			$scope.show_delete = true;
			$http.get(config.host + "/job/" + $scope.group_alias + "/" + $routeParams.job_id)
				.success(function(data, status, headers, config){
					$scope.job = data;
					//try{
					//	$scope.job.job_class = get_key_by_value($scope.job.job_class, $scope.job_classes);
					//	$scope.job.education = get_key_by_value($scope.job.education, $scope.required_educations);
					//	$scope.job.gender = get_key_by_value($scope.job.gender, $scope.genders);
					//}catch (err){
					//	console.log(err);
					//}
				});

			$scope.update_job = function(){
				$scope.job.job_class = $scope.job.job_class.value;
				$scope.job.education = $scope.job.education.value;
				$scope.job.gender = $scope.job.education.value;
				$http.put(config.host + "/job/" + $scope.group_alias + "/" + $routeParams.job_id, data=$scope.job)
					.success(function(response, status){
						$location.path('/job/' + $scope.group_alias + "/view/" + response.id);
					});

			};

			$scope.delete_job = function(){
				$http.delete(config.host + "/job/" + $routeParams.group_alias + "/" + $routeParams.job_id)
					.success(function(response, status){
						$location.path('/jobs/' + $scope.group_alias);
					})
			};
		}

		$scope.new_job = function(){
			$scope.job.job_class = $scope.job.job_class.value;
			$scope.job.education = $scope.job.education.value;
			$scope.job.gender = $scope.job.gender.value;
			$http.post(config.host + "/job/" + $scope.group_alias, data=$scope.job)
				.success(function(response, status){
					$location.path('/jobs/' + $scope.group_alias);
				});
		};
	});