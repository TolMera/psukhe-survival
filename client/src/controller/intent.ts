export default class Intent {
    constructor() {

    }
    
    personalize(name) {
        if (undefined !== name.length || 0 !== name.length) {
            global.controller.socket.socket.emit('intention', { action: 'personalize', name });
        }
    }

    /**
     * 
     */
    move(dir) {
        if (['n', 's', 'e', 'w'].includes(dir)) {
            global.controller.socket.socket.emit('intention', { action: 'move', dir });
            // console.log({ action: 'move', dir });
        } else {
            throw "Sorry, you passed in an invalid direction, try 'n', 's', 'e' or 'w'";
        }
    }

    /**
     * 
     */
    evolve(name) {
        if (
            [
                'Photo sensitive organ',
                'Greyscale sight',
                'two colour sight',
                'Three colour sight',
                'Thermal vision',
                'Sense Vibration',
                'Sounds',
                'Clear Hearing',
                'Sensitive Hearing',
                'Very Sensitive Hearing',
                'Chemical Receptors',
                'Sense of smell',
                'Dog like',
                'ppm',
                'Teeth',
                'Beak',
                'Needle',
                'Sucker',
                'Venom',
                'Toxins',
                'Digest Celulose',
                'Camoflage',
                'Photo Synthesis',
                'Leathery',
                'Scaled',
                'Heavily Scaled',
                'Dragon Like',
                'Hairs',
                'Thin Fur',
                'Fur',
                'Thick Fur',
                'Bristles',
                'Spikes',
                'Mitosis',
                'Fertalize',
                'Lay Eggs',
                'Live Birth',
                'Parthenogenesis'
            ].includes(name)
        ) {
            global.controller.socket.socket.emit('intention', { action: 'evolve', name });
            // console.log({ action: 'evolve', name });
        }
    }

    /**
     * 
     */
    attack(dir) {
        if (['n', 's', 'e', 'w'].includes(dir)) {
            global.controller.socket.socket.emit('intention', { action: 'attack', dir });
            // console.log({ action: 'attack', dir });
        } else {
            throw "Sorry, you passed in an invalid direction, try 'n', 's', 'e' or 'w'";
        }
    }

    /**
     * 
     */
    eat(dir) {
        if (['n', 's', 'e', 'w'].includes(dir)) {
            global.controller.socket.socket.emit('intention', { action: 'eat', dir });
            // console.log({ action: 'eat', dir });
        } else {
            throw "Sorry, you passed in an invalid direction, try 'n', 's', 'e' or 'w'";
        }
    }

    /**
     * 
     */
    drink(dir) {
        if (['n', 's', 'e', 'w'].includes(dir)) {
            global.controller.socket.socket.emit('intention', { action: 'drink', dir });
            // console.log({ action: 'drink', dir });
        } else {
            throw "Sorry, you passed in an invalid direction, try 'n', 's', 'e' or 'w'";
        }
    }

    /**
     * 
     */
    trade(id, what, amount) {
        if (
            undefined === id || id.length === 0
            || undefined === what || what.length === 0
            || undefined === amount || amount.length === 0
        ) {
            console.log(
                undefined === id,
                id.length === 0,
                undefined === what,
                what.length === 0,
                undefined === amount,
                amount.length === 0
            );
            throw "Sorry but you did not provide all the required parameters - see console.log";
        }
        global.controller.socket.socket.emit('intention', { action: 'trade', what, amount, id });
        // console.log({ action: 'trade', what, amount, id });
    }
}