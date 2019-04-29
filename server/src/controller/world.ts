export default class World {
    cubeSide: number;
    grid: Array<Array<{}>>;
    day: boolean;

    constructor() {
        let config = require('../helper/configs').default;
        
        // Fill array of X length with arrays
        this.cubeSide = 256;
        this.grid = [];
        for (let x = 0; x < this.cubeSide * this.cubeSide; x++) {
            this.grid[x] = [];
        }
        
        this.day = true;
        setInterval(() => {
            this.day != this.day;
        }, config.world.dayLength);
    }

    get(_x: number, _y: number) {
        return this.grid[this.xyToGrid(_x, _y)];
    }

    set(_point, _object) {
        let grid = this.xyToGrid(_point.x, _point.y);
        if (grid < 0) grid = 0;
        if (grid > this.cubeSide * this.cubeSide - 1) grid = this.cubeSide * this.cubeSide - 1;
        this.grid[grid].push(_object);
        _object.position = grid;
        
        if (undefined !== _object.status && undefined !== _object.status.oxygen) {
            let height = global.controller.map.get(_point.x, _point.y);
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

    xyToGrid(_x: number, _y: number) {
        let x = _x;
        let y = _y * this.cubeSide;
        return x + y;
    }

    gridToXY(_grid: number) {
        let x = _grid % global.controller.world.cubeSide;
        if (x > 1023) x = 1023;
        if (x < 0) x = 0;
        
        let y = Math.floor(_grid / global.controller.world.cubeSide);
        if (y > 1023) y = 1023;
        if (y < 0) y = 0;
        
        return { x, y };
    }
    
    /**
     * What happens when someone dies
     */
    death(_char) {
        this.pop(_char.position, _char);
    }
}