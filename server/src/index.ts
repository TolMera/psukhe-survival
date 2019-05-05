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
    let config = require('./helper/configs').default;

    console.log("Server started");

    setTimeout(() => {
        let http = require('http');

        http.createServer(function (request, response) {
            let mapTable = global.controller.map.mapTable;

            let map = '<table class="col-12" cellspacing="0" cellpadding="1">';
            let i = 0;
            for (let south = 0; south < global.controller.world.cubeSide; south++) {
                map += "<tr>";
                for (let east = 0; east < global.controller.world.cubeSide; east++) {
                    let place = global.controller.world.get(south, east);
                    if (mapTable[i]) {
                        if (place.length > 0) {
                            map += `<td style="background-color: rgb(0, 0, 0);"></td>`;
                        } else {
                            map += `<td style="background-color: rgb(${mapTable[i].r}, ${mapTable[i].g}, ${mapTable[i].b});"></td>`;
                        }
                        i++;
                    }
                }
                map += "</tr>";
            }
            map += "</table>";

            response.writeHeader(200, { "Content-Type": "text/html" });
            response.write(`
                <!doctype html>

                <html lang="en">
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

                    <title>psukhe-survival - Ludum Dare 44</title>
                    
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

                    <style>
                        .character {
                            background-color: #ffffff !important;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="page-header">
                            <h1>psukhe-survival</h1>
                        </div>

                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h3 class="panel-title">
                                    World Map
                                </h3>
                            </div>
                            <div class="panel-body">
                                ${map}
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-6">
                                <h3>
                                    Top 20 Leader Board
                                </h3>
                                <div class="col-12">
                                    ${global.controller.graph.top}
                                </div>
                            </div>
                            <div class="col-6">
                                <h3>
                                    Last 20 deaths
                                </h3>
                                <div class="col-12">
                                    ${global.controller.status.deaths.join('<hr />')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
                    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js" integrity="sha256-yr4fRk/GU1ehYJPAs8P4JlTgu0Hdsp4ZKrx8bDEDC3I=" crossorigin="anonymous"></script>
                    <script>
                        var socket = io('${config.server.ip}:${config.server.port}');
                        console.log(socket);
                        socket.emit('showMap');
                        socket.on('add', (data) => {
                            console.log(data);
                            let cell = $('td').splice(data.grid, 1);
                            $(cell).addClass('character');
                        });
                        socket.on('remove', (data) => {
                            console.log(data);
                            let cell = $('td').splice(data.grid, 1);
                            $(cell).removeClass('character');
                        });
                    </script>
                </body>
                </html>`
            );
            response.end();
        }).listen(80);
    }, 5000);
});