class SwiftSlider extends HTMLElement {
  constructor() {
    super();

    this.elements = {
      view:  this.querySelector('.swift-slider__view'),
      slides: this.querySelectorAll('.swift-slide'),
      dots: null,
      nextButton: null,
      prevButton: null,
      navigation: document.querySelector(`[data-swift-nav-for="${this.id}"]`) ? document.querySelector(`[data-swift-nav-for="${this.id}"]`) : null
    }

    this.states = {
      hovered: false, // Is the user hovering over the slideshow
      currentIndex: 0, // The current active slide
      prevIndex: 0, // The previous active slide
      scrolling: false // Is the view currently scrolling
    }

    this.settings = {
      perFrame: Number(this.dataset.perFrame ? this.dataset.perFrame : 1), // How many slides per view
      initialSlide: Number(this.dataset.initialSlide ? this.dataset.initialSlide : 0), // The initial slide to display
      sliderDirection: this.dataset.sliderDirection ? this.dataset.sliderDirection : 'horizontal', // Horizontal or vertical
      sliderSpeed: Number(this.dataset.sliderSpeed ? this.dataset.sliderSpeed : 0), //Speed of slider in seconds (0 = disabled)
      showButtons: this.dataset.showButtons ? this.dataset.showButtons : 'false', // Show or hide buttons
      showDots: this.dataset.showDots ? this.dataset.showDots : 'false' // Show or hide dots
    }
  }

  connectedCallback() {
    this.changeSlide(this.settings.initialSlide, false, 'instant');
    this.calculatePerFrame();

    if (this.elements.slides.length > this.settings.perFrame) {
      this.generateButtons();
      this.generateDots();
    }

    if (this.elements.navigation) {
      this.navHandler();
    }

    this.eventHandler();
    if (this.settings.sliderSpeed !== 0) this.setSlideSpeed();

    // Emit event when slider is ready
    this.dispatchEvent(new CustomEvent('swift-slider:ready', { bubbles: true, detail: { slider: this } }));
  }

  changeSlide(targetIndex, skipScroll = false, behavior = 'smooth') {
    targetIndex = Number(targetIndex);

    if (!skipScroll) {
      if (this.settings.sliderDirection === 'horizontal') {
        this.elements.view.scrollTo({
          left: this.elements.slides[targetIndex].offsetLeft,
          behavior: behavior
        });
      } else {
        this.elements.view.scrollTo({
          top: this.elements.slides[targetIndex].offsetTop,
          behavior: behavior
        });
      }
    }

    // Set active dot
    if (this.settings.showDots === 'true' && this.elements.dots) {
      if (this.querySelector('.swift-slider__dot--active')) this.querySelector('.swift-slider__dot--active').classList.remove('swift-slider__dot--active');
      this.querySelectorAll('.swift-slider__dot')[targetIndex].classList.add('swift-slider__dot--active');
    }

    // Set new currentIndex and prevIndex
    this.states.prevIndex = this.states.currentIndex;
    this.states.currentIndex = targetIndex;
  }

  calculatePerFrame() {
    if (this.settings.perFrame === 1) return;

    if (this.settings.sliderDirection === 'horizontal') {
      this.elements.slides.forEach(slide => {
        slide.style = `width: ${100 / this.settings.perFrame}%; min-width: ${100 / this.settings.perFrame}%;`;
      });
    } else {
      this.elements.slides.forEach(slide => {
        slide.style = `height: ${100 / this.settings.perFrame}%; min-height: ${100 / this.settings.perFrame}%;`;
      });
    }
  }

  generateButtons() {
    if (this.settings.showButtons === 'false') return;

    const buttons = document.createElement('div');
    buttons.classList.add('swift-slider__buttons');

    const prevButton = document.createElement('button');
    prevButton.classList.add('swift-slider__button');
    prevButton.dataset.buttonPrev = '';
    prevButton.innerHTML = '&larr;';
    prevButton.setAttribute('aria-label', 'Previous');
    buttons.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.classList.add('swift-slider__button');
    nextButton.dataset.buttonNext = '';
    nextButton.innerHTML = '&rarr;';
    nextButton.setAttribute('aria-label', 'Next');
    buttons.appendChild(nextButton);

    this.elements.prevButton = prevButton; // Set prevButton to elements
    this.elements.nextButton = nextButton; // Set nextButton to elements

    this.appendChild(buttons);

    // Determine if prev button is pressed
    this.elements.prevButton.addEventListener('click', () => {
      if (this.states.currentIndex === 0) {
        this.changeSlide(this.elements.slides.length - 1);
      } else {
        this.changeSlide(this.states.currentIndex - 1);
      }
    });

    // Determine if next button is pressed
    this.elements.nextButton.addEventListener('click', () => {
      if (this.states.currentIndex === this.elements.slides.length - 1) {
        this.changeSlide(0);
      } else {
        this.changeSlide(this.states.currentIndex + 1);
      }
    });
  }

