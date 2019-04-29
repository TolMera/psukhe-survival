/**
 * Monitors a character and subtracts from the characters hunger, thist and oxygen depending on their environemnt, traits and activity levels.
 */
export default class Status {
    deaths: any;
    constructor() {
        let config = require('../helper/configs').default;
        
        this.deaths = [];

        setTimeout(() => {
            setInterval(() => {
                // console.log("status update");
                for (let char of global.controller.game.characters) {
                    char.status.hunger -= 1;
                    char.status.thirst -= 2;

                    // TODO: I would love to add a gradient here, so if you have been under water with lungs, and you surface (with low oxygen) you will breath harder, create more noise, but also get more oxygen
                    let hasTrait = false;
                    for (let trait of global.controller.evpoint.options.lungs) {
                        if (char.traits.includes(trait)) {
                            hasTrait = true;
                            switch (trait.name) {
                                case 'Gills': {
                                    if (undefined !== char.airType && char.airType == 'water') {
                                        char.status.oxygen += 1.25;
                                    }
                                    break;
                                }
                                case 'lungs': {
                                    if (undefined !== char.airType && char.airType == 'air') {
                                        char.status.oxygen += 1.25;
                                    }
                                    break;
                                }
                                case 'Oxygenated blood': {
                                    // 25% longer lasting breath
                                    char.status.oxygen += 0.25;
                                    break;
                                }
                            }
                        }
                    }

                    if (hasTrait) {
                        // They are an aomeba and will maintain a level of oxygen regardless.
                        // This should have an effect, like aomeba's can't have legs or wings.
                        char.status.oxygen--;
                    }

                    if (char.status.oxygen > 100) char.status.oxygen = 100;

                    this.keepAlive(char);
                    this.health(char);

                    this.think(char);
                }
            }, config.game.waittime.status);
        }, config.game.waittime.start);
    }

    /**
     * Ocasionally the character will think about their hunger/thirst or oxygen level
     */
    think(_char) {
        {
            let hunger = {
                high: 85,
                medium: 75,
                low: 50
            }
            if (_char.status.hunger > hunger.high) {
                // No nothing - they are not hungry
            } else if (_char.status.hunger <= hunger.low) {
                _char._socket.emit("message", { message: 'I really need to eat' });
            } else if (_char.status.hunger <= hunger.medium) {
                _char._socket.emit("message", { message: 'I feel fairly hungry' });
            } else if (_char.status.hunger > hunger.medium && _char.status.hunger < hunger.high) {
                _char._socket.emit("message", { message: 'I feel a little hungry' });
            }
        }

        {
            let thirst = {
                high: 85,
                medium: 75,
                low: 50
            }
            if (_char.status.thirst > thirst.high) {
                // No nothing - they are not thirsty
            } else if (_char.status.thirst <= thirst.low) {
                _char._socket.emit("message", { message: 'I really need to drink something' });
            } else if (_char.status.thirst <= thirst.medium) {
                _char._socket.emit("message", { message: 'I feel fairly thirsty' });
            } else if (_char.status.thirst > thirst.medium && _char.status.thirst < thirst.high) {
                _char._socket.emit("message", { message: 'I feel a little thirsty' });
            }
        }

        {
            let oxygen = {
                high: 85,
                medium: 75,
                low: 50
            }
            if (_char.status.oxygen > oxygen.high) {
                // No nothing - they are not out of breath
            } else if (_char.status.oxygen <= oxygen.low) {
                _char._socket.emit("message", { message: "I feel like I'm going to suffocate" });
            } else if (_char.status.oxygen <= oxygen.medium) {
                _char._socket.emit("message", { message: 'I need some air' });
            } else if (_char.status.oxygen > oxygen.medium && _char.status.oxygen < oxygen.high) {
                _char._socket.emit("message", { message: "I'm holding my breath" });
            }
        }

        {
            if (_char.status.HP > 95) {
                // Don't message - they are healthy enough
            } else if (_char.status.HP > 90) {
                _char._socket.emit("message", { message: `I'm feeling a little scratched up` });
            } else if (_char.status.HP > 80) {
                _char._socket.emit("message", { message: `I'm feeling pretty scratched up` });
            } else if (_char.status.HP > 70) {
                _char._socket.emit("message", { message: `I'm am sore` });
            } else if (_char.status.HP > 60) {
                _char._socket.emit("message", { message: `I'm am pretty sore` });
            } else if (_char.status.HP > 50) {
                _char._socket.emit("message", { message: `I'm bleeding a bit` });
            } else if (_char.status.HP > 40) {
                _char._socket.emit("message", { message: `I'm bleeding a lot` });
            } else if (_char.status.HP > 30) {
                _char._socket.emit("message", { message: `I don't know if I'm going to make it` });
            } else if (_char.status.HP > 20) {
                _char._socket.emit("message", { message: `I'm panicking` });
            } else if (_char.status.HP > 10) {
                _char._socket.emit("message", { message: `Please get me out of here` });
            } else if (_char.status.HP > 5) {
                _char._socket.emit("message", { message: `I'm dieing` });
            } else {
                _char._socket.emit("message", { message: `I see a light` });
            }
        }
    }

    /**
     * The regular role to see if the character is still alive
     */
    keepAlive(_char) {
        let death = false;
        if (_char.status.HP <= 0) {
            _char._socket.emit("message", { message: 'Someone made a meal out of you' });
            this.deaths.push(`${_char.name||_char._socket.id} died from their wounds`);
            death = true;
        }
        if (_char.status.hunger <= 0) {
            _char._socket.emit("message", { message: 'You died from hunger' });
            this.deaths.push(`${_char.name||_char._socket.id} died from hunger`);
            death = true;
        }
        if (_char.status.thirst <= 0) {
            _char._socket.emit("message", { message: 'You died from thirst' });
            this.deaths.push(`${_char.name||_char._socket.id} died from thirst`);
            death = true;
        }
        if (_char.status.oxygen <= 0) {
            _char._socket.emit("message", { message: 'You died from an accute lack of oxygen' });
            this.deaths.push(`${_char.name||_char._socket.id} died from suffocation`);
            death = true;
        }
        
        if (this.deaths.length > 50) {
            this.deaths.shift();
        }

        if (death) {
            global.controller.world.death(_char);
            global.controller.game.death(_char);

            _char._socket.disconnect();
        }
    }

    health(_char) {
        if (
            _char.status.hunger > 95
            && _char.status.thirst > 95
            && _char.status.oxygen > 95
        ) {
            _char.status.HP++;
            if (_char.status.HP > 100) _char.status.HP = 100;
        }
    }
}