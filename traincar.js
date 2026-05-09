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
        this.createCollisionPlatforms();
    }

    createCollisionPlatforms() {
        const floorWidth = 180 * 3;
        const floorHeight = 1;
        const roofWidth = 144 * 3;
        const roofheight = 1;

        this.createCollisionRectangle(this.x, this.y + 20, floorWidth, floorHeight);
        this.createCollisionRectangle(this.x, this.y, roofWidth, roofheight);
    }

    createCollisionRectangle(x, y, width, height) {
        const rect = this.scene.add.rectangle(x, y, width, height, 0x0000ff, 0);
        this.scene.physics.add.existing(rect, true);
        this.scene.platforms.add(rect);
    }


};