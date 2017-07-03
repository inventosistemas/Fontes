var FaleConoscoController = function ($state, $scope, $rootScope, ngDialog, $cookieStore, $http, GeneralFacade) {
    $scope.$on('$viewContentLoaded', function () {
        $rootScope.loading = false;
        $('#dddtelefone').mask('00');
        var c = $('#telefone');
        var celoptions = {
            onChange: function (cel) {
                if (cel.length < 14) {
                    c.unmask();
                    c.mask('0000-00009', celoptions);
                }
                else if (cel.length == 14) {
                    c.unmask();
                    c.mask('90000-0000', celoptions);
                }
            }
        };
        c.mask('0000-00009', celoptions);
    });

    $scope.submitContato = function (isValid) {
        if (isValid) {
            GeneralFacade.faleconosco($scope.faleconosco)
            .success(function (response) {
                if (response) {
                    $scope.expmodal = { title: 'Sucesso', message: 'Obrigado! Entraremos em contato o mais rápido possível!', classandtype: 'ngdialog-theme-plain success', controller: 'ModalController' }
                    ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
                    $scope.faleconosco = null;
                    $scope.contatoform.$setPristine();
                    $scope.contatoform.$setUntouched();
                } else {
                    $scope.expmodal = { title: 'Ops', message: 'Ocorreu um erro ao enviar seu email, tente novamente mais tarde', classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
                    ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
                }
            })
            .error(function (response) {
                $scope.expmodal = { title: 'Ops', message: 'Ocorreu um erro ao enviar seu email, tente novamente mais tarde', classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
                ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
            })
            .finally(function () {
                $rootScope.loading = false;
            });
        }
    };
}

var QuemSomosController = function ($state, $scope, $rootScope, ngDialog, $cookieStore, $http, GeneralFacade) {
  
    $scope.$on('$viewContentLoaded', function () {
        $rootScope.loading = false;
    });
}



var PoliticaFreteController = function ($state, $scope, $rootScope, ngDialog, $cookieStore, $http, GeneralFacade, $sce) {
    $scope.$on('$viewContentLoaded', function () {
        console.log('a');
        GeneralFacade.institucional.politicafrete()
        .success(function (response) {
            
            if (response[0].Itens != null) {
                $scope.html = response[0].Itens[0].Html;
                $scope.htmlfrete = $sce.trustAsHtml($scope.html);
                console.log($scope.htmlfrete);
            }
            //angular.forEach(response[0].Itens, function (value, key) {
            //});
        })
        .error(function (response) {
            console.log('a2');
        })
        .finally(function () {
            $rootScope.loading = false;
        });


    });
}

PoliticaFreteController.$inject = ['$state', '$scope', '$rootScope', 'ngDialog', '$cookieStore', '$http', 'GeneralFacade', '$sce'];
QuemSomosController.$inject = ['$state', '$scope', '$rootScope', 'ngDialog', '$cookieStore', '$http', 'GeneralFacade'];
FaleConoscoController.$inject = ['$state', '$scope', '$rootScope', 'ngDialog', '$cookieStore', '$http', 'GeneralFacade'];

