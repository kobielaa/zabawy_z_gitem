if (typeof $ == 'undefined') {
    var $ = jQuery;
}
// // refresh one time login link after use it

//purchaser site
$(document).ready(function () {
    $('#sso-links-wrapper .card').each(function () {
        $(this).click(function (e) {
            getLoginLinkforUpload($(this));

        });
        $(this).mousedown(function (e) {
            if (e.which == 2) {
                getLoginLinkforUpload($(this));
            }
        });
    });
});

//orders site

$(document).on('click', '#orders-table .sso-link', function (e) {
    getLoginLinkforOrder($(this));
});
$(document).on('mousedown', '#orders-table .sso-link', function (e) {
    if (e.which == 2) {
        getLoginLinkforOrder($(this));
    }
});

function getLoginLinkforOrder(sender) {
    var newTab = window.open('', '_blank');
    $.ajax({
        url: window.location.href + '/url.get.json?' + 'purchaser=' + sender.data('purchaser'),
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        success: function (data) {
            var url = data[0];
            url = url + '?destination=supplier/view/order/' + sender.data('id');
            newTab.location.href = url;
        }

    });
}

function getLoginLinkforUpload(sender) {
    var newTab = window.open('', '_blank');
    $.ajax({
        url: window.location.href + '/url.get.json?' + 'purchaser=' + sender.data('purchaser'),
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        success: function (data, status, xhr) {
            var url = data[0];
            newTab.location.href = url;
        }
    });
}