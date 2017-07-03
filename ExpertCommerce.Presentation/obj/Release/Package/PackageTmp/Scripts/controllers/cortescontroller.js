var CortesController = function ($state, $scope, $rootScope, ngDialog, $cookieStore, $http, $timeout, CortesFacade, GeneralFacade) {

   
    $scope.$on('$viewContentLoaded', function () {
        $rootScope.loading = true;
        $scope.idSelectedCorte = 0;
        $scope.produtosporcorte = {};
        $scope.maisvendidos = {};
        $scope.tiposdecorte = {};
        $scope.filtrocortes = {};

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


            CortesFacade.filtrocortes()
           .success(function (responseFiltro) {

               if (responseFiltro != null) {
                   $scope.tiposdefiltro = responseFiltro;

                   for (var i = 0; i < responseFiltro.Tipos.length; i++) {
                      

                       if (responseFiltro.Tipos[i].TipoDescricao == "Preparo") {

                           $scope.tipopreparonome = responseFiltro.Tipos[i].TipoDescricao;
                           $scope.tipopreparo = $scope.tiposdefiltro.Tipos[i];
                           $scope.tipopreparo = responseFiltro.Tipos[i];
                           $scope.tipopreparoid = responseFiltro.Tipos[i].TipoID;
                       }

                       if (responseFiltro.Tipos[i].TipoDescricao == "Ocasião") {

                           $scope.tipoocasiaonome = responseFiltro.Tipos[i].TipoDescricao;
                           $scope.tipoocasiao = $scope.tiposdefiltro.Tipos[i];
                           $scope.tipoocasiaoid = responseFiltro.Tipos[i].TipoID;
                       }

                       if (responseFiltro.Tipos[i].TipoDescricao == "Apresentação") {

                           $scope.tipoapresentacaonome = responseFiltro.Tipos[i].TipoDescricao;
                           $scope.tipoapresentacao = $scope.tiposdefiltro.Tipos[i];
                           $scope.tipoapresentacaoid = responseFiltro.Tipos[i].TipoID;
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

        
        $rootScope.loading = true;
        var idcarrinho = $rootScope.credentials.isAuthorized ? $rootScope.credentials.carrinhoId : $rootScope.temp.credentials.carrinhoId;
       
        var response = { CarrinhoID: idcarrinho, SkuID: 1, Quantidade: 1 };



        GeneralFacade.pegaProduto(data)
         .success(function (response) {
             var busca = response;



             var sku = busca.Skus[0].ID

             response = { CarrinhoID: idcarrinho, SkuID: sku, Quantidade: 1 };
            
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

             //    GeneralFacade.addproductHome(response, 1).then(function () {
             //        // $state.go('carrinho.produtos');
             //    }, function (reason) {
             //        $scope.expmodal = { title: 'Ops!', message: reason, classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
             //        ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
             //    });
             })
            .error(function (response) {
             })
             .finally(function () {
                 $rootScope.loading = false;
             })


       
         }

    function selecionarCortes() {
        var values = [];

        $rootScope.loading = true;
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

        $rootScope.loading = false;
        return values;

    }
    function selecionarCortesFiltro() {
        var values = [];
        $rootScope.loading = true;

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

            var item = { 'ValorID': pacote[i].value };
        }

        $rootScope.loading = false;
        return values;

    }

    function selecionarPreparo() {
        var values = [];
        $rootScope.loading = true;

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
        $rootScope.loading = false;
        return itens;
    }

    function selecionarOcasiao() {
        var values = [];

        $rootScope.loading = true;
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
        $rootScope.loading = false;
        return itens;

    }
    function selecionarApresentacao() {
        var values = [];
        $rootScope.loading = true;

        function getValues() {
            var pacote = document.querySelectorAll('[name=apresentacao]:checked');


            for (var i = 0; i < pacote.length; i++) {
                // utilize o valor aqui, adicionei ao array para exemplo

                values.push(pacote[i].id);
            }

        }

        // adicionar ação ao clique no checkbox
        var checkboxes = document.querySelectorAll('[name=apresentacao]');
        var pacote = document.querySelectorAll('[name=apresentacao]:checked');


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
        $rootScope.loading = false;
        return itens;

    }

    function selecionarApresentacaoFiltro() {
        var values = [];

        $rootScope.loading = true;
        function getValues() {
            var pacote = document.querySelectorAll('[name=apresentacao]:checked');


            for (var i = 0; i < pacote.length; i++) {
                // utilize o valor aqui, adicionei ao array para exemplo

                values.push(pacote[i].id);
            }

        }

        // adicionar ação ao clique no checkbox
        var checkboxes = document.querySelectorAll('[name=apresentacao]');
        var pacote = document.querySelectorAll('[name=apresentacao]:checked');


        for (var i = 0; i < checkboxes.length; i++) {
            // somente nome da função, sem executar com ()
            checkboxes[i].addEventListener('click', getValues, false);
        }


        var itens = [];
        for (var i = 0; i < pacote.length; i++) {
            // utilize o valor aqui, adicionei ao array para exemplo
            var item = { 'ValorID': pacote[i].value };

            itens.push(item);
        }
        values.push(item);
        $rootScope.loading = false;
        return itens;

    }

    function selecionarOcasiaoFiltro() {
        var values = [];
        $rootScope.loading = true;

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
            var item = { 'ValorID': pacote[i].value };

            itens.push(item);
        }

        values.push(item);
        $rootScope.loading = false;
        return itens;

    }


    function selecionarPreparoFiltro() {
        var values = [];

        $rootScope.loading = true;
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

           
            var item = { 'ValorID': pacote[i].value };

            itens.push(item);
        }
        values.push(item);
        $rootScope.loading = false;
        return itens;
    }


    function JsonFiltros() {
        var preparo = [];
        var Valores = [];
        var ocasiao = [];
        var apresentacao = [];
       
        var esconde = [{ 'ValorID': 9912399 }]
        ocasiao = selecionarOcasiao();
        preparo = selecionarPreparo();
        apresentacao = selecionarApresentacao();

        var idPreparo = 4;
        var idOcasiao = 5;
        var idApresentacao = 6;
        //var idPreparo = $scope.tipopreparoid;
        //var idOcasiao = $scope.tipoocasiaoid;
        //var idApresentacao = $scope.tipoapresentacaoid;


        
            if (preparo.length != "0") {

                var preparar = {
                    "TipoID": idPreparo,
                    "Valores":

                            preparo
                }
            }
          

            if (ocasiao.length != "0") {

                var ocasionar = {
                    "TipoID": idOcasiao,
                    "Valores":

                            ocasiao
                }

            }
          

            if (apresentacao.length != "0") {

                var apresentar = {
                    "TipoID": idApresentacao,
                    "Valores":

                            apresentacao

                }

            }
          
        

        
          

        var jsonFiltroCorte = {}
        if (preparo.length != "0" && ocasiao.length != "0" && apresentacao.length != "0")
        {

           
            jsonFiltroCorte = {


                "ClassificacaoID": 27,
                "Tipos": [
                  preparar, ocasionar, apresentar
                ]
            }
           
        }
        else if (preparo.length != "0" && ocasiao.length != "0") {
            jsonFiltroCorte = {


                "ClassificacaoID": 27,
                "Tipos": [
                  preparar, ocasionar
                ]
            }
        }
        else if (preparo.length != "0" && apresentacao.length != "0") {
            jsonFiltroCorte = {


                "ClassificacaoID": 27,
                "Tipos": [
                  preparar, apresentar
                ]
            }
        }
        else if (apresentacao.length != "0" && ocasiao.length != "0") {
            jsonFiltroCorte = {


                "ClassificacaoID": 27,
                "Tipos": [
                  ocasionar, apresentar
                ]
            }
        } else if (apresentacao.length != "0") {
            jsonFiltroCorte = {


                "ClassificacaoID": 27,
                "Tipos": [
                   apresentar
                ]
            }
        }
        else if (preparo.length != "0") {
            jsonFiltroCorte = {


                "ClassificacaoID": 27,
                "Tipos": [
                  preparar
                ]
            }
        }
        else if (ocasiao.length != "0") {
            jsonFiltroCorte = {
                "ClassificacaoID": 27,
                "Tipos": [
                  ocasionar
                ]
            }
        }
        else {
            jsonFiltroCorte = "undefined";
        }
       

        var front = "";

        var PrepFiltro = [];
        PrepFiltro = selecionarPreparoFiltro();

        for (var i = 0; i < PrepFiltro.length; i++) {
    
            front = front + "<span class='red'>" + PrepFiltro[i].ValorID + "</span>"
        }

        var ocaFiltro = [];
        ocaFiltro = selecionarOcasiaoFiltro();

        for (var i = 0; i < ocaFiltro.length; i++) {
           
            front = front + "<span class='red'>" + ocaFiltro[i].ValorID + "</span>"
        }

        var ApreFiltro = [];
        ApreFiltro = selecionarApresentacaoFiltro();
        for (var i = 0; i < ApreFiltro.length; i++) {

            front = front + "<span class='red'>" + ApreFiltro[i].ValorID + "</span>"
        }

        var CorteFiltro = [];
        CorteFiltro = selecionarCortesFiltro();

      
        for (var i = 0; i < CorteFiltro.length; i++) {

            front = front + "<span class='red'>" + CorteFiltro[i].ValorID + "</span>"
        }
       
       
        //Aqui joga o filtro que esta sendo usado
       // $("#espacoFiltro").html(front);
       
        if (jsonFiltroCorte == "undefined") {
            jsonFiltroCorte = {


                "ClassificacaoID": 27,
                "Tipos": [
                    {
                        "TipoID": 6,
                        "Valores": [

                        ]
                    }
                ]
            }
        }
        return jsonFiltroCorte;
    }


    $scope.setSelectedCorte = function (selectedid, nome) {
      
        $rootScope.loading = true;
        //$("input[type=checkbox][name='teste[]']:checked").each(function () {

        //    var id = $(this).val();
        // $("#espacoFiltro").html("<span class='red'>" + String(id) + "</span>");

       // });

        //$("#espacoFiltro").html("<span class='red'>" + nome + "</span>");

        var jsonFiltroCorte = JsonFiltros();

        selecionarCortes()


        $rootScope.loading = true;
        $scope.idSelectedCorte = selectedid;

        CortesFacade.produtosporcorte(jsonFiltroCorte)
        .success(function (response) {



            var itens = [];
            var cortesSelecionados = selecionarCortes();
            if (response != null) {
                var preparo = document.querySelectorAll('[name=preparo]:checked');
                var ocasiao = document.querySelectorAll('[name=ocasiao]:checked');
                var cortes = document.querySelectorAll('[name=cortes]:checked');
                var apresentacao = document.querySelectorAll('[name=apresentacao]:checked');

                if (preparo.length != 0 || ocasiao.length != 0 || apresentacao.length != 0) {

                    if (cortes.length != 0) {
                    
                        for (var a = 0; a < response.ProdutoBuscaItens.length; a++) {
                            for (var i = 0; i < response.ProdutoBuscaItens.length; i++) {
                                if (response.ProdutoBuscaItens[i].SubCategoriaDescricao == cortesSelecionados[a]) {
                                    if (response.ProdutoBuscaItens[i].CategoriaDescricao == "BOVINO") {
                                        itens.push(response.ProdutoBuscaItens[i]);
                                    }
                                 
                                  
                                }
                            }
                        }
                    } else {
                      
                        for (var i = 0; i < response.ProdutoBuscaItens.length; i++) {
                            if (response.ProdutoBuscaItens[i].CategoriaDescricao == "BOVINO") {
                                itens.push(response.ProdutoBuscaItens[i]);
                            }
                        }

                    }

                }
                else if (cortes.length != 0) {
               
                    for (var a = 0; a < response.ProdutoBuscaItens.length; a++) {
                        for (var i = 0; i < response.ProdutoBuscaItens.length; i++) {
                            if (response.ProdutoBuscaItens[i].SubCategoriaDescricao == cortesSelecionados[a]) {
                                if (response.ProdutoBuscaItens[i].CategoriaDescricao == "BOVINO") {
                                    itens.push(response.ProdutoBuscaItens[i]);
                                }
                            }
                        }
                    }
                }
                else {
                
                    for (var i = 0; i < response.ProdutoBuscaItens.length; i++) {

                      

                        if (response.ProdutoBuscaItens[i].CategoriaDescricao == "BOVINO") {
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
        $rootScope.loading = false;
    }
}

CortesController.$inject = ['$state', '$scope', '$rootScope', 'ngDialog', '$cookieStore', '$http', '$timeout', 'CortesFacade', 'GeneralFacade'];
