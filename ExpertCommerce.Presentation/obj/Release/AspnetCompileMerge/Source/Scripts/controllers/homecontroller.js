var HomeController = function ($state, $scope, $timeout, $rootScope, $cookieStore, GeneralFacade, $http, ngDialog) {
    $scope.$on('$viewContentLoaded', function () {
        GeneralFacade.banners()
        .success(function (response) {
            $scope.banners = response[0].BannerItens;
            console.log($scope.banners);
            $timeout(function () {
                $('.homeslider').owlCarousel({
                    items: 1,
                    margin: 10,
                    autoplay: true,
                    autoplayTimeout: 5000,
                    //autoplayHoverPause: true,
                    loop:true
                });
            }, 0);
        })
        .error(function (response) {
        })
        .finally(function () {
            /*vitrine*/
            $rootScope.loading = true;
            GeneralFacade.vitrine(4)
            .success(function (response) {
                $scope.vitrine = response;
            })
            .error(function (response) {
            })
            .finally(function () {
                $rootScope.loading = false;
            });
        });
    });

    $scope.submitNewsletter = function (isValid) {
        if (isValid) {
            $rootScope.loading = true;
            var data = {
                "Nome": null,
                "Email": $scope.newsletter.Email.toString().toLowerCase()
            }
            GeneralFacade.newsletter(data)
           .success(function (response) {
               if (response) {
                   $scope.expmodal = { title: 'Obrigado!', message: 'Newsletter cadastrado com sucesso!', classandtype: 'ngdialog-theme-plain success', controller: 'ModalController' }
               } else {
                   $scope.expmodal = { title: 'Ops!', message: 'Esse email já está em nosso mailing!', classandtype: 'ngdialog-theme-plain success', controller: 'ModalController' }
               }

               ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
           })
           .error(function (response) {
               $scope.expmodal = { title: 'Ops!', message: 'Ocorreu um erro ao tentar cadastrar seu email!', classandtype: 'ngdialog-theme-plain error', controller: 'ModalController' }
               ngDialog.open({ controller: $scope.expmodal.controller, className: $scope.expmodal.classandtype, scope: $scope });
           })
           .finally(function (response) {
               $rootScope.loading = false;
           });
        }
    };
}

HomeController.$inject = ['$state', '$scope', '$timeout', '$rootScope', '$cookieStore', 'GeneralFacade', '$http', 'ngDialog'];