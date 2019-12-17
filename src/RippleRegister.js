import Ripple from './Ripple'

export default window.RippleRegister = new class RippleRegister extends Array {
    static get [Symbol.species]() { return Array }

    /**
     * Add element to the `RippleRegister` (if not already existing).
     * @param {Ripple|HTMLElement} element - The element to register.
     * @param {Object} config - The `Ripple` configuration object.
     * 
     */
    add(element, config) {
        return new Ripple(element, config);
    }

    /**
     * Binds a new `Ripple` to all elements with [data-ripple] attribute. Elements that are already bound with a `Ripple`, are skipped.
     * @param {HTMLElement} node - The node used for the query selecting from. Using `document.body` as default.
     */
    bindAll(node = document.body) {
        node.querySelectorAll('[data-ripple]').forEach(el => this.add(el));
    }
    
    /**
     * Get the registered `Ripple` instance of the provided element.
     * @param {Ripple|HTMLElement} element - The element to retrieve the `Ripple` instance for.
     * @returns {Ripple} The `Ripple` instance if found.
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

    /**
     * Unbinds all `Ripple` elements with [data-ripple] attribute.
     * @param {HTMLElement} node - The node used for the query selecting from. Using `document.body` as default.
     */
    unbindAll(node = document.body) {
        node.querySelectorAll('[data-ripple]').forEach(el => this.remove(el));
    }
}