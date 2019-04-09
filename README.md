# Dev Components { Ripples }

Ripple effect which provides an "ink ripple" like effect to an interacted element. 
Apply to any element with a simple setup.

Using `MutationObserver` to observe the DOM tree for insertion/removal of elements to automatically bind/unbind ripple effects to elements, and to react on attribute changes.

> Demo coming soon

## Installation

`@knekki/ripples` is easy to setup. Just add the provided script in your HTML body element (or install via `npm`), and use it on a single HTML element by applying the `ripple` attribute to it. 

> Import and use as a Vue directive coming soon.

### HTML

``` html
<!-- Copy and paste the script below into the bottom of your HTML body element -->
<script type="text/javascript" href="https://unpkg.com/@knekk/ripples@0.0.2/dist/ripples.js"></script>
```

### Vue.js

> Coming soon

## Usage

### HTML

The ripple effect is applied to all elements with the `ripple` attribute:
``` html
<div ripple>Click on me</div>
```

You can also set the `ripple` color yourself by specifying the color value to the `ripple` attribute. It supports all `<color>` values (see: [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value "MDN web docs - <color>") for more information):
``` html
<!-- 'red' ripple color using color keyword -->
<div ripple="red">Click on me</div>

<!-- 'green' ripple color using hex-value -->
<div ripple="#008000">Click on me</div>

<!-- 'blue' ripple color using rgb() -->
<div ripple="rgb(0,0,255)"></div>
```

> **Caution:** The ripple effect is not working properly with `inline` elements. If an `inline` element is registering the `ripple` effect, the element is converted to an `inline-block` element instead.

### Vue.js

> Coming soon

## Configuration

> Coming soon

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2019-present, Kenneth Aamås