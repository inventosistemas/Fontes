var CarrinhoFacade = function ($q, $rootScope, $http, $cookieStore, global) {
    return {
        get: function (data) {
          
            return $http.get(global.apis.expert.domain('v1') + global.apis.expert.carrinho.get.replace('{id}', data));
        },
        changeqtd: function (data) {
            return $http.put(global.apis.expert.domain('v1') + global.apis.expert.carrinho.changeqtd, data, { headers: { "Content-type": "application/json" } });
        },
        add: function (data) {
           
            
            return $http.post(global.apis.expert.domain('v1') + global.apis.expert.carrinho.add, data, { headers: { "Content-type": "application/json" } });
        },
        remove: function (data) {
           
            return $http.delete(global.apis.expert.domain('v1') + global.apis.expert.carrinho.remove.replace('{id}', data));
        },
        cartlink: function (data) {
            return $http.put(global.apis.expert.domain('v1') + global.apis.expert.carrinho.cartlink, data, { headers: { "Content-type": "application/json" } });
        },
        getfrete: function (data) {
            var tempdata = angular.copy(data);
            return $http.get(global.apis.expert.domain('v1') + global.apis.expert.carrinho.getfrete.replace('{idcarrinho}', tempdata.idcarrinho).replace('{cep}', tempdata.cep));
        },
        getfreteprogramacao: function (data) {
            return $http.post(global.apis.expert.domain('v1') + global.apis.expert.carrinho.getfreteprogramacao, data, { headers: { "Content-type": "application/json" } });
        },
        getcupom: function (data) {
        
            return $http.post(global.apis.expert.domain('v1') + global.apis.expert.carrinho.getcupom, data, { headers: { "Content-type": "application/json" } });
        },
        clearcupom: function (data) {
            return $http.post(global.apis.expert.domain('v1') + global.apis.expert.carrinho.clearcupom, data, { headers: { "Content-type": "application/json" } });
        },
        gravapedido: function (data, reprocessa) {
          
            if(!reprocessa)
                return $http.post(global.apis.expert.domain('v1') + global.apis.expert.carrinho.gravapedido, data, { headers: { "Content-type": "application/json" } });
            else
                return $http.put(global.apis.expert.domain('v1') + global.apis.expert.carrinho.reprocessapedido, data, { headers: { "Content-type": "application/json" } });
        },
        addproduct: function (data, quantidade) {

           
            var t = this;
            var def = $q.defer();
            $rootScope.loading = true;

            if (quantidade == undefined)
                quantidade = 1;
            var idcarrinho = $rootScope.credentials.isAuthorized ? $rootScope.credentials.carrinhoId : $rootScope.temp.credentials.carrinhoId;
            var data = { CarrinhoID: idcarrinho, SkuID: data.Skus[0].ID, Quantidade: quantidade }
            t.add(data)
            .success(function (response) {
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
                $rootScope.loading = false
            });

            return def.promise;
        },


     
    }
};

CarrinhoFacade.$inject = ['$q', '$rootScope', '$http', '$cookieStore', 'global'];