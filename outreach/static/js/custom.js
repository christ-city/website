/*global jQuery:false */
jQuery(document).ready(function($) {
  "use strict";


  (function() {

    var $menu = $('.navigation nav'),
      optionsList = '<option value="" selected>Go to..</option>';

    $menu.find('li').each(function() {
        var $this = $(this),
          $anchor = $this.children('a'),
          depth = $this.parents('ul').length - 1,
          indent = '';

        if (depth) {
          while (depth > 0) {
            indent += ' - ';
            depth--;
          }

        }
        $(".nav li").parent().addClass("bold");

        optionsList += '<option value="' + $anchor.attr('href') + '">' + indent + ' ' + $anchor.text() + '</option>';
      }).end()
      .after('<select class="selectmenu">' + optionsList + '</select>');

    $('select.selectmenu').on('change', function() {
      window.location = $(this).val();
    });

  })();

  function toggleMenu() {
    const nav = document.querySelector(".nav-links");
    nav.classList.toggle("show");
}



  $('.toggle-link').each(function() {
    $(this).click(function() {
      var state = 'open'; //assume target is closed & needs opening
      var target = $(this).attr('data-target');
      var targetState = $(this).attr('data-target-state');

      //allows trigger link to say target is open & should be closed
      if (typeof targetState !== 'undefined' && targetState !== false) {
        state = targetState;
      }

      if (state == 'undefined') {
        state = 'open';
      }

      $(target).toggleClass('toggle-link-' + state);
      $(this).toggleClass(state);
    });
  });

  //add some elements with animate effect

  $(".big-cta").hover(
    function() {
      $('.cta a').addClass("animated shake");
    },
    function() {
      $('.cta a').removeClass("animated shake");
    }
  );
  $(".box").hover(
    function() {
      $(this).find('.icon').addClass("animated pulse");
      $(this).find('.text').addClass("animated fadeInUp");
      $(this).find('.image').addClass("animated fadeInDown");
    },
    function() {
      $(this).find('.icon').removeClass("animated pulse");
      $(this).find('.text').removeClass("animated fadeInUp");
      $(this).find('.image').removeClass("animated fadeInDown");
    }
  );


  $('.accordion').on('show', function(e) {

    $(e.target).prev('.accordion-heading').find('.accordion-toggle').addClass('active');
    $(e.target).prev('.accordion-heading').find('.accordion-toggle i').removeClass('icon-plus');
    $(e.target).prev('.accordion-heading').find('.accordion-toggle i').addClass('icon-minus');
  });

  $('.accordion').on('hide', function(e) {
    $(this).find('.accordion-toggle').not($(e.target)).removeClass('active');
    $(this).find('.accordion-toggle i').not($(e.target)).removeClass('icon-minus');
    $(this).find('.accordion-toggle i').not($(e.target)).addClass('icon-plus');
  });



  //Navi hover
  $('ul.nav li.dropdown').hover(function() {
    $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn();
  }, function() {
    $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut();
  });

  // tooltip
  $('.social-network li a, .options_box .color a').tooltip();
  //scroll to top
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.scrollup').fadeIn();
    } else {
      $('.scrollup').fadeOut();
    }
  });
  $('.scrollup').click(function() {
    $("html, body").animate({
      scrollTop: 0
    }, 1000);
    return false;
  });

  $(document).ready(function () {
    if ($.fn.jcarousel) { // Ensure jCarousel is loaded
        console.log("jCarousel is loaded and initializing...");
        $("#mycarousel, #mycarousel1").jcarousel({
            wrap: "circular",  // Ensures continuous scrolling
            animation: 600
        });
    } else {
        console.error("jCarousel is not loaded!");
    }
});


  //flexslider
  $('.flexslider').flexslider();

  //nivo slider
  $('.nivo-slider').nivoSlider({
    effect: 'random', // Specify sets like: 'fold,fade,sliceDown'
    slices: 15, // For slice animations
    boxCols: 8, // For box animations
    boxRows: 4, // For box animations
    animSpeed: 500, // Slide transition speed
    pauseTime: 5000, // How long each slide will show
    startSlide: 0, // Set starting Slide (0 index)
    directionNav: true, // Next & Prev navigation
    controlNav: false, // 1,2,3... navigation
    controlNavThumbs: false, // Use thumbnails for Control Nav
    pauseOnHover: true, // Stop animation while hovering
    manualAdvance: false, // Force manual transitions
    prevText: '', // Prev directionNav text
    nextText: '', // Next directionNav text
    randomStart: false, // Start on a random slide
    beforeChange: function() {}, // Triggers before a slide transition
    afterChange: function() {}, // Triggers after a slide transition
    slideshowEnd: function() {}, // Triggers after all slides have been shown
    lastSlide: function() {}, // Triggers when last slide is shown
    afterLoad: function() {} // Triggers when slider has loaded
  });

  // Da Sliders
  if ($('#da-slider').length) {
    $('#da-slider').cslider();
  }

  //slitslider
  var Page = (function() {

    var $nav = $('#nav-dots > span'),
      slitslider = $('#slider').slitslider({
        onBeforeChange: function(slide, pos) {
          $nav.removeClass('nav-dot-current');
          $nav.eq(pos).addClass('nav-dot-current');
        }
      }),

      init = function() {
        initEvents();
      },
      initEvents = function() {
        $nav.each(function(i) {
          $(this).on('click', function() {
            var $dot = $(this);

            if (!slitslider.isActive()) {
              $nav.removeClass('nav-dot-current');
              $dot.addClass('nav-dot-current');
            }

            slitslider.jump(i + 1);
            return false;

          });

        });

      };

    return {
      init: init
    };
  })();

  Page.init();

});

// Replace or update the handler
$('.navbar .nav > li > a, .navbar .dropdown-menu a').on('click', function(e) {
  console.log('Menu clicked');
  var $parent = $(this).parent();
  
  // If it's a dropdown toggle, don't navigate immediately
  if ($parent.hasClass('dropdown-toggle') || $parent.hasClass('dropdown')) {
      e.preventDefault();
      $parent.toggleClass('open');
  } else {
      // Normal link, allow navigation
  }
});

$(document).ready(function () {
  $(".menu-toggle").click(function (event) {
      event.preventDefault(); // Prevents default behavior
      $(".nav-links").toggleClass("active"); // Toggle menu visibility
  });

  // Prevent menu from closing when clicking inside
  $(".nav-links").click(function (event) {
      event.stopPropagation();
  });

  // Close menu when clicking outside
  $(document).click(function (event) {
      if (!$(event.target).closest(".menu-toggle, .nav-links").length) {
          $(".nav-links").removeClass("active");
      }
  });
});

  


