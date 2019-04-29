export default class Intention {
    intentions: {} = {};

    constructor() {
        this.intentions = {};
    }

    add(_socket, _intent) {
        switch (_intent.action) {
            case 'move': {
                this.move(_socket, _intent);
                break;
            }
            case 'evolve': {
                this.evolve(_socket, _intent);
                break;
            }
            case 'attack': {
                this.attack(_socket, _intent);
                break;
            }
            case 'eat': {
                this.eat(_socket, _intent);
                break;
            }
            case 'drink': {
                this.drink(_socket, _intent);
                break;
            }
            case 'trade': {
                this.trade(_socket, _intent);
                break;
            }
            case 'personalize': {
                _socket.game.character.name = _intent.name
                break;
            }
            // case 'look': {
            //     this.look(_socket, _intent);
            //     break;
            // }
        }
    }

    /**
     * Test instruction
     * intention {"action":"move", "dir":"n"}
     * intention {"action":"move", "dir":"s"}
     * intention {"action":"move", "dir":"e"}
     * intention {"action":"move", "dir":"w"}
     */
    move(_socket, _intent) {
        if (undefined === _intent.dir) {
            _socket.emit("message", { message: 'When making a request to move, a direction must be included.' });
            console.log('message', 'When making a request to move, a direction must be included.');
        }
        this.pushIntent(_socket, _intent);
    }

    /**
     * Test Instruction
     * intention {"action":"evolve", "name":"Hairs"}
     * 
     * intention {"action":"evolve", "name":"Photo sensitive organ"}
     * intention {"action":"evolve", "name":"Greyscale sight"}
     * intention {"action":"evolve", "name":"two colour sight"}
     * intention {"action":"evolve", "name":"Three colour sight"}
     * intention {"action":"evolve", "name":"Thermal vision"}
     */
    evolve(_socket, _intent) {
        if (undefined === _intent.name) {
            _socket.emit("message", { message: 'When making a request to evolce, the name of a trait must be given.' });
            console.log('message', 'When making a request to evolce, the name of a trait must be given.');
        }
        this.pushIntent(_socket, _intent);
    }

    /**
     * Test instruction
     intention {"action":"attack", "dir":"n"}
     
     intention {"action":"evolve", "name":"Teeth"}
     intention {"action":"evolve", "name":"Sucker"}
     */
    attack(_socket, _intent) {
        if (undefined === _intent.dir) {
            _socket.emit("message", { message: 'When making a request to attack, a direction must be included.' });
            console.log('message', 'When making a request to attack, a direction must be included.');
        }
        this.pushIntent(_socket, _intent);
    }

    /**
     * Test instruction
     intention {"action":"eat", "dir":"n"}
     * 
     intention {"action":"evolve", "name":"Beak"}
     intention {"action":"evolve", "name":"Needle"}
     */
    eat(_socket, _intent) {
        if (undefined === _intent.dir) {
            _socket.emit("message", { message: 'When making a request to eat, a direction must be included.' });
            console.log('message', 'When making a request to eat, a direction must be included.');
        }
        this.pushIntent(_socket, _intent);
    }

    /**
     * Test instruction
     * intention {"action":"drink", "dir":"n"}
     */
    drink(_socket, _intent) {
        if (undefined === _intent.dir) {
            _socket.emit("message", { message: 'When making a request to drink, a direction must be included.' });
            console.log('message', 'When making a request to drink, a direction must be included.');
        }
        this.pushIntent(_socket, _intent);
    }

    /**
     * Test instruction
     * intention {"action":"trade", "id":"Z4JyOqdEbYmgIfjMAAAA", "what":"evPoints", "amount": 100}
     * intention {"action":"trade", "id":"Z4JyOqdEbYmgIfjMAAAA", "what":"health", "amount": 100}
     * intention {"action":"trade", "id":"Z4JyOqdEbYmgIfjMAAAA", "what":"hunger", "amount": 100}
     * intention {"action":"trade", "id":"Z4JyOqdEbYmgIfjMAAAA", "what":"thirst", "amount": 100}
     * intention {"action":"trade", "id":"Z4JyOqdEbYmgIfjMAAAA", "what":"oxygen", "amount": 100}
     */
    trade(_socket, _intent) {
        if (undefined === _intent.id) {
            _socket.emit("message", { message: 'When making a trade, the ID of the person you are trading to must be included.' });
            console.log('message', 'When making a trade, the ID of the person you are trading to must be included.');
        }
        if (undefined === _intent.what) {
            _socket.emit("message", { message: 'When making a trade, you need to include details of what you are trading (evPoints, health, hunger, thirst, oxygen).' });
            console.log('message', 'When making a trade, you need to include details of what you are trading (evPoints, health, hunger, thirst, oxygen).');
        }
        if (undefined === _intent.amount && !isNaN(Number(_intent.amount))) {
            _socket.emit("message", { message: 'When making a trade, you must include an amount to be traded, and it must be a number' });
            console.log('message', 'When making a trade, you must include an amount to be traded, and it must be a number');
        }
        this.pushIntent(_socket, _intent);
    }

    /**
     * Test instruction
     * intention {"action":"look"}
     */
    // look(_socket, _intent) {
    //     this.pushIntent(_socket, _intent);
    // }

    /**
     * Procreation
     * Test 
     * intention {"action":"procreate", "type":"Mitosis"}
     * 
     * // First Fertalization
     * intention {"action":"procreate", "type":"Fertalize", "id":""} - can be used on eggs or on player ID's
     * intention {"action":"procreate", "type":"Parthenogenesis"}
     * 
     * // Then Birth
     * intention {"action":"procreate", "type":"Lay Eggs"}
     * intention {"action":"procreate", "type":"Live Birth"}
     * 
     * 
     */
    procreate(_socket, _intent) {
        switch (_intent.type) {
            case 'Mitosis': {
                break
            }
            case 'Fertalize': {
                if (undefined === _intent.id) {
                    _socket.emit("message", { message: 'When attempting to fertalize something you must supply an ID' });
                    console.log('message', 'When attempting to fertalize something you must supply an ID');
                }
                break
            }
            case 'Accept': {
                // Because I don't want any negative feedback - it's got to be agreed
                break
            }
            case 'Parthenogenesis': {
                break
            }
            case 'Lay Eggs': {
                break
            }
            case 'Live Birth': {
                break
            }
        }
        this.pushIntent(_socket, _intent);
    }

    /**
     * Push the intent onto the next game frame
     */
    pushIntent(_socket, _intent) {
        let frame = global.controller.game.gameBuffer;
        try {
            this.intentions[frame].push([_socket, _intent]);
        } catch (e) {
            console.log(e);
            try {
                this.intentions[frame++].push([_socket, _intent]);
            } catch (e) {
                console.log("Failure to add _intent to _intentions");
                console.log(_intent);
                console.log(e);
            }
        }
    }
}