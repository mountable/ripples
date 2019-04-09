import './RippleRegister'
import Ripple from './Ripple'

// Initally bind all ripples in document
document.body.querySelectorAll('[ripple]').forEach(el => new Ripple(el));

// Observe document for node insertions/removals of ripple instances
const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type == 'childList') {
            mutation.addedNodes.forEach(node => node.nodeType === 1 && node.getAttribute('ripple') != null && new Ripple(node));
            mutation.removedNodes.forEach(node => RippleRegister.has(node) && RippleRegister.remove(node));
        }

        else if (mutation.type == 'attributes') {
            mutation.attributeName == 'ripple' && RippleRegister.has(mutation.target) && RippleRegister.get(mutation.target).setColor(mutation.target.getAttribute('ripple'));
            mutation.attributeName == 'ripple-out' && RippleRegister.has(mutation.target) && RippleRegister.get(mutation.target).setColorOut(mutation.target.getAttribute('ripple-out'));
        }
    }
});

observer.observe(document.body, { attributes: true, childList: true, subtree: true });