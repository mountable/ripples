import RippleRegister from './RippleRegister'

export default class Ripple {
    constructor(element, { color, colorOut } = {}) {
        if (RippleRegister.has(element)) return RippleRegister.get(element);
        if (!(element instanceof HTMLElement)) throw new Error('Can only construct Ripple with an instance of HTMLElement.');

        this.el = element;
        this.active = [];
        this.color = color;
        this.colorOut = colorOut;
        this.effectNode = document.createElement('span');

        this.bind();
        RippleRegister.push(this);
    }

    /**
     * Binding event listeners and styling for current `Ripple` element.
     */
    bind() {
        const computedStyle = getComputedStyle(this.el);
        if (computedStyle) {
            if (computedStyle.getPropertyValue('position') == 'static') {
                this.el.dataset.ripplePrevPosition = 'static';
                this.el.style.position = 'relative';
            }

            if (computedStyle.getPropertyValue('display') == 'inline') {
                this.el.dataset.ripplePrevDisplay = 'inline';
                this.el.style.display = 'inline-block';
            }
        }
        
        this.el.addEventListener('mousedown', this, { passive: true });
        this.el.addEventListener('touchstart', this, { passive: true });
        this.el.addEventListener('dragstart', this, { passive: true });
        this.el.addEventListener('mouseup', this, { passive: true });
        this.el.addEventListener('mouseleave', this, { passive: true });
        this.el.addEventListener('touchend', this, { passive: true });
        this.el.addEventListener('touchcancel', this, { passive: true });
    }

    /**
     * The color of the ripple effect.
     * - `get`: Get the color of the ripple effect.
     * 
     * @type {*} The CSS `<color>` value.
     */
    get color() {
        return this.__color;
    }

    /**
     * - `set`: Set the color of the ripple effect.
     */
    set color(color) {
        this.__color = color || this.el.dataset.ripple || this.colorLegibility;
    }

    /**
     * Gets the default contrasted ripple color (black/white) by ensuring color legebility depending on the `Ripple` element's background color.
     */
    get colorLegibility() {
        const { backgroundColor } = getComputedStyle(this.el);
        const rgb = backgroundColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

        if (!rgb || (rgb[1] * 0.299 + rgb[2] * 0.587 + rgb[3] * 0.114) > 186) return '#000000';
        return "#ffffff";
    }

    /**
     * The color of the ripple effect when transitioning out.
     * - `get`: Get the color of the ripple effect when transitioning out.
     * 
     * @type {*} The CSS `<color>` value.
     */
    get colorOut() {
        return this.__colorOut;
    }

    /**
     * - `set`: Set the color of the ripple effect when transitioning out.
     */
    set colorOut(color) {
        this.__colorOut = color || this.el.dataset.rippleOut || this.color || this.colorLegibility;
    }

    /**
     * The effect node used for the ripple effect animation.
     * - `get`: Get a new effect node.
     * 
     * @type {HTMLElement}
     */
    get effectNode() {
        return this.__effectNode.cloneNode(true);
    }

    /**
     * - `set`: Set the default effect node. Used as base for the `getter`.
     */
    set effectNode(node) {
        const effect = node.cloneNode(false);
        
        // Assign ripple node (container) styling
        Object.assign(node.style, {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            opacity: 0.32,
            pointerEvents: 'none',
            borderRadius: 'inherit',
            overflow: 'hidden',
            contain: 'strict'
        });

        // Assign ripple effect styling
        Object.assign(effect.style, {
            position: 'absolute',
            borderRadius: '50%',
            transform: 'scale(0)',
            transformOrigin: 'center center',
            transition: 'transform 300ms ease-out, opacity 300ms ease-out, background 300ms ease-in',
            willChange: 'transform, opacity'
        });

        // Append and set effect node
        node.appendChild(effect);
        this.__effectNode = node;
    }

    /**
     * `Ripple`'s event handler handling interactions.
     * @param {Event} event 
     */
    handleEvent(event) {
        switch (event.type) {
            case 'mousedown':
            case 'touchstart':
                this.show(event);
                break;
                
            default:
                this.hide(event);
                break;
        }
    }

    /**
     * Hides then destroys the effect element of the `Ripple`.
     */
    hide() {
        if (this.active.length) {
            const ripple = this.active[0];
            ripple.children[0].style.opacity = 0;
            this.active.splice(0, 1);

            // Remove element from DOM
            setTimeout(() => {
                ripple.parentNode && ripple.parentNode.removeChild(ripple);
            }, 300);
        }
    }

    /**
     * Unregisters the `Ripple` element from `RippleRegister` and unbinds listeners.
     */
    remove() {
        return RippleRegister.remove(this);
    }

    /**
     * Perform and render the ripple-effect for this `Ripple` element.
     * @param {Event} event - The trigger `Event`
     */
    show(event) {
        if (this.el.getAttribute('disabled') != null) return;

        // Calculate ripple's bounding area
        const [{ offsetX, offsetY }, { width, height }] = [event, this.el.getBoundingClientRect()];
        const [x, y] = [Math.max(offsetX, width - offsetX), Math.max(offsetY, height - offsetY)];
        const circumRadius = Math.sqrt(Math.pow(Math.max(x, y), 2) + Math.pow(Math.min(x, y), 2));
        const initialScale = Math.min(64 / (circumRadius * 2), 1);

        // Append ripple effect to element
        const effectNode = this.effectNode;
        Object.assign(effectNode.children[0].style, {
            top: `${ offsetY - circumRadius }px`,
            left: `${ offsetX - circumRadius }px`,
            height: `${ circumRadius * 2 }px`,
            width: `${ circumRadius * 2 }px`,
            background: this.colorLegibility,
            backgroundColor: this.color,
            boxShadow: `0 0 40px 0 ${ this.color }`,
            transform: `scale(${ initialScale })`
        });
        this.el.appendChild(effectNode);
        this.active.push(effectNode);

        // Animate
        requestAnimationFrame(() => {
            effectNode.children[0].style.transform = "scale(1.25)";

            // If 'ripple-out' is set, transition to color out
            if (this.color != this.colorOut) effectNode.children[0].style.backgroundColor = this.colorOut;
        });
    }

    /**
     * Unbinding event listeners and resets styling for current `Ripple` element.
     */
    unbind() {
        // Reset element's position property
        if (this.el.dataset.ripplePrevPosition == 'static') {
            this.el.removeAttribute('data-ripple-prev-position');
            this.el.style.position = 'static';
        }

        // Reset element's display property
        if (this.el.dataset.ripplePrevDisplay == 'inline') {
            this.el.removeAttribute('data-ripple-prev-display');
            this.el.style.display = 'inline';
        }

        this.el.removeEventListener('mousedown', this);
        this.el.removeEventListener('touchstart', this);
        this.el.removeEventListener('touchend', this);
        this.el.removeEventListener('touchcancel', this);
        this.el.removeEventListener('mouseup', this);
        this.el.removeEventListener('mouseleave', this);
        this.el.removeEventListener('dragstart', this);
    }
}