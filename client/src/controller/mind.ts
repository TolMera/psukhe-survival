export default class Mind {
    hunger: number;
    thirst: number;
    oxygen: number;

    lastAction: string;

    constructor() {
        this.config = require('../helper/configs').default;

        this.thirst = 0;
        this.hunger = 0;
        this.oxygen = 0;

        // A little timeout to give everythint time to load in the background
        setTimeout(() => {
            global.controller.intent.personalize("TolMera's wondering AI");
            setInterval(
                this.tick.bind(global.controller.mind),
                this.config.game.tick
            );
        }, 1000);
    }

    tick() {
        switch (true) {
            case (this.hunger > this.thirst && this.hunger > this.oxygen): {
                switch (this.lastAction) {
                    default:
                    case 'move':
                        global.controller.intent.eat('n');
                        this.lastAction = 'eatN';
                        break;
                    case 'eatN':
                        global.controller.intent.eat('e');
                        this.lastAction = 'eatE';
                        break;
                    case 'eatE':
                        global.controller.intent.eat('s');
                        this.lastAction = 'eatS';
                        break;
                    case 'eatS':
                        global.controller.intent.eat('w');
                        this.lastAction = 'eatW';
                        break;
                    case 'eatW':
                        let dir = ['n', 's', 'e', 'w'];
                        global.controller.intent.move(dir[Math.floor(Math.random() * dir.length)]);
                        this.lastAction = 'move';
                        break;
                }
                break;
            }
            case (this.thirst > this.hunger && this.thirst > this.oxygen): {
                switch (this.lastAction) {
                    default:
                    case 'move':
                        global.controller.intent.drink('n');
                        this.lastAction = 'drinkN';
                        break;
                    case 'drinkN':
                        global.controller.intent.drink('e');
                        this.lastAction = 'drinkE';
                        break;
                    case 'drinkE':
                        global.controller.intent.drink('s');
                        this.lastAction = 'drinkS';
                        break;
                    case 'drinkS':
                        global.controller.intent.drink('w');
                        this.lastAction = 'drinkW';
                        break;
                    case 'drinkW':
                        let dir = ['n', 's', 'e', 'w'];
                        global.controller.intent.move(dir[Math.floor(Math.random() * dir.length)]);
                        this.lastAction = 'move';
                        break;
                }
                break;
            }
            default: {
                // Your need for Oxygen is greater than your need for anything else
                // Without any organs you can't tell which way is up.
                // Guess you're just going to keep walking randomly around until you stop suffocating
                let dir = ['n', 's', 'e', 'w'];
                global.controller.intent.move(dir[Math.floor(Math.random() * dir.length)]);
                this.lastAction = 'move';
            }
        }
    }
}