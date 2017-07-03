var MinhaContaController = function ($state, $scope, $timeout, $rootScope) {
  
}

var MeusPedidosController = function ($state, $scope, $timeout, $rootScope, MinhaContaFacade) {
    $scope.pedidos = {};
    $scope.pedidodetail = {};

    $scope.$on('$viewContentLoaded', function () {
       
        $scope.$parent.placeholder = 'meuspedidos'
        $rootScope.loading = true;
      
        /*meuspedidos*/
        //MinhaContaFacade.pedidos.list(27669)
        MinhaContaFacade.pedidos.list($rootScope.credentials.partnerId)
        .success(function (response) {
         
            $scope.pedidos = response;
        })
        .error(function (response) {
        })
        .finally(function () {
            $rootScope.loading = false;
        });
        /*opendetail*/
        $scope.openDetailFor = function (id) {
            $rootScope.loading = true;
            MinhaContaFacade.pedidos.detail(id)
            .success(function (response) {
                $scope.pedidodetail = response[0];
                $("#detail-tr").insertAfter("#" + id);
                $("#detail-tr").removeClass('hide');
                $('html, body').scrollTop($("#" + id).offset().top);
            })
            .error(function (response) {
            })
            .finally(function () {
                $rootScope.loading = false;
            });
        }

        window.setTimeout(function () {

            AtualizaSite()



        }, 300);
    });
}

var MeuCadastroController = function ($state, $scope, $timeout, $rootScope, MinhaContaFacade, $filter, $http, ngDialog) {
    $scope.usuario = {};

    $scope.$on('$viewContentLoaded', function () {
        $scope.$parent.placeholder = 'meucadastro'
        $rootScope.loading = true;

        MinhaContaFacade.cadastro.get($rootScope.credentials.partnerId)
           .success(function (response) {
              
               $scope.usuario = response;

               $scope.usuario.DDDTelefone = parseInt(response.DDDTelefone)
           
               
               $scope.Sexo = [
                     { tipo: 'Feminino', id: 0 },
                     { tipo: 'Masculino', id: 1 }
               ];
               $scope.usuario.Sexo = $scope.Sexo[$scope.usuario.Sexo];

               $scope.usuario.DataNascimento = $filter('date')($scope.usuario.DataNascimento, 'dd/MM/yyyy');
               $timeout(function () {
                   $scope.applyMasks();
               }, 0);
           })
           .error(function (response) {
           })
           .finally(function () {
               $rootScope.loading = false;
           });
        window.setTimeout(function () {

            AtualizaSite()



        }, 300);
    });

    $scope.applyMasks = function () {
        $('#cpf').mask('000.000.000-00');
        $('#nascimento').mask('00/00/0000');
        $('#dddtelefone').mask('000');
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
    };

    $scope.submitCadastro = function (isValid) {
        if (isValid) {
            $rootScope.loading = true;


            //"1976-02-25T00:00:00",
            var data = {
                "LoginID": $rootScope.credentials.userId,
                "Nome": $rootScope.credentials.userName,
                "DataNascimento": $scope.usuario.DataNascimento,
                "DDDTelefone": $scope.usuario.DDDTelefone,
                "Telefone": $scope.usuario.Telefone,
                "Senha": $scope.usuario.Senha == undefined ? "" : $scope.usuario.Senha
               // "Sexo": $scope.usuario.Sexo.id
            }

         
           
            var AnodeNascimento = $scope.usuario.DataNascimento.split('/');
            var ano_aniversario = AnodeNascimento[2];
            var mes_aniversario = AnodeNascimento[1];
            var dia_aniversario = AnodeNascimento[0];
            var nascimentoCompleto = ano_aniversario + '-' + mes_aniversario + '-' + dia_aniversario + 'T00:00:00';
          
            data.DataNascimento = nascimentoCompleto;
         

           
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
                    MinhaContaFacade.cadastro.update(data)
           .success(function (response) {
               $scope.expmodal = { title: 'Sucesso', message: 'Seu cadastro foi alterado!', classandtype: 'ngdialog-theme-plain success', controller: 'ModalController' }
               ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
           })
           .error(function (response) {
               $scope.expmodal = { title: 'Sucesso', message: 'Idade incorreta.', classandtype: 'ngdialog-theme-plain success', controller: 'ModalController' }
           })
           .finally(function () {
               $rootScope.loading = false;
           });
                }
            




            
        }
    };
}

