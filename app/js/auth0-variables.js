var AUTH0_CLIENT_ID='vjl1DA4FQD0nC2HdheWzJBqLoxbyHAhu';
var AUTH0_DOMAIN='jweigel-fus.auth0.com';
var AUTH0_CALLBACK_URL=location.href;
var options = {
  "icon":"https://franciscan.university/ma-theology/img/side-nav-logo.jpg",
  "primaryColor":"#21412a",
  "responseType":"token",
  "rememberLastLogin": false,
  "autoclose":true,
  "closable":false,
  "focusInput":false,
  "popup":false,
  "dict":{
    emailSent: {
      success: "A link will be sent to {email}. Please use this link within the next two days to sign in.<br /> <a href='https://franciscan.university/bulletin/help' title='Bulletin Help' target='_blank'>Need help?</a>"
    },
    title:"",
    email: {
      emailInputPlaceholder: "you@franciscan.edu",
      footerText: "<a href='https://franciscan.university/bulletin/help' title='Bulletin Help' target='_blank'>Need help?</a>",
      headerText: "Please enter your @franciscan.edu email address to view the Bulletin."
    }
  }};
