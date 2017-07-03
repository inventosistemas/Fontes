var ProdutoController = function ($state, $stateParams, $scope, $rootScope, ngDialog, $cookieStore, $http, $timeout, ProdutoFacade, CarrinhoFacade, $sce) {

    console.log($scope.idsubcategoria)
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
            console.log(response)
            console.log(response[0].ProdutoTipo.Descricao)
            //.ProdutoTipo.Descricao
            $rootScope.loading = true;
            $scope.breadcrumb = response;
            /*produtos*/
            ProdutoFacade.agrupamento($scope.prodid)
            .success(function (response) {
                if (response.Itens[0].Produto.SubCategoria) {
                    $scope.Tipo = response.Itens[0].Produto.SubCategoria.Descricao;
                    $scope.produtos = response.Itens;
                    $scope.idsubcategoria = response.Itens[0].Produto.SubCategoria.ID;
                    $scope.subcategoria = response.Itens[0].Produto.SubCategoria.Descricao;

                    alert($scope.subcategoria)
                    //if ($scope.subcategoria == "TEMPEROS") {
                    //    console.log("Entrou nos temperos")
                    //}
                    //else if ($scope.subcategoria == "TEMPEROS") {

                    //}

                    $scope.tipoproduto = response.Itens[0].Produto.ProdutoTipo.Descricao;
                    //antes motrava descricao de produtoTipo como combinado, por isso alguns produtos vinham com descricao vazia, mesmo quando descricao estava preenchida
                    //$scope.descricaotipoproduto = $sce.trustAsHtml(response.Itens[0].Produto.ProdutoTipo.DescricaoDetalhada);
                    $scope.descricaotipoproduto = $sce.trustAsHtml(response.Itens[0].Produto.DescricaoDetalhada);
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
            });
        })
        .error(function (response) {
        })
        .finally(function () {
            $rootScope.loading = false;
        });
    });

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

ProdutoController.$inject = ['$state', '$stateParams', '$scope', '$rootScope', 'ngDialog', '$cookieStore', '$http', '$timeout', 'ProdutoFacade', 'CarrinhoFacade', '$sce'];
