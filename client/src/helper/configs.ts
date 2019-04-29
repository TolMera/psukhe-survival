/**
 * Configs Object
 * A place to store any random magic number information
 * Or other params that you need a name for, but the value may change throughout your code
 */

export default {
    version: 'v0.2019.04.27.12',
    game: {
        tick: 1000 / 20, // = 50
    },
    server: {
        dns: "ec2-52-56-250-10.eu-west-2.compute.amazonaws.com",
        port: 81
    }
}