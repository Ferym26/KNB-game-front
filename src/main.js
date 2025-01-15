import { Application, Container, Assets, Sprite, Texture, Graphics } from "pixi.js";


import { assetsLoader } from './utils/assetsLoader.js';
import { Player } from './components/Player.js';
import { ConnectorService } from './services/connectorService.js';

import './styles/style.css';

class KNBgame {
	constructor() {
		this.app = new Application();
		this.scene = new Container();

		this.gameState = 'pending'; // pending, started, finished

		this.fieldWidth = 760;
		this.fieldHeight = 280;
		this.fieldBGColor = '#ccc';

		this.currentPlayer = null; // primary, secondary
		this.primaryPlayerInstance = null;
		this.secondaryPlayerInstance = null;

		this.ui = {
			primaryPlayer: {
				container: document.querySelector('.js_primary-player'),
				score: null,
			},
			secondaryPlayer: {
				container: document.querySelector('.js_secondary-player'),
				score: null,
			},
		};

		this.connectorService = null;
	}

	async initView() {
		await this.app.init({
			width: this.fieldWidth,
			height: this.fieldHeight,
			backgroundColor: this.fieldBGColor,
			antialias: true,
		})
		document.querySelector('.canvas-container').appendChild(this.app.canvas);

		this.app.stage.addChild(this.scene);
	}

	checkCurrentPlayer() {
		const params = new URLSearchParams(window.location.search);
		const roomId = params.get('roomId');
		roomId ? this.currentPlayer = 'secondary' : this.currentPlayer = 'primary';
	}

	drawPlayers() {
		this.primaryPlayerInstance = new Player({
			scene: this.scene,
			type: 'primary',
			connectorService: this.connectorService,
		});

		this.secondaryPlayerInstance = new Player({
			scene: this.scene,
			type: 'secondary',
			connectorService: this.connectorService,
		});
	}

	draw() {
		assetsLoader.load()
			.then(() => {
				console.log('Assets loaded');
				this.drawPlayers();
			})
			.catch((error) => {
				console.error(error);
			});
	}

	setScore() {
		this.ui.primaryPlayer.container.textContent = this.ui.primaryPlayer.score;
		this.ui.secondaryPlayer.container.textContent = this.ui.secondaryPlayer.score;
	}

	connectorInit() {
		this.connectorService = new ConnectorService({
			currentPlayer: this.currentPlayer,
			ui: this.ui,
		});
	}

	connectorCreateGame() {
		this.connectorService.createGame();
		this.connectorService.onEvent("gameStart", (data) => {
			this.ui.primaryPlayer.score = data.primePlayerScore;
			this.ui.secondaryPlayer.score = data.secondaryPlayerScore;
			this.setScore();
		});

		// получение обновленных данных после хода
		this.connectorService.onEvent("updateState", (data) => {
			console.log(data);
			this.ui.primaryPlayer.score = data.primePlayerScore;
			this.ui.secondaryPlayer.score = data.secondaryPlayerScore;
			this.setScore();
		});
	}

	init() {
		this.initView();

		this.checkCurrentPlayer();
		this.connectorInit();
		this.connectorCreateGame();

		this.draw();
	}
}

const game = new KNBgame();
game.init();