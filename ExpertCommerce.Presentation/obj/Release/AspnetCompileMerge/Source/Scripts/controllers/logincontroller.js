var LoginController = function ($state, $scope, $rootScope, ngDialog, $cookieStore, $http, AuthFacade, CarrinhoFacade) {
    $scope.login = {
        UserName: "",
        Password: ""
    };

    $scope.$watch('login.UserName', function () {
        if ($scope.login.UserName != undefined)
        $scope.login.UserName = $scope.login.UserName.toString().toLowerCase().replace(/\s+/g, '');
    });

    $scope.$watch('login.Password', function () {
        if ($scope.login.Password != undefined)
            $scope.login.Password = $scope.login.Password.toString().toLowerCase().replace(/\s+/g, '');
    });


    $scope.$on('$viewContentLoaded', function () {
        $scope.usernotfound = false;
        if ($state.current.name == 'carrinho.login' || $state.current.name == 'login')
            $rootScope.loading = false;
    });


    $scope.submitLogin = function (isValid, fromview) {
        if (isValid) {
            AuthFacade.login($scope.login.UserName, $scope.login.Password, $rootScope.temp.credentials.carrinhoId)
           .then(function () {
               console.log($state.current.name);
               if ($state.current.name == 'carrinho.login') {
                   $state.go("carrinho.produtos");
               } else if ($state.current.name == 'carrinho.produtos') {
                   $state.go($state.current, {}, { reload: true });
               } else {
                   $state.go("home");
               }
           }, function (reason) {
               $scope.usernotfound = true;
               if (fromview) {
                   $scope.expmodal = { title: 'Ops', message: 'E-mail ou senha não conferem', classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
                   ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
                   $rootScope.loading = false;
               }
           });
        }
    };

    $scope.MeCadastrar = function (isValid) {
        $rootScope.camefromstate = $state.current.name.toString();
        $state.go('cadastro.passo1')
    };

    $scope.logout = function () {
        $http.defaults.headers.common = {};
        $cookieStore.remove('auth');
        $rootScope.credentials = {
            isAuthorized: false,
            userId: null,
            partnerId: null,
            userName: null,
            carrinhoId: null,
            access_token: null
        };
        $state.go('home');
    };
}

LoginController.$inject = ['$state', '$scope', '$rootScope', 'ngDialog', '$cookieStore', '$http', 'AuthFacade', 'CarrinhoFacade'];


