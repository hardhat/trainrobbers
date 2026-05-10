// Train car.
import Actor from './actor.js'
// Listens for rhythm based commands and updates Actor class

export default class TrainCar extends Actor {
    constructor({ scene, sprite1, sprite2, wheels, x, y, health }) {
        super({ scene, sprite1, sprite2, wheels, x, y, health });
        this.sprite1 = sprite1;
        this.sprite2 = sprite2;
        this.wheels = wheels;
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.scene.playerText = [];
    }

    create() {

        this.exteriorSprite = this.scene.add.image(this.x, this.y, this.sprite1).setOrigin(0, 0);
        this.exteriorSprite.setScale(3);

        this.interior = this.scene.add.image(this.x, this.y, this.sprite2).setOrigin(0, 0);
        this.interior.setScale(3);
        this.interior.setAlpha(0);

        this.wheels = this.scene.add.image(this.x + 54, this.y + 87, this.wheels).setOrigin(0, 0);
        this.wheels.setScale(3);

        this.createCollisionPlatforms();
        this.createLadders();
        this.createInteractZones();
    }

    createCollisionPlatforms() {
        const floorWidth = 146 * 3;
        const floorHeight = 1;
        const roofWidth = 156 * 3;
        const roofheight = 1;

        this.extPlatform1 = this.createCollisionRectangle(this.x + 30, this.y + 80, 50, floorHeight);
        this.mainFloor = this.createCollisionRectangle(this.x, this.y + 120, 10000, floorHeight);
        this.extPlatform2 = this.createCollisionRectangle(this.x + floorWidth + 90, this.y + 80, 40, floorHeight);
        this.roofPlatform = this.createCollisionRectangle(this.x + 278, this.y, roofWidth, roofheight);
        this.interiorFloor = this.createCollisionRectangle(this.x + 275, this.y + 80, 440, floorHeight);
        console.log('x = ' + this.x + (floorWidth / 2));
    }

    createCollisionRectangle(x1, y1, width, height) {
        let rect = this.scene.platforms.create(x1, y1, null).setSize(width, height).setOrigin(0, 0).setVisible(false).setAlpha(0);
        this.scene.platforms.add(rect);
        return rect;
    }

    createLadders() {
        const ladderWidth = 9;
        const ladderHeight = 82;
        console.log('ladder width: ' + ladderWidth);
        console.log('ladder height: ' + ladderHeight);

        this.createLadderZone(this.x + 50, this.y + 40, ladderWidth, ladderHeight);

        this.createLadderZone(this.x + 508, this.y + 40, ladderWidth, ladderHeight);

    }

    createLadderZone(x, y, w, h) {
        console.log('ladder width: ' + w);
        console.log('ladder height: ' + h);
        let ladder = this.scene.ladders.create(x, y, null).setSize(w, h).setOrigin(0, 0).setVisible(false).setAlpha(0);
        this.scene.ladders.add(ladder);
    }

    createInteractZones() {
        const interactZoneWidth = 440;
        const interactZoneHeight = 75;

        this.createInteractZone(this.x + 275, this.y + 40, interactZoneWidth, interactZoneHeight);
        //this.createInteractZone(this.x + 528, this.y + 50, interactZoneWidth, interactZoneHeight);

    }

    createInteractZone(x, y, w, h) {
        console.log('interact zone width: ' + w);
        console.log('interact zone height: ' + h);
        let interactZone = this.scene.interactZones.create(x, y, 'char').setSize(w, h).setOrigin(0, 0).setVisible(false).setAlpha(0);
        interactZone.traincar = this;
        this.scene.interactZones.add(interactZone);
    }

    update() {
        let isInside = false;
        if (this.scene.player && this.scene.player.sprite) {
            this.scene.physics.overlap(this.scene.player.sprite, this.scene.interactZones, (player, zone) => {
                if (zone.traincar === this) {
                    isInside = true;
                }
            });
        }

        let targetAlpha = isInside ? 1 : 0;
        let extTargetAlpha = isInside ? 0 : 1;

        if (this.interior.alpha < targetAlpha) {
            this.interior.alpha = Math.min(1, this.interior.alpha + 0.05);
        } else if (this.interior.alpha > targetAlpha) {
            this.interior.alpha = Math.max(0, this.interior.alpha - 0.05);
        }

        if (this.exteriorSprite.alpha < extTargetAlpha) {
            this.exteriorSprite.alpha = Math.min(1, this.exteriorSprite.alpha + 0.05);
        } else if (this.exteriorSprite.alpha > extTargetAlpha) {
            this.exteriorSprite.alpha = Math.max(0, this.exteriorSprite.alpha - 0.05);
        }

        // Toggle exterior collision zones
        let enableExterior = !isInside;
        if (this.roofPlatform) this.roofPlatform.body.enable = enableExterior;
        if (this.extPlatform1) this.extPlatform1.body.enable = enableExterior;
        if (this.extPlatform2) this.extPlatform2.body.enable = enableExterior;

        // Toggle interior collision zone
        if (this.interiorFloor) this.interiorFloor.body.enable = isInside;
    }

};