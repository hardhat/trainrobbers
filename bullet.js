// Player character.
import Actor from './actor.js'
// Listens for rhythm based commands and updates Actor class

export default class Bullet extends Actor {
    constructor({ scene, sprite, x, y }) {
        super({ scene, sprite, x, y });
        this.sprite = sprite;
        this.scene = scene;
        this.x = x;
        this.y = y;
    }

    create() {
        if (this.currentBulletSprite && this.currentBulletSprite.active) {
            return; // A bullet is already active
        }
        if (!this.scene.anims.exists('bullet_anim')) {
            this.scene.anims.create({
                key: 'bullet_anim',
                frames: this.scene.anims.generateFrameNumbers(this.sprite, { start: 0, end: 4 }),
                frameRate: 15, // Play quickly
                repeat: 0 // Play once
            });
        }

        // Get the player's position and facing direction
        let spawnX = this.scene.player ? this.scene.player.sprite.x : this.x;
        let spawnY = this.scene.player ? this.scene.player.sprite.y : this.y;
        let isFacingLeft = this.scene.player ? this.scene.player.sprite.flipX : false;

        this.currentBulletSprite = this.scene.physics.add.sprite(spawnX, spawnY - 27, this.sprite).setOrigin(0, 0).setSize(3, 2).setOffset(16, 8);
        this.currentBulletSprite.setScale(3);

        this.currentBulletSprite.play('bullet_anim');

        // Disable gravity for the bullet so it doesn't fall
        this.currentBulletSprite.body.setAllowGravity(false);
        this.currentBulletSprite.setVelocityX(0);

        if (isFacingLeft) {
            this.currentBulletSprite.flipX = true; // Optional: flip the bullet sprite
        }

        // Wait for animation to finish before moving
        this.currentBulletSprite.once('animationcomplete-bullet_anim', () => {
            if (this.currentBulletSprite && this.currentBulletSprite.active) {
                // Set velocity based on direction
                if (isFacingLeft) {
                    this.currentBulletSprite.setVelocityX(-200);
                } else {
                    this.currentBulletSprite.setVelocityX(200);
                }

                // Make it disappear after 2 seconds
                let bulletToDestroy = this.currentBulletSprite;
                this.scene.time.delayedCall(2000, () => {
                    if (bulletToDestroy && bulletToDestroy.active) {
                        bulletToDestroy.destroy();
                    }
                });
            }
        });
    }

}
