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
        this.sprite.setGravityY(100);
        this.damage = 0;
        this.nextSfx = 0;
        this.ground = this.scene.physics.add.sprite(384, 547);
        this.ground.displayWidth = 844;
        this.ground.setImmovable(true);
        this.scene.physics.add.collider(this.sprite, this.ground);
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.scene.input.keyboard.on('keydown-UP', this.doUp, this);
        this.scene.input.keyboard.on('keydown-DOWN', this.doDown, this);
        //this.scene.input.keyboard.on('keydown-LEFT', this.doLeft, this);
        //this.scene.input.keyboard.on('keydown-RIGHT', this.doRight, this);
        this.scene.input.keyboard.on('keydown-SPACE', this.doSpace, this);
        this.scene.input.keyboard.on('keydown-W', this.doUp, this);
        this.scene.input.keyboard.on('keydown-S', this.doDown, this);
        this.scene.input.keyboard.on('keydown-A', this.doLeft, this);
        this.scene.input.keyboard.on('keydown-D', this.doRight, this);
        this.enemy = this.scene.npc;
        this.isMoving = false;

    }

    doUp(event) {
        //this.scene.showSyllable('do', this.comboString.length);
        //this.climb();
        //this.die();
        this.jump();
        this.scene.syllable1.play();
    }

    doRight(event) {
        //this.scene.showSyllable('wah', this.comboString.length);
        this.walkRight();

        this.scene.syllable2.play();
    }

    doDown(event) {
        //this.scene.showSyllable('uhuh', this.comboString.length);
        this.duck();
        this.scene.syllable3.play();
    }

    doLeft(event) {
        //this.scene.showSyllable('katta', this.comboString.length);
        this.walkLeft();
        this.scene.syllable4.play();
    }

    doSpace(event) {
        this.shoot();
    }

    dealDamage(amount) {
        console.log('hit');
        this.damage = amount;
        this.enemy.health -= this.damage;
        console.log(this.scene.npc.health);
    }

    walkLeft() {
        console.log('walk left');
        this.sprite.play('charwalk', true);
        this.sprite.flipX = true;
        /*this.scene.tweens.add({
            targets: this.sprite,
            x: this.sprite.setVelocityX(-75),
            duration: 1000,
            delay: 0,
        });*/
        this.sprite.setVelocityX(-75);
        /*this.scene.time.addEvent({
            delay: 1000, callback: function () {
                this.sprite.play('charidle');
            }, callbackScope: this, loop: false
        });*/
    }

    walkRight() {
        console.log('advance');
        this.sprite.play('charwalk', true);
        this.sprite.flipX = false;
        /*this.scene.tweens.add({
            targets: this.sprite,
            x: this.sprite.x + 75,
            duration: 1000,
            delay: 0,
        });*/
        this.sprite.setVelocityX(75);
        /*this.x += 75;
        this.scene.time.addEvent({
            delay: 1000, callback: function () {
                this.sprite.play('charidle');
            }, callbackScope: this, loop: false
        });*/
    }

    shoot() {
        console.log('shoot');
        this.sprite.play('charshoot');
        this.sprite.flipX = false;
        this.scene.manFight[(this.nextSfx++) % 5].play();
        this.scene.time.addEvent({
            delay: 1000, callback: function () {
                this.sprite.play('charidle');
            }, callbackScope: this, loop: false
        });
    }

    climb() {
        console.log('climb');
        this.sprite.play('charclimb');
        this.sprite.flipX = false;
        this.scene.manFight[(this.nextSfx++) % 5].play();
        this.scene.time.addEvent({
            delay: 1000, callback: function () {
                this.sprite.play('charidle');
            }, callbackScope: this, loop: false
        });
    }

    jump() {
        console.log('jump');
        this.sprite.play('charjump');
        this.sprite.flipX = false;
        /*this.scene.manFight[(this.nextSfx++) % 5].play();'
        this.timer = this.time.addEvent({
            delay:100,
            callback: this.tick,
            callbackScope: this,
            loop:true
        });*/
        this.sprite.body.setVelocityY(-110);
        /*this.scene.tweens.add({
            targets: this.sprite,
            y: this.sprite.y - 75,
            duration: 1000,
            delay: 0,
        });
        this.y -= 75;*/
        this.scene.time.addEvent({
            delay: 1000, callback: function () {
                this.sprite.play('charidle');
            }, callbackScope: this, loop: false
        });
    }

    duck() {
        console.log('duck');
        this.sprite.play('charduck');
        this.sprite.flipX = false;
        this.scene.manFight[(this.nextSfx++) % 5].play();
        if (this.scene.npc.x - this.x <= 100) {
            this.dealDamage(5);
        }
        this.scene.time.addEvent({
            delay: 1000, callback: function () {
                this.sprite.play('charidle');
            }, callbackScope: this, loop: false
        });
        this.scene.npc.isAlive();
    }

    die() {
        this.sprite.play('chardie');
        this.scene.time.addEvent({
            delay: 1000, callback: function () {
                this.sprite.play('charidle');
            }, callbackScope: this, loop: false
        });
    }

    update() {
        if (this.cursors.left.isDown) {
            this.walkLeft();
        }
        else if (this.cursors.right.isDown) {
            this.walkRight();
        }
        else {
            this.sprite.setVelocityX(0);
            this.sprite.play('charidle', true);
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
