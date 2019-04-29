/**
 * Author: Bjorn Macintosh
 * Date: 20190218
 * 
 * Description: Simple API to read (RESTFUL) templates for customers
 * 
 * Optamisation:
 * 
 * Pending Updates:
 */

global.model = {};
global.controller = {};
global.view = {};

/**
 * Sets up the environment by loading the controllers and the models.
 * Also tests the connection to the database.
 */
function init() {
    return new Promise(async (resolve) => {
        let filesystem = require('fs');
        let proms = [];

        proms.push(new Promise((p1Resolve, p1Reject) => {
            filesystem.readdir('./model', (err: string, files: Array<string>) => {
                if (files)
                    files.forEach(file => {
                        // Exclude .map files
                        if (file.indexOf('.map') != -1) return;
                        file = file.split('.')[0];
                        global.model[file] = new (require(`./model/${file}`)).default();
                    });
                p1Resolve();
            });
        }));

        await Promise.all(proms);

        proms.push(new Promise((p2Resolve, p2Reject) => {
            filesystem.readdir('./controller', (err: string, files: Array<string>) => {
                if (files)
                    files.forEach(file => {
                        // Exclude .map files
                        if (file.indexOf('.map') != -1) return;
                        file = file.split('.')[0];
                        if (undefined === global.controller[file]) {
                            global.controller[file] = new (require(`./controller/${file}`)).default();
                        }
                    });
                p2Resolve();
            });
        }));

        await Promise.all(proms);

        proms.push(new Promise((p2Resolve, p2Reject) => {
            filesystem.readdir('./view', (err: string, files: Array<string>) => {
                if (files)
                    files.forEach(file => {
                        // Exclude .map files
                        if (file.indexOf('.map') != -1) return;
                        file = file.split('.')[0];
                        if (undefined === global.view[file]) {
                            global.view[file] = new (require(`./view/${file}`)).default();
                        }
                    });
                p2Resolve();
            });
        }));

        Promise.all(proms).then(resolve);
    });
}

init().then(() => {
    console.log("Server started");

    var stdin = process.openStdin();

    stdin.addListener("data", function (d) {
        console.log(d);
        let input = d.toString().trim().split(' ');
        event = input.splice(0,1)[0];
        input = input.join(' ');
        global.controller.socket.socket.emit(event, input);
    });
});