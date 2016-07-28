/* jshint esversion: 6 */
var testImgArr;

$(function() {
  var wpURL = 'https://franciscan.university/fus-bulletin/';
  getImages();

  var $container = $('.isotope-container'),
  selector;

  function isotopeize() {
    $container.isotope({
      itemSelector: '.col',
      layoutMode: 'masonry',
      masonry: {
        columnWidth: '.col',
      },
        filter: '*',
        animationOptions: {
            duration: 750,
            easing: 'linear',
            queue: false
        }
    });
  }

  function isotopeizeInit() {

    isotopeize();

    // Category filter (sidebar)
    $('#mobile-demo .category').click(function(){
      selector = $(this).attr('catid');
      $('.button-collapse').sideNav('hide');
      $container.isotope({
          filter: selector,
          animationOptions: {
              duration: 750,
              easing: 'linear',
              queue: false
          }
      });
      return false;
    });

    //Init category card filtering from the category name displayed on the cards
    initCatCardFilters();

    //Init tags filtering
    initTagFilters();
  }

function initCatCardFilters() {
  // Category filter (in card)
  $('.cat-name').click(function(){
     var selector = $(this).attr('data-filter');
      $container.isotope({
          filter: selector,
          animationOptions: {
              duration: 750,
              easing: 'linear',
              queue: false
          }
      });
      return false;
  });
}

function initTagFilters () {
  // Tag filter (in card)
  $('.tag-name').click(function(){

     var selector = $(this).attr('data-filter');
      $container.isotope({
          filter: selector,
          animationOptions: {
              duration: 750,
              easing: 'linear',
              queue: false
          }
      });
      return false;
  });
}

  //More button on post cards
//   var currentPath;
//   function expandCard() {
//
//   $('.expand-card').click(function(){
//
//     currentPath = window.location.hash;
//     //console.log(currentPath);
//     // $('#post-modal .modal-content h4').text($(this).parent().parent().find('.card-title').text());
//     // $('#post-modal .modal-content p').html($(this).parent().parent().find('.full-content').html());
//     // $('#post-modal .full-content, #post-modal .tag-name').show();
//     //$('#post-modal').openModal();
//     let slug = $(this).attr('slug');
//     let currentView = $('.isotope-container').html();
//     getPosts(`filter[name]=${slug}&`, 1, false);
//     let stateObj = {foo: 'bar'};
//
//     $('.isotope-container').html('');
//
//     window.location.hash = slug;
//     initCatCardFilters();
//     initTagFilters();
//
//     $('.modal-content h4').text($(this).parent().parent().find('.card-title').text());
//     $('.modal-content p').html($(this).parent().parent().find('.full-content').html());
//     $('.full-content, .tag-name').show();
//     });
//
//     //Card Images
//     $('.card-image img').click(function(){
//       $(this).parent().parent().find('.expand-card').trigger('click');
//       console.log($(this).parent().parent().find('.expand-card'));
//     });
//   }
//
// $('#post-modal .modal-close, .lean-overlay').click(function(){
//   $('#post-modal').closeModal();
//   let stateObj = {old: 'state'};
//   window.location.hash = currentPath;
// });

// $('.expand-card').leanModal({
//   ready: function() { alert('Ready'); },
//   complete: function() {console.log('closed');}
// });

//   //On modal close
// $('.modal-close').click(function(){
//
// });

//API Calls
	var i, t,
  categories = {},
  tags = {},
  images = {},
  cardImg,
  cardImgTemp,
  posts, postTitle, postContent, postCatagories, postTags, categoryName, categoryID, categorySlug, tagName, tagID, tagSlug, catName;



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

  getJSON(`${wpURL}wp-json/wp/v2/categories?per_page=100`)
  .then(function(data){
    $.each(data, function(i, category){
      categories[category.id] = category.name;
      $( '.filters' ).append( `<option value=".${category.id}" catID="${category.id}">${category.name}</option>` );

      $('#mobile-demo').append(
        `
          <li><a class="category" catID=".${category.id}">${category.name}</a></li>
        `
      );
    });

     $('select').material_select();
  })
  .catch(function(error) {
    console.log(error);
  });

  getJSON(`${wpURL}wp-json/wp/v2/tags?per_page=100`)
  .then(function(data){
    $.each(data, function(i, tag){
      tags[tag.id] = tag.name;
    });
  })
  .catch(function(error) {
    console.log(error);
  });

// Fetch and render posts when images are ready
  function tryAgain() {
    if (Object.keys(images).length !== 0) {
      getPosts();
    } else {
      setTimeout(tryAgain, 200);
    }
  }
  //tryAgain();

  var path = window.location.hash.split("#")[1];
  // Fires when the url changes
    window.onhashchange = function(event) {
      path = window.location.hash.split("#")[1];
      $('.isotope-container').html('');
      if (window.location.hash !== "") {
        $('.isotope-container').html('');
        getPosts(`filter[name]=${path}&`, 1, false);
      } else {
        tryAgain();
      }
      console.log(path);
    };

    if (window.location.hash !== "") {
      $('.isotope-container').html('');
      getPosts(`filter[name]=${path}&`, 1, false);
    } else {
      tryAgain();
    }

  // Get Posts
  function getPosts(filterOpts='', perPage=100, isotopeInit=true) {
    getJSON(`${wpURL}wp-json/wp/v2/posts?${filterOpts}per_page=${perPage}`)
    .then(function(data){
      renderCards(data, isotopeInit);
    })
    .catch(function(error) {
      console.log(error);
    });
  }


    // Get Images
    function getImages() {
      getJSON(`${wpURL}wp-json/wp/v2/media?per_page=100`)
      .then(function(data){
        testImgArr = data;
        // This function is now unnecessary, but still here because getPosts wont run until the image var has data

        for(let thisImage of data){
          if(thisImage.media_type === 'image') {
            images[thisImage.id] = {
              thumb: thisImage.media_details.sizes.thumbnail.source_url || "",
              medium: thisImage.media_details.sizes.medium.source_url || "",
              'medium-large': thisImage.media_details.sizes.medium_large.source_url || "",
              large: thisImage.media_details.sizes.large.source_url || "",
              // 'post-thumb': (function(){if(thisImage.media_details.sizes.hasOwnProperty('post-thumbnail')){return thisImage.media_details.sizes['post-thumbnail'].source_url !== undefined}else{return ""}})(),
              full: thisImage.media_details.sizes.full.source_url || ""
            };
          }
        }
      })
      .catch(function(error) {
        console.log(error);
      });
    }

  // function checkUndefined(objName, keyName, valPath){
  //   if (valPath.hasOwnProperty(keyName)) {
  //     objName[]
  //   } else {
  //     ""
  //   }
  // }

  function renderCards(data, isotopeInit=true) {
    let i = 0;
    let cardImgArr;
    for(let post of data) {

      // Get media url for this post from data saved as cardImgArr
     if(post.featured_media !== 0) {
      cardImgArr = testImgArr.filter(function( obj ) { return obj.id == post.featured_media });
      //Check to make sure the desired image size exists
      if(cardImgArr[0].media_details.sizes.hasOwnProperty('post-thumbnail')) {
        cardImg = cardImgArr[0].media_details.sizes['post-thumbnail'].source_url;
      } else {
        //If not load another size
        cardImg = cardImgArr[0].media_details.sizes.large.source_url;
      }
        //This was were the image url initially came from
       //images[post.featured_media].large;
      cardImgTemp = `<div class="card-image">
                           <img src="${cardImg}"/>
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
         categoryTemplate = `${categoryTemplate} <div class="cat-name" data-filter=".${category.cat_ID}">${category.name}</div>`;
       }
     }

    //  Get tag data
    let tagNames = "";
    let tagIds = "";
    let tagTemplate = ""
    if (post.pure_taxonomies.tags !== undefined) {
       let tagData = post.pure_taxonomies.tags;

       for(let tag of tagData) {
         tagNames = tagNames + " " + tag.name;
         tagIds = `${tagIds} t${tag.term_id}`;
         tagTemplate = `${tagTemplate} <span class="tag-name" data-filter=.t${tag.term_id}>${tag.name},</span>`;
       }
     }

     $( '.isotope-container' ).append(
       `<div class="col s12 m6 l12 ${post.categories}${tagIds}">
         <div class="card isotope-item ${tagIds}">
            ${cardImgTemp}
            <div class="card-content" post-id=${post.id}>
              <div class="card-title">
                <a href="#${post.slug}">${post.title.rendered}</a>
              </div>
              <div class="content excerpt">
                ${categoryTemplate}
                ${post.excerpt.rendered}
              </div>
            </div>

          </div>
        </div>` );

        $(`div[post-id="${post.id}"] .more-link`).attr('href', `#${post.slug}`);

  //TODO: Convert the followin to use the category names and id's from the pure taxonomy fields
     //Attach Category names to cards
    //  $.each(post.categories, function(i, category){
    //    $(`div[post-id="${post.id}"] .content`).prepend(`<div class="cat-name" data-filter=".${category}">${categories[category]}</div>`);
    //  });



     //Attach Tag names to cards
    //  $.each(post.tags, function(i, tag){
    //    $(`div[post-id="${post.id}"] .content`).append(`<span class="tag-name" data-filter=".t${tag}">${tags[tag]} </span>`);
     //
    //    //Add tag IDs as classes for filtering
    //    $(`div[post-id="${post.id}"]`).parent().addClass(`t${tag}`);
     //
    //  });

     if (i === data.length - 1) {

       $('.isotope-container').imagesLoaded(function(){
         if (isotopeInit === true) {
          isotopeizeInit();

         } else {
           $container.isotope('destroy');
           isotopeizeInit();
         }
       });

     }
     i++;
   }
 }

//Init side nav
$(".button-collapse").sideNav({
  closeOnClick: true,
  menuWidth: 300
});


 //Search input
  var $searchInput,
    searchLen;

  $('.search-nav').addClass('hide-nav');

  $('.search-icon, .mobile-search-item').click(function(){
    //Hide navs
    $('nav').removeClass('show-nav').addClass('hide-nav');

    //Show search nav
    $('.search-nav').removeClass('hide-nav').addClass('show-nav');
    //Init select input
    $('.search-nav select').material_select();

    //Put cursor in search input
    $searchInput = $('#search');
    $searchInput.focus();

  });

  $('.search-nav .close-search, .section').not('.search-view').click(function(){
    if ($('.search-nav').hasClass('show-nav') === true) {
      //Hide nav
      $('nav').removeClass('show-nav').addClass('hide-nav');

      //Show main nav
      $('.main-nav').removeClass('hide-nav').addClass('show-nav');
    }
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
      total = 100,
      searchURL = `${wpURL}wp-json/wp/v2/posts?filter[s]=${val}&per_page=${total}`;

    // 600ms delay so we dont exectute excessively
    timer = setTimeout(function(){
      console.log('timer');
      // don't proceed if the value is empty or not equal to itself
				if ( !valEqual && !notEmpty )
					return false;
          console.log(val);
				// what if the user only types two characters?
				if ( val.length == 2 && !$(helper).length ) {
          console.log('2chars');
					// $( input ).after( helperSpan );
        }

        // if we have more than 3 characters
        if ( val.length >= 3 || val.length >= 3 && 13 == key ) {
          //TODO: after the || should be >= 1 maybe? want search to work with less than 3 on enter
console.log('3chars');
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
console.log('hi');
          // make the search request
          $('.isotope-container').html('');
          getPosts(`filter[s]=${val}&`, total, false);

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

});
