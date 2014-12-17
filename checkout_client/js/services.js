/**
 * Created by vita on 8/22/14.
 */
app.factory('warningService', function ($rootScope) {
	var messages = [];

	$rootScope.$on("$routeChangeSuccess", function () {
		messages = [];
	});

	return {
		showMessage: function (msg) {
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
