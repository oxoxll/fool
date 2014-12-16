/**
 * Created by vita on 8/22/14.
 */
app.factory('flashService', function ($rootScope) {
	var messages = [];

	$rootScope.$on("$routeChangeSuccess", function () {
		messages = [];
	});

	return {
		addMessage: function (msg) {
			if(!msg){
				return
			}
		}
	};
})

	.factory('cookieService', function ($cookieStore) {
		return {
			isLogin: function () {
				return $cookieStore.get(config.auth_key);
			}
		};
	})
