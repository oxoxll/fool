/**
 * Created by vita on 8/29/14.
 */
function get_key_by_value(value, src_list){
	for(var i= 0; i<src_list.length; i++){
		if(src_list[i].value === value){
			return src_list[i];
		}
	}
	return ""
}

app.controller('AccountCtrl',
	function ($scope, $http, $location, $routeParams) {
		$scope.email = "";
		$scope.address = "";
		$scope.password = "";
		$scope.password_confirm = "";

		$http.get(config.host + "/account")
			.success(function (data, status, headers, config) {
				$scope.account = data;
				if ($scope.account) {
					$scope.email = $scope.account.email || "";
					$scope.address = $scope.account.address || "";
					$scope.contact = $scope.account.contact || "";
					$scope.description = $scope.account.description || "";
					$scope.alias = $scope.account.alias;
				}
			});


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
	.controller('FlashCtrl', ['$cookieStore', '$rootScope', '$scope', 'flashService', '$interval', '$http',
		function ($cookieStore, $rootScope, $scope, flashService, $interval, $http) {
			$scope.messages = flashService.getMessages();
//        console.log($scope.messages);

			$rootScope.$on("$routeChangeSuccess", function () {
				$scope.messages = flashService.getMessages();
//            console.log($scope.messages);
			});

			$scope.unread_notifications = null;

			var stop;
			stop = $interval(function () {
//                console.log($scope.unread_notifications);
				if ($cookieStore.get(config.auth_key)) {
					$http.get(config.host + "/notification/unread")
						.success(function (data, status, headers, config) {
							$scope.unread_notifications = data;
						});
				}
			}, 60 * 1000);

			$scope.$on('$destroy', function () {
				if (angular.isDefined(stop)) {
					$interval.cancel(stop);
					stop = undefined;
				}
				;
			});

		}])
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
	.controller('MainCtrl', function ($http, $scope, $cookieStore, $location, flashService, utilService, translateService) {
		$scope.isLogin = utilService.isLogin();

		if($scope.isLogin){
			$location.path("/dashboard")
		}

//            var url = "http://ajaxhttpheaders.appspot.com?callback=JSON_CALLBACK"
//            $http.jsonp(url)
//                .success(function (data, status, headers, config) {
//                    language = data['Accept-Language'];
//                    translateService.setCurLang('');
//                });
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
	.controller('PeopleCtrl', function ($scope, $http, flashService, $routeParams) {
		$scope.group_alias = $routeParams.group_alias;



		if($routeParams.class){
			$http.get(config.host + "/people/" + $scope.group_alias + "?class=" + $routeParams.class)
				.success(function (data, status, headers, config) {
					$scope.people = data['talents'];
					$scope.total = data['total'];
					$scope.match = data['match'];
					$scope.job_classes = data['job_class'];
					$scope.handlers = data['handlers'];
					console.log(data);
				});
		}else{
			$http.get(config.host + "/people/" + $scope.group_alias)
				.success(function (data, status, headers, config) {
					$scope.people = data['talents'];
					$scope.total = data['total'];
					$scope.match = data['match'];
					$scope.job_classes = data['job_classes'];
					$scope.handlers = data['handlers'];
//                    console.log(data);
				});
		}

		$scope.searchKey = null;
		$scope.sortKey = "name";
		$scope.job_class = "all";
		$scope.handler_id = "all";
		$scope.searchFilter = function (person) {
			var keyword = new RegExp($scope.searchKey, 'i');
			return (!$scope.searchKey || keyword.test(person.name) || keyword.test(person.personal.phone)
				|| keyword.test(person.personal.email))
				&& ($scope.job_class == 'all' || person.career.job_class == $scope.job_class)
				&& ($scope.handler_id == 'all' || person.creator_id == $scope.handler_id);
		};

		$scope.setClass = function(job_c) {
			console.log(job_c);
			$scope.job_class = job_c;
		}

		$scope.setHandler = function(handler_id) {
			$scope.handler_id = handler_id;
		}

		$scope.setSortKey = function(key){
			$scope.sortKey = key;
		}
	})
	.controller('NewPersonCtrl', function ($scope, $http, $location, $upload, flashService, translateService, $routeParams) {
//        $scope.educations = translateService.getEducations();
		$scope.meetings = translateService.getMeetings();
		$scope.offers = translateService.getOffers();
		$scope.job_classes = translateService.getJobClasses();

		d = new Date();

		$scope.person = {
			'name': "",
			'update_time': d.yyyymmdd(),
			'group_alias': $routeParams.group_alias,

			'personal': {
				'age': "",
				'gender': "male",
				'work_time': "",
				'current_city': "",
				'email': "",
				'phone': "",
				'marital_status': "single",
				'education': "",
				'returnees': "no",
				'census_register': '',
				'citizenship': 'local',
				'resume_path': ""
			},
			'career': {
				'job_class': "",
				'job_title': "",
				'salary_exp': "",
				'job_status': "work"
			},
			'interview': {
				'meeting': $scope.meetings[0],
				'scores': {
					'look': 0,
					'knowledge': 0,
					'speech': 0,
					'intention': 0
				},
				'offer': $scope.offers[0]
			},
			'description': ''
		};

		$scope.onFileSelect = function ($file) {
			$scope.upload = $upload.upload({
				url: config.host + '/people/resume',
				method: 'POST',
				file: $file
			}).progress(function (evt) {
				$scope.upload_msg = "";
				$scope.progress = parseInt(100.0 * evt.loaded / evt.total)
//                console.log('percent: ' + $scope.progress);
			}).success(function (data, status, headers, config) {
				$scope.person.personal.resume_path = data['resume_path'];
				$scope.progress = -1;
				$scope.upload_msg = "upload_success";
			}).error(function (data) {
				console.log(data);
				$scope.progress = -1;
			});
		}

		$scope.new_person = function () {
			$scope.person.personal.age = parseInt($scope.person.personal.age);
			$scope.person.personal.work_time = parseInt($scope.person.personal.work_time);
			$scope.person.career.job_class = $scope.person.career.job_class.value;
//            $scope.person.personal.education = parseInt($scope.person.personal.education.value);

			$scope.person.interview.offer = parseInt($scope.person.interview.offer.value);
			$scope.person.interview.meeting = parseInt($scope.person.interview.meeting.value);
			$scope.person.interview.scores.look = parseInt($scope.person.interview.scores.look);
			$scope.person.interview.scores.knowledge = parseInt($scope.person.interview.scores.knowledge);
			$scope.person.interview.scores.speech = parseInt($scope.person.interview.scores.speech);
			$scope.person.interview.scores.intention = parseInt($scope.person.interview.scores.intention);

			$scope.person.custom_field = {};

			$http.post(config.host + "/people", data = $scope.person)
				.success(function (response, status) {
					$scope.response = response;
					$scope.status = status;
//                    console.log(response);
					$location.path('/people/' + $scope.person.group_alias)
				})
				.error(function(data, status, headers, config){
					$scope.person.interview.offer = get_key_by_value($scope.person.interview.offer, $scope.offers);
					$scope.person.career.job_class = get_key_by_value($scope.person.career.job_class, $scope.job_classes);
					$scope.person.interview.meeting = $scope.meetings[$scope.person.interview.meeting];
				});
		};
	})
	.controller('PersonCtrl', function ($scope, $http, $location, $upload, $routeParams, flashService, translateService) {
//        $scope.educations = translateService.getEducations();
		$scope.meetings = translateService.getMeetings();
		$scope.offers = translateService.getOffers();
		$scope.job_classes = translateService.getJobClasses();

		$http.get(config.host + "/people/" + $routeParams.group_alias + "/" + $routeParams.id)
			.success(function (data, status, headers) {
				$scope.person = data;
				$scope.person.group_alias = $routeParams.group_alias;

				try {
					$scope.person.interview.offer = get_key_by_value($scope.person.interview.offer, $scope.offers);
					$scope.person.career.job_class = get_key_by_value($scope.person.career.job_class, $scope.job_classes);
					$scope.person.interview.meeting = $scope.meetings[$scope.person.interview.meeting];
					if($scope.person.personal.resume_path){
						$scope.resume_url = config.host + '/people/resume/' + $scope.person.personal.resume_path;
					}
				} catch (err) {
					console.log(err);
				}
			});


		$scope.upload_msg = "";
		$scope.progress = -1;

		$scope.onFileSelect = function ($file) {
			$scope.upload = $upload.upload({
				url: config.host + '/people/resume',
				method: 'POST',
				file: $file
			}).progress(function (evt) {
				$scope.upload_msg = "";
				$scope.progress = parseInt(100.0 * evt.loaded / evt.total)
//                console.log('percent: ' + $scope.progress);
			}).success(function (data, status, headers, config) {
//                console.log(data);
				$scope.person.personal.resume_path = data['resume_path'];
				$scope.progress = -1;
				$scope.upload_msg = "upload_success";
			}).error(function (data) {
				console.log(data);
				$scope.progress = -1;
			});
		}


		$scope.update_person = function () {
			$scope.person.career.job_class = $scope.person.career.job_class.value;
			$scope.person.personal.age = parseInt($scope.person.personal.age);
			$scope.person.personal.work_time = parseInt($scope.person.personal.work_time);
//            $scope.person.personal.education = parseInt($scope.person.personal.education.value);
			$scope.person.interview.offer = parseInt($scope.person.interview.offer.value);
			$scope.person.interview.meeting = parseInt($scope.person.interview.meeting.value);
			$scope.person.interview.scores.look = parseInt($scope.person.interview.scores.look);
			$scope.person.interview.scores.knowledge = parseInt($scope.person.interview.scores.knowledge);
			$scope.person.interview.scores.speech = parseInt($scope.person.interview.scores.speech);
			$scope.person.interview.scores.intention = parseInt($scope.person.interview.scores.intention);
			$scope.person.career.salary_exp = $scope.person.career.salary_exp.toString();

			$http.put(config.host + "/people/" + $routeParams.group_alias + '/' + $scope.person._id, data = $scope.person)
				.success(function (response, status) {
					$scope.response = response;
					$scope.status = status;
					$location.path('/people/' + $scope.person.group_alias);
				});
		};

		$scope.delete_person = function () {
			$http.delete(config.host + "/people/" + $scope.person.group_alias + '/' + $scope.person._id)
				.success(function (response, status) {
					$scope.response = response;
					$scope.status = status;
					$location.path('/people/' + $scope.person.group_alias);
				});
		};
	})
	.controller('TranslateCtrl', ['$scope', 'translateService', '$route', function ($scope, translateService, $route) {
		$scope.langs = ['en', 'ch'];

		$scope.setCurLang = function (lang) {
			translateService.setCurLang(lang);
			$route.reload();
			console.log("setCurLang: " + lang);
		};
	}])
	.controller('LoginCtrl', function ($scope, $http, $location, $cookieStore, flashService, utilService) {
		$scope.email = "";
		$scope.password = "";
		$scope.isLogin = utilService.isLogin;
		$scope.remember = "";
		if ($cookieStore.get(config.login_key)) {
			$scope.email = $cookieStore.get(config.login_key);
		}
		;
		if ($cookieStore.get('enablerem')) {
			$scope.remember = $cookieStore.get('enablerem');
		}
		;

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
//            console.log('before logout==>' + $cookieStore.get(config.auth_key));
			$cookieStore.remove(config.auth_key);
//            console.log('before logout==>' + $cookieStore.get(config.auth_key));
			$location.path('/');
		};
	})
	.controller('RegisterCtrl', function ($scope, $http, $location, flashService) {
		$scope.invite_code = "";
		$scope.email = "";

		$scope.register = function () {
			var data = {
				'code': $scope.invite_code,
				'log': $scope.email
			}

			$http.post(config.supmice + "/user/register", data)
				.success(function (response, status) {
					$scope.response = response;
					$scope.status = status;
//                    console.log(response);
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
					try{
						$scope.job.job_class = get_key_by_value($scope.job.job_class, $scope.job_classes);
						$scope.job.education = get_key_by_value($scope.job.education, $scope.required_educations);
						$scope.job.gender = get_key_by_value($scope.job.gender, $scope.genders);
					}catch (err){
						console.log(err);
					}
				})

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