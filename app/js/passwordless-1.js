// Initialize Passwordless Lock instance
    var lock = new Auth0LockPasswordless(
      // All these properties are set in auth0-variables.js
      AUTH0_CLIENT_ID,
      AUTH0_DOMAIN
    );
    var globalToken;
    $(document).ready(function() {
     var globalProfile = localStorage.getItem('profile') || JSON.parse(localStorage.getItem('profile'));
    globalToken = localStorage.getItem('id_token');



      var hash = lock.parseHash(window.location.hash);
      var errorMsg;

      if (hash && hash.error) {
        alert('There was an error: ' + hash.error + '\n' + hash.error_description + ' You may have clicked on the login email more than once. The login email link only works once. Please go directly to https://franciscan.university/bulletin . If you still are seeing this message, please contact Jesse Weigel (jweigel@franciscan.edu) and include the name of your browser and device in your email.');

        errorMsg = new Error('Error: ' + hash.error + ' Description: ' + hash.error_description);

        function reloadPage() {

            setTimeout(function() {
              window.location.hash = '';
              document.location.reload(true);
            }, 500);

        }

        function throwError() {
          throw errorMsg;
        }

      throwError(reloadPage());

      }
      else if (hash && hash.id_token) {
        //save the token in local storage:
        localStorage.setItem('id_token', hash.id_token);
        globalToken = hash.id_token;
        $('.login-box').hide();
        $('.logged-in-box').show();
        //retrieve profile
        setTimeout(function(){
          lock.getProfile(localStorage.id_token, function (err, profile) {
            if (err){
              console.log('err',err);
              alert('There was an error retrieving your profile: ' + err.message);
              throw new Error('err.message');
            } else {
              localStorage.setItem('profile', JSON.stringify(profile));
              globalProfile = profile;
              loggedIn();
            }
          });
        }, 200);


        window.location.hash = 'l';
        setTimeout(function(){
          $('.isotope-container').html('');
          window.location.hash = '';
          document.location.reload(true);
        }, 400);
      }

      // if (typeof localStorage.profile === 'undefined') {
      //   lock.getProfile(localStorage.id_token, function (err, profile) {
      //     if (err){
      //       console.log('err',err);
      //       alert('There was an error retrieving your profile: ' + err.message);
      //     } else {
      //       localStorage.setItem('profile', JSON.stringify(profile));
      //       globalProfile = profile;
      //       loggedIn();
      //     }
      //   });
      // }

      function loggedIn (profile, token) {
        if(!token || !profile) {
          return;
        }
        // Run logged in stuff
        $('.more-btn').show();
        $('.logout').click(function(){
          localStorage.removeItem('id_token');
          localStorage.removeItem('profile');
          localStorage.removeItem('magiclinkCred');
          window.location.pathname = 'bulletin';
          $('body').removeClass('is-authenticated');
        });
        $('.isotope-container, .related-posts-row').css('visibility', 'visible');
      //  $('.isotope-container').html('');

      }

      console.log(globalToken, globalProfile);


      setTimeout(function(){
        if (globalToken && globalProfile){
          loggedIn(globalProfile, globalToken);
        } else {
          setTimeout(function() {
            if (globalToken && globalProfile) {
              loggedIn(globalProfile, globalToken);
            } else {
              lock.magiclink(options);
            }
          }, 200);
        }
      }, 300);


    });
