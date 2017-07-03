var CarrinhoController = function ($state, $scope, $timeout, $rootScope, $stateParams, CarrinhoFacade, ngDialog, MinhaContaFacade, $cookieStore, $q, $sce) {
    $scope.idcarrinho = 0;
    $scope.enderecos = {}
    $scope.enderecoEntrega = {}
    $scope.carrinho = {
        cupom: null
    };
    $scope.pedidodata = {
        LoginID: $rootScope.credentials.isAuthorized ? $rootScope.credentials.userId : null,
        EnderecoID: null,
        PagamentoMetodoFormaID: null,
        ClassificacaoPagto: 0,
        Parcela: 1,
        CarrinhoID: $rootScope.credentials.isAuthorized ? $rootScope.credentials.carrinhoId : null,
        CupomDesconto: $scope.carrinho.CodigoVoucher,
        DadosCartao: {
            Titular: null,
            Numero: null,
            Mes: null,
            Ano: null,
            CodigoSeguranca: null
        },
        ProgramacaoEntrega: {
            ID: null,
            IntervaloID: null,
            Data: null,
            Hora: 0,
            Minuto: 0,
            ValorFrete: null
        }
    }
    $scope.result = {};
    $scope.jatemcupom = false;
    $scope.tfselecionado = null;
    $scope.peselecionado = null;
    $scope.fistfretecalc = true;

    $scope.setEnderecoEntrega = function (endereco) {
        console.log(endereco);
        $rootScope.loading = true;
        var data = endereco.ID;
        MinhaContaFacade.enderecos.setdefault(data)
        .success(function (response) {
            $scope.enderecoEntrega = endereco;
            $scope.toggleModalEndereco();
            $scope.calculaFrete($scope.enderecoEntrega.CEP);
            $(".endereco").removeClass('selected');
            $(".endereco." + endereco.ID).addClass('selected');
        })
        .error(function (response) {
        })
        .finally(function () {
            $rootScope.loading = false;
        });
    }

    $scope.calculaFrete = function (cep, fromhtml) {
        var deferred = $q.defer();
        $rootScope.loading = true;

        var data = { idcarrinho: $scope.idcarrinho, cep: cep }

        CarrinhoFacade.getfrete(data)
        .success(function (response) {
            $scope.tiposfrete = response;
            deferred.resolve(response);
            if ($scope.fistfretecalc) {
                $timeout(function () {
                    $("#frete-0").trigger('click');
                }, 0);
            }
        })
        .error(function (response) {
            $scope.messagehtml = $sce.trustAsHtml('Infelizmente ainda não realizamos entregas no seu endereço. <br><br> Visite nossa loja na Rua Dr Mario Ferraz, 547 - São Paulo - SP ou entre em contato pelo nosso televendas: (11) 5627-4700.');
            $scope.expmodal = { title: 'Ops', html: true, message: $scope.messagehtml, classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
            ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
            $rootScope.loading = false;
            deferred.reject();
        })
        .finally(function () {
            if (fromhtml)
                $rootScope.loading = false;
        });
        return deferred.promise;
    }

    $scope.setValorFrete = function (frete) {
        $scope.carrinho.Frete = frete.ValorServicoEntrega;
    }

    $scope.calculaFreteProgramacao = function (frete) {
        var deferred = $q.defer();
        $rootScope.loading = true;
        $scope.tfselecionado = frete;

        if ($scope.dataselecionada == undefined)
            $scope.dataselecionada = $('.each-month-day.selected').attr('formatodata');

        var data = {
            ProgramacaoEntregaID: frete.ProgramacaoEntregaID,
            PorAgendamento: frete.PorAgendamento,
            Data: $scope.dataselecionada,
            CarrinhoWebID: $scope.idcarrinho
        }

        //set pedido values
        $scope.pedidodata.ProgramacaoEntrega.ID = frete.ProgramacaoEntregaID;
        $scope.pedidodata.ProgramacaoEntrega.Data = $scope.dataselecionada;
        $scope.pgmcetrg = null;

        CarrinhoFacade.getfreteprogramacao(data)
        .success(function (response) {
            $scope.freteprogramacao = response;

            $timeout(function () {
                $scope.pgmcetrg = $scope.freteprogramacao[0];
                $scope.setProgramacaoEntrega($scope.pgmcetrg);
            }, 10);

            if ($scope.freteprogramacao.length <= 1 && $scope.freteprogramacao.ProgramacaoEntregaIntervaloDescricao == "") {
            } else {
                $scope.pedidodata.ProgramacaoEntrega.IntervaloID = null;
            }

            deferred.resolve(response);
        })
        .error(function (response) {
            $scope.setProgramacaoEntrega(null);
            $scope.freteprogramacao = null;
            $scope.messagehtml = $sce.trustAsHtml('Nenhum horário disponível para esta opção de entrega');
            $scope.expmodal = { title: 'Ops', html: true, message: $scope.messagehtml, classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
            ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
            $rootScope.loading = false;
            deferred.reject();
        })
        .finally(function () {
            $rootScope.loading = false;
            $scope.setValorFrete(frete);
            //set valor frete para gravar pedido (?)
            $scope.pedidodata.ProgramacaoEntrega.ValorFrete = $scope.carrinho.Frete;
        });
        return deferred.promise;
    }

    $scope.RecalculaFreteProgramacao = function (data) {
        $scope.dataselecionada = data;
        if ($scope.tfselecionado != null)
            $scope.calculaFreteProgramacao($scope.tfselecionado);
    }

    $scope.setProgramacaoEntrega = function (programacao) {
        console.log('setProgramacaoEntrega');
        $scope.peselecionado = programacao;
        if (programacao != null) {
            $scope.pedidodata.ProgramacaoEntrega.IntervaloID = programacao.ProgramacaoEntregaIntervaloID;
        } else {
            $scope.pedidodata.ProgramacaoEntrega.IntervaloID = null;
        }
        console.log($scope.pedidodata.ProgramacaoEntrega.IntervaloID);
    }

    $scope.toggleModalEndereco = function () {
        $(document).scrollTop(0);
        $(".fd-modal-overlay, .modal-endereco").toggle();
    }

    $scope.toggleModalResumo = function () {
        $(document).scrollTop(0);
        $(".fd-modal-overlay, .modal-resumo").toggle();
    }

    $scope.gravaPedido = function (reprocessa) {
        $rootScope.loading = true;
        $scope.pedidodata.CupomDesconto = $scope.carrinho.CodigoVoucher;

        CarrinhoFacade.gravapedido($scope.pedidodata, reprocessa)
        .success(function (response) {
            if (response != null && response.Gravou == true) {
                if (!reprocessa)
                    $scope.toggleModalResumo();
                $state.go('carrinho.conclusao');
                $scope.result = response;
                $rootScope.credentials.carrinhoId = 0;
                $cookieStore.put('auth', $rootScope.credentials);
            } else {
                if (!reprocessa)
                    $scope.toggleModalResumo();
                $state.go('carrinho.conclusao');
                $scope.result = response;
                $scope.result.Gravou = false;
                $rootScope.credentials.carrinhoId = 0;
                $cookieStore.put('auth', $rootScope.credentials);
            }
        })
        .error(function (response) {
            if (!reprocessa)
                $scope.toggleModalResumo();
            $state.go('carrinho.conclusao');
            $scope.result.Gravou = false;
        })
        .finally(function () {
            $rootScope.loading = false;
        });
    }

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
                $scope.endereco = null;
                $scope.expmodal = { title: 'Ops', message: 'Cep não encontrado!', classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
                ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
            }
        })
        .error(function (response) {
        })
        .finally(function () {
            $rootScope.loading = false;
        });
    };

    $scope.submitEndereco = function (isValid, endereco) {
        if (isValid) {
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
                Principal: true,
                DDDTelefone: "",
                Telefone: ""
            }

            MinhaContaFacade.enderecos.insert(data)
           .success(function (response) {
               $scope.pedidodata.EnderecoID = response.ID;
               endereco.ID = response.ID;
               endereco.Tipo = 0;
               $('.endereco').removeClass('selected');
               $scope.enderecos.unshift(endereco);
               $scope.enderecoEntrega = endereco;
               $scope.endereco = null;
               $scope.enderecoform.$setPristine();
               $scope.enderecoform.$setUntouched();
               //$scope.toggleModalEndereco();
               //$scope.calculaFrete(endereco.CEP);
               $scope.setEnderecoEntrega(endereco);
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

    $scope.goback = function () {
        history.back(-1);
    }

    $(document).foundation();
}

CarrinhoController.$inject = ['$state', '$scope', '$timeout', '$rootScope', '$stateParams', 'CarrinhoFacade', 'ngDialog', 'MinhaContaFacade', '$cookieStore', '$q', '$sce'];

var CarrinhoProdutosController = function ($state, $scope, $timeout, $rootScope, $stateParams, CarrinhoFacade, MinhaContaFacade, ngDialog, $q, $filter) {
    $scope.$on('$viewContentLoaded', function () {
        $scope.$parent.idcarrinho = $rootScope.credentials.isAuthorized ? $rootScope.credentials.carrinhoId : $rootScope.temp.credentials.carrinhoId;
        $scope.$parent.step = 1;
        $scope.getCarrinho($scope.$parent.idcarrinho);
        $('.cep').mask('00000-000');
        $scope.noitens = false;
        //$scope.toggleModalResumo();
        $scope.$parent.fistfretecalc = true;
        $scope.$parent.tfselecionado = null;
        $scope.$parent.peselecionado = null;
        $(document).foundation();
        //$scope.$parent.toggleModalResumo();
    });

    /*get-carrinho*/
    $scope.getCarrinho = function (id) {
        $rootScope.loading = true;
        var idcarrinho = id;
        CarrinhoFacade.get(idcarrinho)
        .success(function (response) {
            $scope.$parent.carrinho = response;
            if (response.Itens.length > 0) {
                $scope.noitens = false;
                /*get-enderecos*/
                if ($rootScope.credentials.isAuthorized) {
                    $scope.getEnderecos()
                    .then(function (enderecoresponse) {
                        /*calcula-frete*/
                        $scope.$parent.calculaFrete($scope.$parent.enderecoEntrega.CEP)
                        .then(function (freteresponse) {
                            /*calcula-cupom*/
                            if ($scope.$parent.carrinho.CodigoVoucher == null || $scope.$parent.carrinho.CodigoVoucher == "") {
                                $scope.$parent.jatemcupom = false;
                                $rootScope.loading = false;
                            } else {
                                $scope.$parent.jatemcupom = true;
                                $scope.calculaCupom($scope.$parent.carrinho.CodigoVoucher);
                            }
                        }, function (reason) {
                        });
                    }, function (reason) {
                    });
                } else {
                    $rootScope.loading = false;
                }
            } else {
                $scope.noitens = true;
            }
        })
        .error(function (response) {
            $rootScope.loading = false;
            $scope.noitens = true;
        })
        .finally(function () {
        });
    }

    /*endereco*/
    $scope.toggleModalEndereco = function () {
        $scope.$parent.toggleModalEndereco();
    }

    /*remove*/
    $scope.removeItem = function (data) {
        $scope.expmodal = { title: 'Excluir item', message: 'Deseja realmente excluir o item?', classandtype: 'ngdialog-theme-plain confirm', controller: 'ModalController', confirm: { buttonOk: 'Ok', buttonCancel: 'Cancelar', data: data } }
        ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
    };

    $scope.confirm = function (data) {
        CarrinhoFacade.remove(data.Id)
        .success(function (response) {
            $scope.getCarrinho($scope.$parent.idcarrinho);
        })
        .error(function (response) {
        })
        .finally(function () {
            ngDialog.close();
            $rootScope.loading = false;
        });
    };

    /*qtd*/
    $scope.changeQtd = function (item, type) {
        var qtd = item.Quantidade;
        if (type == 'add')
            qtd++;
        else
            qtd--;

        var data = {
            CarrinhoItemID: item.Id,
            Quantidade: qtd
        }
        $rootScope.loading = true;
        CarrinhoFacade.changeqtd(data)
        .success(function (response) {

            item.Quantidade = qtd;
            $timeout(function () {
                $scope.updateSub();
            }, 0);

        })
        .error(function (response) {
        })
        .finally(function () {
            $rootScope.loading = false;
        });
    }

    $scope.updateSub = function () {
        var sum = 0;
        var elems = $('.sumvalues');
        angular.forEach(elems, function (value, key) {
            var a = angular.element(value);
            sum += parseFloat(a.html());
        });
        $scope.carrinho.SubTotal = sum;
    }

    $scope.getEnderecos = function () {
        var deferred = $q.defer();
        MinhaContaFacade.enderecos.list($rootScope.credentials.partnerId)
       .success(function (response) {
           if (response != null) {
               $scope.$parent.enderecos = response.Enderecos;
               if ($scope.$parent.pedidodata.EnderecoID == null) {
                   angular.forEach($scope.$parent.enderecos, function (value, key) {
                       if (value.Tipo == 0) {
                           $scope.$parent.enderecoEntrega = value;
                           $scope.$parent.pedidodata.EnderecoID = value.ID;
                       }
                   });
               }
               deferred.resolve(response);
           } else {
               deferred.reject('Não há endereços cadastrados');
               $rootScope.loading = false;
           }
       })
       .error(function (response) {
           deferred.reject(response.Message);
       })
       .finally(function () {
       });

        return deferred.promise;
    }

    $scope.calculaCupom = function (cupom, fromhtml) {
        $rootScope.loading = true;
        var data = { CarrinhoID: $scope.$parent.idcarrinho, NumeroCupom: cupom, ParceiroID: null };
        CarrinhoFacade.getcupom(data)
        .success(function (response) {
            if (response.Erro == false) {
                $scope.$parent.carrinho.ValorDesconto = response.ValorTotalDesconto;
                $scope.$parent.jatemcupom = true;
            } else {
                $scope.expmodal = { title: 'Ops', message: response.Mensagem, classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
                ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
            }
        })
        .error(function (response) {
            $scope.expmodal = { title: 'Ops', message: response.message, classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
            ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
        })
        .finally(function () {
            if (fromhtml)
                $rootScope.loading = false;
        });
    }

    $scope.limpaCupom = function (cupom) {
        $rootScope.loading = true;
        var data = { CarrinhoID: $scope.$parent.idcarrinho };
        CarrinhoFacade.clearcupom(data)
        .success(function (response) {
            $scope.$parent.jatemcupom = false;
            $scope.$parent.carrinho.CodigoVoucher = "";
            $scope.$parent.carrinho.ValorDesconto = 0;
        })
        .error(function (response) {
        })
        .finally(function () {
            $rootScope.loading = false;
        });
    }

    $scope.keepgoing = function () {
        if (!$rootScope.credentials.isAuthorized) {
            $state.go('carrinho.login');
        } else {
            $state.go('carrinho.pagamento');
        }
    }

    $scope.updateEntregaCombo = function () {
        $scope.$parent.setProgramacaoEntrega($scope.pgmcetrg);
    }
}

CarrinhoProdutosController.$inject = ['$state', '$scope', '$timeout', '$rootScope', '$stateParams', 'CarrinhoFacade', 'MinhaContaFacade', 'ngDialog', '$q', '$filter'];

var CarrinhoPagamentoController = function ($state, $scope, $timeout, $rootScope, $stateParams, CarrinhoFacade, MinhaContaFacade, ngDialog) {
    $scope.$on('$viewContentLoaded', function () {
        $scope.showflag = "";
        $scope.$parent.step = 2;
        $rootScope.loading = false;

        if ($scope.$parent.carrinho.Itens == undefined) {
            $state.go('carrinho.produtos');
        }

        $("#numerocartao").mask('9999999999999999');
        $("#mes").mask('99');
        $("#ano").mask('9999');
        $("#cvv").mask('0009');
    });

    /*endereco*/
    $scope.toggleModalResumo = function () {
        $scope.$parent.toggleModalResumo();
    }

    $scope.identifyCard = function (number) {
        var res = $scope.identifyFlag(number);
        $scope.showflag = res;
        if (res == "Visa") {
            $scope.$parent.pedidodata.PagamentoMetodoFormaID = 1;
        } else if (res == "Mastercard") {
            $scope.$parent.pedidodata.PagamentoMetodoFormaID = 2;
        } else if (res == "Diners") {
            $scope.$parent.pedidodata.PagamentoMetodoFormaID = 4;
        } else if (res == "AMEX") {
            $scope.$parent.pedidodata.PagamentoMetodoFormaID = 3;
        } else if (res == "Elo") {
            $scope.$parent.pedidodata.PagamentoMetodoFormaID = 5;
        } else {
            $scope.$parent.pedidodata.PagamentoMetodoFormaID = null;
            $scope.expmodal = { title: 'Ops', message: 'Número de cartão inválido', classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
            ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
            $scope.$parent.pedidodata.DadosCartao.Numero = null;
        }
    }

    $scope.identifyFlag = function (numCartao) {
        if (/^(40117[89]|438935|451416|45763[12]|504175|506699|506717|50672[25-9]|50673[039]|50674[0-8]|50904[^1]|50905[012]|50906[46789]|509074|627780|636297|636368)/.test(numCartao) && numCartao.length <= 16) {
            //"elo";
            return "Elo";
        }
        if (/^(34|37)/.test(numCartao) && numCartao.length <= 15) {
            //"amex";
            return "AMEX";
        }
        if (/^(4)/.test(numCartao) && numCartao.length <= 16) {
            //"visa";
            return "Visa";
        }

        if (/^(5[1-5])/.test(numCartao) && numCartao.length <= 16) {
            //"mastercard";
            return "Mastercard";
        }

        if (/^(30[0-5]|3[68])/.test(numCartao) && numCartao.length <= 16) {
            //"dinersclub";
            return "Diners";
        }
        if (/^(60|384)/.test(numCartao) && (numCartao.length <= 16 || numCartao.length <= 13)) {
            //"hipercard";
            return "Hypercard";
        }
    }
}

CarrinhoPagamentoController.$inject = ['$state', '$scope', '$timeout', '$rootScope', '$stateParams', 'CarrinhoFacade', 'MinhaContaFacade', 'ngDialog'];

var CarrinhoReprocessaPagamentoController = function ($state, $scope, $timeout, $rootScope, $stateParams, CarrinhoFacade, MinhaContaFacade, ngDialog) {
    $scope.$on('$viewContentLoaded', function () {
        $scope.showflag = "";
        $scope.$parent.step = 2;
        $rootScope.loading = false

        var idpedidoreprocessa = $stateParams["pid"];
        if (idpedidoreprocessa == undefined) {
            $state.go('minhaconta.pedidos');
        }

        $scope.$parent.pedidodata = {
            PedidoVendaID: idpedidoreprocessa,
            PagamentoMetodoFormaID: 1,
            ClassificacaoPagto: 0,
            Parcela: 1,
            DadosCartao: {
                Titular: "",
                Numero: "",
                Mes: "",
                Ano: "",
                CodigoSeguranca: ""
            }
        }

        $("#numerocartao").mask('9999999999999999');
        $("#mes").mask('99');
        $("#ano").mask('9999');
        $("#cvv").mask('0009');
    });

    /*endereco*/
    $scope.toggleModalResumo = function () {
        $scope.$parent.toggleModalResumo();
    }

    $scope.identifyCard = function (number) {
        var res = $scope.identifyFlag(number);
        $scope.showflag = res;
        if (res == "Visa") {
            $scope.$parent.pedidodata.PagamentoMetodoFormaID = 1;
        } else if (res == "Mastercard") {
            $scope.$parent.pedidodata.PagamentoMetodoFormaID = 2;
        } else if (res == "Diners") {
            $scope.$parent.pedidodata.PagamentoMetodoFormaID = 4;
        } else if (res == "AMEX") {
            $scope.$parent.pedidodata.PagamentoMetodoFormaID = 3;
        } else if (res == "Elo") {
            $scope.$parent.pedidodata.PagamentoMetodoFormaID = 5;
        } else {
            $scope.$parent.pedidodata.PagamentoMetodoFormaID = null;
            $scope.expmodal = { title: 'Ops', message: 'Número de cartão inválido', classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
            ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
            $scope.$parent.pedidodata.DadosCartao.Numero = null;
        }
    }

    $scope.identifyFlag = function (numCartao) {
        if (/^(40117[89]|438935|451416|45763[12]|504175|506699|506717|50672[25-9]|50673[039]|50674[0-8]|50904[^1]|50905[012]|50906[46789]|509074|627780|636297|636368)/.test(numCartao) && numCartao.length <= 16) {
            //"elo";
            return "Elo";
        }
        if (/^(34|37)/.test(numCartao) && numCartao.length <= 15) {
            //"amex";
            return "AMEX";
        }
        if (/^(4)/.test(numCartao) && numCartao.length <= 16) {
            //"visa";
            return "Visa";
        }

        if (/^(5[1-5])/.test(numCartao) && numCartao.length <= 16) {
            //"mastercard";
            return "Mastercard";
        }

        if (/^(30[0-5]|3[68])/.test(numCartao) && numCartao.length <= 16) {
            //"dinersclub";
            return "Diners";
        }
        if (/^(60|384)/.test(numCartao) && (numCartao.length <= 16 || numCartao.length <= 13)) {
            //"hipercard";
            return "Hypercard";
        }
    }
}

CarrinhoReprocessaPagamentoController.$inject = ['$state', '$scope', '$timeout', '$rootScope', '$stateParams', 'CarrinhoFacade', 'MinhaContaFacade', 'ngDialog'];

var CarrinhoConclusaoController = function ($state, $scope, $timeout, $rootScope, $stateParams, CarrinhoFacade, MinhaContaFacade, $cookieStore, ngDialog) {
    $scope.$on('$viewContentLoaded', function () {
        $scope.$parent.step = 3;
        $rootScope.loading = false;
    });
}

CarrinhoConclusaoController.$inject = ['$state', '$scope', '$timeout', '$rootScope', '$stateParams', 'CarrinhoFacade', 'MinhaContaFacade', 'ngDialog'];