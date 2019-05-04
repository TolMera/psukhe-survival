export default class Perform {
    constructor() {
        console.log("Permorm controller started");
    }

    // Test codes
    // intention {"action":"move", "dir":"n"}
    // intention {"action":"move", "dir":"s"}
    // intention {"action":"move", "dir":"e"}
    // intention {"action":"move", "dir":"w"}

    doMove(_socket, _intent) {
        let char = _socket.game.character;
        global.controller.world.pop(char.position, char);
        let point = global.controller.world.gridToXY(char.position);

        switch (_intent.dir) {
            case 'n': {
                point.south--;
                global.controller.world.set(point, char);
                break;
            }
            case 's': {
                point.south++;
                global.controller.world.set(point, char);
                break;
            }
            case 'e': {
                point.east++;
                global.controller.world.set(point, char);
                break;
            }
            case 'w': {
                point.east--;
                global.controller.world.set(point, char);
                break;
            }
        }
        // console.log(global.controller.world.gridToXY(char.position));
        // console.log(char.position);

        global.controller.eye.reset(char);
        global.controller.ear.reset(char);
    }

    doAttack(_socket, _intent) {
        let char = _socket.game.character;

        let point = global.controller.world.gridToXY(char.position);
        let place;
        switch (_intent.dir) {
            case 'n': {
                point.south--;
                place = global.controller.world.get(char.position);
                break;
            }
            case 's': {
                point.south++;
                place = global.controller.world.get(char.position);
                break;
            }
            case 'e': {
                point.east++;
                place = global.controller.world.get(char.position);
                break;
            }
            case 'w': {
                point.east--;
                place = global.controller.world.get(char.position);
                break;
            }
        }

        for (let thing of place) {
            if (undefined !== thing.status && undefined !== thing.status.HP) {
                // Leathery
                // Scaled
                // Heavily Scaled
                // Dragon Like
                let armour = 0;
                armour += (char.traits.includes('Leathery') ? .02 : 0);
                armour += (char.traits.includes('Scaled') ? 0.4 : 0);
                armour += (char.traits.includes('Heavily Scaled') ? 0.6 : 0);
                armour += (char.traits.includes('Dragon Like') ? 0.8 : 0);

                let attack = armour - char.attack;
                if (attack < 0) {
                    thing.status.HP += attack;
                } else {
                    char.status.HP -= attack;
                    // They do no damage
                }

                // Venom always gets through
                let venom = (char.traits.includes('Venom') ? 4 : 0);
                if (venom > 0) {
                    let config = require('../helper/configs').default;

                    let interval = config.game.waittime.venom;
                    while (venom > 0.25) {
                        let dmg = venom;
                        setTimeout(() => {
                            thing.status.HP -= dmg;
                            thing.status.HP = Math.round(thing.status.HP)
                        }, interval);
                        venom *= 0.66;
                    }
                }

                if (undefined !== thing._socket) {
                    // This is probably not a good idea, I should not be showing the ID of sockets, especially to people attacking other people.
                    if (thing.status.HP <= 0) {
                        char._socket.emit("message", { message: `You killed ${thing._socket.id} - Waste not, want not.  Down the hatch.` });

                        // If it was something toxic
                        let toxins = (char.traits.includes('Toxins') ? 5 : 0);
                        if (toxins > 0) {
                            let config = require('../helper/configs').default;

                            let interval = config.game.waittime.toxins;
                            while (toxins > 0.25) {
                                let dmg = toxins;
                                setTimeout(() => {
                                    thing.status.HP -= dmg;
                                    thing.status.HP = Math.round(thing.status.HP)
                                }, interval);
                                toxins *= 0.66;
                            }
                        }

                        // Should be proportional to the size of the thing you ate
                        if (undefined !== thing.size) {
                            // A Cow is an animal that turns 10 pounds of grass into 1 pound of Cow.
                            // A Tiger is an animal that turns 10 pounds of cow into 1 pound of Tiger.
                            let bonus = 0;
                            bonus += (char.traits.includes('Teeth') ? 1 : 0);
                            bonus += (char.traits.includes('Sucker') ? 0.5 : 0);

                            char.status.hunger += (thing.size / 10) * (1 + bonus);
                            char.status.thirst += (thing.size / 10) * (1 + bonus);
                            if (char.status.hunger > 100) char.status.hunger = 100;
                            if (char.status.thirst > 100) char.status.thirst = 100;
                            // todo: If the thing you just ate was toxic, you should suffer a bit of health loss
                        }

                        thing._socket.emit("message", { message: `You were killed by ${char._socket.id}.  You survived for ${global.controller.game.getTimeSince(thing.born)} game ticks` });
                    } else {
                        if (attack < 0) {
                            char._socket.emit("message", { message: `You attacked ${thing._socket.id}` });
                            thing._socket.emit("message", { message: `You were attacked by ${char._socket.id}` });
                        } else {
                            char._socket.emit("message", { message: `You attacked ${thing._socket.id} - you get the feeling that may not have been a good idea.  The impact of your attack makes your body hurt` });
                            thing._socket.emit("message", { message: `You were attacked by ${char._socket.id} - you barely notice` });
                        }
                    }
                }
            }
        }
    }

    doEat(_socket, _intent) {
        let char = _socket.game.character;

        let point = global.controller.world.gridToXY(char.position);
        let food = false;
        switch (_intent.dir) {
            case 'n': {
                point.south--;
                food = global.controller.map.getVeg(point.south, point.east);
                break;
            }
            case 's': {
                point.south++;
                food = global.controller.map.getVeg(point.south, point.east);
                break;
            }
            case 'e': {
                point.east++;
                food = global.controller.map.getVeg(point.south, point.east);
                break;
            }
            case 'w': {
                point.east--;
                food = global.controller.map.getVeg(point.south, point.east);
                break;
            }
        }

        if (food) {
            // If you have a beak or a needle, then you're going to get more food from vegetation

            let bonus = 0;
            bonus += (char.traits.includes('Beak') ? 1 : 0);
            bonus += (char.traits.includes('Needle') ? 0.5 : 0);
            bonus += (char.traits.includes('Digest Celulose') ? 1 : 0);

            char.status.hunger += 1 + bonus;
            if (char.status.hunger > 100) char.status.hunger = 100;
            char._socket.emit("message", { message: "You found something to eat" });
        } else {
            char._socket.emit("message", { message: "There was nothing to eat there" });
        }
    }

    doDrink(_socket, _intent) {
        let char = _socket.game.character;

        let point = global.controller.world.gridToXY(char.position);
        let water = false;
        switch (_intent.dir) {
            case 'n': {
                point.south--;
                water = global.controller.map.getWater(point.south, point.east);
                break;
            }
            case 's': {
                point.south++;
                water = global.controller.map.getWater(point.south, point.east);
                break;
            }
            case 'e': {
                point.east++;
                water = global.controller.map.getWater(point.south, point.east);
                break;
            }
            case 'w': {
                point.east--;
                water = global.controller.map.getWater(point.south, point.east);
                break;
            }
        }

        if (water) {
            let bonus = 0;
            bonus += (char.traits.includes('Sucker') ? 0.5 : 0);
            bonus += (char.traits.includes('Needle') ? 1 : 0);

            char.status.thirst += 1 + bonus;
            if (char.status.thirst > 100) char.status.thirst = 100;

            char._socket.emit("message", { message: "You took a drink" });
        } else {
            char._socket.emit("message", { message: "There was nothing to drink there" });
        }
    }

    doEvolve(_socket, _intent) {
        let char = _socket.game.character;
        for (let category of Object.keys(global.controller.evpoint.options)) {
            for (let trait of global.controller.evpoint.options[category]) {
                if (trait.name.toLowerCase() == _intent.name.toLowerCase()) {
                    console.log("Trying to evolve");
                    if (trait.price <= char.points) {
                        console.log("Evolution", _intent);
                        char.points -= trait.price;
                        char.traits.push(trait.name);
                        char.size += trait.price;
                        char._socket.emit("message", { message: `Congratulations - You have evolved the ${trait.name} trait. Your EV Point balance is now ${char.points} EV Points` });
                    } else {
                        char._socket.emit("message", { message: "Attempt to evolve, exceeded your available EV Points" });
                    }
                }
            }
        }
    }

    doTrade(_socket, _intent) {
        switch (_intent.what) {
            case "evPoints": {
                this.doTradeEv(_socket, _intent);
                break;
            }
            case "health": {
                this.doTradeHP(_socket, _intent);
                break;
            }
            case "hunger": {
                this.doTradeHunger(_socket, _intent);
                break;
            }
            case "thirst": {
                this.doTradeThirst(_socket, _intent);
                break;
            }
            case "oxygen": {
                this.doTradeOxygen(_socket, _intent);
                break;
            }
        }
    }

    doTradeEv(_socket, _intent) {
        for (let char of global.controller.game.characters) {
            if (
                undefined !== char._socket
                && undefined !== char._socket.id
                && _intent.id === char._socket.id
            ) {
                if (_socket.game.character.points >= _intent.amount) {
                    char.points += _intent.amount;
                    _socket.game.character.points -= _intent.amount;

                    char._socket.emit("message", { message: `You have been sent ${_intent.amount} EV points by ${_socket.id}` });
                    _socket.emit("message", { message: `You have sent ${_intent.amount} EV points to ${char._socket.id}` });
                }
                return;
            }
        }
        _socket.emit("message", { message: `Your trade was not forfilled because "${_intent.id}" count not be found.` });
    }

    doTradeHP(_socket, _intent) {
        for (let char of global.controller.game.characters) {
            if (
                undefined !== char._socket
                && undefined !== char._socket.id
                && _intent.id === char._socket.id
            ) {
                if (_socket.game.character.status.HP >= _intent.amount) {
                    char.status.HP += _intent.amount;
                    _socket.game.character.status.HP -= _intent.amount;

                    char._socket.emit("message", { message: `You have been sent ${_intent.amount} Health by ${_socket.id}` });
                    _socket.emit("message", { message: `You have sent ${_intent.amount} Health to ${char._socket.id}` });
                }
                return;
            }
        }
        _socket.emit("message", { message: `Your trade was not forfilled because "${_intent.id}" count not be found.` });

    }
    doTradeHunger(_socket, _intent) {
        for (let char of global.controller.game.characters) {
            if (
                undefined !== char._socket
                && undefined !== char._socket.id
                && _intent.id === char._socket.id
            ) {
                if (_socket.game.character.status.hunger >= _intent.amount) {
                    char.status.hunger += _intent.amount;
                    _socket.game.character.status.hunger -= _intent.amount;
                    if (char.status.hunger > 100) char.status.hunger = 100;

                    char._socket.emit("message", { message: `You have been sent ${_intent.amount} food by ${_socket.id}` });
                    _socket.emit("message", { message: `You have sent ${_intent.amount} food to ${char._socket.id}` });
                }
                return;
            }
        }
        _socket.emit("message", { message: `Your trade was not forfilled because "${_intent.id}" count not be found.` });
    }
    
    doTradeThirst(_socket, _intent) {
        for (let char of global.controller.game.characters) {
            if (
                undefined !== char._socket
                && undefined !== char._socket.id
                && _intent.id === char._socket.id
            ) {
                if (_socket.game.character.status.thirst >= _intent.amount) {
                    char.status.thirst += _intent.amount;
                    _socket.game.character.status.thirst -= _intent.amount;
                    if (char.status.thirst > 100) char.status.thirst = 100;

                    char._socket.emit("message", { message: `You have been sent ${_intent.amount} water by ${_socket.id}` });
                    _socket.emit("message", { message: `You have sent ${_intent.amount} water to ${char._socket.id}` });
                }
                return;
            }
        }
        _socket.emit("message", { message: `Your trade was not forfilled because "${_intent.id}" count not be found.` });

    }
    doTradeOxygen(_socket, _intent) {
        for (let char of global.controller.game.characters) {
            if (
                undefined !== char._socket
                && undefined !== char._socket.id
                && _intent.id === char._socket.id
            ) {
                if (_socket.game.character.status.oxygen >= _intent.amount) {
                    char.status.oxygen += _intent.amount;
                    _socket.game.character.status.oxygen -= _intent.amount;

                    char._socket.emit("message", { message: `You have been sent ${_intent.amount} oxygen by ${_socket.id}` });
                    _socket.emit("message", { message: `You have sent ${_intent.amount} oxygen to ${char._socket.id}` });
                }
                return;
            }
        }
        _socket.emit("message", { message: `Your trade was not forfilled because "${_intent.id}" count not be found.` });
    }
}