var AuthFacade = function ($q, $http, $rootScope, $cookieStore, global, CarrinhoFacade) {
    return {
        gettoken: function (data) {
            return $http.post(global.apis.expert.domain(null) + global.apis.expert.auth.gettoken, data);
        },
        getuser: function (data) {
            return $http.get(global.apis.expert.domain('v1') + global.apis.expert.auth.getuser, data);
        },
        esqueci:{
            enviaemail: function (data) {
                return $http.put(global.apis.expert.domain('v1') + global.apis.expert.auth.esqueci.enviaemail.replace('{email}', data));
            },
            valida: function (data) {
                return $http.get(global.apis.expert.domain('v1') + global.apis.expert.auth.esqueci.valida.replace('{lid}', data.loginid).replace('{tid}', data.token));
            },
            alterar: function (data) {
                return $http.put(global.apis.expert.domain('v1') + global.apis.expert.auth.esqueci.alterar, data, { headers: { "Content-type": "application/json" } });
            }
        },
        login: function (username, password, idcarrinho) {
           
            var t = this;
            var data = "grant_type=password&UserName=" + username + "&Password=" + password
            var deferred = $q.defer();
            $rootScope.loading = true;

            /*gettoken*/
            t.gettoken(data)
            .success(function (response) {
                var access_token = response.access_token;
                $http.defaults.headers.common["Authorization"] = 'bearer ' + access_token;

                /*getuser*/
                t.getuser(data)
                .success(function (response) {
                   
                    if (idcarrinho != null && idcarrinho != 0) {
                        var data = { CarrinhoID: idcarrinho, LoginID: response.ID }
                        CarrinhoFacade.cartlink(data)
                        .success(function (response) {
                            deferred.resolve();
                        })
                        .error(function (response) {
                            deferred.reject(response.Message);
                        })
                        .finally(function () {
                        });
                    } else {
                        idcarrinho = response.CarrinhoId;
                        deferred.resolve();
                    }

                    $rootScope.NomeLogado = response.Parceiro.RazaoSocial;
                    $rootScope.credentials = {
                        isAuthorized: true,
                        userId: response.ID,
                        partnerId: response.Parceiro.ID,
                        userName: response.Parceiro.RazaoSocial,
                        userMail: response.Email,
                        carrinhoId: idcarrinho,
                        access_token: access_token
                    };
                    $cookieStore.put('auth', $rootScope.credentials);
                })
                .error(function (response) {
                    deferred.reject(response.Message);
                })
                .finally(function () {
                    
                });

            })
            .error(function (response) {
                //$rootScope.usernotfound = true;
                deferred.reject(response.Message);
            })
            .finally(function () {
                $rootScope.loading = false;
            });

            return deferred.promise;
        },
        logout: function () {
            
            $cookieStore.remove('auth');
        }
    }
};
AuthFacade.$inject = ['$q', '$http', '$rootScope', '$cookieStore', 'global', 'CarrinhoFacade'];