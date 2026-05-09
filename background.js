// Parallax scrolling background for the train level.
// Drop real PNGs into assets/sprites/ and swap the placeholder blocks below.

export default class Background {
    constructor(scene) {
        this.scene = scene;
        this.offsets = { mountains: 0, plains: 0, ground: 0 };
    }

    preload() {
        this.scene.load.image('bg-sky', 'assets/sprites/sky.png');
        // Uncomment when art is ready:
        // this.scene.load.image('bg-mountains', 'assets/sprites/bg-mountains.png');
        // this.scene.load.image('bg-plains',    'assets/sprites/bg-plains.png');
        // this.scene.load.image('bg-ground',    'assets/sprites/bg-ground.png');
        // this.scene.load.image('bg-train',     'assets/sprites/bg-train.png');
    }

    create() {
        const s = this.scene;

        // Sky — real asset, tiles horizontally
        this.sky = s.add.tileSprite(0, 0, 800, 600, 'bg-sky').setOrigin(0, 0);

        // --- Placeholder layers (colored rects) ---
        // Replace each block with:
        //   this.mountains = s.add.tileSprite(0, 0, 800, 600, 'bg-mountains').setOrigin(0, 0);
        // and in update() change the offset line to:
        //   this.mountains.tilePositionX += 0.8;

        // Distant mesa silhouette
        this.mountains = s.add.graphics();
        this.mountains.fillStyle(0x8B6F5E);
        this.mountains.fillTriangle(0, 400, 150, 260, 300, 400);
        this.mountains.fillTriangle(200, 400, 380, 230, 560, 400);
        this.mountains.fillTriangle(450, 400, 650, 250, 850, 400);
        this.mountains.fillRect(0, 380, 900, 30);

        // Sandy mid-ground plains
        this.plains = s.add.graphics();
        this.plains.fillStyle(0xC4A35A);
        this.plains.fillRect(0, 420, 900, 50);

        // Dark ground / track blur
        this.ground = s.add.graphics();
        this.ground.fillStyle(0x5C3D1E);
        this.ground.fillRect(0, 468, 900, 40);

        // Train floor line — fixed, not scrolled
        s.add.graphics().fillStyle(0x3A2A1A).fillRect(0, 455, 800, 10);

        // Sprite stage: characters stand at y=400, floor at y=455
        // This matches the existing player/npc placement in level.js
    }

    update() {
        this.sky.tilePositionX += 0.3;

        // Scroll placeholder graphics by moving them left and wrapping
        this.offsets.mountains += 0.8;
        this.offsets.plains    += 1.5;
        this.offsets.ground    += 4.0;

        this.mountains.x = -(this.offsets.mountains % 800);
        this.plains.x    = -(this.offsets.plains    % 800);
        this.ground.x    = -(this.offsets.ground    % 800);
    }
}
