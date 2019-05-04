export default class Graph {
    config: any;
    connections: any;
    top: any = "";;

    constructor() {
        this.config = require('../helper/configs').default;

        setTimeout(() => {
            setInterval(() => {
                this.sendLeaderBoard();
            }, 60000);
        }, 1000);
    }

    sendLeaderBoard() {
        let board = [];
        for (let char of global.controller.game.characters) {
            let card = {
                id: char.name || char._socket.id,
                time: global.controller.game.getTimeSince(char.born),
                position: global.controller.world.gridToXY(char.position)
            };
            board.push(card);
        }

        board.sort((one, two) => {
            if (one.time < two.time) return 1;
            return -1;
        });

        let top = board.splice(0, 20);
        let table = `<table class="table col-12" cellspacing="0" cellpadding="1">`;
        table += `<tr><td>Name</td><td>Score</td><td>Position</td></tr>`;
        for (let player of top) {
            table += `<tr><td>${player.id}</td><td>${player.time}</td><td>East: ${player.position.east}, South: ${player.position.south}</td></tr>`;
        }
        table += "</table>";
        this.top = table;
    }
}