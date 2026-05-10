// Guard NPC – appears when the player collects a money bag inside a passenger car.
// After a short delay the guard shoots at the player. Ducking avoids the bullet.
// If the player shoots the guard first, the guard disappears.

export default class Guard {
    constructor({ scene, x, y }) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.alive = true;
        this.sprite = null;
        this.guardBullet = null;
        this._bulletHit = false;
    }

    create() {
        // Non-physics sprite so the guard is unaffected by platform toggles.
        this.sprite = this.scene.add.sprite(this.x, this.y, 'npc');
        this.sprite.setScale(3);
        this.sprite.setDepth(200);

        // Add a physics body manually so overlap detection works.
        this.scene.physics.add.existing(this.sprite, false);
        this.sprite.body.setAllowGravity(false);
        this.sprite.body.setImmovable(true);
        this.sprite.body.setSize(10, 16);
        this.sprite.body.setOffset(3, 0);

        // Face toward the player.
        if (this.scene.player) {
            this.sprite.flipX = this.scene.player.sprite.x < this.x;
        }
        this.sprite.play('npcidle', true);

        // Shoot after 1.5 seconds.
        this.shootTimer = this.scene.time.delayedCall(1500, () => {
            this.shoot();
        });
    }

    shoot() {
        if (!this.alive || !this.sprite || !this.sprite.active) return;

        // Decide direction toward the player.
        let goLeft = true;
        if (this.scene.player) {
            goLeft = this.scene.player.sprite.x < this.sprite.x;
        }
        this.sprite.flipX = goLeft;
        this.sprite.play('npcshoot', true);

        // Fire the bullet roughly when the muzzle frame shows (~500 ms in).
        this.scene.time.delayedCall(500, () => {
            if (!this.alive) return;
            this.fireGuardBullet(goLeft);
        });
    }

    fireGuardBullet(goLeft) {
        if (!this.alive || !this.sprite || !this.sprite.active) return;

        // Spawn bullet at chest height (same offset the player bullet uses).
        let bulletX = this.sprite.x;
        let bulletY = this.sprite.y - 27;

        let bullet = this.scene.physics.add.sprite(bulletX, bulletY, 'bullet');
        bullet.setScale(3);
        bullet.setOrigin(0, 0);
        bullet.setSize(3, 2);
        bullet.setOffset(16, 8);
        bullet.body.setAllowGravity(false);
        bullet.flipX = goLeft;
        bullet.setDepth(200);
        this._bulletHit = false;

        // Reuse the animation that Bullet.js may have already registered.
        if (!this.scene.anims.exists('bullet_anim')) {
            this.scene.anims.create({
                key: 'bullet_anim',
                frames: this.scene.anims.generateFrameNumbers('bullet', { start: 0, end: 4 }),
                frameRate: 15,
                repeat: 0
            });
        }
        bullet.play('bullet_anim');

        bullet.once('animationcomplete-bullet_anim', () => {
            if (!bullet || !bullet.active) return;
            bullet.setVelocityX(goLeft ? -200 : 200);

            // Set up overlap with the player sprite.
            this.scene.physics.add.overlap(bullet, this.scene.player.sprite, () => {
                if (this._bulletHit) return;
                this._bulletHit = true;

                // Only deal damage if the player is NOT ducking.
                const anim = this.scene.player.sprite.anims.currentAnim;
                const isDucking = anim && anim.key === 'charduck';
                if (!isDucking && !this.scene.player.isDead) {
                    this.scene.player.health = Math.max(0, this.scene.player.health - 10);
                }
                if (bullet && bullet.active) bullet.destroy();
            });

            // Auto-destroy after 3 seconds if nothing was hit.
            this.scene.time.delayedCall(3000, () => {
                if (bullet && bullet.active) bullet.destroy();
            });
        });

        this.guardBullet = bullet;
    }

    update() {
        if (!this.alive || !this.sprite || !this.sprite.active) return;

        // Check whether the player's bullet has hit this guard.
        const pb = this.scene.bullet && this.scene.bullet.currentBulletSprite;
        if (pb && pb.active) {
            this.scene.physics.overlap(pb, this.sprite, () => {
                pb.destroy();
                this.die();
            });
        }
    }

    die() {
        if (!this.alive) return;
        this.alive = false;

        // Stop any pending shoot timer.
        if (this.shootTimer) {
            this.shootTimer.remove(false);
            this.shootTimer = null;
        }

        // Destroy any in-flight guard bullet.
        if (this.guardBullet && this.guardBullet.active) {
            this.guardBullet.destroy();
        }

        if (this.sprite && this.sprite.active) {
            this.sprite.play('npcdie', true);
            this.sprite.once('animationcomplete-npcdie', () => {
                if (this.sprite && this.sprite.active) this.sprite.destroy();
            });
            // Fallback in case the event never fires.
            this.scene.time.delayedCall(1000, () => {
                if (this.sprite && this.sprite.active) this.sprite.destroy();
            });
        }

        // Remove from the scene's active guards list.
        if (this.scene.guards) {
            const idx = this.scene.guards.indexOf(this);
            if (idx !== -1) this.scene.guards.splice(idx, 1);
        }
    }
}
