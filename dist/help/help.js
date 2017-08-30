$(function() {

  //Get current year and add to footer
  var dateToday = new Date();
  var currentYear = dateToday.getFullYear();
  $('#copyright-date').text(currentYear);

  //Scroll to top btn
  $('.scroll-to-top i').click(function(){
    $('html, body').animate({
          scrollTop: 0
        }, 1000);
        return false;
  });

  if($(window).scrollTop() > 1500 ) {
    $('.scroll-to-top').removeClass('slide-out').addClass('slide-in');
  } else {
    $('.scroll-to-top').removeClass('slide-in').addClass('slide-out');
  }

  function scrollToTop() {

    $(window).scroll(function() {
       if($(window).scrollTop() > 1500 ) {
         $('.scroll-to-top').removeClass('slide-out').addClass('slide-in');
       } else {
         $('.scroll-to-top').removeClass('slide-in').addClass('slide-out');
       }
     });
  }

  scrollToTop();

  // Close side nav on tap for mobile but not wide screens
 var windowsize = $(window).width();
 var closeOnClickVal = false;
  if (windowsize < 992) {
    closeOnClickVal = true;
  }

 //Init side nav
 $(".button-collapse").sideNav({
   closeOnClick: closeOnClickVal,
   menuWidth: 300
 });

 //Smooth in page navigation
 function scrollToAnchor(name){
     var aTag = $(name);
     console.log(aTag);
     $('html,body').animate({scrollTop: aTag.offset().top}, 'slow');
 }

 //Init image popout boxes
 $('.materialboxed').materialbox();

 // In page navigation
function inPageNav(){
$('.slow-nav').click(function() {
    event.preventDefault();
    var name = $(this).attr('href');
    scrollToAnchor(name);
  });
}

inPageNav();

});
