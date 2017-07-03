
var altura = document.getElementById('main').offsetWidth;

var tam = $(window).width();
tipoTela();
AlinharMenuDesk();
window.onresize = tipoTela;
window.onresize = AlinharMenuDesk;



function AlinharMenuDesk() {
    altura = document.getElementById('main').offsetWidth;
    tam = $(window).width();



    $('.barra-nav').css("margin-left", 0 + 'px');
    $('.barra-nav').css("margin-left", ((tam - altura) / 2) + 'px');

    $('.barra-nav-carrinho').css("margin-left", 0 + 'px');
    $('.barra-nav-carrinho').css("margin-right", ((tam - altura) / 2) + 'px');



}




function tipoTela() {
    if (tam >= 1024) {

        $(".menu-anchor").click(function() {
            $("html").toggleClass('menu-ativo');
        });

        $(".menu-abrir-carrinho").click(function() {
            $("html").toggleClass('menu-ativo-carrinho');
        });
        $(".menu-fechar-carrinho").click(function() {
            $("html").toggleClass('menu-ativo-carrinho');

        });
        $(".menu-fechar").click(function() {
            $("html").toggleClass('menu-ativo');

        });


        document.documentElement.onclick = function(event) {
            if (event.target === document.documentElement) {
                document.documentElement.classList.remove('menu-ativo-carrinho');
                document.documentElement.classList.remove('menu-ativo');
            }

        };

    } else {

        $("#MenuCelular").addClass('MenuCelular')
        $(document).ready(function() {
            $('.menu-anchor').on('click touchstart', function(e) {
                $('html').toggleClass('menu-active');
                e.preventDefault();
            });
        })
        // $("#verticalMenu").hide();
    }
}





$(function() {
    var nav = $('#menuHeader');
    $(window).scroll(function() {
        if ($(this).scrollTop() > 150) {
            $("#barra-nav").addClass("baixarCarEMenu");
            nav.addClass("menuFixo");
            nav.removeClass("escondeMenuFixo");
            nav.addClass("main");



        } else {
            $("#barra-nav").removeClass("baixarCarEMenu");
            nav.removeClass("menuFixo");
            nav.addClass("escondeMenuFixo");
            nav.removeClass("main");
        }
    });
});
// nav.removeClass("main");
//  nav.addClass("main");



$("li.fade").hover(function() {
    $(this).fadeOut(100);
    $(this).fadeIn(500);
});

function abrir(a) {

    $('#aparecev' + a).css("display", "");
    $('#apareceb' + a).css("display", "");

}




function sair(a) {


    $('#aparecev' + a).css("display", "none");
    $('#apareceb' + a).css("display", "none");

}

$("div.produtoHome")
    .mouseover(function() {
        var $elementoPai = $(this).parent();

        var id = $elementoPai.find('[id="idBotao"]').attr("id");



    })
    .mouseout(function() {

    });
