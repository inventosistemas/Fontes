var ProdutoFacade = function ($q, $http, global) {
    return {
        breadcrumb: function (data) {
            
            return $http.get(global.apis.expert.domain('v1') + global.apis.expert.produto.breadcrumb.replace('{id}', data));
            
        },
        agrupamento: function (data) {
       
            return $http.get(global.apis.expert.domain('v1') + global.apis.expert.produto.agrupamento.replace('{id}', data));
        },
        pegaproduto: function (data) {
         
            return $http.get(global.apis.expert.domain('v1') + global.apis.expert.produto.pegaproduto.replace('{id}', data));
        },
        relacionados: function (data) {
            return $http.get(global.apis.expert.domain('v1') + global.apis.expert.produto.relacionados.replace('{id}', data));
        },
        aviseme: function (data) {
            return $http.post(global.apis.expert.domain('v1') + global.apis.expert.produto.aviseme, data, { headers: { "Content-type": "application/json" } });
        }
    }
};

ProdutoFacade.$inject = ['$q', '$http', 'global'];