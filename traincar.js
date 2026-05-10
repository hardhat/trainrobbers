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
        this.createLadders();
        this.createInteractZones();
    }

    createCollisionPlatforms() {
        const floorWidth = 146 * 3;
        const floorHeight = 1;
        const roofWidth = 156 * 3;
        const roofheight = 1;

        this.createCollisionRectangle(this.x + 30, this.y + 80, 50, floorHeight);
        this.createCollisionRectangle(this.x, this.y + 100, 10000, floorHeight);
        this.createCollisionRectangle(this.x + floorWidth + 90, this.y + 80, 40, floorHeight);
        this.createCollisionRectangle(this.x + 278, this.y, roofWidth, roofheight);
        console.log('x = ' + this.x + (floorWidth / 2));
    }

    createCollisionRectangle(x1, y1, width, height) {
        let rect = this.scene.platforms.create(x1, y1, null).setSize(width, height).setOrigin(0, 0).setVisible(false).setAlpha(0);
        this.scene.platforms.add(rect);

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
        let ladder = this.scene.ladders.create(x, y, 'char').setSize(w, h).setOrigin(0, 0).setVisible(true).setAlpha(1);
        this.scene.ladders.add(ladder);
    }

    createInteractZones() {
        const interactZoneWidth = 6;
        const interactZoneHeight = 20;

        this.createInteractZone(this.x + 30, this.y + 50, interactZoneWidth, interactZoneHeight);
        this.createInteractZone(this.x + 528, this.y + 50, interactZoneWidth, interactZoneHeight);

    }

    createInteractZone(x, y, w, h) {
        console.log('interact zone width: ' + w);
        console.log('interact zone height: ' + h);
        let interactZone = this.scene.interactZones.create(x, y, 'char').setSize(w, h).setOrigin(0, 0).setVisible(true).setAlpha(1);
        this.scene.interactZones.add(interactZone);
    }

};