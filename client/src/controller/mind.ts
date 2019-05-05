export default class Mind {
    imAlive: number;

    hunger: 0;
    thirst: 0;
    oxygen: 0;

    lastAction: string;

    myEvolutionStage: string;

    knowsWater: Array<Array<number>>;
    knowsFood: Array<Array<number>>;
    knowsOxygen: Array<Array<number>>;

    hungry: number = 0;
    thirsty: number = 0;

    isEating: boolean = false;
    isDrinking: boolean = false;

    position: Array<number>;
    map: Array<Array<{}>>

    myName: string;

    constructor() {
        this.config = require('../helper/configs').default;

        this.imAlive = 0;
        this.myName = "Jùhóng's Tiger";
        this.map = [];

        this.myEvolutionStage = "amoeba";

        // shortcodes
        this.knowsWater = 0;
        this.knowsFood = 0;
        this.knowsOxygen = 0;
        this.knowsOxygen++; // DEBUG 0 you don't need oxygen until you grow lungs
        this.eat = global.controller.intent.eat;
        this.drink = global.controller.intent.drink;

        this.position = [0, 0];

        // A little timeout to give everythint time to load in the background
        setTimeout(() => {
            global.controller.intent.personalize(this.myName);
            setInterval(
                this.tick.bind(global.controller.mind),
                this.config.game.tick
            );
        }, 1000);
    }

    tick() {
        console.clear();
        console.log(this.myName, this.myEvolutionStage);
        console.log("hungry:", this.hungry, "thirsty:", this.thirsty);
        console.log('Alive', this.imAlive++, ' --- ', this.position[0], "South", this.position[1], "East");
        if (this.myEvolutionStage == 'amoeba') {
            this.amoeba();
        }
    }

    move(direction) {
        console.log(`move ${direction}`);
        global.controller.intent.move(direction);
        switch (direction) {
            case 'n':
                this.position[0]++;
                break;
            case 's':
                this.position[0]--;
                break;
            case 'e':
                this.position[1]++;
                break;
            case 'w':
                this.position[1]--;
                break;
        }
    }

    amoeba() {
        // console.log("I'm an amoeba");
        if (this.knowsWater == 0) {
            console.log("Find Water");
            return this.findWater();
        } else if (this.knowsFood == 0) {
            console.log("Find Food");
            return this.findFood()
        } else if (this.knowsOxygen == 0) {
            console.log("Find Oxygen");
            // This is undeveloped - because you have no 'inhale' to see if you drown.
        }

        if (this.hunger == 0) this.isEating = false;
        if (this.thirsty == 0) this.isDrinking = false;

        if (this.thirsty > 10 || this.hungry > 10)
        switch (this.thirsty > this.hungry) {
            case true:  // Thirsty
            return this.findWater();
                break;
            case false: // Hungry
            return this.findFood();
                break;
        }
    }

    findFood() {
        if (undefined === this.findFood.lastAction) {
            this.findFood.lastAction = "move";
        }
        switch (this.findFood.lastAction) {
            case "move": {
                this.findFood.lastAction = 'eat';
                // console.log(`${this.myName} is looking for Food`);
                this.eat('s');
                break;
            }
            case "eat": {
                console.log(`${this.myName} moved East`);
                this.findFood.lastAction = 'move';
                this.move('s');
                break;
            }
        }
    }

    findWater() {
        if (undefined === this.findWater.lastAction) {
            this.findWater.lastAction = "move";
        }
        switch (this.findWater.lastAction) {
            case "move": {
                this.findWater.lastAction = 'drink';
                // console.log(`${this.myName} is looking for water`);
                this.drink('n');
                break;
            }
            case "drink": {
                console.log(`${this.myName} moved North`);
                this.findWater.lastAction = 'move';
                this.move('n');
                break;
            }
        }
    }

    tookDrink() {
        let map = this.mapPosition(this.position[0], this.position[1] - 1, true);
        if (map.water) {
        } else {
            map.water = true;
            this.knowsWater++;
        }
        console.log(`${this.myName} took a drink or water.`);
        this.isDrinking = true;
    }

    ateFood() {
        let map = this.mapPosition(this.position[0], this.position[1] + 1, true);
        if (map.food) {
        } else {
            map.food = true;
            this.knowsFood++;
        }
        console.log(`${this.myName} ate some food.`);
        this.isEating = true;
    }

    goToWater() {
        let map;
        map = this.mapPosition(this.position[0], this.position[1] - 1);
        if (map.water) {
            this.drink('w');
        }
        map = this.mapPosition(this.position[0], this.position[1] + 1);
        if (map.water) {
            this.drink('e');
        }
        map = this.mapPosition(this.position[0] - 1, this.position[1]);
        if (map.water) {
            this.drink('n');
        }
        map = this.mapPosition(this.position[0] + 1, this.position[1]);
        if (map.water) {
            this.drink('s');
        }

        this.move('n');
    }

    goToFood() {
        let map;
        map = this.mapPosition(this.position[0], this.position[1] - 1);
        if (map.food) {
            this.eat('w');
        }
        map = this.mapPosition(this.position[0], this.position[1] + 1);
        if (map.food) {
            this.eat('e');
        }
        map = this.mapPosition(this.position[0] - 1, this.position[1]);
        if (map.food) {
            this.eat('n');
        }
        map = this.mapPosition(this.position[0]
            + 1, this.position[1]);
        if (map.food) {
            this.eat('s');
        }

        this.move('s');
    }

    mapPosition(x, y, create) {
        if (undefined === this.map[x]) {
            if (create) {
                this.map[x] = [];
            } else {
                return false;
            }
        }
        if (undefined === this.map[x][y]) {
            if (create) {
                this.map[x][y] = {};
            } else {
                return false;
            }
        }
        return this.map[x][y];
    }
}