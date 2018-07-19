if (typeof $ == 'undefined') {
    var $ = jQuery;
}
var dataTable = require('datatables.net');
require('datatables.net-buttons');
require('datatables.net-responsive');
$.DataTable = dataTable;

function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}

// adding progress bar based on status from table
if (!isEmpty($('#tu-files'))) {
    var rows = $('tr');
    // flaga dodawana aby dodawac headeer uploading files dla pierwszego upploadu
    var flag = true;
    for (i = 1; i < rows.length; i++) {
        if (rows[i].children[3].innerHTML == 'Running') {
            if (flag) {
                $('#progress-wrapper').append(
                    '<div class="form-tab"><h2>Uploding files ...</h2></div>' +
                    '<div class="desc_bar">' +
                    '<div class="left-texture">.</div>' +
                    '<div class="row padding-50 downloading">' +
                    '<div class="single-progress-wrapper">' +
                    '<p>Uploading products to databases from file: ' + rows[i].children[1].innerHTML + '</p>' +
                    '<div class="progress"><div ' + 'data-files="' + rows[i].children[4].innerHTML +
                    '" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75"  style="width:10%;" aria-valuemin="0" aria-valuemax="100"></div></div>' +
                    '</div></div></div>'
                );
                var flag = false;
            } else {
                $('#progress-wrapper').append(
                    '<div class="desc_bar">' +
                    '<div class="left-texture">.</div>' +
                    '<div class="row padding-50 downloading">' +
                    '<div class="single-progress-wrapper">' +
                    '<p>Uploading products to databases from file: ' + rows[i].children[1].innerHTML + '</p>' +
                    '<div class="progress"><div ' + 'data-files="' + rows[i].children[4].innerHTML +
                    '" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" style="width:10%;" aria-valuemin="0" aria-valuemax="100"></div></div>' +
                    '</div></div></div>'
                );
            }
        }
    }
}

setInterval(function () {
    var processing_files = $('#progress-wrapper .progress-bar');
    if (processing_files) {
        var getUrl = window.location;
        var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
        for (let i = 0; i < processing_files.length; i++) {
            var fid = processing_files[i].getAttribute("data-files");
            // request for progress to backend
            $.ajax({
                type: "GET",
                url: baseUrl + '/purchasers/progress/' + fid,
                success: function (data) {
                    var progress = JSON.stringify(data['progress']).replace('"', '').replace('"', '');
                    if (progress == '100') {
                        setTimeout(function () {
                            processing_files[i].innerHTML = '100%';
                            processing_files[i].setAttribute('aria-valuenow', progress);
                            processing_files[i].style.width = '100%';
                            $.ajax({
                                type: "GET",
                                url: baseUrl + '/purchasers/upload/finished/' + fid + "/1",
                                success: function (data) {
                                    //update status in history table
                                    var infoIcon = 'i[data-message="' + fid + '"]';
                                    var status = $(infoIcon).parent().parent().children()[3];
                                    status.innerHTML = "Finished";
                                    processing_files[i].parentNode.parentNode.innerHTML =
                                        '<div class="alert alert-success alert-dismissible fade show" role="alert">' +
                                        '<strong><h3>Well done</h3></strong><p><br>'
                                        + data['response'] +
                                        '</p>' +
                                        '<button type="button" class="close button-reload">' +
                                        '<span aria-hidden="true">&times;</span>' +
                                        '</button></div>';
                                }
                            });
                        }, 600)
                    }
                    else if (progress == 'Error') {
                        $.ajax({
                            type: "GET",
                            url: baseUrl + '/purchasers/upload/finished/' + fid + "/3",
                            success: function (data) {
                                //update status in history table
                                var infoIcon = 'i[data-message="' + fid + '"]';
                                var status = $(infoIcon).parent().parent().children()[3];
                                status.innerHTML = "Error";

                                processing_files[i].parentNode.parentNode.innerHTML =
                                    '<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
                                    '<strong><h3>Error!</h3></strong><p>There were some errors in your file. Please correct data and try again:<br><br>'
                                    + data['response'] +
                                    '</p>' +
                                    '<button type="button" class="close button-reload">' +
                                    '<span aria-hidden="true">&times;</span>' +
                                    '</button></div>';
                            }
                        });
                    }
                    else {
                        processing_files[i].innerHTML = progress + '%';
                        processing_files[i].setAttribute('aria-valuenow', progress);
                        processing_files[i].style.width = progress + '%';
                    }

                },
            });
        }
    }
}, 3000);


//modal window with process message
$('.fa-info').on('click', function (event) {
    var getUrl = window.location;
    var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
    var fid = $(this).attr('data-message');
    $.ajax({
        type: "GET",
        url: baseUrl + '/purchasers/upload/message/' + fid,
        success: function (data) {
            $('#exampleModal .modal-body').html('<p>' + data.message + '</p>');
            $('#exampleModal').modal('show');
        }
    });

});

