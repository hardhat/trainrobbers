
//import Phaser from './dist/phaser-arcade-physics.min.js'
import MainMenu from './mainmenu.js'
import Level from './level.js'

const config = {
	type: Phaser.AUTO,
	//pixelArt: true,
	width: 768,
	height: 576,
	render: {
		pixelArt: true, // no blur on sprites
		// roundPixels: true // no blur on geometry (recommended for 2D)
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
			//debug: true
		}
	},
	scene: [MainMenu, Level]
}

const game = new Phaser.Game(config);
