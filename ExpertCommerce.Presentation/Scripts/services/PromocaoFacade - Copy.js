var PromocaoFacade = function ($q, $http, global) {
    var page;

    return {
        get: function () {
            if (page == undefined)
                page = $http.get(global.apis.expert.domain('v1') + global.apis.expert.promocao.getpromocao.replace('{codigoExterno}', 'campanha'));
            return page;
        }
    }
};
PromocaoFacade.$inject = ['$q', '$http', 'global'];