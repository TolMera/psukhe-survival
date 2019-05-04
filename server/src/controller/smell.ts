export default class Smell {
    constructor() {
        let config = require('../helper/configs').default;
        setInterval(() => {
            for (let char of global.controller.game.characters) {
                if (this.hasNose(char)) {
                    this.doSniff(char._socket);
                }
            }
        }, config.game.waittime.sniff);
    }

    /**
     * Sets up the message buffer
     */
    socketUpdate(_socket) {
        _socket.game.nose = {
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
            veg: {
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
            },
            chemicalReceptors: { message: '' },
            senseOfSmell: { n: { message: '' }, s: { message: '' }, e: { message: '' }, w: { message: '' } }
        }
    }

    /**
     * Simple test for ears
     */
    hasNose(char) {
        if (char.traits.includes('Chemical Receptors')) {
            return true;
        }
        if (char.traits.includes('Sense of smell')) {
            return true;
        }
        if (char.traits.includes('Dog like')) {
            return true;
        }
        if (char.traits.includes('ppm')) {
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

        if (char.traits.includes('Chemical Receptors')) {
            this.chemicalReceptors(_socket);
        }
        if (char.traits.includes('Sense of smell')) {
            this.senseOfSmell(_socket);
        }
        if (char.traits.includes('Dog like')) {
            this.dogLike(_socket);
        }
        if (char.traits.includes('ppm')) {
            this.ppm(_socket);
        }
    }

    populateDirections(_char) {
        let myGrid = _char.position;
        let myPoint = global.controller.world.gridToXY(myGrid);
        _char._socket.game.nose.old.n = _char._socket.game.nose.n;
        _char._socket.game.nose.old.ne = _char._socket.game.nose.ne;
        _char._socket.game.nose.old.nw = _char._socket.game.nose.nw;
        _char._socket.game.nose.old.s = _char._socket.game.nose.s;
        _char._socket.game.nose.old.se = _char._socket.game.nose.se;
        _char._socket.game.nose.old.sw = _char._socket.game.nose.sw;
        _char._socket.game.nose.old.e = _char._socket.game.nose.e;
        _char._socket.game.nose.old.w = _char._socket.game.nose.w;
        _char._socket.game.nose.veg.n = global.controller.map.getVeg(myPoint.south - 1, myPoint.east);
        _char._socket.game.nose.n = global.controller.world.get(myPoint.south - 1, myPoint.east).filter((item) => {
            if (undefined !== item.status && undefined !== item.size) {
                return true;
            }
            return false;
        }).length;
        _char._socket.game.nose.veg.ne = global.controller.map.getVeg(myPoint.south - 1, myPoint.east + 1);
        _char._socket.game.nose.ne = global.controller.world.get(myPoint.south - 1, myPoint.east + 1).filter((item) => {
            if (undefined !== item.status && undefined !== item.size) {
                return true;
            }
            return false;
        }).length;
        _char._socket.game.nose.veg.nw = global.controller.map.getVeg(myPoint.south - 1, myPoint.east - 1);
        _char._socket.game.nose.nw = global.controller.world.get(myPoint.south - 1, myPoint.east - 1).filter((item) => {
            if (undefined !== item.status && undefined !== item.size) {
                return true;
            }
            return false;
        }).length;
        _char._socket.game.nose.veg.s = global.controller.map.getVeg(myPoint.south + 1, myPoint.east);
        _char._socket.game.nose.s = global.controller.world.get(myPoint.south + 1, myPoint.east).filter((item) => {
            if (undefined !== item.status && undefined !== item.size) {
                return true;
            }
            return false;
        }).length;
        _char._socket.game.nose.veg.se = global.controller.map.getVeg(myPoint.south + 1, myPoint.east + 1);
        _char._socket.game.nose.se = global.controller.world.get(myPoint.south + 1, myPoint.east + 1).filter((item) => {
            if (undefined !== item.status && undefined !== item.size) {
                return true;
            }
            return false;
        }).length;
        _char._socket.game.nose.veg.sw = global.controller.map.getVeg(myPoint.south + 1, myPoint.east - 1);
        _char._socket.game.nose.sw = global.controller.world.get(myPoint.south + 1, myPoint.east - 1).filter((item) => {
            if (undefined !== item.status && undefined !== item.size) {
                return true;
            }
            return false;
        }).length;
        _char._socket.game.nose.veg.e = global.controller.map.getVeg(myPoint.south, myPoint.east + 1);
        _char._socket.game.nose.e = global.controller.world.get(myPoint.south, myPoint.east + 1).filter((item) => {
            if (undefined !== item.status && undefined !== item.size) {
                return true;
            }
            return false;
        }).length;
        _char._socket.game.nose.veg.w = global.controller.map.getVeg(myPoint.south, myPoint.east - 1);
        _char._socket.game.nose.w = global.controller.world.get(myPoint.south, myPoint.east - 1).filter((item) => {
            if (undefined !== item.status && undefined !== item.size) {
                return true;
            }
            return false;
        }).length;
    }

    /**
     * You're ontop of some food
     */
    chemicalReceptors(_socket) {
        let message;

        let myGrid = _char.position;
        let myPoint = global.controller.world.gridToXY(myGrid);
        let veg = global.controller.map.getVeg(myPoint.south, myPoint.east);

        if (veg) {
            message = { message: 'You smell nutrients' };
            if (_socket.game.eye.chemicalReceptors.message != JSON.stringify(message)) {
                _socket.emit('nose', message);
                _socket.game.eye.chemicalReceptors.message = JSON.stringify(message)
            }
        }
    }

    /**
     * Smell food or characters around you
     */
    senseOfSmell(_socket) {
        let message;

        if (_socket.game.nose.veg.n) {
            message = { message: 'You smell vegetation to the "n"' };
            if (_socket.game.eye.senseOfSmell.n.message != JSON.stringify(message)) {
                _socket.emit('nose', message);
                _socket.game.eye.senseOfSmell.n.message = JSON.stringify(message)
            }
        }
        if (_socket.game.nose.veg.s) {
            message = { message: 'You smell vegetation to the "s"' };
            if (_socket.game.eye.senseOfSmell.s.message != JSON.stringify(message)) {
                _socket.emit('nose', message);
                _socket.game.eye.senseOfSmell.s.message = JSON.stringify(message)
            }
        }
        if (_socket.game.nose.veg.e) {
            message = { message: 'You smell vegetation to the "e"' };
            if (_socket.game.eye.senseOfSmell.e.message != JSON.stringify(message)) {
                _socket.emit('nose', message);
                _socket.game.eye.senseOfSmell.e.message = JSON.stringify(message)
            }
        }
        if (_socket.game.nose.veg.w) {
            message = { message: 'You smell vegetation to the "w"' };
            if (_socket.game.eye.senseOfSmell.w.message != JSON.stringify(message)) {
                _socket.emit('nose', message);
                _socket.game.eye.senseOfSmell.w.message = JSON.stringify(message)
            }
        }
    }

    /**
     * Should give you a sign as to how big something is
     */
    dogLike(_socket) {
        let message;

        let myGrid = _socket.game.character.position;
        let point = global.controller.world.gridToXY(myGrid);

        if (_socket.game.nose.old.n != _socket.game.nose.n) {
            let place = global.controller.world.get(point.south - 1, point.east);
            let weight = 0;
            for (let item of place) {
                if (undefined !== item.size) weight += item.size;
            }
            message = { message: `I smell something to the "n", it smells ${(weight > _socket.game.character.size) ? 'bigger than' : 'smaller than'} me` };
            _socket.emit('nose', message);
        }
        if (_socket.game.nose.old.s != _socket.game.nose.s) {
            let place = global.controller.world.get(point.south + 1, point.east);
            let weight = 0;
            for (let item of place) {
                if (undefined !== item.size) weight += item.size;
            }
            message = { message: `I smell something to the "s", it smells ${(weight > _socket.game.character.size) ? 'bigger than' : 'smaller than'} me` };
            _socket.emit('nose', message);
        }
        if (_socket.game.nose.old.e != _socket.game.nose.e) {
            let place = global.controller.world.get(point.south, point.east - 1);
            let weight = 0;
            for (let item of place) {
                if (undefined !== item.size) weight += item.size;
            }
            message = { message: `I smell something to the "e", it smells ${(weight > _socket.game.character.size) ? 'bigger than' : 'smaller than'} me` };
            _socket.emit('nose', message);
        }
        if (_socket.game.nose.old.w != _socket.game.nose.w) {
            let place = global.controller.world.get(point.south, point.east + 1);
            let weight = 0;
            for (let item of place) {
                if (undefined !== item.size) weight += item.size;
            }
            message = { message: `I smell something to the "w", it smells ${(weight > _socket.game.character.size) ? 'bigger than' : 'smaller than'} me` };
            _socket.emit('nose', message);
        }
    }

    /**
     * The ability to smell and differentiate chars in the same square
     */
    ppm(_socket) {
        let message;

        let myGrid = _socket.game.character.position;
        let point = global.controller.world.gridToXY(myGrid);

        if (_socket.game.nose.old.n != _socket.game.nose.n) {
            let place = global.controller.world.get(point.south - 1, point.east);
            message = { message: `I smell ${(place.length > 1) ? place.length + ' things' : 'something'} to the "n".` };
            _socket.emit('nose', message);
        }
        if (_socket.game.nose.old.s != _socket.game.nose.s) {
            let place = global.controller.world.get(point.south + 1, point.east);
            message = { message: `I smell ${(place.length > 1) ? place.length + ' things' : 'something'} to the "s".` };
            _socket.emit('nose', message);
        }
        if (_socket.game.nose.old.e != _socket.game.nose.e) {
            let place = global.controller.world.get(point.south, point.east - 1);
            message = { message: `I smell ${(place.length > 1) ? place.length + ' things' : 'something'} to the "e".` };
            _socket.emit('nose', message);
        }
        if (_socket.game.nose.old.w != _socket.game.nose.w) {
            let place = global.controller.world.get(point.south, point.east + 1);
            message = { message: `I smell ${(place.length > 1) ? place.length + ' things' : 'something'} to the "w".` };
            _socket.emit('nose', message);
        }
    }

    /**
     * Reset the message buffer so all messages will now process
     */
    reset(char) {
        this.socketUpdate(char._socket);
    }
}