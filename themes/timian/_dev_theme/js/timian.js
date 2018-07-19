if (typeof $ == 'undefined') {
    var $ = jQuery;
}
// adding class to drupal status messages
$('div[aria-label="Status message"]')
    .addClass("alert alert-success alert-dismissible fade show")
    .append("<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>");

$('div[aria-label="Error message"]')
    .addClass("alert alert-danger alert-dismissible fade show")
    .append("<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>");

$(document).ready(function () {
    //toggle burger icon
    $('.fa-times').on('click', function () {
        $(this).hide();
        $('.logo img').css("position", "relative");
        $('.nav.navbar-nav').animate({left: '-100%'}, 600);
        $('.fa-bars').show();
    })
    $('.fa-bars').on('click', function () {
        $('.nav.navbar-nav').animate({left: 0}, 600);
            $('.logo img').css("position", "fixed");

        setTimeout(function () {
            $('.fa-bars').hide();
            $('.fa-times').show();
            $('.orange-circle').show();
        }, 600);

    })

    $('.nav-item').on('click', function(){
        $('.loader-wrapper').show();
    })
    
    require('./animations.js');
    require('./upload.js');
    require('./orders.js');
    require('./timian_sso.js');
    require('./users.js');
    


});