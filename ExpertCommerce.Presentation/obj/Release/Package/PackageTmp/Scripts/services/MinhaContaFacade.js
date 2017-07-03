var MinhaContaFacade = function ($q, $http, $cookieStore, global) {
    var pedidolist;

    return {
        pedidos:{
            list: function (data) {
                if (pedidolist == undefined)
                    pedidolist = $http.get(global.apis.expert.domain('v1') + global.apis.expert.minhaconta.pedidos.list.replace('{id}', data));
                return pedidolist;
            },
            detail: function (data) {
                return $http.get(global.apis.expert.domain('v1') + global.apis.expert.minhaconta.pedidos.detail.replace('{id}', data));
            }
        },
        cadastro:{
            get: function (data) {
               
              
                return $http.get(global.apis.expert.domain('v1') + global.apis.expert.minhaconta.cadastro.get.replace('{id}', data));
            },
            update: function (data) {
               
             
                return $http.put(global.apis.expert.domain('v1') + global.apis.expert.minhaconta.cadastro.update, data, { headers: { "Content-type": "application/json" } });
            }
        },
        enderecos:{
            list: function (data) {
                return $http.get(global.apis.expert.domain('v1') + global.apis.expert.minhaconta.enderecos.list.replace('{id}', data));
            },
            bycep: function (data) {
               
                return $http.get(global.apis.expert.domain('v1') + global.apis.expert.minhaconta.enderecos.bycep.replace('{id}', data));
            },
            insert: function (data) {
                
                return $http.post(global.apis.expert.domain('v1') + global.apis.expert.minhaconta.enderecos.insert, data, { headers: { "Content-type": "application/json" } });
            },
            remove: function (data) {
                return $http.delete(global.apis.expert.domain('v1') + global.apis.expert.minhaconta.enderecos.remove.replace('{id}', data));
            },
            setdefault: function (data) {
                return $http.put(global.apis.expert.domain('v1') + global.apis.expert.minhaconta.enderecos.setdefault.replace('{id}', data));
            }
        }
    }
};

MinhaContaFacade.$inject = ['$q', '$http', '$cookieStore', 'global'];