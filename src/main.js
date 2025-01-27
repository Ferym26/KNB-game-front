import { Application, Container, Assets, Sprite, Texture, Graphics } from "pixi.js";


import { assetsLoader } from './utils/assetsLoader.js';
import { Player } from './components/Player.js';
import { Ui } from './components/Ui.js';
import { ConnectorService } from './services/connectorService.js';

import { gameStateType, gameStateText } from './utils/types.js';

import './styles/style.css';

class KNBgame {
	constructor() {
		this.app = new Application();
		this.scene = new Container();

		this.gameState = gameStateType.pending;

		this.fieldWidth = 760;
		this.fieldHeight = 280;
		this.fieldBGColor = '#ccc';

		this.currentPlayer = null; // primary, secondary
		this.primaryPlayerInstance = null;
		this.secondaryPlayerInstance = null;

		this.uiInstance = new Ui();

		this.connectorService = new ConnectorService({
			currentPlayer: this.currentPlayer,
		});

		this.resetTime = 3000;
	}

	// TODO: доработать сценарий когда после начала игры первый юзер отключается и второй должен стать основным и получить возможность делится линкой

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
			type: this.currentPlayer,
			connectorService: this.connectorService,
		});
	}

	drawScore(data) {
		this.uiInstance.setScore('primary', data.primePlayerScore);
		this.uiInstance.setScore('seconadary', data.secondaryPlayerScore);
		this.uiInstance.renderScore(this.currentPlayer);
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

	connectorInit() {
		this.connectorService = new ConnectorService({
			currentPlayer: this.currentPlayer,
		});
	}

	connectorCreateGame() {
		this.connectorService.createGame();
		this.connectorService.onEvent("gameStart", (data) => {
			this.drawScore(data);
			this.uiInstance.setGameStateText(gameStateText.connected);
		});

		// получение обновленных данных после хода
		this.connectorService.onEvent("updateState", (data) => {
			console.log(data);
			// const move = this.currentPlayer === 'primary' ? data.secondaryPlayerMove : data.primaryPlayerMove;
			this.primaryPlayerInstance.actionOnMove(data);
			// this.primaryPlayerInstance.drawEnemyTile(move);
			// this.primaryPlayerInstance.hightlightTileOnMove(data);
			this.drawScore(data);

			setTimeout(() => {
				this.primaryPlayerInstance.clearTiles();
			}, this.resetTime)
		});

		// получение эвента при выходе из игры второго игрока
		this.connectorService.onEvent("userDisconnect", (data) => {
			console.log(data);
			this.uiInstance.setGameStateText(gameStateText.pending);
			this.drawScore({
				primePlayerScore: '-', // TODO: что-то с этим надо сделать
				secondaryPlayerScore: '-',
			});
		});
	}

	init() {
		this.initView();

		this.checkCurrentPlayer();
		this.connectorInit();
		this.connectorCreateGame();

		this.uiInstance.setCurrentPlayer(this.currentPlayer);
		this.uiInstance.setGameStateText(gameStateText.pending);

		this.draw();
	}
}

const game = new KNBgame();
game.init();