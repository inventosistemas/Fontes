var BuscaController = function ($state, $scope, $timeout, $rootScope, $stateParams, GeneralFacade, ngDialog) {
    $scope.$on('$viewContentLoaded', function () {
        $scope.totalregs = 0;
        $scope.cansearch = true;
        $scope.busca = {
            Chave: $stateParams["termo"],
            Count: 8,
            UltimoID: -1,
            UltimoPreco: -1,
            UltimaDescricao: -1,
            TipoOrdenacao: '-1',
            ProdutoID: -1,
            ProdutoCategoriaID: -1,
            ProdutoSubCategoriaID: -1,
        }
        $scope.results = { ProdutoBuscaItens: null, TotalRegistros: 0 };
        $scope.get($scope.busca, true);

        $(window).scroll(function () {
            if (($state.current.name == 'busca') && $scope.isScrolledIntoView() && $scope.cansearch) {
                $scope.cansearch = false;
                $scope.get($scope.busca, false);
            }
        })
    });

    $scope.get = function (data, first) {
        $rootScope.loading = true;
        if (first) {
            $scope.busca.UltimoID = -1;
            $scope.busca.UltimoPreco = -1;
            $scope.busca.UltimaDescricao = -1;
        }
        GeneralFacade.busca(data)
        .success(function (response) {
            if (response != null) {
                
                if (response.ProdutoBuscaItens.length > 0) {
                    if (first)
                        $scope.results.ProdutoBuscaItens = new Array();
                    angular.forEach(response.ProdutoBuscaItens, function (value, key) {
                        $scope.results.ProdutoBuscaItens.push(value);
                    }, 0);
                }
                if (first) {
                    $scope.totalregs = response.TotalRegistros;
                } 
                $scope.busca.UltimoID = $scope.results.ProdutoBuscaItens[$scope.results.ProdutoBuscaItens.length - 1].ID;
                $scope.busca.UltimoPreco = $scope.results.ProdutoBuscaItens[$scope.results.ProdutoBuscaItens.length - 1].PrecoVigente;
                $scope.busca.UltimaDescricao = $scope.results.ProdutoBuscaItens[$scope.results.ProdutoBuscaItens.length - 1].Descricao;
                $scope.cansearch = true;
                var faltam = response.TotalRegistros - $scope.busca.Count;
                if (faltam <= 0) {
                    $scope.cansearch = false;
                }
            }
        })
        .error(function (response) {
        })
        .finally(function () {
            $(".campobusca").val('');
            $rootScope.loading = false;
        });
    }
                
    $scope.isScrolledIntoView = function(){
        var $elem = $("#trigger-busca");
        var $window = $(window);
        var docViewTop = $window.scrollTop();
        var docViewBottom = docViewTop + $window.height();
        var elemTop = $elem.offset().top;
        var elemBottom = elemTop + $elem.height();
        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }
}
BuscaController.$inject = ['$state', '$scope', '$timeout', '$rootScope', '$stateParams', 'GeneralFacade', 'ngDialog'];