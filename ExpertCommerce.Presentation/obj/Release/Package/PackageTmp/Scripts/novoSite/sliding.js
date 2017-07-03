var carousel;

$(document).ready(function() {

    carousel = $("#scrolling ul");

    carousel.itemslide({
        swipe_out: false //NOTE: REMOVE THIS OPTION IF YOU WANT TO DISABLE THE SWIPING SLIDES OUT FEATURE.
    }); //initialize itemslide


    $(window).resize(function() {
        carousel.reload();
    }); //Recalculate width and center positions and sizes when window is resized



    /* Below are some examples */




    /*
    //acionado quando item ativo atual foi alterado
    carousel.on('changeActiveIndex', function(event) {
        console.log("changeActiveIndex OCCURED!!");
    });
    */

    /*
    //acionado quando posição do carrossel mudou
    carousel.on('changePos', function(event) {
        console.log("new pos: "+ carousel.getCurrentPos());
    });
    */

    /*
    carousel.on('swipeout', function(event) {
        console.log("swiped out slide - " + event.slide);
    });
    */

    /*
    carousel.on('clickSlide', function(event) {
        console.log("Tapped tapped slide index " + event.slide + " Current Active Index: " + carousel.getActiveIndex());
    });
    */

    /*
    // Exemplo de ajuste do índice atual ativo como arrastar
    carousel.on('changePos', function(event) {
        var currentIndex = carousel.getIndexByPosition(carousel.getCurrentPos());
        console.log("dragging active index: "+ currentIndex);
        carousel.children().removeClass('itemslide-currently-active');
        carousel.children(':nth-child(' + ((currentIndex + 1) || 0) + ')').addClass('itemslide-currently-active');
    });
    */

});