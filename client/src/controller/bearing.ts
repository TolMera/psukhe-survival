export default class Bearing {
    constructor() {

    }

    getCardinal(a, b) {
        let compas = 0;
        if (a.south != b.south && a.east != b.east) {
            console.log("UNIMPLEMENTED: Attempted to get Bearing of ne, nw, se, sw bearing");
            return undefined;
        }
        else if (a.south == b.south && a.east == b.east) {
            console.log("Error: You tried to get the bearing of the point you are in");
            return undefined;
        }
        if (a.south > b.south) {
            return 's';
        }
        else if (a.south < b.south) {
            return 'n';
        }
        else if (a.east > b.east) {
            return 'w';
        }
        else if (a.east < b.east) {
            return 'e';
        }
    }
}