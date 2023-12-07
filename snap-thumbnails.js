class SnapThumbnails extends HTMLElement {
  constructor() {
    super();
    this.el = this;
    this.parentSlideshow = this.dataset.parent;
    this.thumbnails = Array.from(this.children);
  }

  connectedCallback() {
    this.init();
  }

  init() {
    this.thumbnails.forEach((thumbnail, i) => {
      if (i == 0) this.setClasses(i);

      thumbnail.addEventListener('click', () => {
        this.setClasses(i);
        const thumbnailClickEvent = new CustomEvent('snap-slider:goto', {
          detail: {
            parent: this.parentSlideshow,
            index: i
          },
          bubbles: true
        });

        this.el.dispatchEvent(thumbnailClickEvent);
      });
    });

    document.addEventListener('snap-slider:changed', (e) => this.setClasses(e.detail.nextIndex));
  }

  setClasses(index) {
    const activeBtn = this.thumbnails[index];
    this.thumbnails.forEach(thumbnail => {
      thumbnail.classList.remove('is-selected');
    });

    activeBtn.classList.add('is-selected');
  }
}

customElements.define('snap-thumbnails', SnapThumbnails);
