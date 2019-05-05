export default class Map {
    kdtree: any;
    points: Array<coordinate>;

    constructor() {
    }

    /**
     * Build a new tree (to maintain balance?)
     */
    newTree() {
        this.kdtree = new (require('kd-tree-javascript').kdTree)(this.points, this.distanceF, ["south", "east"]);
    }

    /**
     * Add a coordinate to the tree
     */
    add(south: number, east: number, _obj: {}) {
        this.points.push({ south, east });
        this.newTree();
    }

    /**
     * Remove a coordinate from the tree
     */
    remove(south: number, east: number, _obj: {}) {
        let index = this.points.findIndex(({ s, e }) => {
            return south == s && east == e;
        });
        this.points.splice(index, 1);
        
        this.newTree();
    }

    /**
     * Simple distance calculation using a right angle triangle
     */
    distanceF(a, b) {
        return Math.sqrt(Math.pow(a.east - b.east, 2) + Math.pow(a.south - b.south, 2));
    }
    
    nearest(position: coordinate, distance) {
        if (undefined === this.kdtree) this.newTree();
        this.kdtree.nearest(position, distance);
    }
}