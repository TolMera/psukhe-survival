export default class Message {
    constructor() {

    }

    event(data) {
        // Spawned
        if (data.message.includes(`You have spawned`)) {
            console.log(data.message);
        }

        //Hunger
        else if (`I really need to eat` == data.message) {
            global.controller.mind.hunger += 3;
            console.log(data.message);
        }
        else if (`I feel fairly hungry` == data.message) {
            global.controller.mind.hunger += 2;
            console.log(data.message);
        }
        else if (`I feel a little hungry` == data.message) {
            global.controller.mind.hunger += 1;
            console.log(data.message);
        }

        // Thirst
        else if (`I really need to drink something` == data.message) {
            global.controller.mind.thirst += 3;
            console.log(data.message);
        }
        else if (`I feel fairly thirsty` == data.message) {
            global.controller.mind.thirst += 2;
            console.log(data.message);
        }
        else if (`I feel a little thirsty` == data.message) {
            global.controller.mind.thirst += 1;
            console.log(data.message);
        }

        // Oxygen
        else if (`I need some air` == data.message) {
            global.controller.mind.oxygen += 3;
            console.log(data.message);
        }
        else if (`I'm holding my breath` == data.message) {
            global.controller.mind.oxygen += 2;
            console.log(data.message);
        }
        else if (`I'm feeling a little scratched up` == data.message) {
            global.controller.mind.oxygen += 1;
            console.log(data.message);
        }

        // Death
        else if (`Someone made a meal out of you` == data.message) {
            console.log(data.message);
            setTimeout(() => {
                process.exit(0);
            }, 5000);
        }
        else if (`You died from hunger` == data.message) {
            console.log(data.message);
            setTimeout(() => {
                process.exit(0);
            }, 5000);
        }
        else if (`You died from thirst` == data.message) {
            console.log(data.message);
            setTimeout(() => {
                process.exit(0);
            }, 5000);
        }
        else if (`You died from an accute lack of oxygen` == data.message) {
            console.log(data.message);
            setTimeout(() => {
                process.exit(0);
            }, 5000);
        }
        else if (data.message.includes(`You were killed by`)) {
            console.log(data.message);
            setTimeout(() => {
                process.exit(0);
            }, 5000);
        }

        else {
            console.log(data.message);
            if (data.options) {
                for (let index in data.options) {
                    console.log(index, ':', data.options[index].name);
                }
            }
        }
    }
}
/**
 * Refference list of all messages you will get from the server
 */
