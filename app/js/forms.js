$(function() {

// Send to Google Sheet

// Variable to hold request
var request, checkLength;

$('#modal1 .success, #modal1 .failure').hide();
// Bind to the submit event of our form
$("#modal1 #announcement-submit").click(function(event){

    //Hidden checkbox to help prevent spam submissions
    checkLength = $('#checkbox-3:checked').length === 0;

    if (checkLength === true) {


    // Abort any pending request
    if (request) {
        request.abort();
    }
    // setup some local variables
    var $form = $('#announcement-form'); //Put the id of the div form container here

    // Let's select and cache all the fields
    var $inputs = $form.find("input, select, button, textarea"),
        $name, $val, i, $thisCheckbox,
        $formElements = $($form).find("input, select, button, textarea").not('input[type=checkbox]').not('input[type=file]'),
        $uploads = $('#uploads')[0].files;

    // Serialize the data in the form
    var serializedFormElements = '';
    //var serializedCheckboxData = '';
    var serializedData = '';
    var fileNames = '';
    var path = ''; //This need to be the path to the uploads folder
    var email = JSON.parse(localStorage.profile).email;
    var announcementContent = $('#announcementText').val();

    // Serialize other form data
      for (i = 0; i < $formElements.length; i++) {
        $name = $($formElements[i]).attr('id');
        $val = $($formElements[i]).val();
        serializedFormElements = serializedFormElements + $name + '=' + $val + '&';
      }

    $.each($uploads, function(key, value) {
      fileNames = fileNames + path + value.name + ' , ';
    });

    console.log(fileNames);
    serializedData = 'announcementText=' + announcementContent + '&email=' + email + '&uploads=' + fileNames;  //Concat all form input serialized data
    console.log(serializedData);

    // Let's disable the inputs for the duration of the Ajax request.
    // Note: we disable elements AFTER the form data has been serialized.
    // Disabled form elements will not be serialized.
    $inputs.prop("disabled", true);

    // Fire off the request to /form.php
    request = $.ajax({
        url: "https://script.google.com/macros/s/AKfycbxZIsj-3jcq9KzJBM-q9eoyZcN5y1ITqXsa_H4tIaCyu26sGMA3/exec",
        type: "post",
        data: serializedData
    });

        // Callback handler that will be called on success
   request.done(function (response, textStatus, jqXHR){

       if ($('#uploads').val()) {
       var formData = new FormData();

             var fileList = $('#uploads')[0].files;
             for(var x=0;x<fileList.length;x++) {
                 formData.append('upload[]', fileList[x]);
             }
             formData.append('ajax', true);


         fetch('https://franciscan.university/bulletin/upload.php', {
             method:'POST',
             body:formData
         }).then(function(res) {
             console.log('Status', res);
             // Log a message to the console
             console.log("Hooray, it worked!");
             console.log(response);
             console.log(textStatus);
             console.log(jqXHR);
             $("#announcement-form input, #announcement-form textarea").val("");
             //$("#announcement-form input:checkbox").prop('checked', "");
             $('#modal1 .modal-content').hide();
             $('#modal1 .success').show();
         }).catch(function(e) {
             console.log('File Upload Error',e);
             $('#modal1 modal-content').hide();
             $('#modal1 .failure').show();
         });
       } else {
         // Log a message to the console
         console.log("Hooray, it worked!");
         console.log(response);
         console.log(textStatus);
         console.log(jqXHR);
         $("#announcement-form input, #announcement-form textarea").val("");
         //$("#announcement-form input:checkbox").prop('checked', "");
         $('#modal1 .modal-content').hide();
         $('#modal1 .success').show();
       }

   });

    // Callback handler that will be called on success
    // request.done(function (response, textStatus, jqXHR){
    //
    //   var formData = new FormData();
    //     if($('#uploads').val()) {
    //         var fileList = $('#uploads')[0].files;
    //         for(var x=0;x<fileList.length;x++) {
    //             formData.append('upload[]', fileList[x]);
    //         }
    //         formData.append('ajax', true);
    //     }
    //
    //     $.ajax({
    //         url: 'https://script.google.com/macros/s/AKfycbxZIsj-3jcq9KzJBM-q9eoyZcN5y1ITqXsa_H4tIaCyu26sGMA3/exec',
    //         type: 'POST',
    //         xhr: function() {
    //             var myXhr = $.ajaxSettings.xhr();
    //             return myXhr;
    //         },
    //         success: function (data) {
    //             console.log("Data Uploaded: "+data);
    //         },
    //         data: formData,
    //         cache: false,
    //         contentType: false,
    //         processData: false
    //     });
    //
    //     fetch('https://script.google.com/macros/s/AKfycbxZIsj-3jcq9KzJBM-q9eoyZcN5y1ITqXsa_H4tIaCyu26sGMA3/exec', {
    //         method:'POST',
    //         body:formData
    //     }).then(function(res) {
    //         console.log('Status', res);
    //         // Log a message to the console
    //         console.log("Hooray, it worked!");
    //         console.log(response);
    //         console.log(textStatus);
    //         console.log(jqXHR);
    //         $("#announcement-form input, #announcement-form textarea").val("");
    //         //$("#announcement-form input:checkbox").prop('checked', "");
    //         $('#modal1 .modal-content').hide();
    //         $('#modal1 .success').show();
    //     }).catch(function(e) {
    //         console.log('File Upload Error',e);
    //         $('#modal1 modal-content').hide();
    //         $('#modal1 .failure').show();
    //     });
    // });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
        // Log the error to the console
        console.error(
            "The following error occurred: "+
            textStatus, errorThrown
        );

        // HACK - check if browser is Safari - and redirect even if fail b/c we know the form submits.
        if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0){
          $('#modal1 modal-content').hide();
          $('#announcement-submit').hide();
          $('#modal1 .success').show();
        } else {
          $('#modal1 modal-content').hide();
          $('#announcement-submit').hide();
          $('#modal1 .failure').show();
        }
    });

    // Callback handler that will be called regardless
    // if the request failed or succeeded
    request.always(function () {
        // Reenable the inputs
        $inputs.prop("disabled", false);
    });

    // Prevent default posting of form
    event.preventDefault();

  } else {
    $('#pgb-container label').css('color', 'red');
  }
});
//End Send to Google Sheet
});
