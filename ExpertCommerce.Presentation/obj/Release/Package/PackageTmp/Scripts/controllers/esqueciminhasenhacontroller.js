var EsqueciMinhaSenhaController = function ($state, $stateParams, $scope, $rootScope, ngDialog, $cookieStore, $http, AuthFacade) {
    $scope.$on('$viewContentLoaded', function () {
        $rootScope.loading = false;
        window.setTimeout(function () {

            AtualizaSite()



        }, 300);

    });

    $scope.submitEsqueci = function (isValid, esqueciform) {
        if (isValid) {
            $rootScope.loading = true;
            AuthFacade.esqueci.enviaemail($scope.esqueci)
            .success(function (response) {
                if (response) {
                    $scope.expmodal = { title: 'Legal!', message: 'Siga as instruções que te enviamos no email para alterar sua senha e logar!', classandtype: 'ngdialog-theme-plain success', controller: 'ModalController' }
                    ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
                    $scope.esqueci = null;
                    esqueciform.$setUntouched();
                    $rootScope.loading = false;
                }
                else {
                    $scope.expmodal = { title: 'Ops!', message: 'Email não cadastrado!', classandtype: 'ngdialog-theme-plain success', controller: 'ModalController' }
                    ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
                    $rootScope.loading = false;
                }
            })
            .error(function (response) {
                
            })
            .finally(function () {
                $rootScope.loading = false;
            });
        }
    };
}
EsqueciMinhaSenhaController.$inject = ['$state', '$stateParams', '$scope', '$rootScope', 'ngDialog', '$cookieStore', '$http', 'AuthFacade'];

var AlterarMinhaSenhaController = function ($state, $stateParams, $scope, $rootScope, ngDialog, $cookieStore, $http, AuthFacade) {
    $scope.$on('$viewContentLoaded', function () {
        $rootScope.loading = false;
        $scope.lid = $stateParams["login"];
        $scope.tid = $stateParams["token"];


        if ($scope.lid != undefined && $scope.tid != undefined) {

            var data = { loginid: $scope.lid, token: $scope.tid };
            $rootScope.loading = true;
            AuthFacade.esqueci.valida(data)
           .success(function (response) {
               if (response) {
                   $scope.showing = "form-alterar";
               } else {
                   $scope.showing = "form-expirado";
               }
           })
           .error(function (response) {

           })
           .finally(function () {
               $rootScope.loading = false;
           });
        } else {
            $scope.showing = "form-esqueci";
        }
    });


    $scope.submitAlterar = function (isValid, alterarform) {
        if (isValid) {
            $rootScope.loading = true;
            var data = {
                LoginID: $scope.lid,
                TokenID: $scope.tid,
                NovaSenha: $scope.senha,
            };
            AuthFacade.esqueci.alterar(data)
            .success(function (response) {
                if (response) {
                    $scope.expmodal = { title: 'Legal!', message: 'Sua senha foi alterada com sucesso!', classandtype: 'ngdialog-theme-plain success', controller: 'ModalController', backto: "login", backtobutton: "Ok" }
                    ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
                    $scope.esqueci = null;
                    esqueciform.$setUntouched();
                }
            })
            .error(function (response) {
                $scope.expmodal = { title: 'Ops', message: 'Não foi possível alterar a senha', classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
                ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
            })
            .finally(function () {
                $rootScope.loading = false;
            });
        }
    };
}

AlterarMinhaSenhaController.$inject = ['$state', '$stateParams', '$scope', '$rootScope', 'ngDialog', '$cookieStore', '$http', 'AuthFacade'];


