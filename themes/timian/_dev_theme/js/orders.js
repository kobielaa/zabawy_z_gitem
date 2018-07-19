if (typeof $ == 'undefined') {
    var $ = jQuery;
}
$(document).ready(function () {


    var dataTable = require('datatables.net');
    require('datatables.net-buttons');
    require('datatables.net-responsive');
    $.DataTable = dataTable;

//action on inputs at order page
    $('.select-multiple').select2({
        placeholder: Drupal.t("Click to choose"),
        height: '100%',
        width: '100%',
    });
    $('.date-picker').datepicker({
        format: 'dd-mm-yyyy'
    });

    /* Custom filtering function which will search data in column */
    if (!isEmpty($('#orders-table'))) {
        $.fn.dataTable.ext.search.push(
            function (settings, data, dataIndex) {

                //  dates
                var startDate = $('#start-date').val();
                var endDate = $('#end-date').val();
                var startTimestamp = new Date(startDate.substring(6, 10),  startDate.substring(3, 5),startDate.substring(0, 2)).getTime() / 1000;
                var startTimestamp = (startTimestamp > 0 ? startTimestamp : 0);
                var endTimestamp = new Date(endDate.substring(6, 10), endDate.substring(3, 5), endDate.substring(0, 2)).getTime() / 1000;
                var endTimestamp = (endTimestamp > 0 ? endTimestamp : 0);
                var columnTimestamps = new Date(data[4].substring(6, 10), data[4].substring(3, 5), data[4].substring(0, 2)).getTime() / 1000 || 0;

                //statuses
                var selectedStatuses = [];
                var li = $('.select2-selection__rendered')[1].children;
                for (i = 0; i < li.length - 1; i++) {
                    selectedStatuses.push(li[i].getAttribute('title'));
                }
                var flag = false;
                for (j = 0; j < selectedStatuses.length; j++) {
                    if (data[6].indexOf(selectedStatuses[j]) > -1) {
                        flag = true;
                    }
                }


                // purchasers
                var selectedPurchasers = [];
                var liPurchasers = $('.select2-selection__rendered')[0].children;
                for (i = 0; i < liPurchasers.length - 1; i++) {
                    var purchaserTrimed = liPurchasers[i].getAttribute('title').replace(/\s/g, '').toLowerCase();
                    selectedPurchasers.push(purchaserTrimed);
                }
                var flagPurchasers = false;
                for (k = 0; k < selectedPurchasers.length; k++) {
                    if (data[1].indexOf(selectedPurchasers[k]) > -1) {
                        flagPurchasers = true;
                    }
                }

                if (((startTimestamp == 0 && endTimestamp == 0) ||
                    (startTimestamp <= columnTimestamps && columnTimestamps <= endTimestamp) ||
                    (startTimestamp <= columnTimestamps && endTimestamp == 0) ||
                    (startTimestamp == 0 && columnTimestamps <= endTimestamp)) &&
                    (flag || selectedStatuses.length == 0) && (flagPurchasers || selectedPurchasers.length == 0)
                ) {
                    return true;
                }
                return false;
            }
        );
    }

// application of DataTable library
    var table = $('#orders-table').DataTable({
        dom: 'Brtip',
        buttons: [
            {
                text: '<i class="fa fa-file-excel-o"></i> Export as excel',
                extend: 'excelHtml5',
                title: 'Orders_export',
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6, 9]
                }
            },
            {
                text: '<i class="fa fa-file-pdf-o"></i> Export as pdf',
                extend: 'pdfHtml5',
                title: 'Orders_export',
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6, 7]
                }
            },
        ],
        columnDefs: [
            { "type": "formatted-num", targets: 7 },
            { "type": "date-euro", targets: 3 },
            { "type": "date-euro", targets: 4 },
        ]
    });

    function isEmpty(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }
        return true;
    }

    function animateTable() {
        var rows = $('.render-table tbody tr');
        rows.removeClass("animate");
        var counter = 0;

        var intervalID = setInterval(
            function () {
                $(rows[counter]).addClass("animate");
                counter++;
                if (counter === rows.length) {
                    window.clearInterval(intervalID);
                }
            }, 100);
    }

// Event listener to the two range filtering inputs to redraw on input
// if (!isEmpty($('#orders-table'))) {
    $('#start-date, #end-date').on('keyup change', function () {
        table.draw();
        animateTable();
        highlightOrders();
    });
    $('#select-status').on('change', function () {
        table.draw();
        animateTable();
        highlightOrders();
    });
    $('#timian-orders-settings-form #purchasers-list').on('change', function () {
        table.draw();
        animateTable();
        highlightOrders();
    });
    $('#orders-for-review').on('change', function () {
        table.draw();
        animateTable();
        highlightOrders();
    });
    $(document).on('click', '.paginate_button', function ( event ) {
        animateTable();
        highlightOrders();
    })
    
    $(document).on('change', '.bottom select', function ( event ) {
        animateTable();
        highlightOrders();
    })
    $(document).on('click', 'thead th', function ( event ) {
        animateTable();
        highlightOrders();
    })
// }


// select all purchasers
    $("#all-purchasers-orders").click(function () {
        if ($("#all-purchasers-orders").is(':checked')) {
            $("#purchasers-list > option").prop("selected", "selected");
            $("#purchasers-list").trigger("change");
        } else {
            $("#purchasers-list > option:selected").prop("selected", false);
            $("#purchasers-list").trigger("change");
        }
    });

    //highlight orders for review
    function highlightOrders(){
        var orders = $('#orders-table tbody td');
        for (i = 0; i < orders.length; i++) {
            if (orders[i].innerHTML == 'for_review') {
                orders[i].parentElement.classList.add("for-review");
            }
        }
    }
    animateTable();
    highlightOrders();

})