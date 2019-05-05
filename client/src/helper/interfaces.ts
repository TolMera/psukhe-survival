interface controller {
    ear: '../controller/ear'
    eye: '../controller/eye'
    intent: '../controller/intent'
    message: '../controller/message'
    mind: '../controller/mind'
    nose: '../controller/nose'
    socket: '../controller/socket'
}

interface global {
    controller: controller
}

interface coordinate {
    south: number
    east: number
}