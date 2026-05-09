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
        const floorWidth = 146 * 3;
        const floorHeight = 1;
        const roofWidth = 146 * 3;
        const roofheight = 1;

        this.createCollisionRectangle(this.x, this.y + 130, 19 * 3, floorHeight);
        this.createCollisionRectangle(this.x + (floorWidth / 2) + 57, this.y + 160, floorWidth, floorHeight);
        this.createCollisionRectangle(this.x + floorWidth + 57, this.y + 130, 19 * 3, floorHeight);

        //this.createCollisionRectangle(this.X, this.y + 52, roofWidth, roofheight);
    }

    createCollisionRectangle(x1, y1, width, height) {
        let rect = this.scene.platforms.create(x1, y1, null).setSize(width, height).setOrigin(0, 0).setVisible(false).setAlpha(0);
        this.scene.platforms.add(rect);

    }


};