<p align="center">
    <a href="https://npmcharts.com/compare/@mountable/ripples?minimal=true"><img src="https://img.shields.io/npm/dm/@mountable/ripples.svg" alt="Downloads"></a>
    <a href="https://www.npmjs.com/package/@mountable/ripples"><img src="https://img.shields.io/npm/v/@mountable/ripples.svg" alt="Version"></a>
    <a href="https://www.npmjs.com/package/@mountable/ripples"><img src="https://img.shields.io/npm/l/@mountable/ripples.svg" alt="License"></a>
</p>

# Ripples

Ripple effect which provides an "ink ripple" like effect to an interacted element. 
Apply to any element with a simple setup.

Using `MutationObserver` to observe the DOM tree for insertion/removal of elements to automatically bind/unbind ripple effects to elements, and to react on attribute changes.

> Demo coming soon

## Installation

Add the provided script in your HTML body element (or install via `npm`), and use it on a single HTML element by applying the `data-ripple` attribute to it. 

### HTML

``` html
<!-- Copy and paste the script below into the bottom of your HTML body element -->
<script type="text/javascript" src="https://unpkg.com/@mountable/ripples@0.0.12/dist/ripples.js"></script>
```

### Vue.js

> Coming soon

## Usage

### HTML

The ripple effect is applied to all elements with the `data-ripple` attribute:
``` html
<div data-ripple>Click me</div>
```

You can also set the ripple color yourself by specifying the color value to the `data-ripple` attribute. It supports all `<color>` values (see: [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value "MDN web docs - <color>") for more information):
``` html
<!-- 'red' ripple color using color keyword -->
<div data-ripple="red">Click me</div>

<!-- 'green' ripple color using hex-value -->
<div data-ripple="#008000">Click me</div>

<!-- 'blue' ripple color using rgb() -->
<div data-ripple="rgb(0,0,255)">Click me</div>
```

> **Caution:** The ripple effect is not working properly with `inline` elements. If an `inline` element is registered with the ripple effect, the element is converted to an `inline-block` element.

### Vue.js

> Coming soon

## Advanced usage

### Manually register/unregister ripples

You can manually register ripple effects on elements with `RippleRegister.add`:
``` javascript
// RippleRegister.add(HTMLElement, config)
window.RippleRegister.add(document.body.querySelector('#id'));

// or with a config
window.RippleRegister.add(document.body.querySelector('#id'), {
    color: 'blue'
});
```

To remove and unregister a ripple, use `RippleRegister.remove`:
``` javascript
// RippleRegister.remove(HTMLElement|Ripple)
window.RippleRegister.remove(document.body.querySelector('#id'));

// or by a Ripple instance
const ripple = window.RippleRegister.add(document.body.querySelector('#id'));
window.RippleRegister.remove(ripple); 
```

The `Ripple` instance also exposes its own `.remove` method:
``` javascript
const ripple = window.RippleRegister.add(document.body.querySelector('#id'));
ripple.remove();
```

### Color transitioning with `data-ripple-out`

If you want the ripple effect to have a color transitioning effect when it 'ripples' out, just specify the out color with the `data-ripple-out` attribute on the element. The ripple effect will then start off with the initial ripple color, and ripple out (transition) into the new color on interaction:
``` html
<div data-ripple="blue" data-ripple-out="purple">Click me</div>
```

## Looking for more?
Mountable
* [Spinners](https://github.com/mountable/spinners "Pure CSS Spinners by Kenneth Aamås")

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2019-present, Kenneth Aamås