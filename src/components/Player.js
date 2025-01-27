import { Sprite, Texture, Container } from "pixi.js";
import { Tile } from "./Tile.js";

// import { ConnectorService } from '../services/connectorService.js';

const actionTilesData = [
	{
		type: 'k',
		x: 0,
		y: 0,
		size: 80,
	},
	{
		type: 'n',
		x: 0,
		y: 80 + 10,
		size: 80,
	},
	{
		type: 'b',
		x: 0,
		y: 160 + 20,
		size: 80,
	},
];

export class Player {
	constructor(opt) {
		this.scene = opt.scene;
		this.type = opt.type; // primary, secondary
		this.connectorService = opt.connectorService;

		this.playerContainer = new Container();

		this.playerContainer.position.set(10, 10);

		this.actionTiles = [];
		this.resultTile = null;
		this.enemyTile = null;

		this.draw();
	}

	handleTileClick(tile) {
		this.connectorService.makeMove({
			currentPlayer: this.type,
			action: tile.type,
		});
		this.drawResultTile(tile.type);
	}

	drawActionTiles() {
		actionTilesData.forEach((tileData) => {
			const tile = new Tile({
				playerInstance: this,
				type: tileData.type,
				x: tileData.x,
				y: tileData.y,
				size: tileData.size,
				isAction: true,
			});

			this.actionTiles.push(tile);
		});
	}

	drawResultTile(type) {
		this.resultTile = new Tile({
			playerInstance: this,
			type: type,
			x: 90,
			y: 0,
			size: 260,
			isAction: false,
		});
	}

	actionOnMove(data) {
		this.drawEnemyTile(data);
		this.hightlightTileOnMove(data);
	}

	drawEnemyTile(data) {
		const type = this.type === 'primary' ? data.secondaryPlayerMove : data.primaryPlayerMove;

		this.enemyTile = new Tile({
			playerInstance: this,
			type: type,
			x: 400,
			y: 30,
			size: 200,
			isAction: false,
		});
	}

	hightlightTileOnMove(data) {
		const result = data.winner;
		if(this.type === 'primary') {
			switch (result) {
				case 'primary':
					this.resultTile.drawOverlay('green');
					this.enemyTile.drawOverlay('red');
					break;
				case 'secondary':
					this.resultTile.drawOverlay('red');
					this.enemyTile.drawOverlay('green');
					break;
				default:
					break;
			}
		}
		if(this.type === 'secondary') {
			switch (result) {
				case 'primary':
					this.resultTile.drawOverlay('red');
					this.enemyTile.drawOverlay('green');
					break;
				case 'secondary':
					this.resultTile.drawOverlay('green');
					this.enemyTile.drawOverlay('red');
					break;
				default:
					break;
			}
		}
		if(result === 'draw') {
			this.resultTile.drawOverlay('orange');
			this.enemyTile.drawOverlay('orange');
		}
	}

	clearTiles() {
		this.resultTile.toggleIcon('hide');
		this.enemyTile.toggleIcon('hide');
	}

	draw() {
		this.drawActionTiles();

		this.scene.addChild(this.playerContainer);
	}
}

