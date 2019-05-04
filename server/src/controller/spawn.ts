export default class Spawner {
    shells: Array<any>;
    constructor() {
        console.log("Spawn controller loaded");
        this.shells = [];
    }

    /**
     * Spawn a new cell at a random location
     */
    newCharacter(_socket) {
        return new Promise((resolve, reject) => {
            if (0 == this.shells.length) {
                this.spawnNew(_socket, resolve);
            } else {
                // Get the first live shell
                let char = this.shells.shift();
                // Attach the new connection to it
                char._socket = _socket;
                // Clear the buffers
                global.controller.eye.socketUpdate(_socket);
                global.controller.ear.socketUpdate(_socket);
                global.controller.smell.socketUpdate(_socket);
                // Add the character to the world
                global.controller.game.addCharacter(char);
                return resolve(char);
            }
        });
    }

    spawnNew(_socket, resolve) {
        let spawnPoint = global.controller.world.cubeSide;
        spawnPoint *= spawnPoint;
        spawnPoint = Math.floor(Math.random() * spawnPoint);
        let point = global.controller.world.gridToXY(spawnPoint);

        // console.log(`Spawn point x: ${point.east}, y: ${point.south}`);

        // Create a character
        let character = this.createCharacter(_socket);

        // Put the character into the world
        global.controller.world.set(point, character);

        // Let the game know to process this on game ticks
        global.controller.game.addCharacter(character);

        // Let the player know they have spawned
        _socket.emit("message", { message: `You have spawned.  Your unique ID is: "${_socket.id}" - you can trade EV points using your ID if you live long enough to collect any` });
        return resolve(character);
    }

    createCharacter(_socket) {
        let config = require('../helper/configs').default;

        global.controller.eye.socketUpdate(_socket);
        global.controller.ear.socketUpdate(_socket);
        global.controller.smell.socketUpdate(_socket);
        
        return {
            _socket,
            born: global.controller.game.gameBuffer,

            // Evolution factors
            points: 0,
            traits: [],
            size: 1,

            // World factos
            position: 0,

            // Status factors
            status: {
                HP: config.spawn.HP,
                hunger: config.spawn.hunger,
                thirst: config.spawn.thirst,
                oxygen: config.spawn.oxygen
            },

            // Organ factors
            airType: "air",
            
            // Procreation
            pregnant: false,
            potentialPartner: undefined,
        };
    }

    procreation(_char) {
        let owner = _char._socket;
        _char._socket = undefined;
        
        // Prevent the whole object refferences other object trouble - just sting and unstring the object.
        let shell = JSON.parse(JSON.stringify(_char));
        _char._socket = owner;
        
        this.shells.push(shell);
    }
}