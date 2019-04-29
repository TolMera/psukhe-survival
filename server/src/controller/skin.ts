export default class Eye {
    constructor() {
        let config = require('../helper/configs').default;
        setInterval(() => {
            for (let char of global.controller.game.characters) {
                if (this.hasSkinTrait(char)) {
                    this.processSkinTrait(char._socket);
                }
            }
        }, config.game.waittime.skin);
    }

    /**
     * Simple test for eyes
     */
    hasSkinTrait(char) {
        if (char.traits.includes('Photo Synthesis')) {
            return true;
        }
        return false;
    }

    /**
     * If character has eyes, then they are able to look around for information about their world.
     */
    processSkinTrait(_socket) {
        let char = _socket.game.character;
        if (char.traits.includes('Photo Synthesis')) {
            this.photoSynthesis(_socket);
        }
    }

    photoSynthesis(_socket) {
        if (global.controller.world.day) {
            _socket.game.character.status.hunger++;
            if (_socket.game.character.status.hunger > 100) _socket.game.character.status.hunger = 100;
        } else {
            // It's night time, there is no sunlinght to do photosynthesis
        }
    }
}