export default class Mind {
    config: {};

    hunger: boolean;
    dirFood: Array<boolean>;
    thirst: boolean;
    oxygen: boolean;

    position: coordinate;
    waterMap: any;
    foodMap: any;

    goto: Function | undefined;
    doEat: Function = global.controller.intent.eat;
    doDrink: Function = global.controller.intent.drink;

    exploreAction: string;

    constructor() {
        this.config = require('../helper/configs').default;

        this.position = { south: 0, east: 0 };

        this.thirst = false;
        this.waterMap = new (require('./map').default);

        this.oxygen = false;  // Dont need an oxygen map, because it would be the opposite of the water map?

        this.hunger = false;
        this.foodMap = new (require('./map').default);

        this.goto = undefined;

        // A little timeout to give everythint time to load in the background
        setTimeout(() => {
            global.controller.intent.personalize("Piano Hunter");
            setInterval(
                this.tick.bind(global.controller.mind),
                this.config.game.tick
            );
        }, 1000);
    }

    tick() {
        // console.clear();
        // console.log("---");
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

    doMove(direction: string) {
        switch (direction) {
            case 'n': this.position.south--;
                break;
            case 's': this.position.south++;
                break;
            case 'e': this.position.east++;
                break;
            case 'w': this.position.east--;
                break;
            default:
                return console.log("You did not submit a direction with your move request");
        }
        global.controller.intent.move(direction);
        // Rebuild - dirFood, dirWater, dirOxygen
    }

    doHunger() {
        if (!this.hunger && this.doHunger === this.goto) {
            this.goto = undefined;
        }
        let nearest = [];
        let loop = 1;
        while (nearest.length === 0) {
            /* This could be an infinite loop */
            nearest = this.foodMap.nearest(this.position, loop++);
            console.log(nearest);
        }
        let direction = global.controller.bearing.getCardinal(this.position, nearest[0]);
        if (direction === undefined) {
            if (this.position.south > nearest[0].south) return this.doMove('s');
            if (this.position.south < nearest[0].south) return this.doMove('n');

            // The below two lines will technically never get hit, because as soon as you are in-line with it north/south, then you're no longer going to get an undefined bearing.
            if (this.position.east > nearest[0].east) return this.doMove('w');
            if (this.position.east < nearest[0].east) return this.doMove('e');
        }
        if (this.foodMap.distanceF(this.position, nearest[0]) == 1) {
            this.doEat(direction);
        }
    }

    doThirst() {
        if (!this.thirst && this.doThirst === this.goto) {
            this.goto = undefined;
        }
        let nearest = [];
        let loop = 1;
        while (nearest.length === 0) {
            /* This could be an infinite loop */
            nearest = this.waterMap.nearest(this.position, loop++);
            console.log(nearest);
        }
        let direction = global.controller.bearing.getCardinal(this.position, nearest[0]);
        if (direction === undefined) {
            if (this.position.south > nearest[0].south) return this.doMove('s');
            if (this.position.south < nearest[0].south) return this.doMove('n');

            // The below two lines will technically never get hit, because as soon as you are in-line with it north/south, then you're no longer going to get an undefined bearing.
            if (this.position.east > nearest[0].east) return this.doMove('w');
            if (this.position.east < nearest[0].east) return this.doMove('e');
        }
        if (this.waterMap.distanceF(this.position, nearest[0]) == 1) {
            this.doDrink(direction);
        }
    }

    doOxygen() {
        if (!this.oxygen && this.doOxygen === this.goto) {
            this.goto = undefined;
        }
    }

    explore() {
        switch (this.exploreAction) {
            default:
                this.doMove('n');
                this.exploreAction = 'move';
                break;
            case 'move': // Should move in a space filling curve
                this.doEat('n');
                this.exploreAction = 'eatN';
                break;
            case 'eatN':
                this.doEat('s');
                this.exploreAction = 'eatS';
                break;
            case 'eatS':
                this.doEat('w');
                this.exploreAction = 'eatW';
                break;
            case 'eatW':
                this.doEat('e');
                this.exploreAction = 'eatE';
                break;
            case 'eatE':
                this.doDrink('n');
                this.exploreAction = 'drinkN';
                break;
            case 'drinkN':
                this.doDrink('s');
                this.exploreAction = 'drinkS';
                break;
            case 'drinkS':
                this.doDrink('e');
                this.exploreAction = 'drinkE';
                break;
            case 'drinkE':
                this.doDrink('w');
                this.exploreAction = 'drinkW';
                break;
        }
    }
}