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

		if(this.type === 'primary') {
			this.playerContainer.position.set(10, 10);
		} else {
			this.playerContainer.position.set(380, 10);
		}

		this.actionTiles = [];
		this.resultTile = null;

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

	draw() {
		this.drawActionTiles();

		this.scene.addChild(this.playerContainer);
	}
}

