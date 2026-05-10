// Game level goes here.
//import Phaser from 'phaser'
import Player from './player.js'
import Npc from './npc.js'
import TrainCar from './traincar.js'
import Bullet from './bullet.js'
import Hud from './hud.js'

// Shows level background.  Stretch goal: scroll side to side

export default class Level extends Phaser.Scene {
    constructor() {
        super('Level');
    }

    preload() {
        this.load.image('sky', 'assets/isolated bg assets/blank_bg.png');
        this.load.image('track', 'assets/isolated bg assets/train-track-seamless-crop.png');
        this.load.image('mountain', 'assets/isolated bg assets/Mountain_Range.png');
        this.load.image('cactus', 'assets/isolated bg assets/cactus.png');

        this.char = this.load.spritesheet('char', 'assets/sprites/char.png', { frameWidth: 16, frameHeight: 16 });
        this.candy = this.load.spritesheet('candy', 'assets/sprites/woman.png', { frameWidth: 48, frameHeight: 48 });
        this.passenger = this.load.image('passengercar', 'assets/trains/passengercar.png');
        this.bullet = this.load.spritesheet('bullet', 'assets/sprites/BulletFire.png', { frameWidth: 16, frameHeight: 16 });

        this.load.image('healthbar', 'assets/hud/healthbar.png');
        this.load.image('hudBg', 'assets/hud/hud-bg.png');

        // Load the theme
        this.levelMusic = this.load.audio('levelmusic', 'assets/music/main_theme.mp3');

        this.load.audio('1', ['assets/syllables/DO_woman.wav', 'assets/syllables/DO_woman.mp3', 'assets/syllables/DO_woman.ogg']);
        this.load.audio('2', ['assets/syllables/WAH_woman.wav', 'assets/syllables/WAH_woman.mp3', 'assets/syllables/WAH_woman.ogg']);
        this.load.audio('3', ['assets/syllables/UHUH_woman.wav', 'assets/syllables/WAH_woman.mp3', 'assets/syllables/WAH_woman.ogg']);
        this.load.audio('4', ['assets/syllables/KATTA_woman.wav', 'assets/syllables/WAH_woman.mp3', 'assets/syllables/WAH_woman.ogg']);

        this.load.audio('woman1', ['assets/sfx/FIGHT_woman1.wav']);
        this.load.audio('woman2', ['assets/sfx/FIGHT_woman2.wav']);
        this.load.audio('woman3', ['assets/sfx/FIGHT_woman3.wav']);
        this.load.audio('woman4', ['assets/sfx/FIGHT_woman4.wav']);
        this.load.audio('woman5', ['assets/sfx/FIGHT_woman5.wav']);
        this.load.audio('womanwin', ['assets/sfx/WIN_woman.wav']);
        this.load.audio('man1', ['assets/sfx/FIGHT_man1.wav']);
        this.load.audio('man2', ['assets/sfx/FIGHT_man2.wav']);
        this.load.audio('man3', ['assets/sfx/FIGHT_man3.wav']);
        this.load.audio('man4', ['assets/sfx/FIGHT_man4.wav']);
        this.load.audio('man5', ['assets/sfx/FIGHT_man5.wav']);
        this.load.audio('man6', ['assets/sfx/FIGHT_man6.wav']);
        this.load.audio('manwin', ['assets/sfx/WIN_man.wav']);
    }

