// Player character.
import Actor from './actor.js'
// Listens for rhythm based commands and updates Actor class

export default class Player extends Actor {
    constructor({ scene, sprite, x, y, health }) {
        super({ scene, sprite, x, y, health });
        this.sprite = sprite;
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.scene.playerText = [];
        this.addFancyText1(300, 300);
    }

    create() {
        this.sprite.setGravityY(75);
        this.damage = 0;
        this.nextSfx = 0;
        this.scene.physics.add.collider(this.sprite, this.scene.platforms);
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.wasd = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.eKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.isMoving = false;

    }

    walkLeft() {
        console.log('walk left');
        this.sprite.play('charwalk', true);
        this.sprite.flipX = true;
        this.sprite.setVelocityX(-75);
    }

    walkRight() {
        console.log('advance');
        this.sprite.play('charwalk', true);
        this.sprite.flipX = false;
        this.sprite.setVelocityX(75);
    }

    shoot() {
        if (this.scene.bullet && this.scene.bullet.currentBulletSprite && this.scene.bullet.currentBulletSprite.active) {
            return;
        }
        console.log('shoot');
        this.sprite.play('charshoot', true);
        this.sprite.flipX = false;
        this.hasFiredThisAnimation = false;
    }

    climb() {
        console.log('climb');
        this.sprite.play('charclimb', true);
        this.sprite.flipX = false;
    }

    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.sprite.play('chardie', true);
        this.sprite.setVelocityX(0);
        this.scene.registry.set('gameState', 'lost');
    }

    jump() {
        console.log('jump');
        this.sprite.play('charjump', true);
        this.sprite.flipX = false;
        this.sprite.body.setVelocityY(-180);
    }

    duck() {
        console.log('duck');
        this.sprite.play('charduck', true);
        this.sprite.setSize(10, 8);
        this.sprite.setOffset(3, 8);
    }

    die() {
        this.sprite.play('chardie');
        this.sprite.setVelocityX(0);
        this.sprite.setVelocityY(0);
    }
    update() {
        if (this.isDead) {
            this.sprite.setVelocityX(0);
            return;
        }

        if (this.sprite.body.bottom >= 439) {
            this.die();
            return;
        }

        // Reset hitbox to normal size (ducking will halve it again if needed)
        this.sprite.setSize(10, 16);
        this.sprite.setOffset(3, 0);

        let activeLadder = null;
        const isAtLadder = this.scene.physics.overlap(this.sprite, this.scene.ladders, (player, ladder) => {
            activeLadder = ladder;
        });

        const isAtInteractZone = this.scene.physics.overlap(this.sprite, this.scene.interactZones);

        let activeCollectible = null;
        if (this.scene.collectibleZones) {
            this.scene.physics.overlap(this.sprite, this.scene.collectibleZones, (player, zone) => {
                activeCollectible = zone.collectible;
            });
        }

        if (!isAtLadder) {
            this.isClimbing = false;
        } else if (this.cursors.up.isDown || this.wasd.up.isDown || this.cursors.down.isDown || this.wasd.down.isDown) {
            this.isClimbing = true;
        }

        if (this.isClimbing) {
            this.sprite.body.setAllowGravity(false);
            this.sprite.body.checkCollision.down = false;
            this.sprite.body.checkCollision.up = false;
            this.sprite.setVelocityX(0);

            // Snap player to be inline with the ladder
            if (activeLadder) {
                let ladderCenter = activeLadder.x + (activeLadder.width / 2);
                let diff = ladderCenter - this.sprite.x;
                if (Math.abs(diff) > 0.5) {
                    this.sprite.x += diff * 0.2;
                } else {
                    this.sprite.x = ladderCenter;
                }

                // Stop climbing if we reached the platform at the bottom
                let isTouchingBottomPlatform = false;
                if (this.sprite.body.velocity.y > 0) {
                    this.scene.physics.overlap(this.sprite, this.scene.platforms, (player, platform) => {
                        let ladderBottom = activeLadder.y + activeLadder.displayHeight;
                        // Only snap if the platform is near the bottom of the ladder
                        if (Math.abs(platform.y - ladderBottom) < 30 && player.body.bottom >= platform.y - 2) {
                            isTouchingBottomPlatform = true;
                        }
                    });
                }

                if (isTouchingBottomPlatform) {
                    this.isClimbing = false;
                }
            }
        } else {
            this.sprite.body.setAllowGravity(true);
            this.sprite.body.checkCollision.down = true;
            this.sprite.body.checkCollision.up = true;
        }

        if (isAtInteractZone) {
            console.log('yay interact zone');
        }

        if ((this.cursors.left.isDown || this.wasd.left.isDown) && !this.isClimbing) {
            this.walkLeft();
        } else if ((this.cursors.right.isDown || this.wasd.right.isDown) && !this.isClimbing) {
            this.walkRight();
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            if (this.isClimbing) {
                this.climb();
                this.sprite.setVelocityY(100);
            } else {
                this.duck();
            }
        } else if (this.cursors.up.isDown || this.wasd.up.isDown) {
            if (this.isClimbing) {
                this.climb();
                this.sprite.setVelocityY(-100);
            } else if (this.sprite.body.onFloor()) {
                this.jump();
            }
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            this.shoot();
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.shift) || Phaser.Input.Keyboard.JustDown(this.eKey)) {
            if (activeCollectible && !activeCollectible.collected) {
                activeCollectible.collect();
                console.log('Collected moneybag!');

                let collected = this.scene.registry.get('moneybagsCollected') || 0;
                this.scene.registry.set('moneybagsCollected', collected + 1);
            } else if (isAtInteractZone) {
                console.log('interact');
            }
        } else {
            this.sprite.setVelocityX(0);

            if (this.isClimbing) {
                this.sprite.setVelocityY(0);
            }

            if (this.sprite.anims.isPlaying && this.sprite.anims.currentAnim.key === 'charshoot') {
                // Let the shoot animation finish
                if (this.sprite.anims.currentFrame && this.sprite.anims.currentFrame.isLast && !this.hasFiredThisAnimation) {
                    this.scene.bullet.create();
                    this.hasFiredThisAnimation = true;
                }
            } else {
                this.sprite.play('charidle', true);
            }

        }
    }

    addFancyText(x, y) {
        var text = this.scene.add.text(x, y, '', { font: "20px Arial Black", fill: "#fff" });
        text.setStroke('#00f', 5);
        text.setShadow(2, 2, '#333333', 2, true, true);
        this.scene.hintText.push(text);
    }

    addFancyText1(x, y) {
        var text = this.scene.add.text(x, y, '', { font: "20px Arial Black", fill: "#fff" });
        text.setStroke('#00f', 5);
        text.setShadow(2, 2, '#333333', 2, true, true);
        this.scene.playerText.push(text);
    }

    stringToArrows(start) {
        var result = "";

        var i;
        for (i = 0; i < start.length; i++) {
            switch (start.substring(i, i + 1)) {
                case '1':
                    result += '^';
                    break;
                case '2':
                    result += '>';
                    break;
                case '3':
                    result += 'v';
                    break;
                case '4':
                    result += '<';
                    break;
                default:
                    result += '*';
                    break;
            }
        }

        return result;
    }

    stringToAction(start) {
        const actions = {
            '1112': 'advance',
            '1212': 'punch',
            '2121': 'kick',
            '2221': 'retreat',
            '3334': 'block',
            '2424': 'jump',
            '4434': 'jumpkick',
        };

        return actions[start];
    }

}
