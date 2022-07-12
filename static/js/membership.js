$(document).ready(function () {

    $('#membership').on('click', function () {
        $('#membership-popup').fadeIn(500);
    });

    $('.close-button').on('click', function () {
        $('#membership-popup').fadeOut(500);
    });

    $('#id_check').on('click', function () {
        $('#membership-popup').fadeIn(500);
    });

});