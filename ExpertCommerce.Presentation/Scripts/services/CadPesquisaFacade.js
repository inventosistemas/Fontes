var CadPesquisaFacade = function ($q, $http, global, $filter) {
    var preferencia;
    var origemcliente;
    return {
        passo1: function (data) {
           
            var tempdata = angular.copy(data);
            
            var tempdate = tempdata.DataNascimento.split("/");
            var f = new Date(tempdate[2], tempdate[1] - 1, tempdate[0]);
            tempdata.DataNascimento = $filter('date')(f, "yyyy-MM-ddTHH:mm:ss");
          
            //return $http.post(global.apis.expert.domain('v1') + global.apis.expert.cadpesquisa.passo1, tempdata, { headers: { "Content-type": "application/json" } });
            return $http.post(global.apis.expert.domain('v1') + global.apis.expert.cadastro.passo12, tempdata, { headers: { "Content-type": "application/json" } });
        },
        preferencia: function () {

            if (preferencia == undefined)
                preferencia = $http.get(global.apis.expert.domain('v1') + global.apis.expert.cadpesquisa.preferencia);

            return preferencia;
        },

        buscabyce: function (data) {
            return $http.get(global.apis.expert.domain('v1') + global.apis.expert.cadpesquisa.buscabyce.replace('{CPF_EMAIL}', data));
        },
        buscabyid: function (data) {
            return $http.get(global.apis.expert.domain('v1') + global.apis.expert.cadpesquisa.buscabyid.replace('{parceiroID}', data));
        },
 
        alterausuario: function (data) {
           
            var tempdata = angular.copy(data);
            
            var tempdate = tempdata.DataNascimento.split("/");
            var f = new Date(tempdate[2], tempdate[1] - 1, tempdate[0]);
            tempdata.DataNascimento = $filter('date')(f, "yyyy-MM-ddTHH:mm:ss");
         
           
            return $http.post(global.apis.expert.domain('v1') + global.apis.expert.cadpesquisa.alterausuario, tempdata, { headers: { "Content-type": "application/json" } });
        },
        origemcliente: function (data) {

            if (origemcliente == undefined)
                origemcliente = $http.get(global.apis.expert.domain('v1') + global.apis.expert.cadpesquisa.origemcliente);

            return origemcliente;
        },
        
       
    }
};
CadPesquisaFacade.$inject = ['$q', '$http', 'global', '$filter'];