  generateDots() {
    if (this.settings.perFrame === 1) {
      this.totalCalculatedSlides = this.elements.slides.length;
    } else {
      this.totalCalculatedSlides = (Math.floor(this.elements.slides.length / this.settings.perFrame) + 1);
    }

    if (this.settings.showDots === 'false') return;

    const dots = document.createElement('ul');
    dots.classList.add('swift-slider__dots');

    for(let i = 0; i < this.totalCalculatedSlides; i++) {
      const dot = document.createElement('li');
      dot.classList.add('swift-slider__dot');
      if (i === this.settings.initialSlide) dot.classList.add('swift-slider__dot--active');
      dot.setAttribute('tabindex', '0');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dots.appendChild(dot);

      // Determine if dot is pressed
      dot.addEventListener('click', () => {
        this.changeSlide(i);
      });

      // Determine if enter is pressed on dot
      dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.changeSlide(i);
        }
      });
    }

    this.elements.dots = dots; // Set dots to elements

    this.appendChild(dots);
  }

  determineUserScroll() {
    if (this.settings.sliderDirection === 'horizontal') {
      if (this.elements.view.scrollLeft === 0) { // We're at the start of the slider
        this.changeSlide(0, true);
      } else if (this.elements.view.scrollLeft === this.elements.view.scrollWidth) { // We're at the end of the slider
        this.changeSlide(this.totalCalculatedSlides - 1, true);
      } else { // Figure out where we are in the slider
        this.changeSlide(Math.round(this.elements.view.scrollLeft / this.elements.slides[0].offsetWidth), true)
      }
    } else {
      if (this.elements.view.scrollTop === 0) { // We're at the start of the slider
        this.changeSlide(0, true);
      } else if (this.elements.view.scrollTop === this.elements.view.scrollHeight) { // We're at the end of the slider
        this.changeSlide(this.totalCalculatedSlides - 1, true);
      } else { // Figure out where we are in the slider
        this.changeSlide(Math.round(this.elements.view.scrollTop / this.elements.slides[0].offsetHeight), true)
      }
    }
  }

  setSlideSpeed() {
    this.slideInterval = setInterval(() => {
      if (this.states.hovered) return;

      if (this.states.currentIndex === this.totalCalculatedSlides - 1) {
        this.changeSlide(0);
      } else {
        this.changeSlide(this.states.currentIndex + 1);
      }
    }, this.settings.sliderSpeed*1000); // Convert value to milliseconds
  }

  debounce(func, wait, immediate) {
    let timeout;

    return function executedFunction() {
      const context = this;
      const args = arguments;

      const later = () => {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };

      const callNow = immediate && !timeout;

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);

      if (callNow) func.apply(context, args);
    };
  }

  navHandler() {
    this.elements.navItems = this.elements.navigation.children;

    if (this.elements.navItems.length !== this.elements.slides.length) {
      console.error('Swift slider: The number of navigation items does not match the number of slides.');
      this.elements.navigation = null;
      return;
    }

    this.elements.navItems[this.states.currentIndex].classList.add('swift-slider--nav-active');

    //loop through each nav item and add event listener
    for(let i = 0; i < this.elements.navItems.length; i++) {
      this.elements.navItems[i].addEventListener('click', () => {
        this.changeSlide(i, false, 'instant');

        for(let j = 0; j < this.elements.navItems.length; j++) {
          this.elements.navItems[j].classList.remove('swift-slider--nav-active');
        }

        this.elements.navItems[i].classList.add('swift-slider--nav-active');
      });
    }
  }

  eventHandler() {
    /* NOTE: Dots, Prev and Next button events are handled in generateDots() and generateButtons() */

    /* Hover events
    ============================== */
    this.addEventListener('mouseover', () => {
      this.states.hovered = true;
    });

    this.addEventListener('mouseleave', () => {
      this.states.hovered = false;
    });

    /* Custom events
    ============================== */

    document.addEventListener('swift-slider:goto', (e) => {
      if (e.detail.id !== this.id) return;
      this.changeSlide(e.detail.targetIndex, false, 'instant');
    });

    /* Keyboard events
    ============================== */

    document.addEventListener('keydown', (e) => {
      if (!this.states.hovered) return;

      if (e.key === 'ArrowRight') {
        if (this.states.currentIndex === this.totalCalculatedSlides - 1) {
          this.changeSlide(0);
        } else {
          this.changeSlide(this.states.currentIndex + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (this.states.currentIndex === 0) {
          this.changeSlide(this.totalCalculatedSlides - 1);
        } else {
          this.changeSlide(this.states.currentIndex - 1);
        }
      }
    });

    /* Slide change events
    ============================== */

    this.elements.view.addEventListener('scroll', () => {
      if (this.states.scrolling) return;
      this.states.scrolling = true;
      this.dispatchEvent(new CustomEvent('swift-slider:change', { bubbles: true,
        detail: {
          slider: this
        }
      }));
    });

    this.elements.view.addEventListener('scrollend', () => {
      if (!this.states.scrolling) return;
      this.states.scrolling = false;
      this.dispatchEvent(new CustomEvent('swift-slider:settle', { bubbles: true,
        detail: {
          slider: this,
          currentIndex: this.states.currentIndex,
          prevIndex: this.states.prevIndex
        }
      }));
    }, { passive: false });

    this.elements.view.addEventListener('scroll',() => {
      this.debounce(this.determineUserScroll(), 100);
    }, { passive: false });

    if (this.elements.navigation) {
      document.addEventListener('swift-slider:settle', (e) => {
        if (e.detail.slider.id !== this.id) return;
        for(let i = 0; i < this.elements.navItems.length; i++) {
          this.elements.navItems[i].classList.remove('swift-slider--nav-active');
        }

        this.elements.navItems[e.detail.currentIndex].classList.add('swift-slider--nav-active');
      });
    }
  }
}

customElements.define('swift-slider', SwiftSlider);
