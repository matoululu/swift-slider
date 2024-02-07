# swift-slider
A modern way to make slideshows

## Demo
https://codepen.io/matouio/pen/qBgGpGd?editors=1010

## How to install animape

### NPM package

1.  Install the package `npm i swift-slider`
2.  Import it into JS
```
import SwiftSlider from 'swift-slider';
import SwiftStyles from 'swift-slider/swift-slider.css';
```

### CDN
```
<link rel="stylesheet" href="https://unpkg.com/swift-slider@latest/swift-slider.css">
<script src="https://unpkg.com/swift-slider@latest/swift-slider.js"></script>
```

## Getting started

1. Ensure the swift-slider `.css` and `.js` files are included in you project.
2. swift-slider is set up using a custom HTML element, a wrapper and a group of slides. A basic example of this can be seen below. (The data attributes in the example below are optional and can be removed if you wish to use the default settings)

```html
<swift-slider
  id="mySlider"
  data-per-slide="1"
  data-initial-slide="0"
  data-slider-direction="horizontal"
  data-slider-speed="0"
  data-show-buttons="false"
  data-show-dots="false"
>
  <div class="swift-slider__view">
    <div class="swift-slide">Example slide 1</div>
    <div class="swift-slide">Example slide 2</div>
    <div class="swift-slide">Example slide 3</div>
    <div class="swift-slide">Example slide 4</div>
  </div>
</swift-slider>
```

3. When a `<swift-slider>` element is detected on the page the slider will initialize itself automatically.

## Settings
As you may have noticed in the example above you can use a few attributes to set up slider options.

## Events

Coming soon (sorry 😓)

## Navigation slider

Coming soon (sorry 😓)
