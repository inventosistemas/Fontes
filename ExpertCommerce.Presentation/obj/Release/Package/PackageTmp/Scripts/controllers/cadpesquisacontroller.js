var CadPesquisaController = function ($state, $scope, $timeout, $rootScope, $cookieStore, CadPesquisaFacade, $http, ngDialog) {
    $rootScope.title = "Cadastro";
   

    $scope.$on('$viewContentLoaded', function () {


        window.setTimeout(function () {

            AtualizaSite()



        }, 300);

    });
};
function preferenciasSelecionas() {
    var values = [];


    //function getValues() {
    //    var pacote = document.querySelectorAll('[name=checkpreferencia]:checked');


    //    for (var i = 0; i < pacote.length; i++) {
    //        // utilize o valor aqui, adicionei ao array para exemplo

    //        values.push(pacote[i].id);
    //    }

    //}

    // adicionar ação ao clique no checkbox
    var checkboxes = document.querySelectorAll('[name=checkpreferencia]');
    var pacote = document.querySelectorAll('[name=checkpreferencia]:checked');


    //for (var i = 0; i < checkboxes.length; i++) {
    //    // somente nome da função, sem executar com ()
    //    checkboxes[i].addEventListener('click', getValues, false);
    //}
    for (var i = 0; i < pacote.length; i++) {
        // utilize o valor aqui, adicionei ao array para exemplo

        var item = { 'ID': pacote[i].id };
        values.push(item);
    }


    return values;

}
function preferenciasSelecionasAlter() {
    var values = [];


    var checkboxes = document.querySelectorAll('[name=checkpreferencia]');
    var pacote = document.querySelectorAll('[name=checkpreferencia]:checked');



    for (var i = 0; i < pacote.length; i++) {


        var item = { 'ID': pacote[i].id, 'Descricao': pacote[i].value };
        values.push(item);
    }


    return values;

}

