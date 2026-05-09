// Train car.
import Actor from './actor.js'
// Listens for rhythm based commands and updates Actor class

export default class TrainCar extends Actor {
    constructor({ scene, sprite, x, y, health }) {
        super({ scene, sprite, x, y, health });
        this.sprite = sprite;
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.scene.playerText = [];
    }

    create() {
        this.ground = this.scene.add.rectangle(this.x, this.y, 1000, 10, 0x0000ff, 0);
        this.scene.physics.add.existing(this.ground, true);
        this.scene.platforms.add(this.ground);
    }

};