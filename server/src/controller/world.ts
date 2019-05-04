export default class World {
    cubeSide: number;
    grid: Array<Array<{}>>;
    day: boolean;

    constructor() {
        let config = require('../helper/configs').default;

        // Fill array of X length with arrays
        this.cubeSide = 256;
        this.grid = [];
        for (let south = 0; south < this.cubeSide * this.cubeSide; south++) {
            this.grid[south] = [];
        }

        this.day = true;
        setInterval(() => {
            this.day != this.day;
        }, config.world.dayLength);
    }

    get(_south: number, _east: number) {
        return this.grid[this.xyToGrid(_south, _east)];
    }

    set(_point, _object) {
        let grid = this.xyToGrid(_point.south, _point.east);
        if (grid < 0) grid = 0;
        if (grid > this.cubeSide * this.cubeSide - 1) grid = this.cubeSide * this.cubeSide - 1;
        this.grid[grid].push(_object);
        _object.position = grid;

        if (undefined !== _object.status && undefined !== _object.status.oxygen) {
            let height = global.controller.map.get(_point.south, _point.east);
            if (height > global.controller.map.waterLevel) {
                _object.airType = "air";
            } else {
                _object.airType = "water";
            }
        }
    }

    pop(_grid, _object) {
        let place = this.grid[_grid];
        for (let key in place) {
            if (place[key] === _object) {
                return this.grid[_grid].splice(key, 1);
            }
        }
    }

    xyToGrid(_south: number, _east: number) {
        return _east + (_south * this.cubeSide);
    }

    gridToXY(_grid: number) {
        let east = _grid % this.cubeSide;
        let south = Math.floor(_grid / this.cubeSide);
        
        if (east > 1023) east = 1023;
        if (east < 0) east = 0;
        if (south > 1023) south = 1023;
        if (south < 0) south = 0;

        return { south, east };
    }

    /**
     * What happens when someone dies
     */
    death(_char) {
        this.pop(_char.position, _char);
    }
}