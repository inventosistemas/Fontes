var ProdutoController = function ($state, $stateParams, $scope, $rootScope, ngDialog, $cookieStore, $http, $timeout, ProdutoFacade, CarrinhoFacade, $sce, GeneralFacade) {

   
    $scope.$on('$viewContentLoading', function () {
        $rootScope.loading = true;
        
    });

    $scope.breadcrumb = {};
    $scope.idsubcategoria = null;
    $scope.subcategoria = null;
    $scope.tipoproduto = null;
    $scope.descricaotipoproduto = null;
    $scope.quantidade = 1;
    $scope.selecionado = {};
    $scope.showproduto = false;
    $scope.Tipo = "";
    $scope.agrup = "";
    someHtmlVar = "";

    $scope.aviseme = {
        email: null,
        produtoId: null
    }

    $scope.$on('$viewContentLoaded', function () {
        $rootScope.loading = true;
        $scope.prodid = $stateParams["id"];

        /*breadcrumb*/
        ProdutoFacade.breadcrumb($scope.prodid)

        .success(function (response) {

            //.ProdutoTipo.Descricao
           
            $scope.breadcrumb = response;
            /*produtos*/

            ProdutoFacade.agrupamento($scope.prodid)
            .success(function (response) {
                if (response.Itens[0].Produto.SubCategoria) {


                    $scope.Tipo = response.Itens[0].Produto.Categoria.Descricao;

                    if ($scope.Tipo == "BOVINO") {

                        $scope.Tipo = "CORTES"
                        $sce.trustAsHtml();
                        someHtmlVar = "<a src='/#!/cortes' ng-click='menumobile = false'>CORTES</a>  / {{subcategoria}} / <strong class='show-for-small-only'> {{tipoproduto}} </strong></span>";
                        $scope.agrup = true;


                    }

                    if ($scope.Tipo == "TEMPEROS") {
                        $scope.Tipo = "EMPORIO"
                        $sce.trustAsHtml();
                        someHtmlVar = "<a src='/#!/cortes' ng-click='menumobile = false'>EMPORIO</a>  / {{subcategoria}} / <strong class='show-for-small-only'> {{tipoproduto}} </strong></span>";
                        $scope.agrup = $sce.trustAsHtml(someHtmlVar);
                        $scope.agrup = false;

                    }

             
                   
                    var num = response.Itens.length - 1;
                    for (var i = 0; i < response.Itens.length; i++) {
                        
                        if (parseInt(response.Itens[i].Produto.ID) == parseInt($scope.prodid)) {
                            num = i;
                            
                        }
                        
                    }

                    $scope.produtos = response.Itens[num];
                   
                    
                    $scope.idsubcategoria = response.Itens[num].Produto.SubCategoria.ID;


                    $scope.subcategoria = response.Itens[num].Produto.SubCategoria.Descricao;



                    $scope.pesoTotal = response.Itens[num].Produto.Skus[0].Peso;
                    $scope.tipoproduto = response.Itens[num].Produto.ProdutoTipo.Descricao;
                    
                   
                    $scope.desc = $sce.trustAsHtml(response.Itens[num].Produto.DescricaoDetalhada);
                    $scope.descRes = $sce.trustAsHtml(response.Itens[num].Produto.DescricaoResumida);
                    //antes motrava descricao de produtoTipo como combinado, por isso alguns produtos vinham com descricao vazia, mesmo quando descricao estava preenchida
                    //$scope.descricaotipoproduto = $sce.trustAsHtml(response.Itens[0].Produto.ProdutoTipo.DescricaoDetalhada);
                    $scope.descricaotipoproduto = $sce.trustAsHtml(response.Itens[num].Produto.DescricaoDetalhada);
                    $scope.combo = parseInt($scope.prodid);

                    angular.forEach(response.Itens, function (value, key) {
                        if (value.Produto.ID == $scope.prodid)
                            $scope.selecionado = value.Produto;
                    });

                    /*relacionados*/
                    ProdutoFacade.relacionados($scope.idsubcategoria)
                    .success(function (response) {
                        if (response != null) {
                            $scope.relacionados = response.ProdutoBuscaItens;
                           
                           
                            $scope.showproduto = true;
                        }
                    })
                    .error(function (response) {
                    })
                    .finally(function () {
                        $rootScope.loading = false;
                    });
                } else {
                    $state.go('home');
                }

            })
            .error(function (response) {
            })
            .finally(function () {
                AtualizaSite();
            });
        })
        .error(function (response) {
        })
        .finally(function () {
           
            $rootScope.loading = false;
           
        });
        
    });

    $scope.adicionarCarrinhoProd = function (data) {

        //var idcarrinho = $rootScope.credentials.isAuthorized ? $rootScope.credentials.carrinhoId : $rootScope.temp.credentials.carrinhoId;
        //var response = { CarrinhoID: idcarrinho, SkuID: 1, Quantidade: 1 };
        //GeneralFacade.pegaProduto(data)
        // .success(function (response) {
        //     var busca = response;
        //     var sku = busca.Skus[0].ID
        //     response = { CarrinhoID: idcarrinho, SkuID: sku, Quantidade: 1 };
        //     GeneralFacade.addproductHome(response, 1).then(function () {
        //         // $state.go('carrinho.produtos');
        //     }, function (reason) {
        //         $scope.expmodal = { title: 'Ops!', message: reason, classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
        //         ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
        //     });
        // })
        // .error(function (response) {
        // })
        // .finally(function () {
        // })


        var idcarrinho = $rootScope.credentials.isAuthorized ? $rootScope.credentials.carrinhoId : $rootScope.temp.credentials.carrinhoId;

        var response = { CarrinhoID: idcarrinho, SkuID: 1, Quantidade: 1 };


        GeneralFacade.pegaProduto(data)
         .success(function (response) {
             var busca = response;



             var sku = busca.Skus[0].ID

             var idcarrinho2 = $rootScope.credentials.isAuthorized ? $rootScope.credentials.carrinhoId : $rootScope.temp.credentials.carrinhoId;

             var response = { CarrinhoID: idcarrinho2, SkuID: sku, Quantidade: 1 }


             $http.post('https://webapi.feed.com.br/v1/carrinho/item/adicionaritem', response, { headers: { "Content-type": "application/json" } })
             //$http.post('http://hom.feed.com.br:8091/v1/carrinho/item/adicionaritem', response, { headers: { "Content-type": "application/json" } })
                       .success(function (response) {

                           if (!response.Erro) {
                               if ($rootScope.credentials.isAuthorized) {
                                   $rootScope.credentials.carrinhoId = response.Dados.CarrinhoID;
                                   $cookieStore.put('auth', $rootScope.credentials);
                               } else {
                                   $rootScope.temp.credentials.carrinhoId = response.Dados.CarrinhoID;
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



         })


    }


    $scope.setProduto = function (item) {
        $scope.selecionado = item;
    }

    $scope.setTipo = function () {
        window.location = '#!/produto/' + $scope.combo;
    }

    $scope.addToCart = function (produto, quantidade) {

        CarrinhoFacade.addproduct(produto, quantidade).then(function () {
            $state.go('carrinho.produtos');
        }, function (reason) {
            $scope.expmodal = { title: 'Ops!', message: reason, classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
            ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
        });

    }

    $scope.toggleModalAviseme = function (idproduto) {
        $(".fd-modal-overlay, .modal-aviseme").toggle();
        $scope.aviseme.produtoId = idproduto;
    }

    $scope.submitAviseme = function (isValid) {
        if (isValid) {
            var data = {
                Nome: "",
                Email: $scope.aviseme.email,
                ProdutoID: $scope.aviseme.produtoId
            }

            $scope.toggleModalAviseme();
            $rootScope.loading = true;

            ProdutoFacade.aviseme(data)
            .success(function (response) {
                $scope.expmodal = { title: 'Legal!', message: 'Você será notificado assim que este produto estiver disponível, Obrigado!', classandtype: 'ngdialog-theme-plain success', controller: 'ModalController' }
                ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
            })
            .error(function (response) {
                $scope.expmodal = { title: 'Ops!', message: 'Não foi possível completar a solicitação, por favor, tente novamente em instantes', classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
                ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
            })
            .finally(function () {
                $rootScope.loading = false;
            });
        }
    }
}

ProdutoController.$inject = ['$state', '$stateParams', '$scope', '$rootScope', 'ngDialog', '$cookieStore', '$http', '$timeout', 'ProdutoFacade', 'CarrinhoFacade', '$sce', 'GeneralFacade'];
