export default class Evpoint {
    options: any;
    loop = 0;

    constructor() {
        let config = require('../helper/configs').default;

        setTimeout(() => {
            setInterval(() => {
                let evPoints = 0;
                for (let char of global.controller.game.characters) {
                    evPoints += ++char.points;
                    char._socket.emit('point');
                    this.reward(char);
                }

                this.loop++;
                if (this.loop / 60 % 1 == 0) {
                    this.loop = 0;
                    console.log(`There are ${evPoints} points in the game, and ${global.controller.game.characters.length} players - ${evPoints / global.controller.game.characters.length} average`);
                }

            }, config.game.waittime.evpoint);
        }, config.game.waittime.start);

        this.options = {
            eyes: [
                { name: 'Photo sensitive organ', price: 6 },
                { name: 'Greyscale sight', price: 12 },
                { name: 'two colour sight', price: 24 },
                { name: 'Three colour sight', price: 40 },
                { name: 'Thermal vision', price: 40 }
            ],
            ears: [
                { name: 'Sense Vibration', price: 3 },
                { name: 'Sounds', price: 6 },
                { name: 'Clear Hearing', price: 10 },
                { name: 'Sensitive Hearing', price: 25 },
                { name: 'Very Sensitive Hearing', price: 50 }
            ],
            smell: [
                { name: 'Chemical Receptors', price: 15 },
                { name: 'Sense of smell', price: 25 },
                { name: 'Dog like', price: 35 },
                { name: 'ppm', price: 50 }
            ],
            mouth: [
                { name: 'Teeth', price: 15 },
                { name: 'Beak', price: 10 },
                { name: 'Needle', price: 15 },
                { name: 'Sucker', price: 5 }
            ],
            poisons: [
                { name: 'Venom', price: 12 },
                { name: 'Toxins', price: 8 }
            ],
            lungs: [
                { name: 'Gills', price: 12 },
                { name: 'lungs', price: 12 },
                { name: 'Oxygenated blood', price: 75 }
            ],
            gut: [
                // { name: 'Eat Algae', price: 3 },
                // { name: 'Eat Plants', price: 12 },
                // { name: 'Eat Meat', price: 20 },
                { name: 'Digest Celulose', price: 36 },
                // { name: 'Digest Minerals', price: 24 },
            ],
            // physiology: [
                // { name: 'Warm blooded', price: 36 },
                // { name: 'Cold blooded', price: 24 },
            // ],
            skin: [
                { name: 'Camoflage', price: 25 },
                { name: 'Photo Synthesis', price: 5 },
                // { name: 'Symbiote', price: 25 },
                { name: 'Leathery', price: 25 },
                { name: 'Scaled', price: 35 },
                { name: 'Heavily Scaled', price: 50 },
                { name: 'Dragon Like', price: 75 },
                // { name: 'Mineral Infused', price: 65 },
                // { name: 'Hard as a Rock', price: 25 }
            ],
            fur: [
                { name: 'Hairs', price: 3 },
                { name: 'Thin Fur', price: 10 },
                { name: 'Fur', price: 20 },
                { name: 'Thick Fur', price: 40 },
                { name: 'Bristles', price: 35 },
                { name: 'Spikes', price: 60 }
            ],
            // legs: [
            //     { name: 'Two Legs', price: 65 },
            //     { name: 'Four Legs', price: 20 },
            //     { name: 'Six Legs', price: 35 },
            //     { name: 'Eight Legs', price: 35 },
            //     { name: 'Ten Legs', price: 45 },
            //     { name: 'Twelve Legs', price: 47 },
            //     { name: 'Fourteen Legs', price: 49 },
            //     { name: 'Sixteen Legs', price: 53 },
            //     { name: 'Eighteen Legs', price: 60 },
            //     { name: 'Twenty Legs', price: 70 }
            // ],
            // wings: [
            //     { name: 'Two Wings', price: 25 },
            //     { name: 'Four wings', price: 35 },
            //     { name: 'Six Wings', price: 55 },
            //     { name: 'Eight Wings', price: 85 }
            // ],
            procreate: [
                { name: 'Mitosis', price: 12 },
                { name: 'Fertalize', price: 12 },
                { name: 'Lay Eggs', price: 24 },
                { name: 'Live Birth', price: 48 },
                { name: 'Parthenogenesis', price: 75 },
            ]
        };
    }

    reward(_char) {
        let options = [];
        for (let category of Object.keys(this.options)) {
            for (let trait of this.options[category]) {
                if (!_char.traits.includes(trait)) {
                    if (trait.price <= _char.points) {
                        options.push(trait);
                    }
                }
            }
        }

        if (options.length > 0) {
            let message = { message: "You're able to evolve", options };
            if (undefined === _char._socket.game.evpoint) {
                _char._socket.game.evpoint = {
                    message: ''
                }
            }
            if (_char._socket.game.evpoint.message != JSON.stringify(message)) {
                _char._socket.emit("message", message);
                _char._socket.game.evpoint.message = JSON.stringify(message)
            }
        }
    }
}