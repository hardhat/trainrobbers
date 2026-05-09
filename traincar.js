// Train car.
import Actor from './actor.js'
// Listens for rhythm based commands and updates Actor class

export default class TrainCar extends Actor {
    constructor({ scene, sprite, x, y, health, carSprites = [] }) {
        super({ scene, sprite, x, y, health });
        this.sprite = sprite;
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.carSprites = carSprites;
        this.scene.playerText = [];

        this.playerSprite = null;
        this.playerNearLadder = false;
        this.playerClimbing = false;
        this.moveKeys = null;

        this.roofPlatforms = null;
        this.floorPlatforms = null;
        this.endLandings = null;
        this.ladderZones = null;
    }

    create() {
        this.buildTrainCollisionGeometry();
        this.moveKeys = this.scene.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.J,
            right: Phaser.Input.Keyboard.KeyCodes.L,
            up: Phaser.Input.Keyboard.KeyCodes.I,
            down: Phaser.Input.Keyboard.KeyCodes.K
        });
    }

    attachPlayer(playerSprite) {
        this.playerSprite = playerSprite;
        this.playerSprite.setCollideWorldBounds(true);
        this.playerSprite.body.setSize(12, 16);

        this.scene.physics.add.collider(this.playerSprite, this.floorPlatforms);
        this.scene.physics.add.collider(this.playerSprite, this.endLandings);
        this.scene.physics.add.collider(this.playerSprite, this.roofPlatforms, null, this.shouldCollideWithRoof, this);
        this.scene.physics.add.overlap(this.playerSprite, this.ladderZones, this.onLadderOverlap, null, this);
    }

    buildTrainCollisionGeometry() {
        this.roofPlatforms = this.scene.physics.add.staticGroup();
        this.floorPlatforms = this.scene.physics.add.staticGroup();
        this.endLandings = this.scene.physics.add.staticGroup();
        this.ladderZones = this.scene.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        for (const carSprite of this.carSprites) {
            this.createCarCollisionBodies(carSprite);
        }
    }

    createCarCollisionBodies(carSprite) {
        const left = carSprite.x;
        const top = carSprite.y;
        const width = carSprite.displayWidth;
        const height = carSprite.displayHeight;
        const centerX = left + width / 2;

        this.addStaticBody(this.roofPlatforms, centerX, top + 14, width - 30, 10);
        this.addStaticBody(this.floorPlatforms, centerX, top + height - 20, width - 20, 12);

        this.addStaticBody(this.endLandings, left + 12, top + 28, 24, 10);
        this.addStaticBody(this.endLandings, left + width - 12, top + 28, 24, 10);

        this.addLadderZone(left + 22, top + height - 36, 16, height - 40);
        this.addLadderZone(left + width - 22, top + height - 36, 16, height - 40);
    }

    addStaticBody(group, x, y, width, height) {
        const bodyRect = this.scene.add.rectangle(x, y, width, height, 0x00ff00, 0);
        this.scene.physics.add.existing(bodyRect, true);
        group.add(bodyRect);
    }

    addLadderZone(x, y, width, height) {
        const ladder = this.scene.add.zone(x, y, width, height);
        this.scene.physics.add.existing(ladder);
        ladder.body.setAllowGravity(false);
        ladder.body.setImmovable(true);
        this.ladderZones.add(ladder);
    }

    onLadderOverlap() {
        this.playerNearLadder = true;
    }

    shouldCollideWithRoof() {
        return !this.playerClimbing;
    }

    updatePlatformMovement() {
        if (!this.playerSprite || !this.moveKeys) {
            return;
        }

        const speed = 130;
        const climbSpeed = 90;
        const jumpSpeed = 210;
        const body = this.playerSprite.body;

        if (this.moveKeys.left.isDown) {
            body.setVelocityX(-speed);
            this.playerSprite.flipX = true;
        } else if (this.moveKeys.right.isDown) {
            body.setVelocityX(speed);
            this.playerSprite.flipX = false;
        } else {
            body.setVelocityX(0);
        }

        if (this.playerNearLadder && (this.moveKeys.up.isDown || this.moveKeys.down.isDown)) {
            this.playerClimbing = true;
            body.setAllowGravity(false);
            body.setVelocityY(this.moveKeys.up.isDown ? -climbSpeed : climbSpeed);
        } else if (this.playerClimbing) {
            body.setVelocityY(0);
            if (!this.playerNearLadder) {
                this.playerClimbing = false;
                body.setAllowGravity(true);
            }
        } else {
            body.setAllowGravity(true);
            if (Phaser.Input.Keyboard.JustDown(this.moveKeys.up) && body.blocked.down) {
                body.setVelocityY(-jumpSpeed);
            }
        }
    }

    update() {
        this.playerNearLadder = false;
        this.updatePlatformMovement();
    }

};