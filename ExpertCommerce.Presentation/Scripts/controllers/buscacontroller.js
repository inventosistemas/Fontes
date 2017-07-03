var BuscaController = function ($state, $scope, $timeout, $rootScope, $stateParams, GeneralFacade, $http, ngDialog, $cookieStore) {
    $scope.$on('$viewContentLoaded', function () {
        $scope.totalregs = 0;
        $scope.cansearch = true;
        $rootScope.loading = true;
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
        window.setTimeout(function () {

            AtualizaSite()



        }, 300);
      $("#gosearch").val("")
       $("#buscar1").val("")
       $("#buscar2").val("")
       $rootScope.loading = false;
    });

    //$scope.adicionarCarrinhoProd = function (data) {
    //    $rootScope.loading = true;
    //    var idcarrinho = $rootScope.credentials.isAuthorized ? $rootScope.credentials.carrinhoId : $rootScope.temp.credentials.carrinhoId;
    //    var response = { CarrinhoID: idcarrinho, SkuID: 1, Quantidade: 1 };
    //    GeneralFacade.pegaProduto(data)
    //     .success(function (response) {
    //         var busca = response;
    //         var sku = busca.Skus[0].ID
    //         response = { CarrinhoID: idcarrinho, SkuID: sku, Quantidade: 1 };
    //         GeneralFacade.addproductHome(response, 1).then(function () {
    //             // $state.go('carrinho.produtos');
    //         }, function (reason) {
    //             $scope.expmodal = { title: 'Ops!', message: reason, classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
    //             ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
    //             $rootScope.loading = false;
    //         });
    //     })
    //     .error(function (response) {
    //     })
    //     .finally(function () {
    //         $rootScope.loading = false;
    //     })
    //}

    $scope.adicionarCarrinhoProd = function (data) {
        $rootScope.loading = true;
       
        var idcarrinho = $rootScope.credentials.isAuthorized ? $rootScope.credentials.carrinhoId : $rootScope.temp.credentials.carrinhoId;
        var response = { CarrinhoID: idcarrinho, SkuID: 1, Quantidade: 1 };
        GeneralFacade.pegaProduto(data)
         .success(function (response) {
             
             var busca = response;
             var sku = busca.Skus[0].ID;
             
              response = { CarrinhoID: idcarrinho, SkuID: sku, Quantidade: 1 };
           

             $http.post('https://webapi.feed.com.br/v1/carrinho/item/adicionaritem', response, { headers: { "Content-type": "application/json" } })
                .success(function (response2) {
                 
                    if (!response2.Erro) {
                        if ($rootScope.credentials.isAuthorized) {
                            $rootScope.credentials.carrinhoId = response2.Dados.CarrinhoID;
                            $cookieStore.put('auth', $rootScope.credentials);
                        } else {
                            $rootScope.temp.credentials.carrinhoId = response2.Dados.CarrinhoID;
                            $cookieStore.put('tempauth', $rootScope.temp.credentials);
                        }

                        //inserir o auth no cookie

                        //def.resolve();
                    }


                })
          .error(function (response) {

          })
          .finally(function () {
              $rootScope.loading = false;

          });

         })
         .error(function (response) {
         })
         .finally(function () {
             $rootScope.loading = false;
         })
    }

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
BuscaController.$inject = ['$state', '$scope', '$timeout', '$rootScope', '$stateParams', 'GeneralFacade', '$http', 'ngDialog', '$cookieStore'];