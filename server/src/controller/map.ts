export default class Map extends require('./controller').default {
    map: any;
    mapMin = 0;
    mapMax = 1;
    mapTable: any;

    waterLevel: number;

    vegetationLevel: number;
    vegetationMap: any;
    vegetationMin = 1;
    vegetationMax = 0;
    /**
     * Builds the perlin function so we can start querying the map
     */
    constructor() {
        super();

        let Perlin = require('pf-perlin');
        this.map = new Perlin({
            seed: require('../helper/configs').default.seeds.map,
            dimensions: 2,
            min: 0,
            max: 1,
            wavelength: 1,
            octaves: 8,
            octaveScale: 0.5,
            persistence: 0.66,
            //interpolation: ,
        });

        // Need time for everything else to load
        setTimeout(() => {
            this.calulateWaterLevel();
            this.createVegetation();

            this.generateMap();
        }, 1000);
    }

    /**
     * Calculates the water level of the map using mean as the low point.
     */
    calulateWaterLevel() {
        let min = 1;
        let max = -1;
        let heights = [];
        for (let south = 0; south < global.controller.world.cubeSide; south++) {
            for (let east = 0; east < global.controller.world.cubeSide; east++) {
                let v = this.get(south, east);
                heights.push(v);
                if (v < min) min = v;
                if (v > max) max = v;
            }
        }

        this.mapMin = min;
        this.mapMax = max;

        let stats = require("stats-lite")
        this.waterLevel = stats.percentile(heights, 0.70)
        console.log("Water level", this.waterLevel);
    }

    /**
     * Create vegeation so there is something for herbivores to eat
     */
    createVegetation() {
        let Perlin = require('pf-perlin');
        this.vegetationMap = new Perlin({
            seed: require('../helper/configs').default.seeds.vegetation,
            dimensions: 2,
            min: 0,
            max: 1,
            wavelength: 1,
            octaves: 12,
            octaveScale: 0.5,
            persistence: 0.75,
            //interpolation: ,
        });

        let min = 1;
        let max = -1;
        let heights = [];
        for (let south = 0; south < global.controller.world.cubeSide; south++) {
            for (let east = 0; east < global.controller.world.cubeSide; east++) {
                let v = this.vegetationMap.get([
                    south / global.controller.world.cubeSide,
                    east / global.controller.world.cubeSide
                ]);
                if (v < min) min = v;
                if (v > max) max = v;
                heights.push(v);
            }
        }

        let stats = require("stats-lite");
        this.vegetationLevel = stats.percentile(heights, 0.65);
        this.vegetationMin = min;
        this.vegetationMax = max;
        console.log("Vegetation level", this.vegetationLevel);
    }

    /**
     * Bridge function - get the height of a point on the map
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    get(_south: number, _east: number): number {
        return this.map.get([
            _south / global.controller.world.cubeSide,
            _east / global.controller.world.cubeSide
        ]);
    }

    /**
     * Bridge function - Test if there is vegetation on a tile
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    getVeg(_south: number, _east: number): boolean {
        return this.vegetationMap.get([
            _south / global.controller.world.cubeSide,
            _east / global.controller.world.cubeSide
        ]) >= this.vegetationLevel;
    }
    getRawVeg(_south: number, _east: number): boolean {
        return this.vegetationMap.get([
            _south / global.controller.world.cubeSide,
            _east / global.controller.world.cubeSide
        ]);
    }

    /**
     * Bridge function - Test if there is vegetation on a tile
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    getWater(_south: number, _east: number): boolean {
        return this.map.get([
            _south / global.controller.world.cubeSide,
            _east / global.controller.world.cubeSide
        ]) >= this.waterLevel;
    }

    /**
     * Would be nice to be able to set the height of a point on the map, like a death makes the tile higher, and walking over a tile makes it lower over time.
     */
    set() {
        throw "Not currently implemented";
    }

    generateMap() {
        let data = [];

        for (let i = 0; i < global.controller.world.cubeSide * global.controller.world.cubeSide; i += 1) {
            let xy = global.controller.world.gridToXY(i);

            let water = Math.round(this.getWater(xy.south, xy.east) ? 192 : 0);
            let land;
            // if (0 == water) {
                land = 255 - Math.round((this.get(xy.south, xy.east) - this.mapMin) * (255 / (this.mapMax - this.mapMin)));
            // } else {
                // land = 0;
            // }
            // land = 0;
            let veg = this.getRawVeg(xy.south, xy.east);
            // if (veg < this.vegetationLevel) {
                // veg = 0;
            // }
            veg = Math.round(((veg - this.vegetationMin) * (255 / (this.vegetationMax - this.vegetationMin))) * .75);
            // veg = 0;

            data.push({ r: land, g: veg, b: water });
        }

        this.mapTable = data;
    }
}