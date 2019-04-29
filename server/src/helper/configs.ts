/**
 * Configs Object
 * A place to store any random magic number information
 * Or other params that you need a name for, but the value may change throughout your code
 */

export default {
    version: 'v0.2019.04.27.12',
    game: {
        tick: 1000 / 20, // = 50
        waittime: {
            start: 3000, // = 60
            evpoint: 100000, // = 6
            status: (1000 / 20) * 20,
            // Should have it so there more evolution you buy of a speciffic trait, the more often it will message you.
            eyes: (1000 / 20) * 5,
            ears: (1000 / 20) * 5,
            sniff: (1000 / 20) * 5,
            skin: (1000 / 20) * 5,
            venom: (1000 / 20) * 5,
            toxins: (1000 / 20) * 5 * 2
        },
    },
    server: {
        dns: "ec2-52-56-250-10.eu-west-2.compute.amazonaws.com",
        ip: "172.31.31.34",
        port: 81
    },
    spawn: {
        HP: 100,
        hunger: 100,
        thirst: 100,
        oxygen: 100,
        attack: 1
    },
    seeds: {
        map: 'LudumDare44',
        vegetation: 'vegetation',
        predators: 'predators',
    },
    world: {
        dayLength: 60000 * 5
    }
}