var MeusEnderecosController = function ($state, $scope, $timeout, $rootScope, MinhaContaFacade, ngDialog, $sce) {
    $scope.$on('$viewContentLoaded', function () {
        $scope.$parent.placeholder = 'meusenderecos'
        $scope.enderecos = {};
        $scope.endereco = { Principal: false };
        $rootScope.loading = true;

        $('#cepfield').mask('00000-000');

        MinhaContaFacade.enderecos.list($rootScope.credentials.partnerId)
        .success(function (response) {
            $scope.enderecos = response.Enderecos;
        })
        .error(function (response) {
        })
        .finally(function () {
            $rootScope.loading = false;
        });

        window.setTimeout(function () {

            AtualizaSite()



        }, 300);
    });

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
                $('#celfield').unmask();
                $('#celfield').mask('00000-000', { reverse: true });
            } else {
                $scope.messagehtml = $sce.trustAsHtml('Infelizmente para entregas no seu endereço precisamos calcular o frete diretamente <br><br> Entre em contato com o nosso televendas através do telefone (11) 5627-4700 para podermos fechar o seu pedido ou visite nossa loja. Teremos o maior prazer em atendê-lo');
                $scope.endereco = null;
                $scope.expmodal = { title: 'Ops', html: true, message: $scope.messagehtml, classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
                ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
            }
        })
        .error(function (response) {
        })
        .finally(function () {
            $rootScope.loading = false;
        });
    };

    $scope.ExcluiEndereco = function (endereco) {
        $rootScope.loading = true;

        MinhaContaFacade.enderecos.remove(endereco.ID)
        .success(function (response) {
            var index = $scope.enderecos.indexOf(endereco);
            $scope.enderecos.splice(index, 1);
            $scope.expmodal = { title: 'Sucesso', message: 'Endereço excluido!', classandtype: 'ngdialog-theme-plain success', controller: 'ModalController' }
            ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
        })
        .error(function (response) {
        })
        .finally(function () {
            $rootScope.loading = false;
        });
    };

    $scope.submitEndereco = function (enderecoform, endereco) {
        if (enderecoform.$valid) {
            $rootScope.loading = true;
            var stringcep = endereco.CEP.toString().replace('-', '');
            var data = {
                ParceiroID: $rootScope.credentials.partnerId,
                Destinatario: "",
                Identificacao: endereco.Identificacao,
                CEP: stringcep,
                Logradouro: endereco.Logradouro,
                Numero: endereco.Numero,
                Complemento: endereco.Complemento,
                Bairro: endereco.Bairro,
                CidadeID: endereco.Cidade.ID,
                Principal: endereco.Principal,
                DDDTelefone: "",
                Telefone: ""
            }
            MinhaContaFacade.enderecos.insert(data)
           .success(function (response) {
               endereco.ID = response.ID;
               if (endereco.Principal == true) {
                   angular.forEach($scope.enderecos, function (key, value) {
                       key.Tipo = 1;
                       key.Principal = false;
                   });
               }
               $scope.enderecos.unshift(endereco);
               $timeout(function () {
                   $scope.addaddress = false;
                   $scope.endereco = null;
                   $scope.enderecoform.$setPristine();
                   $scope.enderecoform.$setUntouched();
               }, 0);
               $scope.expmodal = { title: 'Sucesso', message: 'Endereço adicionado!', classandtype: 'ngdialog-theme-plain success', controller: 'ModalController' }
               ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
           })
           .error(function (response) {
               $scope.expmodal = { title: 'Ops', message: 'Erro ao cadastrar endereço!', classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
               ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
           })
           .finally(function () {
               $rootScope.loading = false;
           });
        }
    };
}

MinhaContaController.$inject = ['$state', '$scope', '$timeout', '$rootScope'];
MeusPedidosController.$inject = ['$state', '$scope', '$timeout', '$rootScope', 'MinhaContaFacade'];
MeuCadastroController.$inject = ['$state', '$scope', '$timeout', '$rootScope', 'MinhaContaFacade', '$filter', '$http', 'ngDialog'];
MeusEnderecosController.$inject = ['$state', '$scope', '$timeout', '$rootScope', 'MinhaContaFacade', 'ngDialog', '$sce'];


