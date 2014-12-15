/**
 * Created by vita on 8/22/14.
 */
app.factory('flashService', function ($rootScope, translateService) {
	var messages = [];

	$rootScope.$on("$routeChangeSuccess", function () {
		messages = [];
//            console.log('route change');
	});

	return {
		addMessage: function (message) {
			if(!message){
				return
			}
			messages.shift();
			var msg = translateService.translateErr(message) || message;
			messages.push(msg);
		},
		getMessages: function () {
//            console.log("messages:" + messages);
			return messages;
		}
	};
})
	.factory('utilService', function ($cookieStore, $http, $q, flashService) {
		return {
			isLogin: function () {
				return $cookieStore.get(config.auth_key);
			}
		};
	})
	.factory('translateService', ['$interpolate', '$cookieStore', '$window', function ($rootScope, $cookieStore, $window) {
		var curLang = 'ch';

		function handleErrorMsgKey(key){
			arr = key.split(' ');
			title = arr.shift();
			for(var i=0;i<arr.length;i++){
				arr[i] = arr[i].toUpperCase();
			}
			return arr.join('_');
		}


		return {
			setCurLang: function (lang) {
				curLang = lang
				$cookieStore.put(config.lang_key, lang);
//                console.log("set current language ==>" + curLang);
			},
			getCurLang: function () {
//                console.log("get current language ==>" + curLang);
				return curLang;
			},
			getEducations: function () {
				return educations[curLang];
			},
			getMeetings: function () {
				return meetings[curLang];
			},
			getOffers: function () {
				return offers[curLang];
			},
			getJobClasses: function () {
				return job_classes[curLang];
			},
			getRequiredEducation: function(){
				return required_education[curLang];
			},
			getRequiredWorkExperience: function(){
				return required_work_time;
			},
			getGenders: function(){
				return genders[curLang];
			},
			translate: function (label, parameters) {
				if (parameters == undefined || parameters == null) {
//                console.log('get ' + label);
					return tables[curLang][label];
				} else {
					console.log(parameters);
					return $interpolate(tables[curLang][label], parameters);
				}
			},
			translateErr: function (label) {
				var msg = errTables[curLang][label];

				//handle error message include space
				//ex: aa.c is not a valid email
				if(!msg){
					key = handleErrorMsgKey(label)
					msg = errTables[curLang][key]
				}
				return msg || label;
			}
		};
	}]);