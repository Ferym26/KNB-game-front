import { Sprite, Texture, Container, Graphics } from "pixi.js";

export class Tile {
	constructor(opt) {
		this.playerInstance = opt.playerInstance;
		this.type = opt.type;
		this.size = opt.size;
		this.isAction = opt.isAction;
		this.x = opt.x;
		this.y = opt.y;
		
		this.tile = new Container();
		this.rect = new Graphics();
		this.icon = new Sprite(Texture.from('/images/b-image.png'));

		this.setType(this.type);
		this.draw();

		if (this.isAction) {
			this.tile.interactive = true;
			this.tile.on('click', this.handleClick.bind(this));
		}
	}

	handleClick() {
		this.playerInstance.handleTileClick(this);
	}

	setType(type) {
		if(type === 'k') {
			this.icon.texture = Texture.from('/images/k-image.png');
		}
		if(type === 'n') {
			this.icon.texture = Texture.from('/images/n-image.png');
		}
		if(type === 'b') {
			this.icon.texture = Texture.from('/images/b-image.png');
		}
	}

	draw() {
		if (this.isAction) {
			this.rect.fill('gray');
			this.rect.rect(0, 0, this.size, this.size);
			this.rect.fill();
			this.rect.x = this.x;
			this.rect.y = this.y;
			this.rect.width = this.size;
			this.rect.height = this.size;

			this.icon.width = 70;
			this.icon.height = 70;
			this.icon.x = this.x + 5;
			this.icon.y = this.y + 5;
		} else {
			this.icon.width = 260;
			this.icon.height = 260;
			this.icon.x = this.x;
			this.icon.y = this.y;
		}

		this.tile.addChild(this.rect);
		this.tile.addChild(this.icon);

		this.playerInstance.playerContainer.addChild(this.tile);
	}
}