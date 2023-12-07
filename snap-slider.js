class SnapSlider extends HTMLElement {
  constructor() {
    super();
    this.el = this;
    this.slideshow = this.firstElementChild;
    this.slideshowIntervalEnabled = this.dataset.slideshowTimer;
    this.slides = Array.from(this.slideshow.children);
    this.showButtons = this.dataset.buttons === 'false' ? false : true;
    this.showDots = this.dataset.dots === 'false' ? false : true;
    this.fixedHeightMode = this.classList.contains('snap-slider--fixed-height');

    this.currentIndex = 0;
    this.direction = 'next';
    this.isActive = false;
    this.scrollTimer;
    this.slideshowInterval;
  }

  connectedCallback() {
    if (this.slides && this.slides.length > 1) this.init();
  }

  init() {
    this.setDOMElements();
    this.setAttributes();
    this.setActiveElements();
    this.setSlideshowInterval();

    document.addEventListener('snap-slider:goto', (e) => { if (this.id === e.detail.parent) { this.specificIndex = true; this.update(this.determineNewIndex('click', e)) }});

    this.addEventListener('mouseover', () => { this.isActive = true; });
    this.addEventListener('mouseout', () => { this.isActive = false; });
    this.slideshow.addEventListener('scroll',() => { if (!this.specificIndex) { this.update(this.determineNewIndex(), true) }}, { passive: false });

    this.update(this.determineNewIndex('click', { index: 0}), false, 'instant');
    this.eventDispatcher('snap-slider:initialized');
  }

  update(targetIndex,  scrollEvent = false, behavior = 'smooth') {
    const previousIndex = this.currentIndex;
    this.currentIndex = targetIndex;

    if (!scrollEvent) {
      this.slideshow.scrollTo({
        left: this.slides[targetIndex].offsetLeft,
        behavior
      });
    }

    this.setActiveElements();

    this.eventDispatcher('snap-slider:changed', {
      previousIndex,
      nextIndex: this.currentIndex,
      nextSlide: this.slides[this.currentIndex]
    });

    // Used to prevent the scroll event from firing when we're scrolling to a specific slide
    clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => {
      this.specificIndex = false;
    }, 300);

    // Reset slideshow interval upon interaction
    if (this.slideshowIntervalEnabled > 0) {
      clearInterval(this.slideshowInterval);
      this.setSlideshowInterval();
    }
  }

  determineNewIndex(type, direction) {
    let targetIndex = this.currentIndex;

    if (type == 'click' || typeof direction === 'object') {
      switch (direction) {
        case 'next':
          targetIndex++;
          // If we're at the end of the slides, go back to the first one
          if (targetIndex > this.slides.length - 1) targetIndex = 0;
          break;
        case 'previous':
          targetIndex--;
          // If we're at the beginning of the slides, go back to the last one
          if (targetIndex < 0) targetIndex = this.slides.length - 1;
          break;
        default:
          if (direction.index != null) {
            // Go to slide dictated by slide dots
            targetIndex = direction.index;
          } else if (direction.detail != null) {
            // Go to slide dictated by snap-slider:goto event
            targetIndex = direction.detail.index;
          } else {
            // Go to slide dictated by shopify block select event
            targetIndex = parseInt(direction.srcElement.dataset.slideIndex, 10);
          }
          break;
      }
    } else {
      switch (this.slideshow.scrollLeft) {
        case 0:
          // If we're at the beginning of the slideshow
          targetIndex = 0;
          break;
        case this.slideshow.scrollLeft === this.slideshow.scrollWidth:
          // If we're at the end of the slideshow
          targetIndex = this.slides.length - 1;
          break;
        default:
          // Calculate the current index
          targetIndex = Math.round(this.slideshow.scrollLeft / this.slides[0].offsetWidth);
          break;
      }
    }

    return targetIndex;
  }

  eventDispatcher(type, detail = {}) {
    const event = new CustomEvent(type, { bubbles: true, detail});
    this.el.dispatchEvent(event);
  }

  setDOMElements() {
    const controlsFragment = new DocumentFragment();
    this.controlsWrapper = document.createElement('div');
    this.controlsWrapper.classList.add('snap-controls');

    // Set up slideshow buttons if enabled
    if (this.showButtons) {
      this.controlsHTML = `
        <div class="snap-control__buttons">
          <button class="snap-control__button" data-previous></button>
          <button class="snap-control__button" data-next></button>
        </div>
      `;

      this.controlsWrapper.innerHTML = this.controlsHTML;
    }

    // Set up slideshow dots if enabled
    if (this.showDots) {
      this.dotsWrapper = document.createElement('div');
      this.dotsWrapper.classList.add('snap-dots');

      if (this.slides.length > 0) {
        for (let i = 0; i < this.slides.length; i++) {
          this.dot = `
            <button class="snap__dot" data-snap-dot data-index="${i}"></button>
          `;
          this.dotsWrapper.insertAdjacentHTML('beforeend', this.dot);
        }
      }

      this.controlsWrapper.appendChild(this.dotsWrapper);
    }

    // Append controls to DOM
    controlsFragment.appendChild(this.controlsWrapper);
    this.appendChild(controlsFragment);

    // Set up DOM elements
    this.nextBtn = this.el.querySelector('[data-next]');
    this.previousBtn = this.el.querySelector('[data-previous]');
    this.dots = this.el.querySelectorAll('[data-snap-dot]');

    if (this.showButtons) {
      this.nextBtn.addEventListener('click', () => { this.specificIndex = true; this.update(this.determineNewIndex('click', 'next')) });
      this.previousBtn.addEventListener('click', () => { this.specificIndex = true; this.update(this.determineNewIndex('click', 'previous')) });
    }

    if (this.showDots) {
      this.dots.forEach(dot => dot.addEventListener('click', () => {
        const index = parseInt(dot.dataset.index, 10);
        this.currentIndex = index;

        this.update(this.determineNewIndex('specific', { index }));
      }));
    }
  }

  setAttributes() {
    if (this.showButtons) {
      this.nextBtn.setAttribute('aria-label', 'next');
      this.previousBtn.setAttribute('aria-label', 'previous');
    }

    if (this.showDots) {
      this.dots.forEach((dot, i) => dot.setAttribute('aria-label', 'Load slide ' + (i + 1)));
    }

    this.el.setAttribute('role', 'region');
    this.el.setAttribute('aria-label', 'Slideshow');
    this.el.setAttribute('aria-roledescription', 'carousel');

    this.slideshow.setAttribute('aria-live', 'polite');
    this.slideshow.setAttribute('aria-atomic', 'true');

    this.slides.forEach((slide, index) => {
      slide.setAttribute('data-slide-index', index);
      slide.setAttribute('aria-label', `Slide ${index + 1} of ${this.slides.length}`);
      slide.setAttribute('aria-roledescription', 'Slide');
      slide.setAttribute('role', 'group');
    });
  }

  setActiveElements() {
    this.slides.forEach(slide => {
      slide.setAttribute('aria-hidden', true);
      slide.classList.remove('snap-slideshow__slide--selected', 'snap-slideshow__slide--transitioning');
      slide.removeAttribute('data-active-slide');

      const links = slide.querySelectorAll('a');
      links.forEach(link => link.setAttribute('tabindex', '-1'));

    });

    this.slides[this.currentIndex].classList.add('snap-slideshow__slide--selected');
    this.slides[this.currentIndex].setAttribute('data-active-slide', true);
    this.slides[this.currentIndex].setAttribute('aria-hidden', false);

    if (this.previousBtn) {
      if (this.currentIndex === 0) {
        this.previousBtn.setAttribute('disabled', true);
        this.previousBtn.setAttribute('aria-disabled', true);
      } else {
        this.previousBtn.removeAttribute('disabled');
        this.previousBtn.removeAttribute('aria-disabled');
      }
    }

    if (this.nextBtn) {
      if (this.currentIndex === this.slides.length - 1) {
        this.nextBtn.setAttribute('disabled', true);
        this.nextBtn.setAttribute('aria-disabled', true);
      } else {
        this.nextBtn.removeAttribute('disabled');
        this.nextBtn.removeAttribute('aria-disabled');
      }
    }

    const links = this.slides[this.currentIndex].querySelectorAll('a');
    links.forEach(link => link.setAttribute('tabindex', '0'));

    if (this.dots) {
      this.dots.forEach(dot => {
        const index = parseInt(dot.dataset.index, 10);
        dot.classList.remove('snap__controller--is-active');

        if (index === this.currentIndex) dot.classList.add('snap__controller--is-active');
      });
    }
  }

  setSlideshowInterval() {
    if (this.slideshowIntervalEnabled > 0) {
      this.slideshowInterval = setInterval(() => {
        if (!this.isActive) this.specificIndex = true; this.update(this.determineNewIndex('click', 'next'));
      }, this.slideshowIntervalEnabled*1000);
    }
  }
}

customElements.define('snap-slider', SnapSlider);
