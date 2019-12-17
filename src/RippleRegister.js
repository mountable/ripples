import Ripple from './Ripple'

export default window.RippleRegister = new class RippleRegister extends Array {
    static get [Symbol.species]() { return Array }

    /**
     * Add element to the `RippleRegister` (if not already existing).
     * @param {Ripple|HTMLElement} element - The element to register.
     * @param {Object} config - The `Ripple` configuration object.
     */
    add(element, config) {
        if (!this.has(element)) {
            return new Ripple(element, config);
        }

        return false;
    }

    /**
     * Binds a new `Ripple` to all elements with [data-ripple] attribute. Elements that are already bound with a `Ripple`, are skipped.
     */
    bindAll() {
        document.body.querySelectorAll('[data-ripple]').forEach(el => new Ripple(el));
    }
    
    /**
     * Get the registered `Ripple` instance of the provided element.
     * @param {Ripple|HTMLElement} element - The element to retrieve the `Ripple` instance for.
     */
    get(element) {
        return this.find(ripple => element instanceof Ripple ? ripple === element : ripple.el === element);
    }

    /**
     * Checks if the element or `Ripple` is registered.
     * @param {Ripple|HTMLElement} element - The element to check.
     */
    has(element) {
        return !!this.get(element);
    }

    /**
     * Unbinding the `Ripple` and removing the element from the `RippleRegister`. 
     * @param {Ripple|HTMLElement} element - The element to remove.
     */
    remove(element) {
        if (this.has(element)) {
            const ripple = this.get(element);
            ripple.unbind();
            this.splice(this.indexOf(ripple), 1);

            return true;
        }

        return false;
    }
}