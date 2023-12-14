# speedy-slider
A modern way to make slideshows

## Demo
https://codepen.io/matouio/pen/qBgGpGd?editors=1010

## How to install animape

### NPM package

1.  Install the package `npm i speedy-slider`
2.  Import it into JS
```
import SpeedySlides from 'speedy-slider';
import SpeedyStyles from 'speedy-slider/speedy-slider.css';
```

### CDN
```
<link rel="stylesheet" href="https://unpkg.com/speedy-slider@latest/speedy-slider.css">
<script src="https://unpkg.com/speedy-slider@latest/speedy-slider.js"></script>
```

## Getting started

1. Ensure the speedy-slider `.css` and `.js` files are included in you project.
2. speedy-slider is set up using a custom HTML element, a wrapper and a group of slides. A basic example of this can be seen below. (The data attributes in the example below are optional and can be removed if you wish to use the default settings)

```html
<speedy-slider
  id="mySlider"
  data-per-slide="1"
  data-initial-slide="0"
  data-slide-direction="horizontal"
  data-slide-speed="0"
  data-show-buttons="false"
  data-show-dots="false"
>
  <div class="speedy-slider__view">
    <div class="speedy-slide">Example slide 1</div>
    <div class="speedy-slide">Example slide 2</div>
    <div class="speedy-slide">Example slide 3</div>
    <div class="speedy-slide">Example slide 4</div>
  </div>
</speedy-slider>
```

3. When a `<speedy-slider>` element is detected on the page the slider will initialize itself automatically.

## Settings
As you may have noticed in the example above you can use a few attributes to set up slider options.

## Events

| Event                   	| description                                        	| details                           	|
|-------------------------	|----------------------------------------------------	|-----------------------------------	|
| speedy-slider:changed     	| Emits. Emitted when the current slide has changed. 	| previousIndex, targetIndex, slider 	|
| speedy-slider:ready 	| Emits. Emitted when the slide has initially loaded 	| N/A                               	|
| speedy-slider:goto        	| Listens. Used to specifically set current slide     	| targetIndex, id                             	|