var CadastroFstStepController2 = function ($state, $scope, $timeout, $rootScope, $cookieStore, CadPesquisaFacade, $http, ngDialog, $filter) {
    $rootScope.title = "Cadastro";

    $scope.$on('$viewContentLoaded', function () {
        var tck = $cookieStore.get('idorigem');
        if (tck == undefined) {
            $state.go('cadpesquisa.passoe6');
        }
        CadPesquisaFacade.preferencia()
            .success(function (response) {
                if (response != null) {
                    $scope.preferencias = response;
                }
            })
            .error(function (response) {
            })
            .finally(function () {
            });
        $scope.$parent.step = 1;
        $scope.usuario = {};
        $rootScope.loading = false;
        $('#CelularDDD').mask('00');
        $('#cpf').mask('000.000.000-00');
        $('#nascimento').mask('00/00/0000');
        var c = $('#CelularNumero');
        //var celoptions = {
        //    onChange: function (cel) {
        //        if (cel.length < 14) {
        //            c.unmask();
        //            c.mask('0000-00009', celoptions);
        //        }
        //        else if (cel.length == 14) {
        //            c.unmask();
        //            c.mask('90000-0000', celoptions);
        //        }
        //    }
        //};
        //c.mask('0000-00009', celoptions);
    });

    $scope.submitCadastro = function (isValid) {
        if (isValid) {

            // $scope.usuario.TipoPessoa = 1;
            //$scope.usuario.Nome = $scope.usuario.RazaoSocial;
            $rootScope.loading = true;
            var preferencias = [];
            preferencias = preferenciasSelecionas();


            $scope.usuario.Interesses = preferencias;
            if (document.querySelectorAll('[name=receber]:checked').length != 0) {

                $scope.usuario.OptIn = "true";
            }
            else {

                $scope.usuario.OptIn = "false";
            }
            var tck = $cookieStore.get('idorigem');
            $scope.usuario.ParceiroOrigemId = parseInt(tck);




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

                CadPesquisaFacade.passo1($scope.usuario)
            .success(function (response) {

                if (response.Erro) {
                    $scope.expmodal = { title: 'Ops', message: response.Mensagem, classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
                    ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
                } else {
                    $rootScope.temp.credentials.partnerId = response.ParceiroID;
                    $rootScope.temp.credentials.userName = $scope.usuario.Email;
                    $rootScope.temp.credentials.passWord = $scope.usuario.Senha;
                    $cookieStore.put('tempauth', $rootScope.temp.credentials);
                    $state.go('cadpesquisa.passoe2', { pid: response.ParceiroID });
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
var CadastroSndStepController2 = function ($state, $stateParams, $scope, $timeout, $rootScope, $cookieStore, CadPesquisaFacade, MinhaContaFacade, AuthFacade, $http, ngDialog, $sce) {
    $rootScope.title = "Cadastro";
    $scope.endereco = { Principal: false };
    $scope.pid = $stateParams["pid"];
    $scope.$on('$viewContentLoaded', function () {
        var tck = $cookieStore.get('idorigem');
        if (tck == undefined) {
            $state.go('cadpesquisa.passoe6');
        }
        $rootScope.loading = false;
        $scope.$parent.step = 2;
        $('#cepfield').mask('00000-000', { reverse: true });
    });

    $scope.submitEndereco = function (endereco) {
      

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
            CelularDDD: "",
            CelularNumero: ""
        }
       
        MinhaContaFacade.enderecos.insert(data)
       .success(function (response) {
           AuthFacade.login($rootScope.temp.credentials.userName, $rootScope.temp.credentials.passWord, $rootScope.temp.credentials.carrinhoId)
           .then(function () {
               $state.go('cadpesquisa.passoe5');
           }, function (reason) {
               //$scope.expmodal = { title: 'Endereço cadastrado', message: reason, classandtype: 'ngdialog-theme-plain', controller: 'ModalController' }
               //ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
               $rootScope.loading = false;
               $state.go('cadpesquisa.passoe5');
               
             
           });
       })
       .error(function (response) {
           $rootScope.loading = false;
           $scope.expmodal = { title: 'Ops', message: 'Erro ao cadastrar endereço!', classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
           ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
       })
       .finally(function () {
           $rootScope.loading = false;
       });

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
                $rootScope.loading = false;
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
var CadastroThrStepController = function ($state, $stateParams, $scope, $timeout, $rootScope, $cookieStore, CadPesquisaFacade, $filter, MinhaContaFacade, AuthFacade, $http, ngDialog, $sce) {
    var tck = $cookieStore.get('idorigem');
    if (tck == undefined) {
        $state.go('cadpesquisa.passoe6');
    }
    $rootScope.title = "EDITOR";
    var arraySelecionados = [];
    $scope.$on('$viewContentLoaded', function () {
        $scope.pid = $stateParams["pid"];

        $('#cpf').mask('000.000.000-00');
        $scope.usuario = {};
        var user = {};
        $scope.$parent.step = 3;

        //25614252584
        CadPesquisaFacade.buscabyce($scope.pid).success(function (response) {
            if (response != null) {

                if (response.length == 0) {
                    $state.go('cadpesquisa.passoe1');
                }

                CadPesquisaFacade.preferencia().success(function (response) {
                    if (response != null) {

                        preferenciaSistema = response;
                    }
                })
                .error(function (response) {
                })
                .finally(function () {
                });
                CadPesquisaFacade.buscabyid(response[0].ID).success(function (response2) {
                    if (response2 != null) {

                        $scope.usuario.Nome = response2.Fantasia;
                        $scope.usuario.Email = response2.Email;
                        $scope.usuario.CelularDDD = parseInt(response2.DDDTelefone);
                        $scope.usuario.CelularNumero = response2.Telefone;
                        $scope.Cpfusuario = response2.CNPJ;
                        $scope.usuario.ID = response2.ID;

                        var parts = response2.DataNascimento.split("-");
                        $scope.usuario.DataNascimento = (parts[2].substring(0, 2) + '/' + parts[1] + '/' + parts[0]);

                        arraySelecionados = response2.Interesses;

                        $scope.preferenciasSite = $sce.trustAsHtml('');

                        $scope.info = $sce.trustAsHtml('');

                        if (response2.OptIn == true) {
                            $scope.info = $sce.trustAsHtml($scope.info +
                        '<div class="[ form-group ]">' +
                        '<input type="checkbox" name="receber" id="fancy-checkbox-primary" autocomplete="off" checked />' +
                        '<div class="[ btn-group ]"><label for="fancy-checkbox-primary" class="[ btn btn-primary ]">' +
                        ' <span class="[ glyphicon glyphicon-ok ]"></span><span> </span></label>' +
                        '<label style="width: 499px;" for="fancy-checkbox-primary" class="[ btn btn-default active ]">Deseja receber nossas informações</label></div></div>')
                        }
                        else {
                            $scope.info = $sce.trustAsHtml($scope.info +
                        '<div class="[ form-group ]">' +
                        '<input type="checkbox" name="receber" id="fancy-checkbox-primary" autocomplete="off"  />' +
                        '<div class="[ btn-group ]"><label for="fancy-checkbox-primary" class="[ btn btn-primary ]">' +
                        ' <span class="[ glyphicon glyphicon-ok ]"></span><span> </span></label>' +
                        '<label style="width: 499px;" for="fancy-checkbox-primary" class="[ btn btn-default active ]">Deseja receber nossas informações</label></div></div>')
                        }
                        var contPref = 0;
                        var igual = 0;

                        for (var i = 0; i < preferenciaSistema.length; i++) {
                            contPref = 0;
                                for (var a = 0; a < arraySelecionados.length; a++) {
                                   
                                    if (preferenciaSistema[i].ID == arraySelecionados[a].ID) {
                                       
                                        contPref = 1;
                                        $scope.preferenciasSite = $sce.trustAsHtml($scope.preferenciasSite +
                                           '<div class="searchable-container" style="width: 200px;float:left;"> <div class="info-block block-info clearfix">' +
                             '<div data-toggle="buttons" class="btn-group bizmoduleselect"><label class="btn btn-default active" ><div class="bizcontent">' +
                             '<input style="display: none !important" autocomplete="off"  value="' + preferenciaSistema[i].Descricao + '"name="checkpreferencia" id="' + preferenciaSistema[i].ID + '" type="checkbox" class="check" checked /> ' +
                             '<span class="glyphicon glyphicon-ok glyphicon-lg"></span><h5 style="font-weight: bold;font-size: 14px;">' + preferenciaSistema[i].Descricao + '</h5></div></label></div></div></div>')
                                    }

                                }
                                        if (contPref != 1) {
                                            $scope.preferenciasSite = $sce.trustAsHtml($scope.preferenciasSite +
                             '<div class="searchable-container" style="width: 200px;float:left;"> <div class="info-block block-info clearfix">' +
                             '<div data-toggle="buttons" class="btn-group bizmoduleselect"><label class="btn btn-default "><div class="bizcontent">' +
                             '<input style="display: none !important" autocomplete="off"  value="' + preferenciaSistema[i].Descricao + '"name="checkpreferencia" id="' + preferenciaSistema[i].ID + '" type="checkbox" class="check"  /> ' +
                             '<span class="glyphicon glyphicon-ok glyphicon-lg"></span><h5 style="font-weight: bold;font-size: 14px;">' + preferenciaSistema[i].Descricao + '</h5></div></label></div></div></div>')
                                        }
                        }
                        $timeout(function () {
                            $scope.applyMasks();
                        }, 0);
                        $scope.applyMasks = function () {
                            $('#cpf').mask('000.000.000-00');
                            $('#CelularDDD').mask('00/00/0000');
                            $('#nascimento').mask('00/00/0000')
                            //$('#CelularNumero').mask('000');
                            var c = $('#CelularNumero');
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

                    }
                })
           .error(function (response) {
           })
           .finally(function () {
           });
            }
        })
          .error(function (response) {
          })
          .finally(function () {

              CadPesquisaFacade.preferencia()
           .success(function (response) {
               if (response != null) {
                   $scope.preferencias = response;
               }
           })
           .error(function (response) {
           })
           .finally(function () {
           });
          });

        $rootScope.loading = false;
        $('#CelularDDD').mask('00');
        $('#cpf').mask('000.000.000-00');
        $('#nascimento').mask('00/00/0000');
        var c = $('#CelularNumero');

    });

    $scope.submitCadastro = function (isValid) {
        if (isValid) {

            // $scope.usuario.TipoPessoa = 1;
            //$scope.usuario.Nome = $scope.usuario.RazaoSocial;
            $rootScope.loading = true;
            var preferencias = [];
            preferencias = preferenciasSelecionasAlter();
            $scope.usuario.Interesses = preferencias;
            if (document.querySelectorAll('[name=receber]:checked').length != 0) {

                $scope.usuario.OptIn = "true";
            }
            else {

                $scope.usuario.OptIn = "false";
            }

            $scope.usuario.Interesses = preferencias;
            if (document.querySelectorAll('[name=receber]:checked').length != 0) {

                $scope.usuario.OptIn = "true";
            }
            else {

                $scope.usuario.OptIn = "false";
            }
            var tck = $cookieStore.get('idorigem');
            $scope.usuario.ParceiroOrigemId = parseInt(tck);




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

                CadPesquisaFacade.alterausuario($scope.usuario)
            .success(function (response) {
                if (response.Erro) {
                    $scope.expmodal = { title: 'Ops', message: response.Mensagem, classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
                    ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
                } else {
                    $rootScope.temp.credentials.partnerId = response.ParceiroID;
                    $rootScope.temp.credentials.userName = $scope.usuario.Email;
                    $rootScope.temp.credentials.passWord = $scope.usuario.Senha;
                    $cookieStore.put('tempauth', $rootScope.temp.credentials);
                    $state.go('cadpesquisa.passoe5');
                    // $state.go('cadastro.passo2', { pid: response.ParceiroID });
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

var CadastrofohStepController = function ($state, $stateParams, $scope, $timeout, $rootScope, $cookieStore, CadPesquisaFacade, MinhaContaFacade, AuthFacade, $http, ngDialog, $sce) {
    $rootScope.title = "Busca";


    $scope.$on('$viewContentLoaded', function () {
        $rootScope.loading = false;
        $scope.$parent.step = 4;
        var tck = $cookieStore.get('idorigem');
        if (tck == undefined) {
            $state.go('cadpesquisa.passoe6');
        }

    });

    $scope.submitEndereco = function (isValid, endereco) {
        if (isValid) {
            $rootScope.loading = true;


            $state.go('cadpesquisa.passoe3', { pid: $scope.usuario.Nome });
        }
    };


};

var CadastrofivStepController = function ($state, $stateParams, $scope, $timeout, $rootScope, $cookieStore, CadPesquisaFacade, MinhaContaFacade, AuthFacade, $http, ngDialog, $sce) {
    $rootScope.title = "Busca";


    $scope.$on('$viewContentLoaded', function () {
        $rootScope.loading = false;
        $scope.$parent.step = 5;
        var tck = $cookieStore.get('idorigem');
        if (tck == undefined) {
            $state.go('cadpesquisa.passoe6');
        }

    });

    $scope.submitEndereco = function (isValid, endereco) {

        $rootScope.loading = true;


        $state.go('cadpesquisa.passoe4');

    };


};
var CadastrosixStepController = function ($state, $stateParams, $scope, $timeout, $rootScope, $cookieStore, CadPesquisaFacade, MinhaContaFacade, AuthFacade, $http, ngDialog, $sce) {
    $rootScope.title = "ORIGEM";
    $scope.$on('$viewContentLoaded', function () {
        $rootScope.loading = false;
        $scope.$parent.step = 6;



        CadPesquisaFacade.origemcliente()
        .success(function (response) {
            if (response != null) {


                
                $scope.jsonOrigem = response;
            }
        })
        .error(function (response) {
        })
        .finally(function () {
        });

    });
    $scope.submitEndereco = function (isValid) {

        //$rootScope.loading = true;
        var escolhido = $scope.selectedName.ID;
        $cookieStore.put('idorigem', escolhido);
        var tck = $cookieStore.get('idorigem');

        if (tck != undefined) {

           
            //$rootScope.temp.credentials = tck;
        }
        $state.go('cadpesquisa.passoe4');




    };

};
var CadastroseveStepController = function ($state, $stateParams, $scope, $timeout, $rootScope, $cookieStore, CadPesquisaFacade, MinhaContaFacade, AuthFacade, $http, ngDialog, $sce) {
    $rootScope.title = "ORIGEM";
    $scope.$on('$viewContentLoaded', function () {
        $rootScope.loading = false;
        $scope.$parent.step = 7;


        $scope.login = {
            UserName: "",
            Password: ""
        };

        $scope.$watch('login.UserName', function () {
            if ($scope.login.UserName != undefined)
                $scope.login.UserName = $scope.login.UserName.toString().toLowerCase().replace(/\s+/g, '');
        });

        $scope.$watch('login.Password', function () {
            if ($scope.login.Password != undefined)
                $scope.login.Password = $scope.login.Password.toString().toLowerCase().replace(/\s+/g, '');
        });


        $scope.$on('$viewContentLoaded', function () {
            $scope.usernotfound = false;
            if ($state.current.name == 'carrinho.login' || $state.current.name == 'login')
                $rootScope.loading = false;
        });


        $scope.submitLogin = function (isValid, fromview) {
            if (isValid) {
                AuthFacade.login($scope.login.UserName, $scope.login.Password, $rootScope.temp.credentials.carrinhoId)
               .then(function () {
                   $state.go('cadpesquisa.passoe6');

               }, function (reason) {
                   $scope.usernotfound = true;
                   if (fromview) {
                       $scope.expmodal = { title: 'Ops', message: 'E-mail ou senha não conferem', classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
                       ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
                       $rootScope.loading = false;
                   }
               });
            }
        };
    });


};


CadPesquisaController.$inject = ['$state', '$scope', '$timeout', '$rootScope', '$cookieStore', 'CadPesquisaFacade', '$http', 'ngDialog'];
CadastroFstStepController.$inject = ['$state', '$scope', '$timeout', '$rootScope', '$cookieStore', 'CadPesquisaFacade', '$http', 'ngDialog', '$filter'];
CadastroSndStepController.$inject = ['$state', '$stateParams', '$scope', '$timeout', '$rootScope', '$cookieStore', 'CadPesquisaFacade', 'MinhaContaFacade', 'AuthFacade', '$http', 'ngDialog', '$sce'];
CadastroThrStepController.$inject = ['$state', '$stateParams', '$scope', '$timeout', '$rootScope', '$cookieStore', 'CadPesquisaFacade', 'MinhaContaFacade', '$filter', 'AuthFacade', '$http', 'ngDialog', '$sce'];
CadastrofohStepController.$inject = ['$state', '$stateParams', '$scope', '$timeout', '$rootScope', '$cookieStore', 'CadPesquisaFacade', 'MinhaContaFacade', 'AuthFacade', '$http', 'ngDialog', '$sce'];
CadastrofivStepController.$inject = ['$state', '$stateParams', '$scope', '$timeout', '$rootScope', '$cookieStore', 'CadPesquisaFacade', 'MinhaContaFacade', 'AuthFacade', '$http', 'ngDialog', '$sce'];
CadastrosixStepController.$inject = ['$state', '$stateParams', '$scope', '$timeout', '$rootScope', '$cookieStore', 'CadPesquisaFacade', 'MinhaContaFacade', 'AuthFacade', '$http', 'ngDialog', '$sce'];
CadastroseveStepController.$inject = ['$state', '$stateParams', '$scope', '$timeout', '$rootScope', '$cookieStore', 'CadPesquisaFacade', 'MinhaContaFacade', 'AuthFacade', '$http', 'ngDialog', '$sce'];
