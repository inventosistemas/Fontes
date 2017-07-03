var CortesFacade = function ($q, $http, global) {
    var maisvendidos;
    var tiposdecorte;
    var filtrocortes;

    return {
        maisvendidos: function () {

            if (maisvendidos == undefined)
                maisvendidos = $http.get(global.apis.expert.domain('v1') + global.apis.expert.cortes.maisvendidos);

            return maisvendidos;
        },
        tiposdecorte: function () {

            if (tiposdecorte == undefined)
                tiposdecorte = $http.get(global.apis.expert.domain('v1') + global.apis.expert.cortes.tiposdecorte);

            return tiposdecorte;
        },
        filtrocortes: function () {

            if (filtrocortes == undefined)
                filtrocortes = $http.get(global.apis.expert.domain('v1') + global.apis.expert.cortes.filtrocortes);
          
            return filtrocortes;
        },

        produtosporcorte: function (data) {
         
            return $http.post(global.apis.expert.domain('v1') + "/produto/getbycaracteristica", data, { headers: { "Content-type": "application/json" } });

            //return $http.get(global.apis.expert.domain('v1') + global.apis.expert.cortes.produtosporcorte.replace('{id}', data));
        },

    }
};
CortesFacade.$inject = ['$q', '$http', 'global'];