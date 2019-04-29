/**
 * Responsible for the actual running of the game
 */
export default class Game {
    gameBuffer: number = 0;
    characters: Array<any>;

    // The Game object
    constructor() {
        let config = require('../helper/configs').default;

        this.characters = [];
        this.gameBuffer = 0;
        // Not sure this is the right place per-se, but I'm going to kick off the gameTick function from here with a small delay for server spinup
        setTimeout(() => {
            global.controller.intention.intentions[this.gameBuffer] = [];

            console.log("Game Starting");
            setInterval(() => {
                // console.log("frame");
                let frame = this.gameBuffer++;
                if (undefined === global.controller.intention.intentions[this.gameBuffer]) {
                    global.controller.intention.intentions[this.gameBuffer] = [];
                }
                Object.freeze(global.controller.intention.intentions[frame]);
                if (global.controller.intention.intentions[frame].length > 0) {
                    this.processIntentions(frame, global.controller.intention.intentions[frame]).then(() => {
                        delete global.controller.intention.intentions[frame];
                    });
                } else {
                    delete global.controller.intention.intentions[frame];
                }
            }, config.game.tick);
        },
            config.game.waittime.start
        );
    }

    processIntentions(_frame: number, intentions) {
        return new Promise((resolve, reject) => {
            // console.log(`Game tick ${_frame}`);
            // console.log(`Intentions to process ${intentions.length}`);
            for (let task of intentions) {
                let socket = task[0];
                let intent = task[1];
                switch (intent.action) {
                    case 'move': {
                        global.controller.perform.doMove(socket, intent);
                        break;
                    }
                    case 'evolve': {
                        global.controller.perform.doEvolve(socket, intent);
                        break;
                    }
                    case 'attack': {
                        global.controller.perform.doAttack(socket, intent);
                        break;
                    }
                    case 'eat': {
                        global.controller.perform.doEat(socket, intent);
                        break;
                    }
                    case 'drink': {
                        global.controller.perform.doDrink(socket, intent);
                        break;
                    }
                    case 'trade': {
                        global.controller.perform.doTrade(socket, intent);
                        break;
                    }
                    case 'look': {
                        global.controller.eye.doLook(socket, intent);
                        break;
                    }
                    case 'procreate': {
                        global.controller.procreate.doProcreate(socket, intent);
                        break;
                    }
                }
            }
            // console.log(`Ending tick ${_frame}`);
            resolve(true);
        });
    }

    /**
     * Add a character to the game
     */
    addCharacter(_character) {
        this.characters.push(_character);
    }

    /**
     * What happens when someone dies
     */
    death(_char) {
        console.log("Death", _char.name||_char._socket.id);
        for (let index in this.characters) {
            if (_char === this.characters[index]) {
                this.characters.splice(index, 1);
            }
        }
    }
    
    /**
     * Get the number of ticks since X
     */
    getTimeSince(tick) {
        return this.gameBuffer - tick;
    }
}