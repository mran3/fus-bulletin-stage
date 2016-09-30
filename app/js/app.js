/* jshint esversion: 6 */

var testImgArr, postType;

$(function() {
  var wpURL = 'https://franciscan.university/HfjGnJUHz77wyWm5S8/';
//  getImages();

  var $container = $('.isotope-container'),
  //cardSize = 's12 m12 l12',
  selector;



  //Get current year and add to footer
  let dateToday = new Date();
  let currentYear = dateToday.getFullYear();
  $('#copyright-date').text(currentYear);

  //Check for @franciscan.edu address
  setTimeout(function(){
    $('.auth0-lock-submit').attr('disabled', 'disabled');
    $('.auth0-lock-input').on('keyup', function(){
      let email = $(this).val();
      if (email.toLowerCase().indexOf('@franciscan.edu') !== -1) {
        $('.auth0-lock-submit').removeAttr('disabled');
      }
    });
  }, 500);

  //Date filter
  function dateFilter() {
    let month;
    let year;

    $('.date-filter select').on('change', function() {
      month = $('.month select').val();
      year = $('.year select').val();

      if( month !== null && year !== null) {

        window.location.hash = `date/${year}/${month}`;
      }
    });

  }

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

  //Layout Buttons
  $('.list-btn').hide();
  $('.grid-btn').click(function(){
    $(this).hide();
    $('.list-btn').show();
    //$('.isotope-container .col').not('.single-post').removeClass(cardSize);
    $('.isotope-container').removeClass('notMasonry');
    $('.isotope-container').addClass('isMasonry');
  //  cardSize = 's12 m6 l4';
  //  $('.isotope-container .col').not('.single-post').addClass(cardSize);
    $('.container').addClass('w90');
    isotopeize();

  });

  $('.list-btn').click(function(){
    $(this).hide();
    $('.grid-btn').show();
    //$('.isotope-container .col').not('.single-post').removeClass(cardSize);
    $('.isotope-container').removeClass('isMasonry');
    $('.isotope-container').addClass('notMasonry');

  //  $('.isotope-container .col').not('.single-post').addClass(cardSize);
    $('.container').removeClass('w90');
    $('.isotope-container').masonry('destroy');
  });

  //Isotope

  function isotopeize() {
    $container.masonry({
      itemSelector: '.col',
      columnWidth: '.col',
      isAnimated: true,
      animationOptions: {
        duration: 750,
        easing: 'linear',
        queue: false
      }
    });
  }

  function isotopeizeInit() {
    isotopeize();
  }


//API Calls
	var i, t,
  categories = {},
  tags = {},
  images = {},
  cardImg,
  cardImgTemp,
  posts, postTitle, postContent, postCatagories, postTags, categoryName, categoryID, categorySlug, tagName, tagID, tagSlug, catName;


if (globalToken) {
  $('body').addClass('is-authenticated');
  function get(url) {
    return fetch(url, {
      method: 'get'
    });
  }

  function getJSON(url) {
    return get(url).then(function(response) {
      return response.json();
    });
  }



  //Get Categories

  getJSON(`${wpURL}wp-json/wp/v2/categories?per_page=100&fields=id,name,slug`)
  .then(function(data){
    $('#mobile-demo').append(
      `
      <li><a class="category" href="#all">All</a></li>
      `

    );

    let i = 0;
    for(let category of data) {
      categories[category.id] = category.name;
      $( '.filters' ).append( `<option value=".${category.id}" catID="${category.id}">${category.name}</option>` );

      if (category.id !== 1) {
        $('#mobile-demo').append(
          `
            <li><a class="category" catID=".${category.id}" href="#category_name/${category.slug}">${category.name}</a></li>
          `
        );
      }

      if (i === data.length - 1) {
        //Add the rest of the side nav items
        $('#mobile-demo').append(
          `
            <li><div class="divider"></div></li>
             <li class="no-padding">
               <ul class="collapsible collapsible-accordion date-filter">
                 <li>
                   <a class="collapsible-header"><i class="material-icons">access_time</i>Filter by Date</a>
                   <div class="collapsible-body">
                    <ul>
                      <li>
                   <div class="row">
                     <div class="input-field col s6 month">
                       <select>
                       <option value="" disabled selected>Month</option>
                         <option value="1">January</option>
                         <option value="2">February</option>
                         <option value="3">March</option>
                         <option value="4">April</option>
                         <option value="5">May</option>
                         <option value="6">June</option>
                         <option value="7">July</option>
                         <option value="8">August</option>
                         <option value="9">September</option>
                         <option value="10">October</option>
                         <option value="11">November</option>
                         <option value="12">December</option>
                       </select>
                       <label>Month</label>
                     </div>
                     <div class="input-field col s6 year">
                       <select>
                         <option value="" disabled selected>Year</option>
                         <option value="2016">2016</option>
                         <option value="2017">2017</option>
                         <option value="2018">2018</option>
                         <option value="2019">2019</option>
                         <option value="2020">2020</option>
                       </select>
                       <label>Year</label>
                     </div>
                   </div>
                   </li>
                   </ul>
                 </li>
               </ul>
             </li>
             <li><div class="divider"></div></li>
            <li class="modal-trigger" data-target="modal1"><a >Submit Announcement</a></li>
          `
        );
         $('.modal-trigger').leanModal();
         $('select').material_select();
         $('.collapsible').collapsible({
            accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
          });
        dateFilter();
      }

      i++;
    }
  })
  .catch(function(error) {
    console.log(error);
  });

//get tags
//TODO: get the top 20 most popular tags
  // getJSON(`${wpURL}wp-json/wp/v2/tags?per_page=100`)
  // .then(function(data){
  //   $.each(data, function(i, tag){
  //     tags[tag.id] = tag.name;
  //   });
  // })
  // .catch(function(error) {
  //   console.log(error);
  // });

  //Check if the view is single post and add or remove container classes
  if ($('.single-post') > 0) {
    $('.container').addClass('single');
  } else {
    $('.container').removeClass('single');
  }


// Router
  var path = window.location.hash.split("#")[1],
  viewType, viewTypePath;


  if (path !== undefined && path.indexOf('/') >= 0) {
    viewType = path.split("/")[0];
    viewTypePath = path.split("/")[1];

  }

  // Fires when the url changes
    window.onhashchange = function(event) {
      $('body').removeClass('classic');
      $('.classic-mode').remove();
      $('.load-more-row').remove();
      $('.isotope-container').html('');
      window.scrollTo(0,0);
      $('.b-header').remove();
      //Add title for home page
      if (window.location.hash === '' || window.location.hash === '#') {
        $('.preloader-wrapper').before(`<h4 class="b-header">This Week's Bulletin<h4>`);
          // $('.isotope-container').prepend(`<h4 class="b-header">This Week's Bulletin<h4>`);
      }

      //Reset offset for infinite scroll
      offsetCount = 10;

      $('.preloader-wrapper').show();
      path = window.location.hash.split("#")[1];
      $('.isotope-container, #related-posts, .related-posts-row h3').html('');

      if (path !== undefined && path.indexOf('/') >= 0) {

        //TODO: this may end up being better as a switch statement
        viewType = path.split("/")[0];
        viewTypePath = path.split("/")[1];

        //Handles date filtering
        if (viewType.toLowerCase() === 'date') {
          let year = viewTypePath;
          let month = path.split("/")[2];

          getPosts(`filter[year]=${year}&filter[monthnum]=${month}&`, 10, false);
        } else {
          // $('.isotope-container').html(`<h3>${viewTypePath}</h3>`);
          getPosts(`filter[${viewType}]=${viewTypePath}&`, 10, false);
        }

      } else if (window.location.hash !== "") {
        if (window.location.hash !== "#") {
          if(path.toLowerCase() === "all") {
            getPosts('', 15, true, true);
          } else {
            getPosts(`filter[name]=${path}&`, 1, false);
          }
        } else {
            getPosts('', 50, true, false);
        }
      } else {
        getPosts('', 50, true, false);
      }
    };

    $('.isotope-container, #related-posts, .related-posts-row h3').html('');
    if (path !== undefined && path.indexOf('/') >= 0) {
      viewType = path.split("/")[0];
      viewTypePath = path.split("/")[1];
      //Handles date filtering
      if (viewType.toLowerCase() === 'date') {
        let year = viewTypePath;
        let month = path.split("/")[2];

        getPosts(`filter[year]=${year}&filter[monthnum]=${month}&`, 10, false);
      } else {
        // $('.isotope-container').html(`<h3>${viewTypePath}</h3>`);
        getPosts(`filter[${viewType}]=${viewTypePath}&`, 10, false);
      }

    } else if (window.location.hash !== "") {
      if (window.location.hash !== "#") {
        if(path.toLowerCase() === "all") {
          getPosts('', 15, true, true);
        } else {
          getPosts(`filter[name]=${path}&`, 1, false);
        }
      } else {
          getPosts('', 50, true, false);
      }
    } else {
      getPosts('', 50, true, false);
    }

  // Get Posts
  function getPosts(filterOpts='', perPage=15, isotopeInit=true, isInfinite=false) {
    getJSON(`${wpURL}wp-json/wp/v2/posts?${filterOpts}per_page=${perPage}&fields=id,title,better_featured_image,slug,pure_taxonomies,date,excerpt,content,featured_media,acf`)
    .then(function(data){
      renderCards(data, isotopeInit, isInfinite);
    })
    .catch(function(error) {
      console.log(error);
    });
  }

//Infinite scroll
  let offsetCount = 15;
function infiniteScroll() {
  $(window).scroll(function() {
     if($(window).scrollTop() + $(window).height() > $(document).height() - 500) {
       $(window).unbind('scroll');
       scrollToTop(); //Must call this here to keep it working after the unbind

       setTimeout(function(){
          path = window.location.hash.split("#")[1];

          if (postType === 'single') {

          } else if (path !== undefined && path.indexOf('/') >= 0) {
           viewType = path.split("/")[0];
           viewTypePath = path.split("/")[1];
           // $('.isotope-container').html(`<h3>${viewTypePath}</h3>`);
           //Handles date filtering
           if (viewType.toLowerCase() === 'date') {
             let year = viewTypePath;
             let month = path.split("/")[2];

             getPosts(`filter[year]=${year}&filter[monthnum]=${month}&offset=${offsetCount}&`, 15, true, true);
           } else {
             // $('.isotope-container').html(`<h3>${viewTypePath}</h3>`);
             getPosts(`filter[${viewType}]=${viewTypePath}&offset=${offsetCount}&`, 15, true, true);
           }

           offsetCount = offsetCount + 15;

         } else {

           if (window.location.hash === '#all') {
             getPosts(`offset=${offsetCount}&`, 15, true, true);
             offsetCount = offsetCount + 15;
           } else {
             //  getPosts(`offset=${offsetCount}&`, 10, true, true);
             //  offsetCount = offsetCount + 10;
             if($('.load-more').length === 0) {

               //Add View All Posts btn that links to 'all' category view
               if(window.location.hash === '' || window.location.hash === '#') {
                 $('.load-more-row').remove();
                 $('.isotope-container').after(`
                   <div class="row load-more-row">
                     <a class="btn btn-large" href="#all">View All Posts</a>
                   </div>
                   `);
                 } else {

            // This was the original btn for the home view. Keep it, it may be needed later.
             $('.isotope-container').after(`
               <div class="row load-more-row">
                 <div class="btn btn-large load-more">Load More</div>
               </div>
               `);
             }
             }
             $('.load-more').click(function(){
               getPosts(`offset=${offsetCount}&`, 15, true, true);
               offsetCount = offsetCount + 15;
               $(this).parent().remove();
               if ($('.isMasonry').length > 0) {
                 $('.isotope-container').masonry('reloadItems');
                 isotopeize();
               }

             });
           }

         }
       }, 200);

     }
  });
}

  function renderCards(data, isotopeInit=true, isInfinite) {
    let i = 0;
    let cardImgArr;

    $('.load-more-row .btn').remove();

    // Check to see if multiple posts will be rendered
    if (window.location.hash.toLowerCase() === "#all" || window.location.hash.indexOf('/') >= 0 || window.location.hash.split('#')[1] === "" || window.location.hash === "") {

      if (data[0] === undefined && isInfinite === false && window.location.hash !== '') {
        $('.preloader-wrapper').hide();
        $('.isotope-container').html('<h3>No matching posts</h3>');
        //Remove load more btn
        $('.load-more-row .btn').remove();
      } else {

      //if so, then render post cards

      postType = 'multiple';
    for(let post of data) {
      // Get media url for this post from data saved as cardImgArr
     if(post.featured_media !== 0) {

      let thumb = post.better_featured_image.media_details.sizes.thumbnail.source_url;
      let medium = post.better_featured_image.media_details.sizes.medium.source_url;
      let mediumLarge = post.better_featured_image.media_details.sizes.medium_large.source_url;
      let large = post.better_featured_image.media_details.sizes.large.source_url;
        //This was were the image url initially came from
       //images[post.featured_media].large;
      cardImgTemp = `<div class="card-image">
                       <a href="#${post.slug}"><img sizes="(max-width: 600px) 95vw, 50vw" srcset="${thumb} 150w, ${medium} 300w, ${mediumLarge} 700w, ${large} 1000w"  src="${medium}"/></a>
                    </div>`;
     } else {
       cardImgTemp = '';
     }

    //  Get category data
    let categoryNames = "";
    let categoryIds = "";
    let categoryTemplate = "";
    if (post.pure_taxonomies.categories !== undefined) {
       let categoryData = post.pure_taxonomies.categories;

       for(let category of categoryData) {
         categoryNames = categoryNames + " " + category.name;
         categoryIds = `${categoryIds} .${category.cat_ID}`;
         categoryTemplate = `${categoryTemplate} <a href="#category_name/${category.slug}"> <div class="cat-name" data-filter=".${category.cat_ID}">${category.name}</div></a>`;
       }
     }

    //  Get tag data
    let tagNames = "";
    let tagIds = "";
    let tagTemplate = "";
    if (post.pure_taxonomies.tags !== undefined) {
       let tagData = post.pure_taxonomies.tags;

       for(let tag of tagData) {
         tagNames = tagNames + " " + tag.name;
         tagIds = `${tagIds} t${tag.term_id}`;
         tagTemplate = `${tagTemplate} <span class="tag-name" data-filter=.t${tag.term_id}>${tag.name},</span>`;
       }
     }

     let thisDate = new Date(post.date);
     let dueDateTemp = "";

     let cardTemplate = `<div class="col ${tagIds}">
       <div class="card isotope-item ${tagIds}">
          ${cardImgTemp}
          <div class="card-content" post-id=${post.id}>
            <div class="card-title">
            ${dueDateTemp}
            ${categoryTemplate}
              <a href="#${post.slug}">${post.title.rendered}</a>
                <span class="post-date">${thisDate.getMonth() + 1}/${thisDate.getDate()}/${thisDate.getFullYear()}</span>
            </div>
            <div class="content excerpt">

              ${post.excerpt.rendered}
            </div>
          </div>

        </div>
      </div>`;

      //If loading home view, exclude posts that do not fit the date range
      let acfObj = post.acf;
      if (window.location.hash === '' || window.location.hash === '#') {

        if (acfObj.hasOwnProperty('bulletin_date') !== false) {
          let rawBulletinDate = post.acf.bulletin_date.split('');
          rawBulletinDate.splice(6, 0, '/');
          rawBulletinDate.splice(4, 0, '/');
          let formattedBulletinDate = rawBulletinDate.join('');
          let bulletinDate = window.bulletinDate = new Date(formattedBulletinDate);
          let maxDate = window.maxDate = new Date();
          let minDate = window.minDate = new Date();
          minDate.setDate(minDate.getDate() - 7);

          if (bulletinDate >= minDate && bulletinDate <= maxDate) {
            $( '.isotope-container' ).append(cardTemplate);
          }
        }

        if (post.acf.time_sensitive !== undefined && post.acf.time_sensitive !== "") {
          let rawDueDate = post.acf.bulletin_date.split('');
          rawDueDate.splice(6, 0, '/');
          rawDueDate.splice(4, 0, '/');
          let formattedDueDate = rawDueDate.join('');
          let dueDate = new Date(formattedDueDate);
          dueDateTemp = `<div class="due-date valign-wrapper"><i class="material-icons valign">alarm</i><span class="valign">Take action by ${dueDate.getMonth() + 1}/${dueDate.getDate()}/${dueDate.getFullYear()}</span></div>`;

          let actionCardTemp = `<div class="col ${tagIds}">
            <div class="card isotope-item ${tagIds}">
               <div class="card-content" post-id=${post.id}>
                 <div class="card-title">
                  ${dueDateTemp}
                  <a href="#${post.slug}">${post.title.rendered}</a>
                 </div>

               </div>
             </div>
           </div>`;
           let todayDate = new Date();
           if (dueDate >= todayDate) {
             $('.isotope-container').prepend(actionCardTemp);
           }
        }

      } else {
        $( '.isotope-container' ).append(cardTemplate);
      }

        $(`div[post-id="${post.id}"] .more-link`).attr('href', `#${post.slug}`);

     if (i === data.length - 1) {
       $('.preloader-wrapper').hide();
        $('.container').removeClass('single');
        $('.grid-btn, .list-btn').css('visibility', 'visible');
       infiniteScroll();


       if (window.location.hash === '' || window.location.hash === '#') {
         $('.side-nav').append(`<li class="classic-mode"><a>Classic Mode</a></li>`);
         // ******* CLASSIC MODE ***********
         $('.classic-mode').click(function () {
           if ($('body').hasClass('classic') === true) {
              $('body').removeClass('classic');
              $('.b-header').replaceWith(`<h4 class="b-header">This Week's Bulletin</h4>`);
           } else {
             $('body').addClass('classic');
             $('.b-header').replaceWith(`<img class="b-header classic-banner" src="img/bulletin-banner.png" />`);
           }
         });
       }

         $('.isotope.container').imagesLoaded(function(){
           if ($('.isMasonry').length > 0) {
             setTimeout(function(){
               $('.isotope-container').masonry('reloadItems');
               isotopeize();
             }, 200);

           }
         });
     }
     i++;
   }
  }
  } else {

    //Remove load more btn
    $('.load-more-row .btn').remove();

    //if data contained only one post, render single post view
    postType = 'single';
    for(let post of data) {
      // Get media url for this post from data saved as cardImgArr
     if(post.featured_media !== 0) {
       let thumb = post.better_featured_image.media_details.sizes.thumbnail.source_url;
       let medium = post.better_featured_image.media_details.sizes.medium.source_url;
       let mediumLarge = post.better_featured_image.media_details.sizes.medium_large.source_url;
       let large = post.better_featured_image.media_details.sizes.large.source_url;
         //This was were the image url initially came from
        //images[post.featured_media].large;
       cardImgTemp = `<div class="card-image">
                        <img  sizes="(max-width: 993px) 95vw, 75vw" srcset="${thumb} 150w, ${medium} 300w, ${mediumLarge} 700w, ${large} 1000w" src="${thumb}" />
                     </div>`;
     } else {
       cardImgTemp = '';
     }

    //  Get category data
    let categoryNames = "";
    let categoryIds = "";
    let categoryTemplate = "";
    if (post.pure_taxonomies.categories !== undefined) {
       let categoryData = post.pure_taxonomies.categories;

       for(let category of categoryData) {
         categoryNames = categoryNames + " " + category.name;
         categoryIds = `${categoryIds} .${category.cat_ID}`;
         categoryTemplate = `${categoryTemplate} <a href="#category_name/${category.slug}"> <div class="cat-name" data-filter=".${category.cat_ID}">${category.name}</div></a>`;
       }
     }

    //  Get tag data
    let tagNames = "";
    let tagIds = "";
    let tagTemplate = "";
    if (post.pure_taxonomies.tags !== undefined) {
       let tagData = post.pure_taxonomies.tags;

       for(let tag of tagData) {
         tagNames = tagNames + " " + tag.name;
         tagIds = `${tagIds} t${tag.term_id}`;
         tagTemplate = `
          ${tagTemplate} <a href="#tag/${tag.slug}" class="tag-link chip"><span class="tag-name" data-filter=.t${tag.term_id}>${tag.name}</span></a>`;
       }
     }
     let thisDate = new Date(post.date);

     $( '.isotope-container' ).append(
       `<div class="col ${tagIds} single-post">
         <div class="card isotope-item ${tagIds}">
            ${cardImgTemp}
            <div class="card-content" post-id=${post.id}>
              <div class="card-title">
              ${categoryTemplate}
                <a href="#${post.slug}">${post.title.rendered}</a>
                <span class="post-date">${thisDate.getMonth() + 1}/${thisDate.getDate()}/${thisDate.getFullYear()}</span>
              </div>
              <div class="content excerpt">

                ${post.content.rendered}
              </div>
            </div>
            <div class="card-action">
              <h6>Tags</h6>
              ${tagTemplate}
            </div>
          </div>
        </div>` );

        $(`div[post-id="${post.id}"] .more-link`).attr('href', `#${post.slug}`);

     if (i === data.length - 1) {
           $container.masonry('destroy');
           $('.preloader-wrapper').hide();
           $('.container').addClass('single');
           $('.grid-btn, .list-btn').css('visibility', 'hidden');
           $('.single .content a').attr('target', '_blank');
           $('.card .content img').addClass('responsive-img');
           $('.card .content iframe').wrap(`<div class="video-container"></div>`);
     }
     i++;

     //Add related posts
     getJSON(`${wpURL}wp-json/wp/v2/posts/?filter[category_name]=${post.pure_taxonomies.categories[0].slug}&per_page=3&exclude=${post.id}&fields=featured_media,better_featured_image,slug,title`)
     .then(function(data){
       for(let relatedPost of data) {
         if(relatedPost.featured_media !== 0) {
           thumb = relatedPost.better_featured_image.media_details.sizes.thumbnail.source_url;
           medium = relatedPost.better_featured_image.media_details.sizes.medium.source_url;

            //This was were the image url initially came from
           //images[post.featured_media].large;
          cardImgTemp = `<div class="card-image">
                               <img src="${medium}"/>
                             </div>`;
         } else {
           cardImgTemp = '';
         }

         let relatedPostsTemp = `
         <div class="col s12 m4">
          <a href="#${relatedPost.slug}">
           <div class="card hoverable">
             ${cardImgTemp}
             <div class="card-stacked">
               <div class="card-content">
                 <p>${relatedPost.title.rendered}</p>
               </div>
             </div>
           </div>
           </a>
         </div>
         `;
         $('#related-posts').append(relatedPostsTemp);
         $('.related-posts-row h3').text(`More from "${post.pure_taxonomies.categories[0].name}"`);
       }
     })
     .catch(function(error) {
       console.log(error);
     });

     }
   }
 }

 //Add title for home page
 if (window.location.hash === '' || window.location.hash === '#') {
   $('.preloader-wrapper').before(`<h4 class="b-header">This Week's Bulletin<h4>`);
 }

 // Close side nav on tap for mobile but not wide screens
let windowsize = $(window).width();
let closeOnClickVal = false;
 if (windowsize < 992) {
   closeOnClickVal = true;
 }

//Init side nav
$(".button-collapse").sideNav({
  closeOnClick: closeOnClickVal,
  menuWidth: 300
});


 //Search input
  var $searchInput;

  $('.search-form').hide();
  $('.search-icon').click(function(){
    $('.page-title, nav ul.right').hide();
    $('nav .button-collapse').css('transform', 'translateX(-200%)');
    $('.search-form').show();
    // Put cursor in search input
      $searchInput = $('#search');
      $searchInput.focus();
  });

  $('.search-nav .close-search').click(function(){
    $('.page-title, nav ul.right').show();
    $('nav .button-collapse').css('transform', 'translateX(0)');
    $('.search-form').hide();
  });

  //Search input
  // adapted from https://github.com/bearded-avenger/wp-live-search/blob/master/public/assets/js/wp-live-search.js

  var postList = $('#post-list'),
    results = $('#results'),
    helper = $('#helper'),
    input = $('#search'),
    timer;

    $('#close-search').click(function() {
      input.val('');
      $(this).removeClass('active');
      $(this).siblings('label').removeClass('active');
    });

  $(input).on('keyup keypress', function(e) {

    // clear the previous timer
		clearTimeout(timer);

    let key = e.which,
      val = $.trim($(this).val()),
      valEqual = val == $(this).val(),
      notEmpty = '' !== val,
      total = 10,
      searchURL = `${wpURL}wp-json/wp/v2/posts?filter[s]=${val}&per_page=${total}`;

    // 600ms delay so we dont exectute excessively
    timer = setTimeout(function(){
      // don't proceed if the value is empty or not equal to itself
				if ( !valEqual && !notEmpty )
					return false;

				// what if the user only types two characters?
				if ( val.length == 2 && !$(helper).length ) {

					// $( input ).after( helperSpan );
        }

        // if we have more than 3 characters
        if ( val.length >= 3 || val.length >= 3 && 13 == key ) {
          //TODO: after the || should be >= 1 maybe? want search to work with less than 3 on enter

          // dont run on escape or arrow keys
					if( blacklistedKeys( key ) )
						return false;

            //TODO: Add as loader in the html and link classes
          // // show loader
					// $( loader ).removeClass('wpls--hide').addClass('wpls--show');
          // TODO: figure out what the helpers are
					// // remove any helpers
					// $( helper ).fadeOut().remove();
          // TODO: see function below
					// // remove the close
					// destroyClose();
          // make the search request
          $('.isotope-container').html('');
          //getPosts(`filter[s]=${val}&`, total, false);
          window.location.hash = `s/${val}`;

        }

    }, 600);

  });

		/**
		* 	Blacklisted keys - dont allow search on escape or arrow keys
		*	@since 0.9
		*/
		function blacklistedKeys( key ){

			return 27 == key || 37 == key || 38 == key || 39 == key || 40 == key;

		}

  }

});
