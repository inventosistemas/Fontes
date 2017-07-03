var CortesController = function ($state, $scope, $rootScope, ngDialog, $cookieStore, $http, $timeout, CortesFacade) {
    $scope.$on('$viewContentLoaded', function () {
        $scope.idSelectedCorte = 0;
        $scope.produtosporcorte = {};
        $scope.maisvendidos = {};
        $scope.tiposdecorte = {};

        CortesFacade.maisvendidos()
        .success(function (response) {
            $scope.maisvendidos = response[0].Itens;
            CortesFacade.tiposdecorte()
            .success(function (response) {
                if (response != null) {
                    $scope.tiposdecorte = response;
                    $scope.idSelectedCorte = $scope.tiposdecorte[0].ID;
                    $scope.setSelectedCorte($scope.idSelectedCorte);
                    $scope.combo = $scope.idSelectedCorte;
                }
            })
            .error(function (response) {
            })
            .finally(function () {
            });
        })
        .error(function (response) {
        })
        .finally(function () {
        });
    });

    $scope.setSelectedCorte = function (selectedid) {
        $rootScope.loading = true;
        $scope.idSelectedCorte = selectedid;
        CortesFacade.produtosporcorte($scope.idSelectedCorte)
        .success(function (response) {
            if (response != null) {
                $scope.produtosporcorte = response.ProdutoBuscaItens;
            } else {
                $scope.produtosporcorte = response;
            }
            
        })
        .error(function (response) {
        })
        .finally(function () {
            $rootScope.loading = false;
        });
    }
}

CortesController.$inject = ['$state', '$scope', '$rootScope', 'ngDialog', '$cookieStore', '$http', '$timeout', 'CortesFacade'];
