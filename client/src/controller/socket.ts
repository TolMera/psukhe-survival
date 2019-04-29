export default class Socket {
    socket;
    constructor(_path:string) {
        this.config = require('../helper/configs').default;

        let socket = require('socket.io-client');
        
        this.socket = socket(`${this.config.server.dns}:${this.config.server.port}`, {
            path: _path||'/'
        });
        
        this.socket.on('message', (data) => {
            global.controller.message.event(data);
        });
        
        this.socket.on('eyes', (data) => {
            global.controller.eye.event(data);
        });
        
        this.socket.on('ears', (data) => {
            global.controller.ear.event(data);
        });
        
        this.socket.on('nose', (data) => {
            global.controller.nose.event(data);
        });
    }
}