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

    bind() {
        if (getComputedStyle(this.el)) {
            if (getComputedStyle(this.el).getPropertyValue('position') == 'static') {
                this.el.dataset.prevPosition = 'static';
                this.el.style.position = 'relative';
            }

            if (getComputedStyle(this.el).getPropertyValue('display') == 'inline') {
                this.el.dataset.prevDisplay = 'inline';
                this.el.style.display = 'inline-block';
            }
        }
        
        this.el.addEventListener('mousedown', this.show);
        this.el.addEventListener('touchstart', this.show, { passive: true });
        this.el.addEventListener('touchend', this.hide, { passive: true });
        this.el.addEventListener('touchcancel', this.hide);
        this.el.addEventListener('mouseup', this.hide);
        this.el.addEventListener('mouseleave', this.hide);
        this.el.addEventListener('dragstart', this.hide, { passive: true });
    }

    getRippleColorLegibility() {
        if (getComputedStyle(this.el)) {
            const rgb = getComputedStyle(this.el).getPropertyValue('background-color').match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            if (!rgb || (rgb[1] * 0.299 + rgb[2] * 0.587 + rgb[3] * 0.114) > 186) return '#000000';
        }
        
        return "#ffffff";
    }

    hide() {
        const self = RippleRegister.get(this);
        const ripple = self.active[self.active.length - 1];
        if (!ripple) return;
        
        ripple.children[0].style.opacity = 0;
        setTimeout(() => {
            ripple.parentNode && ripple.parentNode.removeChild(ripple);
            self.active.splice(self.active.indexOf(ripple), 1);
        }, 300);
    }

    remove() {
        return RippleRegister.remove(this);
    }

    setColor(color) {
        this.color = color || this.el.dataset.ripple || this.getRippleColorLegibility();
        return this.color;
    }

    setColorOut(color) {
        this.colorOut = color || this.el.dataset.rippleOut || this.color || this.getRippleColorLegibility();
        return this.colorOut;
    }

    show(event) {
        if (this.getAttribute('disabled') != null) return;
        const self = RippleRegister.get(this);
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
            background: self.getRippleColorLegibility(),
            backgroundColor: self.color,
            boxShadow: `0 0 40px 0 ${ self.color }`,
            transform: 'scale(0)',
            transition: 'transform 300ms ease-out, opacity 300ms ease-out, background 300ms ease-in',
            willChange: 'transform, opacity'
        });

        // Append ripple
        ripple.appendChild(rippleEffect);
        this.appendChild(ripple);
        self.active.push(ripple);
        setTimeout(() => {
            rippleEffect.style.transform = "scale(1.25)";

            // If 'ripple-out' is set, transition to color out
            if (self.color != self.colorOut) rippleEffect.style.backgroundColor = self.colorOut;
        }, 0);
    }

    unbind() {
        if (this.el.dataset.prevPosition == 'static') {
            this.el.dataset.prevPosition = undefined;
            this.el.style.position = 'static';
        }

        if (this.el.dataset.prevDisplay == 'inline') {
            this.el.dataset.prevDisplay = undefined;
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