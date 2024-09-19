let my_width = window.innerWidth - 20;
let my_height = window.innerHeight - 20;

let config = {
    renderer: Phaser.AUTO,
    width: my_width,
    height: my_height,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

let game = new Phaser.Game(config);

function preload() {

}

function create() {

}

function update() {
    
}

