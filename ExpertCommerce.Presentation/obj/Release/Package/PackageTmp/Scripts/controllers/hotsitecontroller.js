var HotsiteController = function ($state, $scope, $rootScope, ngDialog, $cookieStore, $http, $timeout, HotsiteFacade) {
    $scope.$on('$viewContentLoaded', function () {
        HotsiteFacade.getum()
        .success(function (response) {
            $scope.promocao = response[0];


            

            var centro = $("#HtmlCentral");
            str = $scope.promocao.HTML;

            centro.append(str);
           
        })
        .error(function (response) {
        })
        .finally(function () {
            AtualizaSite()
            $rootScope.loading = false;
        });
    });
}

HotsiteController.$inject = ['$state', '$scope', '$rootScope', 'ngDialog', '$cookieStore', '$http', '$timeout', 'HotsiteFacade'];
