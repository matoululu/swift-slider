# snap-slider README
### Getting started

1. Ensure the snap-slider `.css` and `.js` files are included in you project.
2. snap-slider is set up using a custom HTML element, a wrapper and a group of slides. A basic example of this can be seen below.

```html
<snap-slider
  id="mySlider"
  data-buttons="true"
  data-dots="true"
  data-slideshow-timer="0"
>
  <div class="snap-slideshow">
    <div class="snap-slideshow__slide">
      <div class="snap-slide__media">
        <!-- MEDIA HERE -->
      </div>
      <div class="snap-slide__content">
        <!-- CONTENT HERE -->
      </div>
    </div>
    <div class="snap-slideshow__slide">
      <div class="snap-slide__media">
        <!-- MEDIA HERE -->
      </div>
      <div class="snap-slide__content">
        <!-- CONTENT HERE -->
      </div>
    </div>
    <div class="snap-slideshow__slide">
      <div class="snap-slide__media">
        <!-- MEDIA HERE -->
      </div>
      <div class="snap-slide__content">
        <!-- CONTENT HERE -->
      </div>
    </div>
  </div>
</snap-slider>
```

3. When a `<snap-slider>` element is detected on the page the slider will initialize itself automatically.

### Settings
As you may have noticed in the example above we use a few attributes to set up slider options. Here are the default values:

| setting              	| description                                                                                 	| default 	|
|----------------------	|---------------------------------------------------------------------------------------------	|---------	|
| id                   	| Used as reference for snap-thumbnails parent attribute                                      	| None    	|
| data-buttons         	| Enables previous & next buttons                                                             	| true    	|
| data-dots            	| Enables navigation dots                                                                     	| true    	|
| data-slideshow-timer 	| Determines the amount of time before the slide automatically changes, 0 disables the slide. Value is calculated in seconds 	| 0       	|


You can also add the class `snap-slider—-fixed-height` to `<snap-slider>` to enabled the fixed-height styling.

#### Events

| Event                   	| description                                        	| details                           	|
|-------------------------	|----------------------------------------------------	|-----------------------------------	|
| snap-slider:changed     	| Emits. Emitted when the current slide has changed. 	| previousIndex, targetIndex, slide 	|
| snap-slider:initialized 	| Emits. Emitted when the slide has initially loaded 	| N/A                               	|
| snap-slider:goto        	| Listens. Used to specifically set current slide    	| index                             	|
---

## Snap-thumbnails
Along side snap-slider you can utilize snap-thumbnails if you wish to have a slideshow with thumbnails to pair along with it.

### Getting started

1. Ensure the snap-thumbnails `.css` and `.js` files are included in your project.
2. snap-thumbnails is set up using a custom HTML element and a group of buttons. An basic example of this can be seen below.
```html
<snap-thumbnails data-parent="mySlider">
  <button class="snap-thumbnail">
    <!-- THUMBNAIL MEDIA HERE -->
  </button>
  <button class="snap-thumbnail">
    <!-- THUMBNAIL MEDIA HERE -->
  </button>
  <button class="snap-thumbnail">
    <!-- THUMBNAIL MEDIA HERE -->
  </button>
</snap-thumbnails>
```

3. When a `<snap-thumbnails>` element is detected on the page the thumbnails will initialize themselves automatically.

### Settings

| settings    	| description                                                            	| default 	|
|-------------	|------------------------------------------------------------------------	|---------	|
| data-parent 	| Used to reference the snap-slider the thumbnails should interact with 	| None    	|



