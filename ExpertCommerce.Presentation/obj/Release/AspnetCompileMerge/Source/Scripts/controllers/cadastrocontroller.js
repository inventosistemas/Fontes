var CadastroController = function ($state, $scope, $timeout, $rootScope, $cookieStore, CadastroFacade, $http, ngDialog) {
    $rootScope.title = "Cadastro";

    $scope.$on('$viewContentLoaded', function () {

    });
};

var CadastroFstStepController = function ($state, $scope, $timeout, $rootScope, $cookieStore, CadastroFacade, $http, ngDialog, $filter) {
    $rootScope.title = "Cadastro";

    $scope.$on('$viewContentLoaded', function () {
        $scope.$parent.step = 1;
        $scope.usuario = {};
        $rootScope.loading = false;
        $('#dddtelefone').mask('00');
        $('#cpf').mask('000.000.000-00');
        $('#nascimento').mask('00/00/0000');
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

    $scope.submitCadastro = function (isValid) {
        if (isValid) {
            $scope.usuario.TipoPessoa = 1;
            $scope.usuario.Fantasia = $scope.usuario.RazaoSocial;
            $rootScope.loading = true;
            CadastroFacade.passo1($scope.usuario)
            .success(function (response) {
                if (response.Erro) {
                    $scope.expmodal = { title: 'Ops', message: response.Mensagem, classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
                    ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
                } else {
                    $rootScope.temp.credentials.partnerId = response.ParceiroID;
                    $rootScope.temp.credentials.userName = $scope.usuario.Email;
                    $rootScope.temp.credentials.passWord = $scope.usuario.Senha;
                    $cookieStore.put('tempauth', $rootScope.temp.credentials);
                    $state.go('cadastro.passo2', { pid: response.ParceiroID });
                }
            })
            .error(function (response) {
                $scope.expmodal = { title: 'Ops', message: response.Mensagem, classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
                ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
            })
            .finally(function () {
                $rootScope.loading = false;
            });
        }
    };

};

var CadastroSndStepController = function ($state, $stateParams, $scope, $timeout, $rootScope, $cookieStore, CadastroFacade, MinhaContaFacade, AuthFacade, $http, ngDialog,$sce) {
    $rootScope.title = "Cadastro";
    $scope.endereco = { Principal: false };
    $scope.pid = $stateParams["pid"];
    $scope.$on('$viewContentLoaded', function () {
        $rootScope.loading = false;
        $scope.$parent.step = 2;
        $('#cepfield').mask('00000-000', { reverse: true });
    });

    $scope.submitEndereco = function (isValid, endereco) {
        if (isValid) {
            $rootScope.loading = true;
            var stringcep = endereco.CEP.toString().replace('-', '');
            var data = {
                ParceiroID: $scope.pid,
                Destinatario: "",
                Identificacao: endereco.Identificacao,
                CEP: stringcep,
                Logradouro: endereco.Logradouro,
                Numero: endereco.Numero,
                Complemento: endereco.Complemento,
                Bairro: endereco.Bairro,
                CidadeID: endereco.Cidade.ID,
                Principal: true,
                DDDTelefone: "",
                Telefone: ""
            }

            MinhaContaFacade.enderecos.insert(data)
           .success(function (response) {
               AuthFacade.login($rootScope.temp.credentials.userName, $rootScope.temp.credentials.passWord, $rootScope.temp.credentials.carrinhoId)
               .then(function () {
                   if ($rootScope.camefromstate == 'carrinho.login') {
                       $state.go("carrinho.produtos");
                   } else {
                       $state.go("home");
                   }
               }, function (reason) {
                   $scope.expmodal = { title: 'Ops', message: reason, classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
                   ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
                   $rootScope.loading = false;
               });
           })
           .error(function (response) {
               $scope.expmodal = { title: 'Ops', message: 'Erro ao cadastrar endereço!', classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
               ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
           })
           .finally(function () {
           });
        }
    };

    $scope.getCep = function (endereco) {
        $rootScope.loading = true;
        var stringcep = endereco.CEP.toString().replace('-', '');
        MinhaContaFacade.enderecos.bycep(stringcep)
        .success(function (response) {

            if (response != null) {
                $scope.endereco = {
                    Identificacao: endereco.Identificacao,
                    Logradouro: response.Tipo + ' ' + response.Nome,
                    CEP: endereco.CEP,
                    Principal: false,
                    Cidade: {
                        ID: response.Cidade.ID,
                        Nome: response.Cidade.Nome,
                        Estado: {
                            ID: response.Cidade.Estado.ID,
                            Nome: response.Cidade.Estado.Nome
                        }
                    }
                }
            } else {
                $scope.messagehtml = $sce.trustAsHtml('Infelizmente ainda não realizamos entregas no seu endereço. <br><br> Visite nossa loja na Rua Dr Mario Ferraz, 547 - São Paulo - SP ou entre em contato pelo nosso televendas: (11) 5627-4700.');

                $scope.expmodal = { title: 'Ops', html:true, message: $scope.messagehtml, classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
                ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
            }

            $('#cepfield').unmask();
            $('#cepfield').mask('00000-000', { reverse: true });

        })
        .error(function (response) {
        })
        .finally(function () {
            $rootScope.loading = false;
        });
    };
};

CadastroController.$inject = ['$state', '$scope', '$timeout', '$rootScope', '$cookieStore', 'CadastroFacade', '$http', 'ngDialog'];
CadastroFstStepController.$inject = ['$state', '$scope', '$timeout', '$rootScope', '$cookieStore', 'CadastroFacade', '$http', 'ngDialog', '$filter'];
CadastroSndStepController.$inject = ['$state', '$stateParams', '$scope', '$timeout', '$rootScope', '$cookieStore', 'CadastroFacade', 'MinhaContaFacade', 'AuthFacade', '$http', 'ngDialog', '$sce'];