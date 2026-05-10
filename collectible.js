import Actor from './actor.js'

export default class Collectible extends Actor {
    constructor({ scene, sprite, x, y, value }) {
        super({ scene, sprite, x, y, health: 1 });
        this.x = x;
        this.y = y;
        this.value = value || 10;
    }

    create() {
        this.spriteObj = this.scene.add.image(this.x, this.y, this.sprite).setOrigin(0, 0);
        // Set scale similar to player or train car, 3 is used for train
        this.spriteObj.setScale(3);
        this.spriteObj.setAlpha(0); // Start invisible, sync with traincar interior

        // Create its own interact zone
        this.interactZone = this.scene.add.zone(this.x, this.y).setSize(16 * 3, 16 * 3).setOrigin(0, 0);
        this.scene.physics.world.enable(this.interactZone);
        this.interactZone.body.setAllowGravity(false);
        this.interactZone.body.moves = false;
        this.interactZone.collectible = this;
    }

    update(targetAlpha) {
        if (this.spriteObj) {
            if (this.spriteObj.alpha < targetAlpha) {
                this.spriteObj.alpha = Math.min(1, this.spriteObj.alpha + 0.05);
            } else if (this.spriteObj.alpha > targetAlpha) {
                this.spriteObj.alpha = Math.max(0, this.spriteObj.alpha - 0.05);
            }
        }
    }
}