import './RippleRegister'
import Ripple from './Ripple'

// Initally bind all ripples in document
document.body.querySelectorAll('[data-ripple]').forEach(el => new Ripple(el));

// Observe document for node insertions/removals of ripple instances
const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type == 'childList') {
            mutation.addedNodes.forEach(node => node.nodeType === 1 && node.dataset.ripple != undefined && new Ripple(node));
            mutation.removedNodes.forEach(node => RippleRegister.has(node) && RippleRegister.remove(node));
        }

        else if (mutation.type == 'attributes') {
            console.log(mutation);
            mutation.attributeName == 'data-ripple' && RippleRegister.has(mutation.target) && RippleRegister.get(mutation.target).setColor(mutation.target.dataset.ripple);
            mutation.attributeName == 'data-ripple-out' && RippleRegister.has(mutation.target) && RippleRegister.get(mutation.target).setColorOut(mutation.target.dataset.rippleOut);
        }
    }
});

observer.observe(document.body, { attributes: true, childList: true, subtree: true });