function ScrollShow(selector, options) {
  this.prevPageY = window.pageYOffset;
  this.stylesBeforeShow = {
    transitionProperty: 'none',
    transitionDuration: '0ms',
    transitionDelay: '0ms',
    transitionTimingFunction: 'cubic-bezier(0.5, 0, 0, 1)',
    opacity: '0',
    transform: 'translate(0px, 0px)'
  };
  this.stylesAfterShow = {
    transitionProperty: 'opacity, transform',
    transitionDuration: '600ms',
    transitionDelay: '0ms',
    transitionTimingFunction: 'cubic-bezier(0.5, 0, 0, 1)',
    opacity: '1',
    transform: 'translate(0px, 0px)'
  };
  this.config = {
    delay: 0,
    duration: 600,
    easing: 'cubic-bezier(0.5, 0, 0, 1)',
    slide: true,
    slideDistance: '25px',
    once: false
  };

  this.hideElements = function(elements) {
    var elements = document.querySelectorAll('.scroll-show');
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      for (var j = 0; j < Object.keys(this.stylesBeforeShow).length; j++) {
        var key = Object.keys(this.stylesBeforeShow)[j];
        element.style[key] = this.stylesBeforeShow[key];
      }
      element.classList.remove('scroll-show--visible');
    }
  };

  this.isElementVisible = function(element) {
    var windowBounds = {
        top: window.pageYOffset,
        right: window.pageXOffset + window.innerWidth,
        bottom: window.pageYOffset + window.innerHeight,
        left: window.pageXOffset
      },
      elementRect = element.getBoundingClientRect(),
      elementBounds = {
        top: elementRect.top + windowBounds.top,
        right: elementRect.left + elementRect.width,
        bottom: elementRect.top + windowBounds.top + elementRect.height,
        left: elementRect.left
      };

    return (
      (elementBounds.top < windowBounds.bottom &&
        elementBounds.right > windowBounds.left &&
        elementBounds.bottom > windowBounds.top &&
        elementBounds.left < windowBounds.right) ||
      element.style.position === 'fixed'
    );
  };

  this.onScroll = function() {
    var elements = document.querySelectorAll('.scroll-show'),
      direction = this.prevPageY > window.pageYOffset ? 'up' : 'down',
      pageYDiff = Math.abs(this.prevPageY - window.pageYOffset);

    if (this.config.slide == true) {
      if (pageYDiff > 0) {
        this.stylesBeforeShow.transform =
          direction === 'down' ? 'translate(0px, ' + this.config.slideDistance + ')' : 'translate(0px, -' + this.config.slideDistance + ')';
      }
    }

    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      if (this.isElementVisible(element)) {
        for (var k = 0; k < Object.keys(this.stylesAfterShow).length; k++) {
          var key = Object.keys(this.stylesAfterShow)[k];
          element.style[key] = this.stylesAfterShow[key];
        }
        element.classList.add('scroll-show--visible');
      } else {
        if (this.config.once == false || !element.classList.contains('scroll-show--visible')) {
          for (var j = 0; j < Object.keys(this.stylesBeforeShow).length; j++) {
            var key = Object.keys(this.stylesBeforeShow)[j];
            element.style[key] = this.stylesBeforeShow[key];
          }
          element.classList.remove('scroll-show--visible');
        }
      }
    }

    // store previous scroll position
    this.prevPageY = window.pageYOffset;
  };

  this.constructor = function() {
    // set transition parameters based on defaults
    this.stylesAfterShow.transitionDuration = this.config.duration + 'ms';

    // override transition parameters based on options
    if (options) {
      if (options.delay) {
        var value = options.delay;
        if (typeof value == 'number') {
          this.stylesAfterShow.transitionDelay = value + 'ms';
        } else if (typeof value == 'string') {
          this.stylesAfterShow.transitionDelay = value;
        }
      }
      if (options.duration) {
        var value = options.duration;
        if (typeof value == 'number') {
          this.stylesAfterShow.transitionDuration = value + 'ms';
        } else if (typeof value == 'string') {
          this.stylesAfterShow.transitionDuration = value;
        }
      }
      if (options.easing) {
        this.config.easing = options.easing;
        this.stylesBeforeShow.transitionTimingFunction = this.config.easing;
        this.stylesAfterShow.transitionTimingFunction = this.config.easing;
      }
      if (options.once == true) {
        this.config.once = options.once;
      }
      if (options.slide == false) {
        this.config.slide = options.slide;
        delete this.stylesBeforeShow.transform;
        delete this.stylesAfterShow.transform;
      }
      if (options.slideDistance) {
        this.config.slideDistance = options.slideDistance;
      }
    }

    var elements = document.querySelectorAll(selector);
    if (elements.length) {
      for (var i = 0; i < elements.length; i++) {
        elements[i].classList.add('scroll-show');
      }
    }
    this.hideElements();

    this.onScroll();
    window.addEventListener('scroll', this.onScroll.bind(this));
  };

  this.constructor();
}
