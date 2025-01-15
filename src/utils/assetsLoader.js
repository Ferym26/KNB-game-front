import { Assets } from "pixi.js";

const assets = [
	'/images/k-image.png',
	'/images/n-image.png',
	'/images/b-image.png',
];

export class assetsLoader {
	static async load() {
		await Assets.load(assets);
	}
}
