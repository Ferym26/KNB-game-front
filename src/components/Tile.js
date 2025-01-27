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
		this.overlay = new Graphics();
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

	toggleIcon(action) {
		this.overlay.alpha = 0;
		if(action === 'hide') {
			this.icon.alpha = 0;
		}
		if(action === 'show') {
			this.icon.alpha = 1;
		}
	}

	drawOverlay(color) {
		this.overlay.fill(color);
		this.overlay.rect(0, 0, this.size, this.size);
		this.overlay.fill();
		this.overlay.x = this.x;
		this.overlay.y = this.y;
		this.overlay.width = this.size;
		this.overlay.height = this.size;
		this.overlay.alpha = 0.3;

		this.tile.addChild(this.overlay);
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
			this.icon.width = this.size;
			this.icon.height = this.size;
			this.icon.x = this.x;
			this.icon.y = this.y;
		}

		this.tile.addChild(this.rect);
		this.tile.addChild(this.icon);

		this.playerInstance.playerContainer.addChild(this.tile);
	}
}