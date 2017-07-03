var HotsiteFacade = function ($q, $http, global) {
    var page;

    return {
        getum: function () {
            if (page == undefined)
              
            page = $http.get(global.apis.expert.domain('v1') + global.apis.expert.hotsite.getum.replace('{codigoExterno}', 'paginaum'));
            return page;
        }
    }
};
HotsiteFacade.$inject = ['$q', '$http', 'global'];