// 
//form validation
$('#timian-upload-form  #edit-submit').on('click', function (e) {
    if ($('input[type="file"]')[0].value) {
        var select_selected = $('.select-multiple option:selected').length;
        var flag_checkboxes = select_selected;

        if (!flag_checkboxes) {
            if ($('#timian-upload-form #edit-upload-type').val() == 2) {
                $('#edit-check-all-0').tooltip('show');
                setInterval(function () {
                    $('#edit-check-all-0').tooltip('hide');
                }, 3000);
                e.preventDefault();
                return;
            }
            else {
                $('#edit-check-all-insert-0').tooltip('show');
                setInterval(function () {
                    $('#edit-check-all-insert-0').tooltip('hide');
                }, 3000);
                e.preventDefault();
                return;
            }

        } else {
            $('.loader-wrapper').show();
        }
    }


});




// delete notification after press x and clear all forms fields
$('#block-uploadformblock').on('click', '.button-reload', function () {
    $(this).parent().parent().parent().parent().remove();
    
    if ($('#progress-wrapper').children().length == 1) {
        $('#progress-wrapper').remove();
    }
    var upload_select = document.querySelector('#timian-upload-form .form-select');
    unset(upload_select);
    upload_select.value = 2;
    var checkboxes = document.getElementsByClassName('form-checkbox');
    for (i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
        unset(checkboxes[i]);
    }
});


//pagination fo upload history table
$('#tu-files').DataTable({
    "info": false,
    "dom": '<"top"i>rt<"bottom"lp><"clear">',
    "lengthMenu": [[10, 25, 100, -1], [10, 25, 100, "All"]]
});

//set value for inputs from localstorage
function saveValue(e) {
    var val = e.value;
    localStorage.setItem(name, val);
}

function saveValueSelect(e) {
    var name = e.getAttribute("name");
    var val = e.options[e.selectedIndex].value;
    localStorage.setItem(name, val);
}

function saveValueFile(e) {
    var name = e.getAttribute("name");
    var val = e.value;
    localStorage.setItem(name, val);
}

function unset(e) {
    var name = e.getAttribute("name");
    var val = '';
    localStorage.setItem(name, val);
}


// if (!isEmpty($('#timian-upload-form'))) {
//     var upload_select = document.querySelector('#timian-upload-form .form-select');
//     var name_select = upload_select.getAttribute("name");
//     var local_value_for_select = getSavedValue(name_select);
//     if (local_value_for_select != '') {
//         upload_select.value = local_value_for_select;
//     }

//     var checkboxes = document.getElementsByClassName('form-checkbox');
//     for (i = 0; i < checkboxes.length; i++) {
//         var name_checkbox = checkboxes[i].getAttribute("name");
//         var local_value = getSavedValue(name_checkbox);
//         var bool_local_value = (local_value == 'true');
//         checkboxes[i].checked = bool_local_value;
//     }

// }


function getSavedValue(v) {
    if (localStorage.getItem(v) === null) {
        return "1";// You can change this to your defualt value. 
    }
    return localStorage.getItem(v);
}

$('#timian-upload-form .select-multiple').on('change focus select blur', function () {
    for (i = 0; i < $('.select-multiple option:selected').length; i++) {
        saveValue($('.select-multiple option:selected')[i]);
    }
})
$('#timian-upload-form #edit-upload-type').on('change', function () {
    saveValueSelect(this);

    if ($(this).val() == 1) {
        $('#timian-upload-form .checkboxes-wrapper-insert').show();
        $('#timian-upload-form .checkboxes-wrapper').hide();
        if ($('.lack-permission-notification').text().length > 0) {
            $('#edit-submit').prop('disabled', true);
        }
        $('.select-multiple').val(null).trigger('change');
        ;
    }
    else {
        $('#timian-upload-form .checkboxes-wrapper-insert').hide();
        $('#timian-upload-form .checkboxes-wrapper').show();
        $('#edit-submit').prop('disabled', false);
        $('.select-multiple').val(null).trigger('change');
        ;
    }
})

// disable upload button for insert product for supplier without permission to insert
if (($('.lack-permission-notification').text().length > 0) && $('#timian-upload-form #edit-upload-type').val() == 1) {
    $('#edit-submit').prop('disabled', true);
}

// select all purchasers
$("#edit-check-all-0").click(function () {
    if ($("#edit-check-all-0").is(':checked')) {
        $("#purchasers-list > option").prop("selected", "selected");
        $("#purchasers-list").trigger("change");
     
    } else {
        $("#purchasers-list > option:selected").prop("selected", false);
        $("#purchasers-list").trigger("change");
    }
  
});

$("#edit-check-all-insert-0").click(function () {
    if ($("#edit-check-all-insert-0").is(':checked')) {
        $("#purchasers-list-insert > option").prop("selected", "selected");
        $("#purchasers-list-insert").trigger("change");
      
    } else {
        $("#purchasers-list-insert > option:selected").prop("selected", false);
        $("#purchasers-list-insert").trigger("change");
    }
  
});


// putting loader for resolve jumping effect when one of purchasers list is hidding
if ($('#timian-upload-form #edit-upload-type').val() == 2) {
    setTimeout(function () {
        $('.loader-wrapper-purchasers').remove();
        $('#timian-upload-form .checkboxes-wrapper-insert').hide();
        $('#timian-upload-form .checkboxes-wrapper').show();
    }, 1000);

} else {
    setTimeout(function () {
        $('.loader-wrapper-purchasers').remove();
        $('#timian-upload-form .checkboxes-wrapper-insert').show();
        $('#timian-upload-form .checkboxes-wrapper').hide();
    }, 1000);

}

