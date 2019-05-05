export default class Mind {
    hunger: boolean;
    thirst: boolean;
    oxygen: boolean;
    position: coordinate;

    goto: Function | undefined;

    constructor() {
        this.config = require('../helper/configs').default;
        
        this.position = {south: 0, east: 0};

        this.thirst = false;
        this.waterMap = new (require('./map.ts'));
        
        this.oxygen = false;  // Dont need an oxygen map, because it would be the opposite of the water map?
        
        this.hunger = false;
        this.foodMap = new (require('./map.ts'));

        this.goto = undefined;

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
        if (typeof (this.goto) == typeof (function () { })) {
            return this.goto();
        }
        if (this.hunger) {
            this.goto = this.doHunger;
            return this.doHunger();
        }
        if (this.thirst) {
            this.goto = this.doThirst;
            return this.doThirst();
        }
        if (this.oxygen) {
            this.goto = this.doOxygen;
            return this.doOxygen();
        }
        return this.explore();
    }

    doHunger() {

    }

    doThirst() {

    }

    doOxygen() {

    }
    
    explore() {
        
    }
}