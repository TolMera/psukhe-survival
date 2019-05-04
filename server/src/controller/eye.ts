export default class Eye {
    constructor() {
        let config = require('../helper/configs').default;
        setInterval(() => {
            for (let char of global.controller.game.characters) {
                if (this.hasEyes(char)) {
                    this.doLook(char._socket);
                }
            }
        }, config.game.waittime.eyes);
    }

    /**
     * Sets up the message buffer
     */
    socketUpdate(_socket) {
        _socket.game.eye = {
            photoSensitiveOrgan: { message: '' },
            greyscaleSight: { n: { message: '' }, s: { message: '' }, e: { message: '' }, w: { message: '' } },
            twoColourSight: { n: { message: '' }, s: { message: '' }, e: { message: '' }, w: { message: '' } },
            threeColourSight: { n: { message: '' }, s: { message: '' }, e: { message: '' }, w: { message: '' } },
            thermalVision: { n: { message: '' }, s: { message: '' }, e: { message: '' }, w: { message: '' } }
        }
    }

    /**
     * Simple test for eyes
     */
    hasEyes(char) {
        if (char.traits.includes('Photo sensitive organ')) {
            return true;
        }
        if (char.traits.includes('Greyscale sight')) {
            return true;
        }
        if (char.traits.includes('two colour sight')) {
            return true;
        }
        if (char.traits.includes('Three colour sight')) {
            return true;
        }
        if (char.traits.includes('Thermal vision')) {
            return true;
        }
        return false;
    }

    /**
     * If character has eyes, then they are able to look around for information about their world.
     */
    doLook(_socket) {
        let char = _socket.game.character;
        if (char.traits.includes('Photo sensitive organ')) {
            this.photoSensitiveOrgan(_socket);
        }
        if (char.traits.includes('Greyscale sight')) {
            this.greyscaleSight(_socket);
        }
        if (char.traits.includes('two colour sight')) {
            this.twoColourSight(_socket);
        }
        if (char.traits.includes('Three colour sight')) {
            this.threeColourSight(_socket);
        }
        if (char.traits.includes('Thermal vision')) {
            this.thermalVision(_socket);
        }
    }

    photoSensitiveOrgan(_socket) {
        let message;
        if (global.controller.world.day) {
            message = { message: 'There is a  bright light surrounding you' };
        } else {
            message = { message: 'You are in darkness' };
        }

        if (_socket.game.eye.photoSensitiveOrgan.message != JSON.stringify(message)) {
            _socket.emit('eyes', message);
            _socket.game.eye.photoSensitiveOrgan.message = JSON.stringify(message)
        }


    }
    greyscaleSight(_socket) {
        if (global.controller.world.day) {
            let myGrid = _socket.game.character.position;
            let myPoint = global.controller.world.gridToXY(myGrid);
            let myHeight = global.controller.map.get( myPoint.south, myPoint.east);

            // case 'n': {
            let height;
            height = global.controller.map.get( myPoint.south - 1, myPoint.east);
            if (height > myHeight) {
                let message = { message: `The ground to the "n" is higher` }
                if (_socket.game.eye.greyscaleSight.n.message != JSON.stringify(message)) {
                    _socket.emit('eyes', message);
                    _socket.game.eye.greyscaleSight.n.message = JSON.stringify(message)
                }
            } else if (height < myHeight) {
                let message = { message: `The ground to the "n" is lower` }
                if (_socket.game.eye.greyscaleSight.n.message != JSON.stringify(message)) {
                    _socket.emit('eyes', message);
                    _socket.game.eye.greyscaleSight.n.message = JSON.stringify(message)
                }
            }
            // case 's': {
            height = global.controller.map.get( myPoint.south + 1, myPoint.east);
            if (height > myHeight) {
                let message = { message: `The ground to the "s" is higher` }
                if (_socket.game.eye.greyscaleSight.s.message != JSON.stringify(message)) {
                    _socket.emit('eyes', message);
                    _socket.game.eye.greyscaleSight.s.message = JSON.stringify(message)
                }
            } else if (height < myHeight) {
                let message = { message: `The ground to the "s" is lower` }
                if (_socket.game.eye.greyscaleSight.s.message != JSON.stringify(message)) {
                    _socket.emit('eyes', message);
                    _socket.game.eye.greyscaleSight.s.message = JSON.stringify(message)
                }
            }
            // case 'e': {
            height = global.controller.map.get( myPoint.south, myPoint.east + 1);
            if (height > myHeight) {
                let message = { message: `The ground to the "e" is higher` }
                if (_socket.game.eye.greyscaleSight.e.message != JSON.stringify(message)) {
                    _socket.emit('eyes', message);
                    _socket.game.eye.greyscaleSight.e.message = JSON.stringify(message)
                }
            } else if (height < myHeight) {
                let message = { message: `The ground to the "e" is lower` }
                if (_socket.game.eye.greyscaleSight.e.message != JSON.stringify(message)) {
                    _socket.emit('eyes', message);
                    _socket.game.eye.greyscaleSight.e.message = JSON.stringify(message)
                }
            }
            // case 'w': {
            height = global.controller.map.get( myPoint.south, myPoint.east - 1);
            if (height > myHeight) {
                let message = { message: `The ground to the "w" is higher` }
                if (_socket.game.eye.greyscaleSight.w.message != JSON.stringify(message)) {
                    _socket.emit('eyes', message);
                    _socket.game.eye.greyscaleSight.w.message = JSON.stringify(message)
                }
            } else if (height < myHeight) {
                let message = { message: `The ground to the "w" is lower` }
                if (_socket.game.eye.greyscaleSight.w.message != JSON.stringify(message)) {
                    _socket.emit('eyes', message);
                    _socket.game.eye.greyscaleSight.w.message = JSON.stringify(message)
                }
            }
        }
    }
    twoColourSight(_socket) {
        if (global.controller.world.day) {
            let myGrid = _socket.game.character.position;
            let myPoint = global.controller.world.gridToXY(myGrid);
            let myVeg = global.controller.map.getVeg(myPoint.east, myPoint.south);

            // case 'n': {
            let veg;
            veg = global.controller.map.get( myPoint.south - 1, myPoint.east);
            if (veg > myVeg) {
                let message = { message: `The ground to the "n" has more vegetation` };
                if (_socket.game.eye.twoColourSight.n.message != JSON.stringify(message)) {
                    _socket.emit('eyes', message);
                    _socket.game.eye.twoColourSight.n.message = JSON.stringify(message)
                }
            } else if (veg < myVeg) {
                let message = { message: `The ground to the "n" has less vegetation` };
                if (_socket.game.eye.twoColourSight.n.message != JSON.stringify(message)) {
                    _socket.emit('eyes', message);
                    _socket.game.eye.twoColourSight.n.message = JSON.stringify(message)
                }
            }
            // case 's': {
            veg = global.controller.map.get( myPoint.south + 1, myPoint.east);
            if (veg > myVeg) {
                let message = { message: `The ground to the "s" has more vegetation` };
                if (_socket.game.eye.twoColourSight.s.message != JSON.stringify(message)) {
                    _socket.emit('eyes', message);
                    _socket.game.eye.twoColourSight.s.message = JSON.stringify(message)
                }
            } else if (veg < myVeg) {
                let message = { message: `The ground to the "s" has less vegetation` };
                if (_socket.game.eye.twoColourSight.s.message != JSON.stringify(message)) {
                    _socket.emit('eyes', message);
                    _socket.game.eye.twoColourSight.s.message = JSON.stringify(message)
                }
            }
            // case 'e': {
            veg = global.controller.map.get( myPoint.south, myPoint.east + 1);
            if (veg > myVeg) {
                let message = { message: `The ground to the "e" has more vegetation` };
                if (_socket.game.eye.twoColourSight.e.message != JSON.stringify(message)) {
                    _socket.emit('eyes', message);
                    _socket.game.eye.twoColourSight.e.message = JSON.stringify(message)
                }
            } else if (veg < myVeg) {
                let message = { message: `The ground to the "e" has less vegetation` };
                if (_socket.game.eye.twoColourSight.e.message != JSON.stringify(message)) {
                    _socket.emit('eyes', message);
                    _socket.game.eye.twoColourSight.e.message = JSON.stringify(message)
                }
            }
            // case 'w': {
            veg = global.controller.map.get( myPoint.south, myPoint.east - 1);
            if (veg > myVeg) {
                let message = { message: `The ground to the "w" has more vegetation` };
                if (_socket.game.eye.twoColourSight.w.message != JSON.stringify(message)) {
                    _socket.emit('eyes', message);
                    _socket.game.eye.twoColourSight.w.message = JSON.stringify(message)
                }
            } else if (veg < myVeg) {
                let message = { message: `The ground to the "w" has less vegetation` };
                if (_socket.game.eye.twoColourSight.w.message != JSON.stringify(message)) {
                    _socket.emit('eyes', message);
                    _socket.game.eye.twoColourSight.w.message = JSON.stringify(message)
                }
            }
        }
    }
    threeColourSight(_socket) {
        if (global.controller.world.day) {
            let myGrid = _socket.game.character.position;
            let myPoint = global.controller.world.gridToXY(myGrid);

            // case 'n': {
            let place;
            place = global.controller.world.get( myPoint.south - 1, myPoint.east);
            place.filter((thing) => {
                if (undefined !== thing.traits && thing.traits.includes('Camoflage')) {
                    return false;
                }
                return true;
            });
            if (place.length > 0) {
                let message = { message: `There is something "n" of here` };
                if (_socket.game.eye.threeColourSight.n.message != JSON.stringify(message)) {
                    _socket.emit('eyes', message);
                    _socket.game.eye.threeColourSight.n.message = JSON.stringify(message)
                }
            }
            // case 's': {
            place = global.controller.world.get( myPoint.south + 1, myPoint.east);
            place.filter((thing) => {
                if (undefined !== thing.traits && thing.traits.includes('Camoflage')) {
                    return false;
                }
                return true;
            });
            if (place.length > 0) {
                let message = { message: `There is something "s" of here` };
                if (_socket.game.eye.threeColourSight.s.message != JSON.stringify(message)) {
                    _socket.emit('eyes', message);
                    _socket.game.eye.threeColourSight.s.message = JSON.stringify(message)
                }
            }
            // case 'e': {
            place = global.controller.world.get( myPoint.south, myPoint.east + 1);
            place.filter((thing) => {
                if (undefined !== thing.traits && thing.traits.includes('Camoflage')) {
                    return false;
                }
                return true;
            });
            if (place.length > 0) {
                let message = { message: `There is something "e" of here` };
                if (_socket.game.eye.threeColourSight.e.message != JSON.stringify(message)) {
                    _socket.emit('eyes', message);
                    _socket.game.eye.threeColourSight.e.message = JSON.stringify(message)
                }
            }
            // case 'w': {
            place = global.controller.world.get( myPoint.south, myPoint.east - 1);
            place.filter((thing) => {
                if (undefined !== thing.traits && thing.traits.includes('Camoflage')) {
                    return false;
                }
                return true;
            });
            if (place.length > 0) {
                let message = { message: `There is something "w" of here` };
                if (_socket.game.eye.threeColourSight.w.message != JSON.stringify(message)) {
                    _socket.emit('eyes', message);
                    _socket.game.eye.threeColourSight.w.message = JSON.stringify(message)
                }
            }
        }
    }
    thermalVision(_socket) {
        let myGrid = _socket.game.character.position;
        let myPoint = global.controller.world.gridToXY(myGrid);

        // case 'n': {
        let place;
        place = global.controller.world.get( myPoint.south - 1, myPoint.east);
        if (place.length > 0) {
            let map = place.map((item) => {
                if (undefined !== item.status && undefined !== item.status.HP) {
                    return true;
                }
            });
            if (map.length > 0) {
                let message = { message: `There is something warm "n" of here` };
                if (_socket.game.eye.thermalVision.n.message != JSON.stringify(message)) {
                    _socket.emit('eyes', message);
                    _socket.game.eye.thermalVision.n.message = JSON.stringify(message)
                }
            }
        }
        // case 's': {
        place = global.controller.world.get( myPoint.south + 1, myPoint.east);
        if (place.length > 0) {
            let map = place.map((item) => {
                if (undefined !== item.status && undefined !== item.status.HP) {
                    return true;
                }
            });
            if (map.length > 0) {
                let message = { message: `There is something warm "s" of here` };
                if (_socket.game.eye.thermalVision.s.message != JSON.stringify(message)) {
                    _socket.emit('eyes', message);
                    _socket.game.eye.thermalVision.s.message = JSON.stringify(message)
                }
            }
        }
        // case 'e': {
        place = global.controller.world.get( myPoint.south, myPoint.east + 1);
        if (place.length > 0) {
            let map = place.map((item) => {
                if (undefined !== item.status && undefined !== item.status.HP) {
                    return true;
                }
            });
            if (map.length > 0) {
                let message = { message: `There is something warm "e" of here` };
                if (_socket.game.eye.thermalVision.e.message != JSON.stringify(message)) {
                    _socket.emit('eyes', message);
                    _socket.game.eye.thermalVision.e.message = JSON.stringify(message)
                }
            }
        }
        // case 'w': {
        place = global.controller.world.get( myPoint.south, myPoint.east - 1);
        if (place.length > 0) {
            let map = place.map((item) => {
                if (undefined !== item.status && undefined !== item.status.HP) {
                    return true;
                }
            });
            if (map.length > 0) {
                let message = { message: `There is something warm "w" of here` };
                if (_socket.game.eye.thermalVision.w.message != JSON.stringify(message)) {
                    _socket.emit('eyes', message);
                    _socket.game.eye.thermalVision.w.message = JSON.stringify(message)
                }
            }
        }
    }

    /**
     * Reset the message buffer so all messages will now process
     */
    reset(char) {
        this.socketUpdate(char._socket);
    }
}