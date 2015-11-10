/*!
 * Popout
 * A simple jQuery promo popout.
 * http://adamcolejenkins.com
 * @author Adam Jenkins <adamcole83@gmail.com>
 * @version 1.0.1
 * Copyright 2015. MIT licensed.
 */
(function ($, window, document, undefined) {
  'use strict';

  window.Popout = {

    name : 'Popout',

    version : '1.0.1',

    options: {
      animations : {
        speed : 200
      },
      klasses : {
        element : 'popout',
        open: 'popout-open',
        control: 'popout-control'
      },
      cookie : {
        name: "PopoutCollapse",
        days: 1
      }
    },

    locked: false,

    init : function () {

      // Check if user has closed the window. When they close, a cookie is
      // set so it doesn't pop out again. The cookie options can be set above.
      if ( ! this.cookieIsSet()) {
        // Open the popout
        this.openPopout();
      }

      // Bind the control handle click events
      this.bindEvents();

    },

    openPopout : function (callback) {
      var $el = $( "." + this.options.klasses.element );

      // Lock the popout so it can't be harmed
      this.locked = true;

      // Animate the popout open
      $el.stop().animate({ right: 0 }, this.options.animations.speed, function () {

        // Toggle the open and close classes
        $el.toggleClass(window.Popout.options.klasses.open);

        // If a callback has been set, we will execute it
        if ("function" === typeof callback) {
          callback();
        }

        // Unlock the popout so we can go on with life
        window.Popout.locked = false;

      });
    },

    closePopout : function (callback) {
      var $el = $( "." + this.options.klasses.element );

      // Lock the popout so it can't be harmed
      this.locked = true;

      // Find the width of the popout content
      var position = -($el.outerWidth() - $el.find("." + this.options.klasses.control).outerWidth());

      // Animate the popout close
      $el.stop().animate({ right: position }, this.options.animations.speed, function () {

        // Toggle the open class
        $el.toggleClass(window.Popout.options.klasses.open);

        // If a callback has been set, we will execute it
        if ("function" === typeof callback) {
          callback();
        }

        // Unlock the popout so we can go on with life
        window.Popout.locked = false;

      });
    },

    isOpen : function () {
      return $( "." + this.options.klasses.element ).hasClass(this.options.klasses.open) && ! this.locked;
    },

    bindEvents : function () {
      var $el = $( "." + this.options.klasses.element );
      var $control = $el.find("." + this.options.klasses.control);

      $control.on("click", function () {

        // If the popout has the open class, let's close it
        if (window.Popout.isOpen()) {

          // Close the popout window
          window.Popout.closePopout(function () {

            // If the user triggers the popout to close, they're not interested
            // so let's set the cookie if it hasn't already been set
            if ( ! window.Popout.cookieIsSet()) {
              window.Popout.setCookie();
            }

          });
        } else {

          // Open the popout window
          window.Popout.openPopout(function () {

            // If the user triggers the popout to open, clearly they're interested
            // so we will unset the cookie if it has been set
            if (window.Popout.cookieIsSet()) {
              window.Popout.unsetCookie();
            }

          });
        }
      });

      // Close the window when the user scrolls down
      $(window).scroll(function () {

        // If the popout is open and the user scrolls, close it
        if(window.Popout.isOpen() &&  $(window).scrollTop() > 100) {
          window.Popout.closePopout();
        }
      });
    },

    // Helper method to create a cookie
    // See: http://www.quirksmode.org/js/cookies.html
    setCookie : function ( unset ) {
      var expires = unset ? "" : this.options.cookie.days, value = unset ? "" : true;

      if (unset !== true) {
        var date = new Date();
        date.setTime(date.getTime() + (this.options.cookie.days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
      }

      document.cookie = this.options.cookie.name + "=" + value + expires + "; path=/";
    },

    // Helper method to retrieve cookie
    // See: http://www.quirksmode.org/js/cookies.html
    cookieIsSet : function () {
      var name = this.options.cookie.name + "=";
      var ca = document.cookie.split(';');
      for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1,c.length);
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length,c.length);
        }
      }
      return false;
    },

    // Helper method to unset cookie
    // See: http://www.quirksmode.org/js/cookies.html
    unsetCookie : function () {
      this.setCookie(true);
    }

  };

  // On your mark...get set... GO!
  $(document).ready(function () {
    window.Popout.init();
  });

}(jQuery, window, window.document));