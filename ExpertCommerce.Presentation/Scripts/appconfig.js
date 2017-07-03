var AppConfig = function ($stateProvider, $locationProvider, $httpProvider, ngDialogProvider) {
    $httpProvider.interceptors.push('HttpInterceptor');
    $httpProvider.defaults.headers.common = {};
    //$httpProvider.defaults.headers.common["Content-type"] = "application/json";
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.get = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
    $locationProvider.hashPrefix('!');

    $stateProvider
    .state('home', {
        url: "",
        views: {
            'root': {
                templateUrl: '/home',
                controller: 'HomeController'

            }
        }
    })
    .state('login', {
        url: "/login",
        views: {
            'root': {
                templateUrl: '/login',
                controller: 'LoginController'
            }
        }
    })
    .state('esqueciminhasenha', {
        url: "/esqueci-minha-senha",
        views: {
            'root': {
                templateUrl: '/login/esqueciminhasenha',
                controller: 'EsqueciMinhaSenhaController'
            }
        }
    })
    .state('alterarminhasenha', {
        url: "/alterar-minha-senha/:login/:token",
        views: {
            'root': {
                templateUrl: '/login/alterarminhasenha',
                controller: 'AlterarMinhaSenhaController'
            }
        }
    })
    .state('minhaconta', {
        abstract: true,
        views: {
            'root': {
                templateUrl: '/minhaconta',
                controller: 'MinhaContaController'
            }
        }
    })
    .state('minhaconta.pedidos', {
        url: "/minha-conta/meus-pedidos",
        views: {
            'child1': {
                templateUrl: '/minhaconta/meuspedidos',
                controller: 'MeusPedidosController'
            }
        },
        data: {
            requireAuth: true
        }
    })
    .state('minhaconta.cadastro', {
        url: "/minha-conta/meu-cadastro",
        views: {
            'child1': {
                templateUrl: '/minhaconta/meucadastro',
                controller: 'MeuCadastroController'
            }
        },
        data: {
            requireAuth: true
        }
    })
    .state('minhaconta.enderecos', {
        url: "/minha-conta/meus-enderecos",
        views: {
            'child1': {
                templateUrl: '/minhaconta/meusenderecos',
                controller: 'MeusEnderecosController'
            }
        },
        data: {
            requireAuth: true
        }
    })
    .state('busca', {
        url: "/busca/:termo",
        views: {
            'root': {
                templateUrl: '/busca',
                controller: 'BuscaController'
            }
        }
    })
    .state('faleconosco', {
        url: "/fale-conosco",
        views: {
            'root': {
                templateUrl: '/instituicao/faleconosco',
                controller: 'FaleConoscoController'
            }
        }
    })
    .state('quemsomos', {
        url: "/quem-somos",
        views: {
            'root': {
                templateUrl: '/instituicao/quemsomos',
                controller: 'QuemSomosController'
            }
        }
    })
    .state('politicadefrete', {
        url: "/politica-de-frete",
        views: {
            'root': {
                templateUrl: '/instituicao/politicadefrete',
                controller: 'PoliticaFreteController'
            }
        }
    })
    .state('cadastro', {
        abstract: true,
        views: {
            'root': {
                templateUrl: '/Cadastro',
                controller: 'CadastroController'
            }
        }
    })
    .state('cadastro.passo1', {
        url: "/cadastro/passo-1",
        views: {
            'child1': {
                templateUrl: '/cadastro/passo1',
                controller: 'CadastroFstStepController'
            }
        }
    })
    .state('cadastro.passo2', {
        url: "/cadastro/passo-2/:pid",
        views: {
            'child1': {
                templateUrl: '/cadastro/passo2',
                controller: 'CadastroSndStepController'
            }
        }
    })
        .state('cadpesquisa', {
            abstract: true,
            views: {
                'root': {
                    templateUrl: '/cadpesquisa',
                    controller: 'CadastroController'
                }
            }
        })
    .state('cadpesquisa.passoe1', {
        url: "/cadpesquisa/passoe-1",
        views: {
            'child1': {
                templateUrl: '/cadpesquisa/passoe1',
                controller: 'CadastroFstStepController2'
            }
        },
        data: {
            requireAuth: true
        }
    })
    .state('cadpesquisa.passoe2', {
        url: "/cadpesquisa/passo-2/:pid",
        views: {
            'child1': {
                templateUrl: '/cadpesquisa/passoe2',
                controller: 'CadastroSndStepController2'
            }
        },
        data: {
            requireAuth: true
        }
    })
    .state('cadpesquisa.passoe3', {
        url: "/cadpesquisa/passoe-3/:pid",
             views: {
                 'child1': {
                     templateUrl: '/cadpesquisa/passoe3',
                     controller: 'CadastroThrStepController'
                 }
             },
             data: {
                 requireAuth: true
             }
         })
    .state('cadpesquisa.passoe4', {
             url: "/cadpesquisa/passoe-4",
             views: {
                 'child1': {
                     templateUrl: '/cadpesquisa/passoe4',
                     controller: 'CadastrofohStepController'
                 }
             },
             data: {
                 requireAuth: true
             }
    })
         .state('cadpesquisa.passoe5', {
             url: "/cadpesquisa/passoe-5",
             views: {
                 'child1': {
                     templateUrl: '/cadpesquisa/passoe5',
                     controller: 'CadastrofivStepController'
                 }
             },
             data: {
                 requireAuth: true
             }
         })
    .state('cadpesquisa.passoe6', {
        url: "/cadpesquisa/passoe-6",
        views: {
            'child1': {
                templateUrl: '/cadpesquisa/passoe6',
                controller: 'CadastrosixStepController'
            },
            data: {
                requireAuth: true
            }
        }
    })
    .state('cadpesquisa.passoe7', {
        url: "/cadpesquisa/passoe-7",
        views: {
            'child1': {
                templateUrl: '/cadpesquisa/passoe7',
                controller: 'CadastroseveStepController'
            }
        }
    })
    .state('cortes', {
        url: "/cortes",
        views: {
            'root': {
                templateUrl: '/cortes',
                controller: 'CortesController'
            }
        }
    })
        .state('emporio', {
            url: "/emporio",
            views: {
                'root': {
                    templateUrl: '/emporio',
                    controller: 'EmporioController'
                }
            }
        })
    .state('promocao', {
        url: "/promocao",
        views: {
            'root': {
                templateUrl: '/promocao',
                controller: 'PromocaoController'
            }
        }
    })

         .state('hotsite', {
             url: "/hotsite",
             views: {
                 'root': {
                     templateUrl: '/hotsite',
                     controller: 'HotsiteController'
                 }
             }
         })
    .state('produto', {
        url: "/produto/:id",
        views: {
            'root': {
                templateUrl: '/produto',
                controller: 'ProdutoController'
            }
        }
    }).state('carrinho', {
        abstract: true,
        views: {
            'root': {
                templateUrl: '/carrinho',
                controller: 'CarrinhoController'
            }
        }
    })
    .state('carrinho.produtos', {
        url: "/carrinho/produtos",
        views: {
            'child1': {
                templateUrl: '/carrinho/produtos',
                controller: 'CarrinhoProdutosController'
            }
        }
    })
    .state('carrinho.login', {
        url: "/carrinho/login",
        views: {
            'child1': {
                templateUrl: '/login',
                controller: 'LoginController'
            }
        }
    })
    .state('carrinho.pagamento', {
        url: "/carrinho/pagamento",
        views: {
            'child1': {
                templateUrl: '/carrinho/pagamento',
                controller: 'CarrinhoPagamentoController'
            }
        }
    })
    .state('carrinho.reprocessa-pagamento', {
        url: "/carrinho/reprocessa-pagamento/:pid",
        views: {
            'child1': {
                templateUrl: '/carrinho/reprocessapagamento',
                controller: 'CarrinhoReprocessaPagamentoController'
            }
        }
    })
    .state('carrinho.conclusao', {
        url: "/carrinho/conclusao",
        views: {
            'child1': {
                templateUrl: '/carrinho/conclusao',
                controller: 'CarrinhoConclusaoController'
            }
        }
    });

    ngDialogProvider.setDefaults({
        cache: false,
        template: '/template/modal',
        plain: false,
        showClose: true,
        closeByDocument: true,
        closeByEscape: true,
        appendTo: false
    });
}

AppConfig.$inject = ['$stateProvider', '$locationProvider', '$httpProvider', 'ngDialogProvider'];