/*
    { message: `I really need to eat` }
    { message: `I feel fairly hungry` }
    { message: `I feel a little hungry` }

    { message: `I really need to drink something` }
    { message: `I feel fairly thirsty` }
    { message: `I feel a little thirsty` }

    { message: `I feel like I'm going to suffocate` }
    { message: `I need some air` }
    { message: `I'm holding my breath` }

    { message: `I'm feeling a little scratched up` }
    { message: `I'm feeling pretty scratched up` }
    { message: `I'm am sore` }
    { message: `I'm am pretty sore` }
    { message: `I'm bleeding a bit` }
    { message: `I'm bleeding a lot` }
    { message: `I don't know if I'm going to make it` }
    { message: `I'm panicking` }
    { message: `Please get me out of here` }
    { message: `I'm dieing` }
    { message: `I see a light` }

    { message: `Someone made a meal out of you` }
    { message: `You died from hunger` }
    { message: `You died from thirst` }
    { message: `You died from an accute lack of oxygen` }

    { message: `You have spawned.  Your unique ID is: "${REGEXP}" - you can trade EV points using your ID if you live long enough to collect any` }
    { message: `You have become too complex an organism for Mitosis to be successful.` }
    { message: `You rip yourself in half, it's a strange experience, but you seem to have survived. The other half is awaiting a soul` }
    { message: `You could not find that partner` }
    { message: `You begin performing a courtship dance.  Stay close to them while they think about it.` }
    { message: `${REGEXP} is performing a cortship display for you.  Do you wish to accept?` }
    { message: `You accept - you are now pregnant` }
    { message: `${REGEXP} accepted your performance and has become pregnant.` }
    { message: `You attempt to lay an egg, however you are not pregnant and only succeed in making a mess`, note: `Yes I know egg fertalization takes place outside the body, but you try coding an entire range of ways for a computer to give birth without cutting a few corners...'}
    { message: `You parthenogenerate - you are now pregnant` }
    { message: `You lay an egg.  You are no longer pregnant.  Your egg is awaiting a soul` }
    { message: `You attempt to give birth, however you are not pregnant and only succeed in making a mess` }
    { message: `You give birth.  You are no longer pregnant.  Your baby is awaiting a soul` }
    { message: `You killed ${REGEXP} - Waste not, want not.  Down the hatch.` }
    { message: `You were killed by ${REGEXP}.  You survived for ${REGEXP} game ticks` }
    { message: `You attacked ${REGEXP}` }
    { message: `You were attacked by ${REGEXP}` }
    { message: `You attacked ${REGEXP} - you get the feeling that may not have been a good idea.  The impact of your attack makes your body hurt` }
    { message: `You were attacked by ${REGEXP} - you barely notice` }
    { message: `Congratulations - You have evolved the ${REGEXP} trait. Your EV Point balance is now ${REGEXP} EV Points` }
    { message: "Attempt to evolve, exceeded your available EV Points" }
    { message: `When making a request to move, a direction must be included.` }
    { message: `When making a request to evolce, the name of a trait must be given.` }
    { message: `When making a request to attack, a direction must be included.` }
    { message: `When making a request to eat, a direction must be included.` }
    { message: `When making a request to drink, a direction must be included.` }
    { message: `When making a trade, the ID of the person you are trading to must be included.` }
    { message: `When making a trade, you need to include details of what you are trading (evPoints, health, hunger, thirst, oxygen).` }
    { message: `When making a trade, you must include an amount to be traded, and it must be a number` }
    { message: `When attempting to fertalize something you must supply an ID` }
    { message: `You have earned an Evolution point for saying alive'}
    { message: "You're able to evolve", options }
    
.emit("message", { message: `You killed ${thing._socket.id} - Waste not, want not.  Down the hatch.` });
.emit("message", { message: `You were killed by ${char._socket.id}.  You survived for ${global.controller.game.getTimeSince(thing.born)} game ticks` });
.emit("message", { message: `You attacked ${thing._socket.id}` });
.emit("message", { message: `You were attacked by ${char._socket.id}` });
.emit("message", { message: `You attacked ${thing._socket.id} - you get the feeling that may not have been a good idea.  The impact of your attack makes your body hurt` });
.emit("message", { message: `You were attacked by ${char._socket.id} - you barely notice` });
.emit("message", { message: "You found something to eat" });
.emit("message", { message: "There was nothing to eat there" });
.emit("message", { message: "You took a drink" });
.emit("message", { message: "There was nothing to drink there" });
.emit("message", { message: `Congratulations - You have evolved the ${trait.name} trait. Your EV Point balance is now ${char.points} EV Points` });
.emit("message", { message: "Attempt to evolve, exceeded your available EV Points" });
.emit("message", { message: `You have been sent ${_intent.amount} EV points by ${_socket.id}` });
.emit("message", { message: `You have sent ${_intent.amount} EV points to ${char._socket.id}` });
.emit("message", { message: `Your trade was not forfilled because "${_intent.id}" count not be found.` });
.emit("message", { message: `You have been sent ${_intent.amount} Health by ${_socket.id}` });
.emit("message", { message: `You have sent ${_intent.amount} Health to ${char._socket.id}` });
.emit("message", { message: `Your trade was not forfilled because "${_intent.id}" count not be found.` });
.emit("message", { message: `You have been sent ${_intent.amount} food by ${_socket.id}` });
.emit("message", { message: `You have sent ${_intent.amount} food to ${char._socket.id}` });
.emit("message", { message: `Your trade was not forfilled because "${_intent.id}" count not be found.` });
.emit("message", { message: `You have been sent ${_intent.amount} water by ${_socket.id}` });
.emit("message", { message: `You have sent ${_intent.amount} water to ${char._socket.id}` });
.emit("message", { message: `Your trade was not forfilled because "${_intent.id}" count not be found.` });
.emit("message", { message: `You have been sent ${_intent.amount} oxygen by ${_socket.id}` });
.emit("message", { message: `You have sent ${_intent.amount} oxygen to ${char._socket.id}` });
.emit("message", { message: `Your trade was not forfilled because "${_intent.id}" count not be found.` });

*/