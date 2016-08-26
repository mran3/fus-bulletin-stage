// Initialize Passwordless Lock instance
    var lock = new Auth0LockPasswordless(
      // All these properties are set in auth0-variables.js
      AUTH0_CLIENT_ID,
      AUTH0_DOMAIN
    );

    $(document).ready(function() {
     var globalProfile = localStorage.getItem('profile') || JSON.parse(localStorage.getItem('profile'));
      var globalToken = localStorage.getItem('id_token');



      var hash = lock.parseHash(window.location.hash);

      if (hash && hash.error) {
        alert('There was an error: ' + hash.error + '\n' + hash.error_description);
      }
      else if (hash && hash.id_token) {
        //save the token in local storage:
        localStorage.setItem('id_token', hash.id_token);
        globalToken = hash.id_token;
        console.log('hash',hash);
        $('.login-box').hide();
        $('.logged-in-box').show();
        //retrieve profile
        lock.getProfile(hash.id_token, function (err, profile) {
          if (err){
            console.log('err',err);
            alert('There was an error retrieving your profile: ' + err.message);
          } else {
            localStorage.setItem('profile', JSON.stringify(profile));
            globalProfile = profile;
            loggedIn();
          }
        });

        window.location.hash = '';

      }

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
          window.location.href = "/";
        });
        $('.isotope-container, .related-posts-row').css('visibility', 'visible');

      }

      console.log(globalToken, globalProfile);


      setTimeout(function(){
        if (globalToken && globalProfile){
          loggedIn(globalProfile, globalToken);
        } else {
          lock.magiclink(options);
        }
      }, 200);


    });
