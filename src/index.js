import './RippleRegister'
import Ripple from './Ripple'

// Observe document for node insertions/removals of ripple instances
const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type == 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.dataset.ripple != undefined) new Ripple(node);
                    else node.querySelectorAll('[data-ripple]').forEach(ripple => new Ripple(ripple));
                }
            });

            mutation.removedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (RippleRegister.has(node)) RippleRegister.remove(node);
                    else node.querySelectorAll('[data-ripple]').forEach(ripple => RippleRegister.has(ripple) && RippleRegister.remove(ripple));
                }
            });
        }

        else if (mutation.type == 'attributes') {
            mutation.attributeName == 'data-ripple' && RippleRegister.has(mutation.target) && RippleRegister.get(mutation.target).setColor(mutation.target.dataset.ripple);
            mutation.attributeName == 'data-ripple-out' && RippleRegister.has(mutation.target) && RippleRegister.get(mutation.target).setColorOut(mutation.target.dataset.rippleOut);
        }
    }
});

observer.observe(document.body, { attributes: true, childList: true, subtree: true });

// Initally bind all ripples in document
document.body.querySelectorAll('[data-ripple]').forEach(el => new Ripple(el));
