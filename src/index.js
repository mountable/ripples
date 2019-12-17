import RippleRegister from './RippleRegister'
import Ripple from './Ripple'

// Observe document for node insertions/removals of ripple instances
const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type == 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.dataset.ripple != undefined) new Ripple(node);
                    else RippleRegister.bindAll(node);
                }
            });

            mutation.removedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (RippleRegister.has(node)) RippleRegister.remove(node);
                    else RippleRegister.unbindAll(node);
                }
            });
        }

        // Update ripple colors
        else if (mutation.type == 'attributes' && RippleRegister.has(mutation.target)) {
            if (mutation.attributeName == 'data-ripple') {
                RippleRegister.get(mutation.target).color = mutation.target.dataset.ripple;
            }

            if (mutation.attributeName == 'data-ripple-out') {
                RippleRegister.get(mutation.target).colorOut = mutation.target.dataset.rippleOut;
            }
        }
    }
});

observer.observe(document.body, { attributes: true, childList: true, subtree: true });

// Initally bind all ripples in document
RippleRegister.bindAll();

export default {
    RippleRegister,
    Ripple
}

export {
    RippleRegister,
    Ripple
}