# Snap-slider
Create a slideshow quickly and easily

# snap-slider README
### Getting started

1. Ensure the snap-slider `.css` and `.js` files are included in you project.
2. snap-slider is set up using a custom HTML element, a wrapper and a group of slides. A basic example of this can be seen below. (The data attributes in the example below are optional and can be removed if you wish to use the default settings)

```html
<snap-slider
  id="mySlider"
  data-per-slide="1"
  data-initial-slide="0"
  data-slide-direction="horizontal"
  data-slide-speed="0"
  data-show-buttons="false"
  data-show-dots="false"
>
  <div class="snap-slider__view">
    <div class="snap-slide">Example slide 1</div>
    <div class="snap-slide">Example slide 2</div>
    <div class="snap-slide">Example slide 3</div>
    <div class="snap-slide">Example slide 4</div>
  </div>
</snap-slider>
```

3. When a `<snap-slider>` element is detected on the page the slider will initialize itself automatically.

### Settings
As you may have noticed in the example above you can use a few attributes to set up slider options.

#### Events

| Event                   	| description                                        	| details                           	|
|-------------------------	|----------------------------------------------------	|-----------------------------------	|
| snap-slider:changed     	| Emits. Emitted when the current slide has changed. 	| previousIndex, targetIndex, slider 	|
| snap-slider:ready 	| Emits. Emitted when the slide has initially loaded 	| N/A                               	|
| snap-slider:goto        	| Listens. Used to specifically set current slide     	| targetIndex, id                             	|
