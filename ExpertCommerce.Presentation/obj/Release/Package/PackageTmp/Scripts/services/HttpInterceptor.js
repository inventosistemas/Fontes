var HttpInterceptor = function ($rootScope, $q, global) {
    return {
        request: function ($r) {
            //check if posts to api
            if ($r.url.indexOf(global.apis.expert.domain('v1') + global.apis.expert.auth.getuser) > -1) {
            }
            return $r;
        },
        responseError: function (rejection) {
            // do something on error
            $rootScope.loading = false;
            return $q.reject(rejection);
        }
    }
};
HttpInterceptor.$inject = ['$rootScope', '$q', 'global']