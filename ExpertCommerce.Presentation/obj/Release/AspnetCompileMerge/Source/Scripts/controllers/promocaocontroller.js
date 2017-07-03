var PromocaoController = function ($state, $scope, $rootScope, ngDialog, $cookieStore, $http, $timeout, PromocaoFacade) {
    $scope.$on('$viewContentLoaded', function () {
        PromocaoFacade.get()
        .success(function (response) {
            $scope.promocao = response[0];
            console.log($scope.promocao);
        })
        .error(function (response) {
        })
        .finally(function () {
            $rootScope.loading = false;
        });
    });
}

PromocaoController.$inject = ['$state', '$scope', '$rootScope', 'ngDialog', '$cookieStore', '$http', '$timeout', 'PromocaoFacade'];
