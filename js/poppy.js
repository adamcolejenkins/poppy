/*!
 * Poppy
 * A simple jQuery promo popout.
 * http://adamcolejenkins.com
 * @author Adam Jenkins <adamcole83@gmail.com>
 * @version 1.0.1
 * Copyright 2015. MIT licensed.
 */
(function ($, window, document, undefined) {
  'use strict';

  window.Poppy = {

    name : 'Poppy',

    version : '1.0.1',

    options: {
      animations : {
        speed : 200
      },
      klasses : {
        element : 'poppy',
        open: 'poppy-open',
        control: 'poppy-control'
      },
      cookie : {
        name: "PoppyCollapse",
        days: 1
      }
    },

    locked: false,

    init : function () {

      // Set our element for Rock & Roll
      this.$el = $( "." + this.options.klasses.element );

      // Check if user has closed the window. When they close, a cookie is
      // set so it doesn't pop out again. The cookie options can be set above.
      if ( ! this.cookieIsSet()) {
        // Open the popout
        this.openPopout();
      }

      // Bind the control handle click events
      this.bindEvents();

    },

    bindEvents : function () {
      var $control = this.$el.find("." + this.options.klasses.control);

      // On control handle click, toggle the state of which Poppy is in
      // If it's open, close it & vice versa.
      $control.on("click", this.toggleState);

      // Close the window when the user scrolls down
      $(window).scroll(function () {

        // If the popout is open and the user scrolls, close it
        if(window.Poppy.isOpen() &&  $(window).scrollTop() > 100) {
          window.Poppy.closePopout();
        }

      });

    },

    openPopout : function (callback) {

      // Lock the popout so it can't be harmed
      this.locked = true;

      // Animate the popout open and call complete
      this.$el.stop().animate({ right: 0 }, this.options.animations.speed, this.openCompleted(callback));

    },

    openCompleted : function (callback) {

        // Toggle the open and close classes
        this.$el.toggleClass(this.options.klasses.open);

        // If a callback has been set, we will execute it
        if ("function" === typeof callback) {
          callback();
        }

        // Unlock the popout so we can go on with life
        this.locked = false;

    },

    closePopout : function (callback) {

      // Lock the popout so it can't be harmed
      this.locked = true;

      // Find the width of the popout content
      var position = -(this.$el.outerWidth() - this.$el.find("." + this.options.klasses.control).outerWidth());

      // Animate the popout close
      this.$el.stop().animate({ right: position }, this.options.animations.speed, this.closeCompleted(callback));

    },

    closeCompleted : function (callback) {

      // Toggle the open class
      this.$el.toggleClass(this.options.klasses.open);

      // If a callback has been set, we will execute it
      if ("function" === typeof callback) {
        callback();
      }

      // Unlock the popout so we can go on with life
      this.locked = false;

    },

    toggleState : function () {

      // If Poppy is open, close it
      if (window.Poppy.isOpen()) {

        // If the user triggers the popout to close, they're not interested
        // so let's set the cookie if it hasn't already been set
        return window.Poppy.closePopout() && window.Poppy.setCookie();

      }

      // Otherwise it's closed so open it, duh
      else {

        // If the user triggers the popout to open, clearly they're interested
        // so we will unset the cookie if it has been set
        return window.Poppy.openPopout() && window.Poppy.unsetCookie();

      }

    },

    isOpen : function () {
      return this.$el.hasClass(this.options.klasses.open) && ! this.locked;
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
    window.Poppy.init();
  });

}(jQuery, window, window.document));