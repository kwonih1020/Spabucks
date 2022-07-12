$(document).ready(function () {
    $('#log_in').on('click', function () {
        $('#sign-popup').fadeIn(500);
    });

    $('.close-button').on('click', function () {
        $('#sign-popup').fadeOut(500);
    });
});