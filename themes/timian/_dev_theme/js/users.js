if (typeof $ == 'undefined') {
    var $ = jQuery;
}

$(document).ready(function () {

    $('#tab-edit').on('click', function () {
        $('#create-supplier').hide();
        $('#edit-supplier').css('display', 'flex');
        if (!$(this).hasClass('active-tab')){
        $(this).toggleClass('active-tab');
        $('#tab-create').toggleClass('active-tab');
        }
    });

    $('#tab-create').on('click', function () {
        $('#create-supplier').css('display', 'flex');
        $('#edit-supplier').hide();
        if (!$(this).hasClass('active-tab')){
            $(this).toggleClass('active-tab');
            $('#tab-edit').toggleClass('active-tab');
        }
      
    })

    // disable first option in select supplier
    $("#supplier-edit-all_suppliers option")[0].disabled = true;


    //fill in form to update user data
    $('#supplier-edit-all_suppliers').on('change', function () {

        // $("#timian-edit-user-settings-form").trigger('reset')
        var supplier_uid = $(this).val();
        var getUrl = window.location;
        var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
        $.ajax({
            type: "GET",
            url: baseUrl + '/user/get/' + supplier_uid,
            success: function (data) {
                console.log(data);
                $('#supplier-edit-name').val(data.name);
                $('#supplier-edit-short_name').val(data.short_name);
                $('#supplier-edit-address').val(data.street);
                $('#supplier-edit-postal_code').val(data.postal_code);
                $('#supplier-edit-city').val(data.city);
                $('#supplier-edit-country').val(data.country);
                $('#supplier-edit-telephone').val(data.phone);
                $('#supplier-edit-website').val(data.webpage);
                $('#supplier-edit-email').val(data.mail);
                $('#supplier-edit-minimum').val(data.minimum);
                $('#supplier-edit-sid').val(data.sid);
                var purchasers = Object.keys(data.purchasers).map(i => data.purchasers[i]);
                $('#supplier-edit-purchasers_list').val(purchasers).trigger('change');
               
            }
        });
    })       
        
    //validate user name
    $('#supplier-name').on('focusout', function () {
        var username = $(this).val();
        username = username ? username : 'empty';
        var getUrl = window.location;
        var self = $(this);
        var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
        $.ajax({
            type: "GET",
            url: baseUrl + '/user/validate/' + username,
            
            success: function (data) {
              console.log(data);
              if (data.username == 'empty'){
                $(self).parent().find('.error-message').remove();
                $(self).parent().append('<dic class="error-message">* this field is required</div>');
                return;
              }
              if(!data.unique){
                $(self).parent().find('.error-message').remove();
                $(self).val("");
                $(self).parent().append('<dic class="error-message"><b>*'+ data.username +  '</b> name is already taken</div>');
              } else {
                $(self).parent().find('.error-message').remove();
              }
           
            }
        });
     
    })



});