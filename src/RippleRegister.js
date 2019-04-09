import Ripple from './Ripple'

window.RippleRegister = new class RippleRegister extends Array {
    static get [Symbol.species]() { return Array }

    add(element, config) {
        if (!this.has(element)) {
            return new Ripple(element, config);
        }

        return false;
    }
    
    get(element) {
        return this.find(ripple => element instanceof Ripple ? ripple === element : ripple.el === element);
    }

    has(element) {
        return !!this.get(element);
    }

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