var GeneralFacade = function ($q, $http, global, $rootScope, $cookieStore) {


    var banners;
    var vitrine;
    var promo;
    var cortes;
    var emporios;


    return {
        banners: function () {
            if (banners == undefined)
                banners = $http.get(global.apis.expert.domain('v1') + global.apis.expert.general.banners);

            return banners;
        },
        add: function (data) {
            
           
            return $http.post(global.apis.expert.domain('v1') + global.apis.expert.carrinho.add, data, { headers: { "Content-type": "application/json" } });
        },
        detalheProduto: function (data) {

            return $http.get(global.apis.expert.domain('v1') + global.apis.expert.produto.breadcrumb.replace('{id}', data));

        },
        pegaProduto: function (data) {



            return $http.get(global.apis.expert.domain('v1') + global.apis.expert.produto.pegaproduto.replace('{id}', data));

        },
        agrupamento: function (data) {
            return $http.get(global.apis.expert.domain('v1') + global.apis.expert.produto.agrupamento.replace('{id}', data));
        },
        vitrine: function (data) {
            if (vitrine == undefined)
               
                vitrine = $http.get('https://webapi.feed.com.br/v1/' + global.apis.expert.general.vitrine.replace('{count}', data));
           // vitrine = $http.get('http://hom.feed.com.br:8091/v1/' + global.apis.expert.general.vitrine.replace('{count}', data));
            //vitrine = $http.get('http://hom.feed.com.br:8091/v1/' + global.apis.expert.general.vitrine.replace('{count}', data));

            //vitrine = $http.get(global.apis.expert.domain('v1') + global.apis.expert.general.vitrine.replace('{count}', data));

            return vitrine;
        },
        promo: function () {

            if (promo == undefined)
                promo = $http.get(global.apis.expert.domain('v1') + global.apis.expert.general.promo);

            return promo;
        },
        cortes: function () {
           
            if (cortes == undefined)
                cortes = $http.get(global.apis.expert.domain('v1') + global.apis.expert.general.cortes);

            return cortes;
        },
        emporios: function () {
            
            if (emporios == undefined)
                emporios = $http.get(global.apis.expert.domain('v1') + global.apis.expert.general.emporios);

            return emporios;
        },
        newsletter: function (data) {
            return $http.post(global.apis.expert.domain('v1') + global.apis.expert.general.newsletter, data, { headers: { "Content-type": "application/json" } });
        },
        busca: function (data) {
            return $http.post(global.apis.expert.domain('v1') + global.apis.expert.general.busca, data, { headers: { "Content-type": "application/json" } });
        },
        faleconosco: function (data) {
            return $http.post(global.apis.expert.domain('v1') + global.apis.expert.general.faleconosco, data, { headers: { "Content-type": "application/json" } });
        },
        institucional: {
            politicafrete: function () {
                return $http.get(global.apis.expert.domain('v1') + global.apis.expert.general.institucional.politicafrete.replace('{descricao}', 'POLITICAFRETE'));
            }
        },
        addproductHome: function (data, quantidade) {

            
            var t = this;
            var def = $q.defer();


            if (quantidade == undefined)
                quantidade = 1;

             //var idcarrinho = $rootScope.credentials.isAuthorized ? $rootScope.credentials.carrinhoId : $rootScope.temp.credentials.carrinhoId;
            

            //var data = { CarrinhoID: idcarrinho, SkuID: data.Skus[0].ID, Quantidade: quantidade }
            t.add(data)
            .success(function (response) {
                
                var carrinho = response.Dados.CarrinhoID;
               
               

                if (!response.Erro) {
                    if ($rootScope.credentials.isAuthorized) {
                        $rootScope.credentials.carrinhoId = response.Dados.CarrinhoID;
                        $cookieStore.put('auth', $rootScope.credentials);
                    } else {
                        $rootScope.temp.credentials.carrinhoId = response.Dados.CarrinhoID;
                        $cookieStore.put('tempauth', $rootScope.temp.credentials);
                    }

                    //inserir o auth no cookie

                    def.resolve();
                }
            })
            .error(function (response) {
                def.reject('Nâo foi possível adicionar ao carrinho');


            })
            .finally(function () {

            });


           
          


            return def.promise;
        }

    }
};
GeneralFacade.$inject = ['$q', '$http', 'global'];