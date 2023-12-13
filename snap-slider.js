class SnapSlider extends HTMLElement {
  constructor() {
    super();

    this.states = {
      hovered: false, // Is the user hovering over the slideshow
      activeIndex: 0, // The current active slide
      prevIndex: 0 // The previous active slide
    }

    this.elements = {
      view:  this.querySelector('.snap-slider__view'),
      slides: this.querySelectorAll('.snap-slide'),
      nextButton: null,
      prevButton: null,
      dots: this.querySelector('.snap-slider__dots')
    }

    this.settings = {
      perSlide: Number(this.dataset.perSlide ? this.dataset.perSlide : 1), // How many slides per view
      initialSlide: Number(this.dataset.initialSlide ? this.dataset.initialSlide : 0),
      sliderDirection: this.dataset.sliderDirection ? this.dataset.sliderDirection : 'horizontal',
      sliderSpeed: Number(this.dataset.sliderSpeed ? this.dataset.sliderSpeed : 0),
      showButtons: this.dataset.showButtons,
      showDots: this.dataset.showDots,
    }
  }

  connectedCallback() {
    this.changeSlide(this.settings.initialSlide, 'instant');
    this.calculatePerSlide();
    this.generateButtons();
    this.generateDots();
    this.eventHandler();

    if (this.settings.sliderSpeed !== 0) this.setSliderSpeed();

    // Emit event when slider is ready
    this.dispatchEvent(new CustomEvent('snap-slider:ready', { bubbles: true, detail: { slider: this } }));
    console.log(this)
  }

  setSliderSpeed() {
    this.slideInterval = setInterval(() => {
      if (this.states.hovered) return;

      if (this.states.activeIndex === this.elements.slides.length - 1) {
        this.changeSlide(0);
      } else {
        this.changeSlide(this.states.activeIndex + 1);
      }
    }, this.settings.sliderSpeed*1000);
  }

  changeSlide(targetIndex, behavior = 'smooth') {
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

    // Set new activeIndex and prevIndex
    this.states.prevIndex = this.states.activeIndex;
    this.states.activeIndex = targetIndex;

    this.dispatchEvent(new CustomEvent('snap-slider:changed', { bubbles: true,
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

  eventHandler() {
    /* NOTE: Prev and Next button events are handled in generatebuttons() */

    // Determine if slider is hovered
    this.addEventListener('mouseover', () => {
      this.states.hovered = true;
    });

    // Determine if slider is not hovered
    this.addEventListener('mouseleave', () => {
      this.states.hovered = false;
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
  }

  generateButtons() {
    if (this.settings.showButtons === 'false') return;

    const buttons = document.createElement('div');
    buttons.classList.add('snap-slider__buttons');

    const prevButton = document.createElement('button');
    prevButton.classList.add('snap-slider__button');
    prevButton.dataset.buttonPrev = '';
    prevButton.innerHTML = '&larr;';
    buttons.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.classList.add('snap-slider__button');
    nextButton.dataset.buttonNext = '';
    nextButton.innerHTML = '&rarr;';
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
    dots.classList.add('snap-slider__dots');

    this.elements.slides.forEach((slide, index) => {
      const dot = document.createElement('li');
      dot.classList.add('snap-slider__dot');
      dot.dataset.dotIndex = index;
      dots.appendChild(dot);
    });

    this.elements.dots = dots; // Set dots to elements

    this.appendChild(dots);

    // Determine if dot is pressed
    this.elements.dots.addEventListener('click', (e) => {
      this.changeSlide(Number(e.target.dataset.dotIndex));
    });
  }
}

customElements.define('snap-slider', SnapSlider);