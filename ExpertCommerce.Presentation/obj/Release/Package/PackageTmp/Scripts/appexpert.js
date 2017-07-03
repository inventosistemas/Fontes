(function () {
    var appexp = angular.module('appexpert', ['ui.router', 'ngDialog', 'ngCookies', 'ngAnimate', 'exp.facade']);
    
    /*facade/services*/
    angular.module('exp.facade', [])
    .factory('HttpInterceptor', HttpInterceptor)
    .factory('AuthFacade', AuthFacade)
    .factory('GeneralFacade', GeneralFacade)
    .factory('MinhaContaFacade', MinhaContaFacade)
    .factory('CadastroFacade', CadastroFacade)
    .factory('CortesFacade', CortesFacade)
    .factory('EmporioFacade', EmporioFacade)
    .factory('PromocaoFacade', PromocaoFacade)
    .factory('ProdutoFacade', ProdutoFacade)
    .factory('HotsiteFacade', HotsiteFacade)
    .factory('CadPesquisaFacade', CadPesquisaFacade)
    .factory('CarrinhoFacade', CarrinhoFacade);

    /*controllers*/
    appexp.controller('ModalController', ModalController)
          .controller('HomeController', HomeController)
          .controller('MinhaContaController', MinhaContaController).controller('MeusPedidosController', MeusPedidosController).controller('MeuCadastroController', MeuCadastroController).controller('MeusEnderecosController', MeusEnderecosController)
          .controller('BuscaController', BuscaController)
          .controller('FaleConoscoController', FaleConoscoController).controller('QuemSomosController', QuemSomosController).controller('PoliticaFreteController', PoliticaFreteController)
          .controller('LoginController', LoginController)
          .controller('CadastroController', CadastroController).controller('CadastroFstStepController', CadastroFstStepController)
          .controller('CadastroSndStepController', CadastroSndStepController).controller('CadastroThrStepController', CadastroThrStepController)
          .controller('CadastrofohStepController', CadastrofohStepController).controller('CadastrofivStepController', CadastrofivStepController)
        .controller('CadastrosixStepController', CadastrosixStepController).controller('CadastroseveStepController', CadastroseveStepController)
          .controller('CadPesquisaController', CadPesquisaController)
          .controller('EsqueciMinhaSenhaController', EsqueciMinhaSenhaController).controller('AlterarMinhaSenhaController', AlterarMinhaSenhaController)
          .controller('CortesController', CortesController).controller('ProdutoController', ProdutoController)
          .controller('PromocaoController', PromocaoController).controller('HotsiteController', HotsiteController)
          .controller('EmporioController', EmporioController)
          .controller('CarrinhoController', CarrinhoController).controller('CarrinhoProdutosController', CarrinhoProdutosController).controller('CarrinhoPagamentoController', CarrinhoPagamentoController).controller('CarrinhoReprocessaPagamentoController', CarrinhoReprocessaPagamentoController).controller('CarrinhoConclusaoController', CarrinhoConclusaoController).controller('CalendarioController', CalendarioController);

    /*rotas*/
    appexp.config(AppConfig);

    /*constants*/
    appexp.constant('global', {
        apis:
            {
                expert: {
                    domain: function (version) {
                       // var domain = 'http://hom.feed.com.br:8091';
                        var domain = 'https://webapi.feed.com.br';
                        return (version == null ? domain : domain + '/' + version)
                    },
                    auth: {
                        gettoken: '/Token',
                        getuser: '/login',
                        esqueci: {
                            enviaemail: '/login/{email}/recuperarsenha',
                            valida: '/login/{lid}/{tid}/validartoken',
                            alterar: '/login/alterarsenha'
                        }
                    },
                    minhaconta: {
                        pedidos: {
                            list: '/pedido/{id}/meuspedidosheader',
                            detail: '/pedido/{id}/meuspedidosdetail',
                        },
                        cadastro: {
                            get: '/cadastro/{id}',
                            update: '/cadastro/alterarcadastro',
                        },
                        enderecos: {
                            list: '/cadastro/{id}/obterenderecos',
                            bycep: '/cadastro/{id}/obterlogradourocep',
                            insert: '/cadastro/adicionarendereco',
                            remove: '/cadastro/{id}/deletarendereco',
                            setdefault: '/cadastro/{id}/marcarenderercopadrao'
                        }
                    },
                    general: {
                        banners: '/banner',
                        promo: '/produto/PROMOCOES/categoriaespecial',
                        cortes: '/produto/nossoscortes/categoriaespecial',
                        emporios: '/produto/emporio/categoriaespecial',
                        vitrine: '/vitrine/{count}',
                        newsletter: '/cadastro/newsletter',
                        busca: '/produto/buscar',
                        faleconosco: '/cadastro/faleconosco',
                        institucional: {
                        politicafrete: '/{descricao}/rodape/'
                        }
                    },
                    cadastro: {
                        passo12: '/cadastroparte1'
                    },
                    cadpesquisa: {
                        passo1: '/appexterno/incluirparceiro',
                        preferencia: '/appexterno/obterinteressecliente',
                        buscabyid: '/appexterno/{parceiroID}/obterparceirobyid',//busca por cpf ou email
                        buscabyce: '/appexterno/{CPF_EMAIL}/obterparceirobycpfemail',//busca por cpf ou email
                        alterausuario: '/appexterno/alterarparceiro',
                        origemcliente:'/appexterno/obterorigemcliente',
                        
                    },
                    cortes: {
                        maisvendidos: '/produto/MaisVendidos',
                        tiposdecorte: '/produto/4/subcategorias',
                        filtrocortes: '/produto/27/caracteristica',//Homolog tem o id 31 prod 27
                        //produtosporcorte: '/produto/{id}/produtosubcategoria'
                        produtosporcorte: '/produto/4/produtocategoria'
                    },
                    emporio: {
                        maisvendidos: '/produto/MAISVEMPORIO/maisvendidosporcodigo',
                        tiposdecorte: '/produto/25/subcategorias',
                        filtroemporio: '/produto/28/caracteristica', //Homolog tem o id 32 prod 28
                        produtosporcorte: '/produto/{id}/produtosubcategoria'
                    },
                    promocao: {
                        getpromocao: '/produto/{codigoExterno}/categoriaespecial'
                    },
                    hotsite: {
                        getum: '/produto/{codigoExterno}/categoriaespecial'
                    },
                    produto: {
                        breadcrumb: '/produto/{id}/agrupamentoprodutotipo',
                        agrupamento: '/produto/{id}/agrupamento',
                        relacionados: '/produto/{id}/produtosubcategoria',
                        aviseme: '/produto/avisemequandochegar',
                        pegaproduto: '/produto/{id}'
                    },
                    carrinho: {
                        get: '/carrinho/{id}/',
                        changeqtd: '/carrinho/item/adicionarquantidade',
                        cartlink: '/carrinho/adicionarlogin',
                        add: '/carrinho/item/adicionaritem',
                        remove: '/carrinho/item/{id}/delete',
                        getfrete: '/produto/{idcarrinho}/{cep}/programacaoentrega',
                        getfreteprogramacao: '/produto/programacaoentrega',
                        getcupom: '/carrinho/utilizarcupom',
                        clearcupom: '/carrinho/limparcupom',
                        gravapedido: '/pedido/gravarpedido',
                        reprocessapedido: '/pedido/reprocessarpagto'
                    }
                }
            }
    });

    /*diretivas de elementos - controlados por TemplateController*/
    /*general*/
    appexp.directive("exp", function () {
        return {
            restrict: "E",
            replace: true,
            templateUrl: "/template/exp"
        };
    })
    appexp.directive("orientationLock", function () {
        return {
            restrict: "E",
            replace: true,
            templateUrl: "/template/orientationlock"
        };
    })
    .directive("expLoader", function () {

        return {
            restrict: "E",
            replace: true,
            templateUrl: "/template/loader"
        };
    })
     .directive("carrinhoNovo", function () {

         controller: 'CarrinhoProdutosController'

         return {
             restrict: "AE",
             replace: true,
             templateUrl: "/template/carrinhonovo"
         };
     })
         .directive("carrinhoPrincipal", function () {

             controller: 'CarrinhoProdutosController'

             return {
                 restrict: "AE",
                 replace: true,
                 templateUrl: "/template/carrinhoprincipal"
             };
         })
    /*app*/
    .directive("expApp", function () {
        return {
            restrict: "E",
            replace: true,
            templateUrl: "/template/app"
        };
    })
    .directive("appHeader", function () {
        return {
            replace: true,
            templateUrl: "/template/header",
            link: function ($scope, element, attrs) {
                $scope.menulogin = false;
                $scope.buscar = function (term) {
                    if (term != undefined)
                        window.location = '#!/busca/' + term;
                }
                $scope.gotocarrinho = function (term) {
                   
                    window.location = '#!/carrinho/produtos';
                }
            }
        };
    })
    .directive("appFooter", function () {
        return {
            restrict: "E",
            replace: true,
            templateUrl: "/template/footer"
        };
    })

    .directive("appMenu", function () {
        return {
            restrict: "E",
            replace: true,
            templateUrl: "/template/menu"
        };
    })
    .directive("appMobileMenu", function () {
        return {
            restrict: "E",
            replace: true,
            templateUrl: "/template/menuMobile"
        };
    })
    .directive("appMenuLogin", function () {
        return {
            scope: false,
            templateUrl: "/template/menuLogin",
            controller: 'LoginController'
        };
    })
    .directive("feedCalendario", function () {
        return {
            restrict: "E",
            scope: {
                hoje: '@hoje',
                mostrar: '@mostrar',
                isolatedBindingFoo: '=bindingFoo',
            },
            templateUrl: "/template/calendario",
            controller: "CalendarioController",
            link: function ($scope, element, attrs) {
                $scope.initcalendario($scope.hoje, $scope.mostrar);
            }
        };
    })
    .directive('fallbackSrc', function () {
        var fallbackSrc = {
            link: function postLink(scope, iElement, iAttrs) {
                iElement.bind('error', function () {
                    angular.element(this).attr("src", iAttrs.fallbackSrc);
                });
            }
        }
        return fallbackSrc;
    })
    .directive('compareTo', function () {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function (scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function () {
                    ngModel.$validate();
                });
            }
        };
    });
    /*filters*/
    appexp.filter('capitalize', function () {
        return function (input, scope) {
            if (input != null)
                input = input.toLowerCase();
            return input.substring(0, 1).toUpperCase() + input.substring(1);
        }
    });

    /*init*/
    appexp.run(['$state', '$http', '$rootScope', '$cookieStore', '$window', '$location', function ($state, $http, $rootScope, $cookieStore, $window, $location) {

        $window.ga('create', 'UA-79833596-1', 'auto');
        
        $rootScope.numeroCarrinho = 0;
        $rootScope.iddologin = 0;
        $rootScope.forAnotherCtrl = { name: '/template/menu.cshtml', url: '/template/menu' };
       
        $rootScope.logout = function () {
           
          
            $http.defaults.headers.common = {};
            $cookieStore.remove('auth');
            $rootScope.credentials = {
                isAuthorized: false,
                userId: null,
                partnerId: null,
                userName: null,
                carrinhoId: null,
                access_token: null
            };
            $state.go('login');
        };
      
        
        
        $rootScope.temp = {
            credentials: {
                partnerId: null,
                userName: null,
                passWord: null,
                carrinhoId: 0
            }
        };
       
      
        $rootScope.NomeLogado = "Visitante";
        $rootScope.credentials = {
            isAuthorized: false,
            userId: null,
            partnerId: null,
            userName: null,
            carrinhoId: 0,
            access_token: null
        };

        
        $rootScope.camefromstate = null;

        var tck = $cookieStore.get('tempauth');
        if (tck != undefined) {
            $rootScope.temp.credentials = tck;
        }

        var ck = $cookieStore.get('auth');
        if (ck != undefined) {
            $rootScope.credentials = ck;
        }

        function detectOrientation() {
            if (window.orientation != undefined) {
                if (window.orientation == 0) {
                    $("#orientation-lock").hide();
                }
                else {
                    if (window.orientation > 0) { //clockwise
                        $("#orientation-lock").show();
                    }
                    else {
                        $("#orientation-lock").show();
                    }
                }

            }
        }

        $window.addEventListener('orientationchange', function ($rootScope) {
            detectOrientation();
        }, false);


        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, $scope, global) {
            //$rootScope.loading = true;
           
            if ($rootScope.credentials.userName == null) {
              
            }
            else {
                $rootScope.NomeLogado = $rootScope.credentials.userName.split(' ')[0];
            }
            
            $rootScope.menulogado = false;
            $rootScope.menumobile = false;

            
            var url = location.href;
           
            if (url.indexOf("cadpesquisa") == -1) {
                if ((toState.data != undefined && toState.data.requireAuth) && !$rootScope.credentials.isAuthorized) {
                    event.preventDefault();
                    $state.go('login');
                }
            } else {
                if ((toState.data != undefined && toState.data.requireAuth) && !$rootScope.credentials.isAuthorized) {
                    event.preventDefault();
                    $state.go('cadpesquisa.passoe7');
                }
            }

           

        });
        
        $rootScope.$on('$stateChangeSuccess', function (next, current) {
            detectOrientation();
            $('body').scrollTop(0);
           
            $window.ga('send', 'pageview', $location.path());
           

        });
    }]);
})();

