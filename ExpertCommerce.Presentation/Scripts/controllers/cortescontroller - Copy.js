var CortesController = function ($state, $scope, $rootScope, ngDialog, $cookieStore, $http, $timeout, CortesFacade) {
    $scope.$on('$viewContentLoaded', function () {
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

                   $scope.tipoocasiaonome = responseFiltro.Tipos[0].TipoDescricao;
                   $scope.tipoocasiao = $scope.tiposdefiltro.Tipos[0];
                  
                   
                   $scope.tipopreparonome = responseFiltro.Tipos[1].TipoDescricao;
                   $scope.tipopreparo = $scope.tiposdefiltro.Tipos[1];



                   $scope.tipopreparo = responseFiltro.Tipos[1];
                  
                   console.log($scope.tiposdefiltro)
                  
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
        });



    });

    $scope.setSelectedCorte = function (selectedid) {
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
        console.log(checkboxes);
       
        for (var i = 0; i < checkboxes.length; i++) {
            // somente nome da função, sem executar com ()
            checkboxes[i].addEventListener('click', getValues, false);
        }
        for (var i = 0; i < pacote.length; i++) {
            // utilize o valor aqui, adicionei ao array para exemplo
            
            values.push(pacote[i].id);
        }
        console.log(values)

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

            window.setTimeout(function () {

                AlinharMenuDesk();
                window.onresize = tipoTela;
                window.onresize = AlinharMenuDesk;
               
              

            }, 1500);

            $('html, body').animate({
                scrollTop: 0
            }, 500, 'linear');
            $rootScope.loading = false;
        });
    }
}

CortesController.$inject = ['$state', '$scope', '$rootScope', 'ngDialog', '$cookieStore', '$http', '$timeout', 'CortesFacade'];
