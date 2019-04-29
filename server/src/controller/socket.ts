export default class Socket {

    constructor(_path: string) {
        var http = require('http').createServer();
        let socket = require('socket.io')(
            http, {
                path: '/',
                // transports: ['websocket', 'polling']
            }
        );
        http.listen({
            host: '172.31.31.34',
            port: 81
        });
        let id = 0;
        socket.on('connection', (_socket: any) => {
            /**
             * Make the socket carry around a reference to the character int he game
             */
            _socket.game = {
            };

            // console.log(`New connection from ${_socket.conn.id}`);
            // console.log(`Spawning new characted`);
            global.controller.spawn.newCharacter(_socket).then((character) => {
                _socket.game.character = character;

                // Cant have intention before being spawned
                _socket.on('intention', function (data) {
                    global.controller.intention.add(_socket, data);
                });
            });

        });
    }
}