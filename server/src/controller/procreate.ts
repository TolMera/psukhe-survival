export default class Procreate {
    constructor() {
    }

    doProcreate(_socket, _intent) {
        switch (_intent.type) {
            case 'Mitosis': {
                this.mitosis(_socket, _intent);
                break
            }
            case 'Fertalize': {
                this.fertalize(_socket, _intent);
                break
            }
            case 'Accept': {
                // Because I don't want any negative feedback - it's got to be agreed
                this.accept(_socket, _intent);
                break
            }
            case 'Parthenogenesis': {
                this.parthenogenesis(_socket, _intent);
                break
            }
            case 'Lay Eggs': {
                this.layEggs(_socket, _intent);
                break
            }
            case 'Live Birth': {
                this.liveBirth(_socket, _intent);
                break
            }
        }
    }

    mitosis(_socket, _intent) {
        if (_socket.game.character.size > 75) {
            _socket.emit("message", { message: `You have become too complex an organism for Mitosis to be successful.` });
        } else {
            global.controller.spawn.procreation(_socket.game.character);
            _socket.emit("message", { message: `You rip yourself in half, it's a strange experience, but you seem to have survived. The other half is awaiting a soul` });
        }
    }

    fertalize(_socket, _intent) {
        // intention {"action":"procreate", "type":"Fertalize", "id":""}
        let char = _socket.game.character;
        let all = global.controller.game.characters;
        let partner;
        let found = false;
        for (partner of all) {
            if (partner._socket.id == _intent.id) {
                found = true;
                break;
            }
        }
        if (!found) {
            _socket.emit("message", { message: `You could not find that partner` });
        }

        let myGrid = char.position;
        let theirGrid = partner.position;
        let myPoint = global.controller.world.gridToXY(myGrid);
        let theirPoint = global.controller.world.gridToXY(theirGrid);

        if (theirPoint.east >= myPoint.east - 1 && theirPoint.east <= myPoint.east + 1) {
            if (theirPoint.south >= myPoint.south - 1 && theirPoint.south <= myPoint.south + 1) {
                _socket.emit("message", { message: `You begin performing a courtship dance.  Stay close to them while they think about it.` });
                partner._socket.emit("message", {message: `${_socket.id} is performing a cortship display for you.  Do you wish to accept?`});
                partner.potentialPartner = char;
                char.potentialPartner = partner;
            }
        }
    }

    accept(_socket, _intent) {
        let char = _socket.game.character;
        let partner = char.potentialPartner;
        let myGrid = char.position;
        let theirGrid = partner.position;
        let myPoint = global.controller.world.gridToXY(myGrid);
        let theirPoint = global.controller.world.gridToXY(theirGrid);

        if (theirPoint.east >= myPoint.east - 1 && theirPoint.east <= myPoint.east + 1) {
            if (theirPoint.south >= myPoint.south - 1 && theirPoint.south <= myPoint.south + 1) {
                _socket.emit("message", { message: `You accept - you are now pregnant` });
                partner._socket.emit("message", {message: `${_socket.id} accepted your performance and has become pregnant.`});
                partner.potentialPartner = undefined;
                char.potentialPartner = undefined;
                _socket.game.character.pregnant = true;
            }
        }
    }

    parthenogenesis(_socket, _intent) {
        _socket.emit("message", { message: `You parthenogenerate - you are now pregnant` });
        _socket.game.character.pregnant = true;
    }

    layEggs(_socket, _intent) {
        let char = _socket.game.character;
        if (!char.pregnant) {
            _socket.emit(
                'message',
                {
                    message: `You attempt to lay an egg, however you are not pregnant and only succeed in making a mess`,
                    note: 'Yes I know egg fertalization takes place outside the body, but you try coding an entire range of ways for a computer to give birth without cutting a few corners...'
                }
            );
        } else {
            global.controller.spawn.procreation(_socket.game.character);

            _socket.emit("message", { message: `You lay an egg.  You are no longer pregnant.  Your egg is awaiting a soul` });
            char.pregnant != char.pregnant;
        }
    }

    liveBirth(_socket, _intent) {
        let char = _socket.game.character;
        if (!char.pregnant) {
            _socket.emit("message", { message: `You attempt to give birth, however you are not pregnant and only succeed in making a mess` });
        } else {
            global.controller.spawn.procreation(_socket.game.character);

            _socket.emit("message", { message: `You give birth.  You are no longer pregnant.  Your baby is awaiting a soul` });
            char.pregnant != char.pregnant;
        }
    }
}