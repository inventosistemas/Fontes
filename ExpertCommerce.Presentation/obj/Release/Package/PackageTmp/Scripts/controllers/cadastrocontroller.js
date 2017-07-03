var CadastroController = function ($state, $scope, $timeout, $rootScope, $cookieStore, CadastroFacade, $http, ngDialog) {
    $rootScope.title = "Cadastro";

    $scope.$on('$viewContentLoaded', function () {
        window.setTimeout(function () {

            AtualizaSite()



        }, 300);

    });
};

var CadastroFstStepController = function ($state, $scope, $timeout, $rootScope, $cookieStore, CadastroFacade, $http, ngDialog, $filter) {
    $rootScope.title = "Cadastro";

    $scope.$on('$viewContentLoaded', function () {
        $scope.$parent.step = 1;
        $scope.usuario = {};
        $rootScope.loading = true;
        $('#dddtelefone').mask('00');
        $('#cpf').mask('000.000.000-00');
        $('#nascimento').mask('00/00/0000');
        var c = $('#telefone');
        var celoptions = {
            onChange: function (cel) {
                //if (cel.length < 14) {
                //    c.unmask();
                //    c.mask('0000-00009', celoptions);
                //}
                //else if (cel.length == 14) {
                //    c.unmask();
                //    c.mask('90000-0000', celoptions);
                //}
               
                if (cel.indexOf("9") == 0) {
                    c.unmask();
                    c.mask('90000-0000', celoptions);
                }
                else {
                    c.unmask();
                    c.mask('0000-0000', celoptions);
                }
            }
        };
        $rootScope.loading = false;
        c.mask('0000-00009', celoptions);
    });

    $scope.submitCadastro = function (isValid) {
        $rootScope.loading = true;
      
        if (isValid) {
            $scope.usuario.TipoPessoa = 1;
            $scope.usuario.Fantasia = $scope.usuario.RazaoSocial;
            

            if ($scope.usuario.DataNascimento == undefined) {
                $scope.usuario.DataNascimento = "01/10/1910";
            }
           

            var AnodeNascimento = $scope.usuario.DataNascimento.split('/');
            var ano_aniversario = AnodeNascimento[2];
            var mes_aniversario = AnodeNascimento[1];
            var dia_aniversario = AnodeNascimento[0];


            var d = new Date,
                ano_atual = d.getFullYear(),
                mes_atual = d.getMonth() + 1,
                dia_atual = d.getDate(),

                ano_aniversario = +ano_aniversario,
                mes_aniversario = +mes_aniversario,
                dia_aniversario = +dia_aniversario,

                quantos_anos = ano_atual - ano_aniversario;

            if (mes_atual < mes_aniversario || mes_atual == mes_aniversario && dia_atual < dia_aniversario) {
                quantos_anos--;
            }

            if (quantos_anos < 18 || quantos_anos > 120) {

                $scope.expmodal = { title: 'Sucesso', message: 'Verificar data de nascimento', classandtype: 'ngdialog-theme-plain success', controller: 'ModalController' }
                ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
                $rootScope.loading = false;

            }
            else {
                
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



        }
    };

};

var CadastroSndStepController = function ($state, $stateParams, $scope, $timeout, $rootScope, $cookieStore, CadastroFacade, MinhaContaFacade, AuthFacade, $http, ngDialog, $sce) {
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
                $scope.messagehtml = $sce.trustAsHtml('Infelizmente para entregas no seu endereço precisamos calcular o frete diretamente <br><br> Entre em contato com o nosso televendas através do telefone (11) 5627-4700 para podermos fechar o seu pedido ou visite nossa loja. Teremos o maior prazer em atendê-lo');

                $scope.expmodal = { title: 'Ops', html: true, message: $scope.messagehtml, classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
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