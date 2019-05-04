export default class Ear {
    constructor() {
        let config = require('../helper/configs').default;
        setInterval(() => {
            for (let char of global.controller.game.characters) {
                if (this.hasEars(char)) {
                    this.doListen(char._socket);
                }
            }
        }, config.game.waittime.ears);
    }

    /**
     * Sets up the message buffer
     */
    socketUpdate(_socket) {
        _socket.game.ear = {
            n: 0,
            ne: 0,
            nw: 0,
            s: 0,
            se: 0,
            sw: 0,
            e: 0,
            w: 0,
            old: {
                n: 0,
                ne: 0,
                nw: 0,
                s: 0,
                se: 0,
                sw: 0,
                e: 0,
                w: 0,
            },
            senseVibration: { message: '' },
            Sounds: { message: '' },
            clearHearing: { message: '' },
            sensitiveHearing: { message: '' },
            verySensitiveHearing: { message: '' }
        }
    }

    /**
     * Simple test for ears
     */
    hasEars(char) {
        if (char.traits.includes('Sense Vibration')) {
            return true;
        }
        if (char.traits.includes('Sounds')) {
            return true;
        }
        if (char.traits.includes('Clear Hearing')) {
            return true;
        }
        if (char.traits.includes('Sensitive Hearing')) {
            return true;
        }
        if (char.traits.includes('Very Sensitive Hearing')) {
            return true;
        }
        return false;
    }

    /**
     * If character has ears, then they are able to look around for information about their world.
     */
    doListen(_socket) {
        let char = _socket.game.character;

        // Get the number of characters in all directions
        this.populateDirections(char);

        if (char.traits.includes('Sense Vibration')) {
            this.senseVibration(_socket);
        }
        if (char.traits.includes('Sounds')) {
            this.Sounds(_socket);
        }
        if (char.traits.includes('Clear Hearing')) {
            this.clearHearing(_socket);
        }
        if (char.traits.includes('Sensitive Hearing')) {
            this.sensitiveHearing(_socket);
        }
        if (char.traits.includes('Very Sensitive Hearing')) {
            this.verySensitiveHearing(_socket);
        }
    }

    populateDirections(_char) {
        let myGrid = _char.position;
        let myPoint = global.controller.world.gridToXY(myGrid);
        _char._socket.game.ear.old.n = _char._socket.game.ear.n;
        _char._socket.game.ear.old.ne = _char._socket.game.ear.ne;
        _char._socket.game.ear.old.nw = _char._socket.game.ear.nw;
        _char._socket.game.ear.old.s = _char._socket.game.ear.s;
        _char._socket.game.ear.old.se = _char._socket.game.ear.se;
        _char._socket.game.ear.old.sw = _char._socket.game.ear.sw;
        _char._socket.game.ear.old.e = _char._socket.game.ear.e;
        _char._socket.game.ear.old.w = _char._socket.game.ear.w;

        _char._socket.game.ear.n = global.controller.world.get(myPoint.south - 1, myPoint.east).filter((item) => {
            if (undefined !== item.status && undefined !== item.size) {
                return true;
            }
            return false;
        }).length;
        _char._socket.game.ear.ne = global.controller.world.get(myPoint.south - 1, myPoint.east + 1).filter((item) => {
            if (undefined !== item.status && undefined !== item.size) {
                return true;
            }
            return false;
        }).length;
        _char._socket.game.ear.nw = global.controller.world.get(myPoint.south - 1, myPoint.east - 1).filter((item) => {
            if (undefined !== item.status && undefined !== item.size) {
                return true;
            }
            return false;
        }).length;
        _char._socket.game.ear.s = global.controller.world.get(myPoint.south + 1, myPoint.east).filter((item) => {
            if (undefined !== item.status && undefined !== item.size) {
                return true;
            }
            return false;
        }).length;
        _char._socket.game.ear.se = global.controller.world.get(myPoint.south + 1, myPoint.east + 1).filter((item) => {
            if (undefined !== item.status && undefined !== item.size) {
                return true;
            }
            return false;
        }).length;
        _char._socket.game.ear.sw = global.controller.world.get(myPoint.south + 1, myPoint.east - 1).filter((item) => {
            if (undefined !== item.status && undefined !== item.size) {
                return true;
            }
            return false;
        }).length;
        _char._socket.game.ear.e = global.controller.world.get(myPoint.south, myPoint.east + 1).filter((item) => {
            if (undefined !== item.status && undefined !== item.size) {
                return true;
            }
            return false;
        }).length;
        _char._socket.game.ear.w = global.controller.world.get(myPoint.south, myPoint.east - 1).filter((item) => {
            if (undefined !== item.status && undefined !== item.size) {
                return true;
            }
            return false;
        }).length;
    }

    /**
     * Senses that something in the environment has moved
     */
    senseVibration(_socket) {
        let message;

        if (
            _socket.game.ear.old.n != _socket.game.ear.n
            || _socket.game.ear.old.s != _socket.game.ear.s
            || _socket.game.ear.old.e != _socket.game.ear.e
            || _socket.game.ear.old.w != _socket.game.ear.w
        ) {
            message = { message: 'You feel a rumbling' };
            _socket.emit('ears', message);
        }
    }

    /**
     * Can tell what direction something moved
     */
    Sounds(_socket) {
        let message;

        if (_socket.game.ear.old.n != _socket.game.ear.n) {
            message = { message: 'You feel a rumbling to the "n"' };
            _socket.emit('ears', message);
        }
        if (_socket.game.ear.old.s != _socket.game.ear.s) {
            message = { message: 'You feel a rumbling to the "s"' };
            _socket.emit('ears', message);
        }
        if (_socket.game.ear.old.e != _socket.game.ear.e) {
            message = { message: 'You feel a rumbling to the "e"' };
            _socket.emit('ears', message);
        }
        if (_socket.game.ear.old.w != _socket.game.ear.w) {
            message = { message: 'You feel a rumbling to the "w"' };
            _socket.emit('ears', message);
        }
    }

    /**
     * Should be able to tell what directions, and if they came closer or went away
     */
    clearHearing(_socket) {
        let message;

        if (_socket.game.ear.old.n != _socket.game.ear.n) {
            if (_socket.game.ear.old.n < _socket.game.ear.n) {
                message = { message: 'You hear something approaching from the "n"' };
            } else {
                message = { message: 'You hear something departing towards the "n"' };
            }
            _socket.emit('ears', message);
        }
        if (_socket.game.ear.old.s != _socket.game.ear.s) {
            if (_socket.game.ear.old.s < _socket.game.ear.s) {
                message = { message: 'You hear something approaching from the "s"' };
            } else {
                message = { message: 'You hear something departing towards the "s"' };
            }
            _socket.emit('ears', message);
        }
        if (_socket.game.ear.old.e != _socket.game.ear.e) {
            if (_socket.game.ear.old.e < _socket.game.ear.e) {
                message = { message: 'You hear something approaching from the "e"' };
            } else {
                message = { message: 'You hear something departing towards the "e"' };
            }
            _socket.emit('ears', message);
        }
        if (_socket.game.ear.old.w != _socket.game.ear.w) {
            if (_socket.game.ear.old.w < _socket.game.ear.w) {
                message = { message: 'You hear something approaching from the "w"' };
            } else {
                message = { message: 'You hear something departing towards the "w"' };
            }
            _socket.emit('ears', message);
        }
    }

    /**
     * Should give you a sign as to how big something is
     */
    sensitiveHearing(_socket) {
        let message;

        let myGrid = _socket.game.character.position;
        let point = global.controller.world.gridToXY(myGrid);

        if (_socket.game.ear.old.n != _socket.game.ear.n) {
            let place = global.controller.world.get(point.east, point.south - 1);
            let weight = 0;
            for (let item of place) {
                if (undefined !== item.size) weight += item.size;
            }
            message = { message: `Something to the "n" sound like it weighs ${weight}` };
            _socket.emit('ears', message);
        }
        if (_socket.game.ear.old.s != _socket.game.ear.s) {
            let place = global.controller.world.get(point.south + 1, point.east);
            let weight = 0;
            for (let item of place) {
                if (undefined !== item.size) weight += item.size;
            }
            message = { message: `Something to the "s" sound like it weighs ${weight}` };
            _socket.emit('ears', message);
        }
        if (_socket.game.ear.old.e != _socket.game.ear.e) {
            let place = global.controller.world.get(point.south, point.east - 1);
            let weight = 0;
            for (let item of place) {
                if (undefined !== item.size) weight += item.size;
            }
            message = { message: `Something to the "e" sound like it weighs ${weight}` };
            _socket.emit('ears', message);
        }
        if (_socket.game.ear.old.w != _socket.game.ear.w) {
            let place = global.controller.world.get(point.south, point.east + 1);
            let weight = 0;
            for (let item of place) {
                if (undefined !== item.size) weight += item.size;
            }
            message = { message: `Something to the "w" sound like it weighs ${weight}` };
            _socket.emit('ears', message);
        }
    }

    verySensitiveHearing(_socket) {
        let message;

        if (_socket.game.ear.old.n != _socket.game.ear.n) {
            if (_socket.game.ear.old.n < _socket.game.ear.n) {
                message = { message: 'You hear something approaching from the "n"' };
            } else {
                message = { message: 'You hear something departing towards the "n"' };
            }
            _socket.emit('ears', message);
        }
        if (_socket.game.ear.old.ne != _socket.game.ear.ne) {
            if (_socket.game.ear.old.ne < _socket.game.ear.ne) {
                message = { message: 'You hear something approaching from the "ne"' };
            } else {
                message = { message: 'You hear something departing towards the "ne"' };
            }
            _socket.emit('ears', message);
        }
        if (_socket.game.ear.old.nw != _socket.game.ear.nw) {
            if (_socket.game.ear.old.nw < _socket.game.ear.nw) {
                message = { message: 'You hear something approaching from the "nw"' };
            } else {
                message = { message: 'You hear something departing towards the "nw"' };
            }
            _socket.emit('ears', message);
        }

        if (_socket.game.ear.old.s != _socket.game.ear.s) {
            if (_socket.game.ear.old.s < _socket.game.ear.s) {
                message = { message: 'You hear something approaching from the "s"' };
            } else {
                message = { message: 'You hear something departing towards the "s"' };
            }
            _socket.emit('ears', message);
        }
        if (_socket.game.ear.old.se != _socket.game.ear.se) {
            if (_socket.game.ear.old.se < _socket.game.ear.se) {
                message = { message: 'You hear something approaching from the "se"' };
            } else {
                message = { message: 'You hear something departing towards the "se"' };
            }
            _socket.emit('ears', message);
        }
        if (_socket.game.ear.old.sw != _socket.game.ear.sw) {
            if (_socket.game.ear.old.sw < _socket.game.ear.sw) {
                message = { message: 'You hear something approaching from the "sw"' };
            } else {
                message = { message: 'You hear something departing towards the "sw"' };
            }
            _socket.emit('ears', message);
        }

        if (_socket.game.ear.old.e != _socket.game.ear.e) {
            if (_socket.game.ear.old.e < _socket.game.ear.e) {
                message = { message: 'You hear something approaching from the "e"' };
            } else {
                message = { message: 'You hear something departing towards the "e"' };
            }
            _socket.emit('ears', message);
        }
        if (_socket.game.ear.old.w != _socket.game.ear.w) {
            if (_socket.game.ear.old.w < _socket.game.ear.w) {
                message = { message: 'You hear something approaching from the "w"' };
            } else {
                message = { message: 'You hear something departing towards the "w"' };
            }
            _socket.emit('ears', message);
        }
    }

    /**
     * Reset the message buffer so all messages will now process
     */
    reset(char) {
        this.socketUpdate(char._socket);
    }
}