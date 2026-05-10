// HUD Scene — runs in parallel on top of Level.
// Data is shared via the Phaser scene registry (set by Level each frame).

export default class Hud extends Phaser.Scene {
    constructor() {
        super({ key: 'Hud' });
    }

    create() {
        this.hudText = [];
        this.addFancyText(150, 30);  // [0] player health
        this.addFancyText(500, 30);  // [1] npc health
        this.addFancyText(150, 5);   // [2] objective label
        this.addFancyText(500, 5);   // [3] guard status
        this.hudText[2].text = 'Get the payroll';
        this.hudText[3].text = 'Guards: idle';
    }

    addFancyText(x, y) {
        var text = this.add.text(x, y, '', { font: '20px Arial Black', fill: '#fff' });
        text.setStroke('#00f', 5);
        text.setShadow(2, 2, '#333333', 2, true, true);
        text.setDepth(100);
        this.hudText.push(text);
    }

    update() {
        const playerHealth    = this.registry.get('playerHealth');
        const playerMaxHealth = this.registry.get('playerMaxHealth');
        const npcHealth       = this.registry.get('npcHealth');
        const npcMaxHealth    = this.registry.get('npcMaxHealth');

        if (playerHealth !== undefined) {
            this.hudText[0].text = '❤️ ' + playerHealth + '/' + playerMaxHealth;
        }
        if (npcHealth !== undefined) {
            this.hudText[1].text = '' + npcHealth + '/' + npcMaxHealth;
        }
    }
}