class SwiftSlider extends HTMLElement {
  constructor() {
    super();

    this.elements = {
      view:  this.querySelector('.swift-slider__view'),
      slides: this.querySelectorAll('.swift-slide'),
      dots: null,
      nextButton: null,
      prevButton: null
    }

    this.states = {
      hovered: false, // Is the user hovering over the slideshow
      activeIndex: 0, // The current active slide
      prevIndex: 0 // The previous active slide
    }

    this.settings = {
      perSlide: Number(this.dataset.perSlide ? this.dataset.perSlide : 1), // How many slides per view
      initialSlide: Number(this.dataset.initialSlide ? this.dataset.initialSlide : 0), // The initial slide to display
      sliderDirection: this.dataset.sliderDirection ? this.dataset.sliderDirection : 'horizontal', // Horizontal or vertical
      sliderSpeed: Number(this.dataset.sliderSpeed ? this.dataset.sliderSpeed : 0), //Speed of slider in seconds (0 = disabled)
      showButtons: this.dataset.showButtons, // Show or hide buttons
      showDots: this.dataset.showDots // Show or hide dots
    }
  }

  connectedCallback() {
    this.changeSlide(this.settings.initialSlide, false, 'instant');
    this.calculatePerSlide();
    this.generateButtons();
    this.generateDots();
    this.eventHandler();
    if (this.settings.sliderSpeed !== 0) this.setSlideSpeed();

    // Emit event when slider is ready
    this.dispatchEvent(new CustomEvent('swift-slider:ready', { bubbles: true, detail: { slider: this } }));
  }

  changeSlide(targetIndex, skipScroll = false, behavior = 'smooth') {
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
      this.querySelector('.swift-slider__dot--active').classList.remove('swift-slider__dot--active');
      this.querySelectorAll('.swift-slider__dot')[targetIndex].classList.add('swift-slider__dot--active');
    }

    // Set new activeIndex and prevIndex
    this.states.prevIndex = this.states.activeIndex;
    this.states.activeIndex = targetIndex;

    this.dispatchEvent(new CustomEvent('swift-slider:changed', { bubbles: true,
      detail: {
        slider: this ,
        activeIndex: this.states.activeIndex,
        prevIndex: this.states.prevIndex
      }
    }));
  }

  calculatePerSlide() {
    if (this.settings.perSlide === 1) return;

    if (this.settings.sliderDirection === 'horizontal') {
      this.elements.slides.forEach(slide => {
        slide.style = `width: ${100 / this.settings.perSlide}%; min-width: ${100 / this.settings.perSlide}%;`;
      });
    } else {
      this.elements.slides.forEach(slide => {
        slide.style = `height: ${100 / this.settings.perSlide}%; min-height: ${100 / this.settings.perSlide}%;`;
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

    // Determine if next button is pressed
    this.elements.nextButton.addEventListener('click', () => {
      if (this.states.activeIndex === this.elements.slides.length - 1) {
        this.changeSlide(0);
      } else {
        this.changeSlide(this.states.activeIndex + 1);
      }
    });

    // Determine if prev button is pressed
    this.elements.prevButton.addEventListener('click', () => {
      if (this.states.activeIndex === 0) {
        this.changeSlide(this.elements.slides.length - 1);
      } else {
        this.changeSlide(this.states.activeIndex - 1);
      }
    });
  }

  generateDots() {
    if (this.settings.showDots === 'false') return;

    const dots = document.createElement('ul');
    dots.classList.add('swift-slider__dots');

    this.elements.slides.forEach((slide, index) => {
      const dot = document.createElement('li');
      dot.classList.add('swift-slider__dot');
      if (index === this.settings.initialSlide) dot.classList.add('swift-slider__dot--active');
      dot.setAttribute('tabindex', '0');
      dot.setAttribute('aria-label', `Slide ${index + 1}`);
      dots.appendChild(dot);

      // Determine if dot is pressed
      dot.addEventListener('click', () => {
        this.changeSlide(index);
      });

      // Determine if spacebar is pressed on dot
      dot.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
          this.changeSlide(index);
        }
      });

    });

    this.elements.dots = dots; // Set dots to elements

    this.appendChild(dots);
  }

  eventHandler() {
    /* NOTE: Dots, Prev and Next button events are handled in generateDots() and generateButtons() */

    // Determine if slider is hovered
    this.addEventListener('mouseover', () => {
      this.states.hovered = true;
    });

    // Determine if slider is not hovered
    this.addEventListener('mouseleave', () => {
      this.states.hovered = false;
    });

    this.addEventListener('swift-slider:goto', (e) => {
      if (!e.detail.id == this.id) return;
      this.changeSlide(e.detail.targetIndex, 'instant');
    });

    // Determine left/right arrow keypress
    document.addEventListener('keydown', (e) => {
      if (!this.states.hovered) return;

      if (e.key === 'ArrowRight') {
        if (this.states.activeIndex === this.elements.slides.length - 1) {
          this.changeSlide(0);
        } else {
          this.changeSlide(this.states.activeIndex + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (this.states.activeIndex === 0) {
          this.changeSlide(this.elements.slides.length - 1);
        } else {
          this.changeSlide(this.states.activeIndex - 1);
        }
      }
    });

    // Determine if slide has been scrolled and debounce the user scrolling function
    this.elements.view.addEventListener('scroll',() => {
      this.debounce(this.determineUserScroll(), 100);
    }, { passive: false });
  }

  determineUserScroll() {
    if (this.elements.view.scrollLeft === 0) { // We're at the start of the slider
      this.changeSlide(0, true);
    } else if (this.elements.view.scrollLeft === this.elements.view.scrollWidth) { // We're at the end of the slider
      this.changeSlide(this.elements.slides.length - 1, true);
    } else { // Figure out where we are in the slider
      this.changeSlide(Math.round(this.elements.view.scrollLeft / this.elements.slides[0].offsetWidth), true)
    }
  }

  setSlideSpeed() {
    this.slideInterval = setInterval(() => {
      if (this.states.hovered) return;

      if (this.states.activeIndex === this.elements.slides.length - 1) {
        this.changeSlide(0);
      } else {
        this.changeSlide(this.states.activeIndex + 1);
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
}

customElements.define('swift-slider', SwiftSlider);
