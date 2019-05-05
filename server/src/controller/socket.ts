export default class Socket {
    mapConnections: Array<Socket>;
    socket: Socket;

    constructor(_path: string) {
        let config = require('../helper/configs').default;

        var http = require('http').createServer();
        this.socket = require('socket.io')(
            http, {
                path: '/',
                // transports: ['websocket', 'polling']
            }
        );
        http.listen({
            host: config.server.ip,
            port: 81
        });
        let id = 0;
        this.socket.on('connection', (_socket: any) => {
            console.log("connection", _socket.id);

            _socket.on('joinGame', () => {
                /**
                 * Make the socket carry around a reference to the character int he game
                 */
                _socket.game = {
                };

                console.log(`New connection from ${_socket.conn.id}`);
                // console.log(`Spawning new characted`);
                global.controller.spawn.newCharacter(_socket).then((character) => {
                    _socket.game.character = character;

                    // Cant have intention before being spawned
                    _socket.on('intention', function (data) {
                        global.controller.intention.add(_socket, data);
                    });
                });
            });

            _socket.on('showMap', () => {
                console.log('Connection to map established');
                _socket.join('showMap');
                _socket.on('disconnect', () => {
                    _socket.disconnect();
                });
            });
        });
    }
    
    sendToMap(eventType, body) {
        console.log(arguments);
        this.socket.to('showMap').emit(eventType, body);
    }
}