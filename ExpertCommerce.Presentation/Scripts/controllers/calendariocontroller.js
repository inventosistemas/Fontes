var CalendarioController = function ($state, $scope, $rootScope) {
    $scope.initcalendario = function (hoje, mostrarmes) {
        var date;
        if (hoje != undefined && hoje != ''){
            date = new Date(hoje.split('/')[2], parseInt(hoje.split('/')[1] - 1), hoje.split('/')[0]);
        }else{
            date = new Date();
        }

        var futuredate = new Date(hoje.split('/')[2], parseInt(hoje.split('/')[1] - 1), hoje.split('/')[0]);

        if (mostrarmes != undefined) {
           
            //fix mes
            var futuredate_ano = mostrarmes.split('/')[1];
            var futuredate_mes_fix = mostrarmes.split('/')[0]; //aplicar regra de negocio aqui se necessario
            var futuredate_mes = parseInt(futuredate_mes_fix - 1);
            var futuredate_day;
            //checa se é o mesmo mes e pega o dia - senao dia 01
            if (futuredate_mes == date.getMonth()) {
                futuredate_day = date.getDate();
            }else{
                futuredate_day = 01;
            }
            //mostra mês específico
            futuredate = new Date(futuredate_ano, futuredate_mes, futuredate_day);
            
        } else {
            //verifica se é último dia do mês
            var hojeverificar = date.getDate();
            var totaldias = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

            if (hojeverificar == totaldias) {
                var ano = hoje.split('/')[2];
                var mes = hoje.split('/')[1];

                if (mes == 12) {
                    mes = 1;
                    ano++;
                } else {
                    mes++;
                }

                futuredate = new Date(ano, mes - 1, 01);
            }
        }

        $scope.calendarioData = {
            mesesNoAno: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
            diasNaSemana: ["Domingo", "Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado"],
            hoje: {
                ano: date.getFullYear(),
                mes: {
                    id: null,
                    nome: null
                },
                dia: date.getDate()
            },
            mostrar: {
                ano: futuredate.getFullYear(),
                mes: {
                    id: null,
                    nome: null
                },
                dia: futuredate.getDate()
            }
        }

        //configura mostrador
        $scope.calendarioData.hoje.mes.id = date.getMonth();
        $scope.calendarioData.hoje.mes.nome = $scope.calendarioData.mesesNoAno[$scope.calendarioData.hoje.mes.id];
        $scope.calendarioData.mostrar.mes.id = futuredate.getMonth();
        $scope.calendarioData.mostrar.mes.nome = $scope.calendarioData.mesesNoAno[$scope.calendarioData.mostrar.mes.id];
        $scope.calendario = { dias: new Array() }

        //cria dias do mês
        for (var i = 1; i <= new Date($scope.calendarioData.mostrar.ano, $scope.calendarioData.mostrar.mes.id + 1, 0).getDate() ; i++) {
            //pega dias que tem no mes atual - 0 representa ultimo dia do mês anterior, por isso o mês + 1.
            var datedia = new Date($scope.calendarioData.mostrar.ano, $scope.calendarioData.mostrar.mes.id, i);
            var stringsemana = $scope.calendarioData.diasNaSemana[datedia.getDay()];
            var dia = {
                id: i,
                diadasemana: stringsemana,
                formatodata: $scope.calendarioData.mostrar.ano + '-' + ($scope.calendarioData.mostrar.mes.id +1 )+ '-' + i + 'T00:00:00'
            }
            
            //preenche os dias do mês anteriores ao dia 1º
            if (i == 1) {
                for (d = 0; d < $scope.calendarioData.diasNaSemana.indexOf(stringsemana) ; d++) {
                    var diavazio = { id: " ", diadasemana: $scope.calendarioData.diasNaSemana[d] }
                    $scope.calendario.dias.push(diavazio);
                }
            }

            if (i - 1 == $scope.calendarioData.hoje.dia) {
                //$scope.setDiaCalendario(dia);
            }

            $scope.calendario.dias.push(dia);
        }
    }

    $scope.setDiaCalendario = function (dia) {
        $('.each-month-day.selected').removeClass('selected');
        $('#' + dia.id).addClass('selected');
        $scope.$parent.$parent.RecalculaFreteProgramacao(dia.formatodata);
    }

    $scope.proximoMes = function () {
        var mes = parseInt($scope.calendarioData.mostrar.mes.id + 2);
        var ano = $scope.calendarioData.mostrar.ano;
        $scope.initcalendario('', mes + '/' + ano);
    }

    $scope.mesAnterior = function () {
        var mes = parseInt($scope.calendarioData.mostrar.mes.id);
        var ano = $scope.calendarioData.mostrar.ano;
        $scope.initcalendario('', mes + '/' + ano);
    }
}
CalendarioController.$inject = ['$state', '$scope', '$timeout', '$rootScope', '$stateParams', 'GeneralFacade', 'ngDialog'];