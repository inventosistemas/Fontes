var CadastroFacade = function ($q, $http, global, $filter) {
    return {
        passo1: function (data) {
            var tempdata = angular.copy(data);
            var tempdate = tempdata.DataNascimento.split("/");
            var f = new Date(tempdate[2], tempdate[1] - 1, tempdate[0]);
            tempdata.DataNascimento = $filter('date')(f, "yyyy-MM-ddTHH:mm:ssZ");
            return $http.post(global.apis.expert.domain('v1') + global.apis.expert.cadastro.passo1, tempdata, { headers: { "Content-type": "application/json" } });
        }
    }
};
CadastroFacade.$inject = ['$q', '$http', 'global', '$filter'];