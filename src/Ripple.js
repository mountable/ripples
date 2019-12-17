import RippleRegister from './RippleRegister'

export default class Ripple {
    constructor(element, { color, colorOut } = {}) {
        if (RippleRegister.has(element)) return RippleRegister.get(element);
        if (!(element instanceof HTMLElement)) throw new Error('Can only construct Ripple with an instance of HTMLElement.');

        this.el = element;
        this.color = this.setColor(color);
        this.colorOut = this.setColorOut(colorOut);
        this.active = [];

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
        
        this.el.addEventListener('mousedown', this.show, { passive: true });
        this.el.addEventListener('touchstart', this.show, { passive: true });
        this.el.addEventListener('dragstart', this.hide, { passive: true });
        this.el.addEventListener('mouseup', this.hide, { passive: true });
        this.el.addEventListener('mouseleave', this.hide, { passive: true });
        this.el.addEventListener('touchend', this.hide, { passive: true });
        this.el.addEventListener('touchcancel', this.hide, { passive: true });
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
     * Hides then destroys the `ripple-effect` element (the child element of the `Ripple` spawned for the effect).
     */
    hide() {
        const { active } = RippleRegister.get(this);

        if (active.length) {
            const ripple = active[0];
            ripple.children[0].style.opacity = 0;
            active.splice(0, 1);

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
     * Sets the color of the ripple-effect.
     * @param {*} color - The CSS `<color>` value.
     */
    setColor(color) {
        this.color = color || this.el.dataset.ripple || this.colorLegibility;
        return this.color;
    }

    /**
     * Sets the color of the ripple-effect when transitioning out.
     * @param {*} color - The CSS `<color>` value.
     */
    setColorOut(color) {
        this.colorOut = color || this.el.dataset.rippleOut || this.color || this.colorLegibility;
        return this.colorOut;
    }

    /**
     * Perform and render the ripple-effect for this `Ripple` element.
     * @param {Event} event - The trigger `Event`
     */
    show(event) {
        if (this.getAttribute('disabled') != null) return;

        const { active, color, colorOut, colorLegibility } = RippleRegister.get(this);
        const [{ offsetX, offsetY }, { width, height }] = [event, this.getBoundingClientRect()];
        const [x, y] = [Math.max(offsetX, width - offsetX), Math.max(offsetY, height - offsetY)];
        const circumRadius = Math.sqrt(Math.pow(Math.max(x, y), 2) + Math.pow(Math.min(x, y), 2));

        // Ripple container
        const ripple = document.createElement('span');
        Object.assign(ripple.style, {
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

        // Ripple effect
        const rippleEffect = document.createElement('span');
        Object.assign(rippleEffect.style, {
            position: 'absolute',
            top: `${ offsetY - circumRadius }px`,
            left: `${ offsetX - circumRadius }px`,
            height: `${ circumRadius * 2 }px`,
            width: `${ circumRadius * 2 }px`,
            borderRadius: '50%',
            background: colorLegibility,
            backgroundColor: color,
            boxShadow: `0 0 40px 0 ${ color }`,
            transform: 'scale(0)',
            transition: 'transform 300ms ease-out, opacity 300ms ease-out, background 300ms ease-in',
            willChange: 'transform, opacity'
        });

        // Append ripple
        ripple.appendChild(rippleEffect);
        this.appendChild(ripple);
        active.push(ripple);
        requestAnimationFrame(() => {
            rippleEffect.style.transform = "scale(1.25)";

            // If 'ripple-out' is set, transition to color out
            if (color != colorOut) rippleEffect.style.backgroundColor = colorOut;
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

        this.el.removeEventListener('mousedown', this.show);
        this.el.removeEventListener('touchstart', this.show);
        this.el.removeEventListener('touchend', this.hide);
        this.el.removeEventListener('touchcancel', this.hide);
        this.el.removeEventListener('mouseup', this.hide);
        this.el.removeEventListener('mouseleave', this.hide);
        this.el.removeEventListener('dragstart', this.hide);
    }
}