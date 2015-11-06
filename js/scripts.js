(function ($, window, document) {
  'use strict';

  window.Popout = {

    name : 'Popout',

    version : '1.0.0',

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

    init : function () {

      // Check if user has closed the window. When they close, a cookie is
      // set so it doesn't pop out again. The cookie options can be set above.
      if ( ! this.cookieIsSet()) {
        // Open the popout
        this.openPopout();
      }

      // Bind the control handle click events
      this.bindClickEvents();

    },

    openPopout : function () {
      var $el = $( "." + this.options.klasses.element );

      // Animate the popout open
      $el.stop().animate({ right: 0 }, this.options.animations.speed, function () {

        // Toggle the open and close classes
        $el.toggleClass(window.Popout.options.klasses.open);

        // Unset the cookie if it has been set
        if (window.Popout.cookieIsSet()) {
          window.Popout.unsetCookie();
        }

      });
    },

    closePopout : function () {
      var $el = $( "." + this.options.klasses.element );

      // Find the width of the popout content
      var position = -($el.outerWidth() - $el.find("." + this.options.klasses.control).outerWidth());

      // Animate the popout close
      $el.stop().animate({ right: position }, this.options.animations.speed, function () {

        // Toggle the open class
        $el.toggleClass(window.Popout.options.klasses.open);

        // Set the cookie if it hasn't already been set
        if ( ! window.Popout.cookieIsSet()) {
          window.Popout.setCookie();
        }

      });
    },

    bindClickEvents : function () {
      var $el = $( "." + this.options.klasses.element );
      var $control = $el.find("." + this.options.klasses.control);

      $control.on("click", function () {
        if ($el.hasClass(window.Popout.options.klasses.open)) {
          window.Popout.closePopout();
        } else {
          window.Popout.openPopout();
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

  $(document).ready(function () {
    window.Popout.init();
  });

}(jQuery, window, window.document));