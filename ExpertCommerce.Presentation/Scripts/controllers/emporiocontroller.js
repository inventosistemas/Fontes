var EmporioController = function ($state, $scope, $rootScope, ngDialog, $cookieStore, $http, $timeout, EmporioFacade, GeneralFacade) {
    $scope.$on('$viewContentLoaded', function () {
        $scope.idSelectedCorte = 0;
        $rootScope.loading = true;
        $scope.produtosporcorte = {};
        $scope.maisvendidos = {};
        $scope.tiposdecorte = {};
        $scope.filtrocortes = {};

        EmporioFacade.maisvendidos()
       .success(function (response) {

           $scope.maisvendidos = response[0].Itens;
           EmporioFacade.tiposdecorte()
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


           EmporioFacade.filtroemporio()
          .success(function (responseFiltro) {
            
             
              if (responseFiltro != null) {
               
                  $scope.tiposdefiltro = responseFiltro;
                 
                  for (var i = 0; i < responseFiltro.Tipos.length; i++) {

                      

                      if (responseFiltro.Tipos[i].TipoDescricao == "Carvão") {

                          $scope.tipopreparonome = responseFiltro.Tipos[i].TipoDescricao;
                          $scope.tipopreparo = $scope.tiposdefiltro.Tipos[i];
                          $scope.tipopreparo = responseFiltro.Tipos[i];
                          $scope.tipopreparoid = responseFiltro.Tipos[i].TipoID;
                      }

                      if (responseFiltro.Tipos[i].TipoDescricao == "Alimentos") {

                          $scope.tipoocasiaonome = responseFiltro.Tipos[i].TipoDescricao;
                          $scope.tipoocasiao = $scope.tiposdefiltro.Tipos[i];
                          $scope.tipoocasiaoid = responseFiltro.Tipos[i].TipoID;
                      }

                     
                  }

              }
          })
          .error(function (responseFiltro) {

          })
          .finally(function () {

          });



       })
        .error(function (response) {
        })
        .finally(function () {

            AtualizaSite()
        });
        $rootScope.loading = false;
    });

    $scope.adicionarCarrinhoProd = function (data) {
      
       
        var idcarrinho = $rootScope.credentials.isAuthorized ? $rootScope.credentials.carrinhoId : $rootScope.temp.credentials.carrinhoId;
     

        var response = { CarrinhoID: idcarrinho, SkuID: 1, Quantidade: '1' };
        GeneralFacade.pegaProduto(data)
         .success(function (response) {
            
             var busca = response;
             var sku = busca.Skus[0].ID
             response = { CarrinhoID: idcarrinho, SkuID: sku, Quantidade: '1' };
             
             //$http.post('http://hom.feed.com.br:8091/v1/carrinho/item/adicionaritem', response, { headers: { "Content-type": "application/json" } })
             $http.post('https://webapi.feed.com.br/v1/carrinho/item/adicionaritem', response, { headers: { "Content-type": "application/json" } })
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

                         def.resolve();
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

    function selecionarCortes() {
        var values = [];


        function getValues() {
            var pacote = document.querySelectorAll('[name=cortes]:checked');


            for (var i = 0; i < pacote.length; i++) {
                // utilize o valor aqui, adicionei ao array para exemplo

                values.push(pacote[i].id);
            }

        }

        // adicionar ação ao clique no checkbox
        var checkboxes = document.querySelectorAll('[name=cortes]');
        var pacote = document.querySelectorAll('[name=cortes]:checked');


        for (var i = 0; i < checkboxes.length; i++) {
            // somente nome da função, sem executar com ()
            checkboxes[i].addEventListener('click', getValues, false);
        }
        for (var i = 0; i < pacote.length; i++) {
            // utilize o valor aqui, adicionei ao array para exemplo

            values.push(pacote[i].id);
        }


        return values;

    }


    function selecionarPreparo() {
        var values = [];


        function getValues() {
            var pacote = document.querySelectorAll('[name=preparo]:checked');


            for (var i = 0; i < pacote.length; i++) {
                // utilize o valor aqui, adicionei ao array para exemplo

                values.push(pacote[i].id);
            }

        }

        // adicionar ação ao clique no checkbox
        var checkboxes = document.querySelectorAll('[name=preparo]');
        var pacote = document.querySelectorAll('[name=preparo]:checked');


        for (var i = 0; i < checkboxes.length; i++) {
            // somente nome da função, sem executar com ()
            checkboxes[i].addEventListener('click', getValues, false);
        }
        var itens = [];
        for (var i = 0; i < pacote.length; i++) {
            // utilize o valor aqui, adicionei ao array para exemplo
            var item = { 'ValorID': pacote[i].id };

            itens.push(item);
        }
        values.push(item);
        return itens;
    }

    function selecionarOcasiao() {
        var values = [];


        function getValues() {
            var pacote = document.querySelectorAll('[name=ocasiao]:checked');


            for (var i = 0; i < pacote.length; i++) {
                // utilize o valor aqui, adicionei ao array para exemplo

                values.push(pacote[i].id);
            }

        }

        // adicionar ação ao clique no checkbox
        var checkboxes = document.querySelectorAll('[name=ocasiao]');
        var pacote = document.querySelectorAll('[name=ocasiao]:checked');


        for (var i = 0; i < checkboxes.length; i++) {
            // somente nome da função, sem executar com ()
            checkboxes[i].addEventListener('click', getValues, false);
        }


        var itens = [];
        for (var i = 0; i < pacote.length; i++) {
            // utilize o valor aqui, adicionei ao array para exemplo
            var item = { 'ValorID': pacote[i].id };

            itens.push(item);
        }

        values.push(item);
        return itens;

    }
 

    function JsonFiltros() {
        var churrasco = [];
        var Valores = [];
        var alimentos = [];
      

        var esconde = [{ 'ValorID': 9912399 }]
        alimentos = selecionarOcasiao();
        churrasco = selecionarPreparo();
     

        var idchurrasco = 10;
        var idalimentos = 9;
      
        //var idchurrasco = $scope.tipopreparoid;
        //var idOcasiao = $scope.tipoocasiaoid;
   



        if (churrasco.length != "0") {

            var preparar = {
                "TipoID": idchurrasco,
                "Valores":

                        churrasco
            }
        }


        if (alimentos.length != "0") {

            var ocasionar = {
                "TipoID": idalimentos,
                "Valores":

                        alimentos
            }

        }

        var jsonFiltroCorte = {}
        if (churrasco.length != "0" && alimentos.length != "0") {


            jsonFiltroCorte = {


                "ClassificacaoID": 28,
                "Tipos": [
                  preparar, ocasionar
                ]
            }

        }
        else if (churrasco.length != "0" && alimentos.length != "0") {
            jsonFiltroCorte = {


                "ClassificacaoID": 28,
                "Tipos": [
                  preparar, ocasionar
                ]
            }
        }
        
        
        else if (churrasco.length != "0") {
            jsonFiltroCorte = {


                "ClassificacaoID": 28,
                "Tipos": [
                  preparar
                ]
            }
        }
        else if (alimentos.length != "0") {
            jsonFiltroCorte = {
                "ClassificacaoID": 28,
                "Tipos": [
                  ocasionar
                ]
            }

          
        }
        else {
            jsonFiltroCorte = "undefined";
        }
     


        if (jsonFiltroCorte == "undefined") {
            jsonFiltroCorte = {


                "ClassificacaoID": 28,
                "Tipos": [
                    {
                        "TipoID": 9,
                        "Valores": [

                        ]
                    }
                ]
            }
        }

        
        return jsonFiltroCorte;
    }



    $scope.setSelectedCorte = function (selectedid) {


        var jsonFiltroCorte = JsonFiltros();
       
        selecionarCortes()


        $rootScope.loading = true;
        $scope.idSelectedCorte = selectedid;

        EmporioFacade.produtosporcorte(jsonFiltroCorte)
        .success(function (response) {

           

            var itens = [];
            var cortesSelecionados = selecionarCortes();
            if (response != null) {
                var preparo = document.querySelectorAll('[name=preparo]:checked');
                var ocasiao = document.querySelectorAll('[name=ocasiao]:checked');
                var cortes = document.querySelectorAll('[name=cortes]:checked');

                if (preparo.length != 0 || ocasiao.length != 0) {

                    if (cortes.length != 0) {
             
                        for (var a = 0; a < response.ProdutoBuscaItens.length; a++) {
                            for (var i = 0; i < response.ProdutoBuscaItens.length; i++) {
                                if (response.ProdutoBuscaItens[i].SubCategoriaDescricao == cortesSelecionados[a]) {
                                 
                                    
                                    if (response.ProdutoBuscaItens[i].CategoriaDescricao == "EMPORIO") {
                                        itens.push(response.ProdutoBuscaItens[i]);
                                    }
                                   
                                }
                            }
                        }
                    } else {
         
                        for (var i = 0; i < response.ProdutoBuscaItens.length; i++) {
                            if (response.ProdutoBuscaItens[i].CategoriaDescricao == "EMPORIO") {
                                itens.push(response.ProdutoBuscaItens[i]);
                            }
                          
                        }

                    }

                }
                else if (cortes.length != 0) {
              
                    for (var a = 0; a < response.ProdutoBuscaItens.length; a++) {
                        for (var i = 0; i < response.ProdutoBuscaItens.length; i++) {
                            if (response.ProdutoBuscaItens[i].SubCategoriaDescricao == cortesSelecionados[a]) {
                                itens.push(response.ProdutoBuscaItens[i]);
                                if (response.ProdutoBuscaItens[i].CategoriaDescricao == "EMPORIO") {
                                    itens.push(response.ProdutoBuscaItens[i]);
                                }
                            }
                        }
                    }
                }
                else {
              
                    for (var i = 0; i < response.ProdutoBuscaItens.length; i++) {
                        if (response.ProdutoBuscaItens[i].CategoriaDescricao == "EMPORIO") {
                            itens.push(response.ProdutoBuscaItens[i]);
                        }
                       
                      
                    }
                }
                $scope.produtosporcorte = itens;

             
            } else {
             
                $scope.produtosporcorte = response;
            }

        })
        .error(function (response) {
            $scope.produtosporcorte = [];
        })
        .finally(function () {

            window.setTimeout(function () {

                AlinharMenuDesk();
                window.onresize = tipoTela;
                window.onresize = AlinharMenuDesk;



            }, 1500);

            //$('html, body').animate({
            //    scrollTop: 0
            //}, 500, 'linear');
            $rootScope.loading = false;
        });
    }
}

EmporioController.$inject = ['$state', '$scope', '$rootScope', 'ngDialog', '$cookieStore', '$http', '$timeout', 'EmporioFacade', 'GeneralFacade'];