    createAnim(texture) {
        var name = texture;
        // Animation set
        this.anims.create({
            key: name + 'walk',
            frames: this.anims.generateFrameNumbers(name, { frames: [24, 25, 26, 27, 28, 29] }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: name + 'idle',
            frames: this.anims.generateFrameNumbers(name, { frames: [0, 1, 2, 3] }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: name + 'shoot',
            frames: this.anims.generateFrameNumbers(name, { frames: [6, 7, 8, 9, 10, 11, 12, 13, 14] }),
            frameRate: 8,
            repeat: 0,
            //repeatDelay: 2000
        });

        this.anims.create({
            key: name + 'climb',
            frames: this.anims.generateFrameNumbers(name, { frames: [30, 31, 32, 33] }),
            frameRate: 8,
            repeat: -1,
            //repeatDelay: 2000
        });

        this.anims.create({
            key: name + 'jump',
            frames: this.anims.generateFrameNumbers(name, { frames: [36] }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: name + 'duck',
            frames: this.anims.generateFrameNumbers(name, { frames: [42] }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: name + 'die',
            frames: this.anims.generateFrameNumbers(name, { frames: [18, 19, 20, 21, 22, 23] }),
            frameRate: 8,
        });

        const keys = ['walk', 'idle', 'shoot', 'climb', 'jump', 'duck', 'die'];
    }

    create() {
        // Sky and mountain are already large native pixels — no tile scaling needed.
        // Track source is 256x2, so scale it up to be visible.
        this.sky = this.add.tileSprite(0, 0, 768, 576, 'sky').setOrigin(0, 0);
        this.mountain = this.add.tileSprite(0,124, 768, 101, 'mountain').setOrigin(0, 0);
        this.track = this.add.tileSprite(0, 430, 768, 6, 'track').setOrigin(0, 0).setTileScale(3, 3);

        this.firstClassSprite = this.add.image(0, 320, 'passengercar').setOrigin(0, 0);
        this.firstClassSprite.setScale(3);
        this.thirdClassSprite = this.add.image(549, 320, 'passengercar').setOrigin(0, 0);
        this.thirdClassSprite.setScale(3);

        this.createAnim('char');
        this.playerSprite = this.physics.add.sprite(200, 250).setSize(10, 16).setOffset(3, 0);
        this.playerSprite.setBounce(0.2);
        this.playerSprite.setCollideWorldBounds(true);
        this.playerSprite.setScale(3);
        this.playerSprite.play('charidle');
        this.playerSprite.flipX = false;

        this.platforms = this.physics.add.staticGroup();
        this.ladders = this.physics.add.staticGroup();
        this.interactZones = this.physics.add.staticGroup();

        var x = 200;
        var y = 400;
        var health = 30;

        this.traincar = new TrainCar({ scene: this, sprite: this.firstClassSprite, x: 0, y: 320, health: health });
        this.traincar2 = new TrainCar({ scene: this, sprite: this.thirdClassSprite, x: 549, y: 320, health: health });
        this.player = new Player({ scene: this, sprite: this.playerSprite, x: x, y: y, health: health });
        this.bullet = new Bullet({ scene: this, sprite: 'bullet', x: 200, y: 200 });
        x = 600;
        this.npc = new Npc({ scene: this, sprite: this.npcSprite, x: x, y: y, health: health });
        this.hud = new Hud({ scene: this, player: this.player, npc: this.npc });

        /*if (this.npc.alive) {
            this.createAnim('candy');
            this.npcSprite = this.add.sprite(600, 400);
            this.npcSprite.setScale(4);
            this.npcSprite.play('candyidle');
        }*/

        this.createSounds();
        this.traincar.create();
        this.traincar2.create();
        this.player.create();
        //this.npc.create();
    }

    createSounds() {
        // Play the main theme looping
        this.levelMusic = this.sound.add('levelmusic', { loop: true });
        this.levelMusic.play();


        this.syllable1 = this.sound.add('1');
        this.syllable2 = this.sound.add('2');
        this.syllable3 = this.sound.add('3');
        this.syllable4 = this.sound.add('4');
        console.log('Do Wa Uhuh Katta');

        /*this.input.keyboard.on('keydown-SPACE', function () {
            console.log("Quiet.");
            this.sound.stopAll();
        }, this);*/

        this.womanFight = [];
        this.womanFight.push(this.sound.add('woman1'));
        this.womanFight.push(this.sound.add('woman2'));
        this.womanFight.push(this.sound.add('woman3'));
        this.womanFight.push(this.sound.add('woman4'));
        this.womanFight.push(this.sound.add('woman5'));

        this.manFight = [];
        this.manFight.push(this.sound.add('man1'));
        this.manFight.push(this.sound.add('man2'));
        this.manFight.push(this.sound.add('man3'));
        this.manFight.push(this.sound.add('man4'));
        this.manFight.push(this.sound.add('man5'));
        this.manFight.push(this.sound.add('man6'));

        this.womanWin = this.sound.add('womanwin');
        this.manWin = this.sound.add('manwin');
    }

    update() {
        this.player.update();
        // Use actor for the animated figures.  Each player or npc has an actor.  This updates the player + npc.
        this.hud.update();
        // Need to scroll the sky image.
        this.sky.tilePositionX += 3;
        this.track.tilePositionX += 3;
        this.mountain.tilePositionX += 1;
    }

}
