var HomeController = function ($state, $scope, $timeout, $rootScope, $cookieStore, GeneralFacade, $http, ngDialog, $sce, CarrinhoFacade, $q) {

  
   
    $scope.quantidade = 1;
    $scope.$on('$viewContentLoaded', function ($q) {

        GeneralFacade.banners()
        .success(function (response) {
            $scope.banners = response[0].BannerItens;

           
            
              
            


            //$timeout(function () {
            //    $('.homeslider').owlCarousel({
            //        center: true,
            //        items: 1,
            //        margin: 10,
            //        //autoplay: true,
            //        //autoplayTimeout: 5000,
            //        //autoplayHoverPause: true,
            //        loop: true

            //    });


            //}, 0);

        })
        .error(function (response) {

        })
        .finally(function () {


            /*vitrine*/
            $rootScope.loading = true;

            GeneralFacade.promo()
                .success(function (response) {
                 

                    $scope.promocoes = response[0].Itens;

                   
                })
           .error(function (response) {
           })
           .finally(function () {
           });

            GeneralFacade.cortes()
              .success(function (response) {
                  

                  $scope.cortes = response[0].Itens;
                 
              })
         .error(function (response) {
         })
         .finally(function () {
         });

            GeneralFacade.emporios()
              .success(function (response) {
                 

                  $scope.emporios = response[0].Itens;
                 
              })
         .error(function (response) {
         })
         .finally(function () {
         });
            
            GeneralFacade.vitrine(4)
            .success(function (response) {
                $scope.vitrine = response;
            })
            .error(function (response) {
                $rootScope.loading = false;
            })
            .finally(function () {
                window.setTimeout(function () {
                    AlinharMenuDesk();
                    window.onresize = tipoTela;
                    window.onresize = AlinharMenuDesk;
                    $('.loop').owlCarousel({
                        stagePadding: 10,
                        center: false,
                        items: 1,
                        loop: true,
                        autoWidth: true
                    });
                }, 1500);
                $('html, body').animate({
                    scrollTop: 0
                }, 500, 'linear');
                $rootScope.loading = false;
            });
            AtualizaSite()
        });
    });

    $scope.adicionarCarrinhoProd = function (data, quantidade) {

      
        var idcarrinho = $rootScope.credentials.isAuthorized ? $rootScope.credentials.carrinhoId : $rootScope.temp.credentials.carrinhoId;
    
        var response = { CarrinhoID: idcarrinho, SkuID: 1, Quantidade: quantidade };
       

        GeneralFacade.pegaProduto(data)
         .success(function (response) {
             var busca = response;
             $rootScope.loading = true;
            

             var sku = busca.Skus[0].ID

             var idcarrinho2 = $rootScope.credentials.isAuthorized ? $rootScope.credentials.carrinhoId : $rootScope.temp.credentials.carrinhoId;

             var response = { CarrinhoID: idcarrinho2, SkuID: sku, Quantidade: quantidade }


             $http.post('https://webapi.feed.com.br/v1/carrinho/item/adicionaritem', response, { headers: { "Content-type": "application/json" } })
             //$http.post('http://hom.feed.com.br:8091/v1/carrinho/item/adicionaritem', response, { headers: { "Content-type": "application/json" } })
                       .success(function (response) {

                           if (!response.Erro) {
                               if ($rootScope.credentials.isAuthorized) {
                                   $rootScope.credentials.carrinhoId = response.Dados.CarrinhoID;
                                   $cookieStore.put('auth', $rootScope.credentials);
                               } else {
                                   $rootScope.temp.credentials.carrinhoId = response.Dados.CarrinhoID;
                                   $cookieStore.put('tempauth', $rootScope.temp.credentials);
                               }

                               //inserir o auth no cookie

                               //def.resolve();
                           }


                       })
                 .error(function (response) {

                 })
                 .finally(function () {
                     $rootScope.loading = false;

                 });

            
         })
         .error(function (response) {
         })
         .finally(function () {



         })






    }

    $scope.adicionarCarrinho = function (data) {
      
        $rootScope.loading = true;
        var idcarrinho = $rootScope.credentials.isAuthorized ? $rootScope.credentials.carrinhoId : $rootScope.temp.credentials.carrinhoId;
       
        var response = { CarrinhoID: idcarrinho, SkuID: data.Skus[0].ID, Quantidade: '1' }


        $http.post('https://webapi.feed.com.br/v1/carrinho/item/adicionaritem', response, { headers: { "Content-type": "application/json" } })
                  .success(function (response) {
                      
                      if (!response.Erro) {
                          if ($rootScope.credentials.isAuthorized) {
                              $rootScope.credentials.carrinhoId = response.Dados.CarrinhoID;
                              $cookieStore.put('auth', $rootScope.credentials);
                          } else {
                              $rootScope.temp.credentials.carrinhoId = response.Dados.CarrinhoID;
                              $cookieStore.put('tempauth', $rootScope.temp.credentials);
                          }

                          //inserir o auth no cookie

                          //def.resolve();
                      }
                      

                  })
            .error(function (response) {
                
            })
            .finally(function () {
                $rootScope.loading = false;
               
            });





        // return def.promise;

    }
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
                   $scope.newsletter.Email = "";

               } else {
                   $scope.expmodal = { title: 'Ops!', message: 'Esse email já está em nosso mailing!', classandtype: 'ngdialog-theme-plain success', controller: 'ModalController' }
                   $scope.newsletter.Email = "";


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


    $scope.submitModal = function (idss) {


       
        $scope.prodid = idss;

        /*breadcrumb*/
        GeneralFacade.detalheProduto($scope.prodid)

            .success(function (response) {

                //.ProdutoTipo.Descricao
               $rootScope.loading = true;
                $scope.breadcrumb = response;
                /*produtos*/
                GeneralFacade.pegaProduto($scope.prodid)
                .success(function (response) {
                   
                    if (response.SubCategoria) {

                        //$sce.trustAsHtml();
                       
                     
                        $scope.produtos = response.Itens;

                      
                        $scope.expmodal = {
                            title: response.Descricao,
                            //desc: $scope.descricaotipoproduto,
                            corte: response.SubCategoria.Descricao,
                            peso: response.Skus[0].Peso,
                            preco: response.PrecoVigente,
                            Imagem: response.ImagemMobile,
                            Id: response.ID,
                            descRes: response.DescricaoResumida
                            
                        }



                        //angular.forEach(response.Itens, function (value, key) {
                        //    if (value.Produto.ID == $scope.prodid)
                        //        $scope.selecionado = value.Produto;
                        //});


                    } else {
                        $state.go('home');
                    }

                })
                .error(function (response) {
                })
                .finally(function () {
                });
            })
            .error(function (response) {
            })
            .finally(function () {
                $rootScope.loading = false;
            });




    };


  



}

HomeController.$inject = ['$state', '$scope', '$timeout', '$rootScope', '$cookieStore', 'GeneralFacade', '$http', 'ngDialog', 'CarrinhoFacade', '$q'];