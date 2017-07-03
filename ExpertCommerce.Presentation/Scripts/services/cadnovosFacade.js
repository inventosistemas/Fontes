var EmporioFacade = function ($q, $http, global) {

    var maisvendidos;
    var tiposdecorte;
    var filtroemporio;

    return {
        maisvendidos: function () {

            if (maisvendidos == undefined)
                maisvendidos = $http.get(global.apis.expert.domain('v1') + global.apis.expert.emporio.maisvendidos);

            return maisvendidos;
        },
        tiposdecorte: function () {

            if (tiposdecorte == undefined)
                tiposdecorte = $http.get(global.apis.expert.domain('v1') + global.apis.expert.emporio.tiposdecorte);
            return tiposdecorte;
        },
        filtroemporio: function () {

            if (filtroemporio == undefined)
              
                filtroemporio = $http.get(global.apis.expert.domain('v1') + global.apis.expert.emporio.filtroemporio);
           
            return filtroemporio;
        },

        produtosporcorte: function (data) {
            console.log(data)
            return $http.post(global.apis.expert.domain('v1') + "/produto/getbycaracteristica", data, { headers: { "Content-type": "application/json" } });

            //return $http.get(global.apis.expert.domain('v1') + global.apis.expert.cortes.produtosporcorte.replace('{id}', data));
        },
    }
};
EmporioFacade.$inject = ['$q', '$http', 'global'];