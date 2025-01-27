export class Ui {
	constructor(opt) {
		this.currentPlayer = null; // TODO: это лучще сделать через глобальный стейт
		this.primaryPlayer = {
			container: document.querySelector('.js_primary-player'),
			score: null,
		};
		this.secondaryPlayer = {
			container: document.querySelector('.js_secondary-player'),
			score: null,
		};
		this.gameStateTitle = document.querySelector('.js_game-state');
		this.shareContainer = document.querySelector('.js_ui-share');
	}

	setScore(player, val) {
		if(player === 'primary') {
			this.primaryPlayer.score = val;
		} else {
			this.secondaryPlayer.score = val;
		}
	}

	renderScore(player) {
		if(player === 'primary') {
			this.primaryPlayer.container.textContent = this.primaryPlayer.score;
			this.secondaryPlayer.container.textContent = this.secondaryPlayer.score;
		}
		if(player === 'secondary') {
			this.primaryPlayer.container.textContent = this.secondaryPlayer.score;
			this.secondaryPlayer.container.textContent = this.primaryPlayer.score;
		}
	}

	createShareLink(roomId) {
		const gameLink = document.createElement('a');
		const gameUrl = `${window.location.origin}?roomId=${roomId}`;
		gameLink.href = gameUrl;
		gameLink.textContent = 'Share this link';
		document.querySelector('.js_game-share-link').appendChild(gameLink);

		// this.copyUrlToClipBoard(gameUrl);
	}

	copyUrlToClipBoard(url) {
		navigator.clipboard.writeText(url)
			.then(() => {
				console.log('Link copied to clipboard');
			})
			.catch(err => {
				console.error('Failed to copy link: ', err);
			});
	}

	setGameStateText(state) {
		this.gameStateTitle.textContent = state;
	}

	setCurrentPlayer(type) {
		this.currentPlayer = type;

		this.showActionBlock(); // TODO: это следует вызывать в отдельном более общем методе
	}

	toggleShareContainer(action) {
		if(action === 'hide') {
			this.shareContainer.classList.add('is-hidden');
		}
		if(action === 'show') {
			this.shareContainer.classList.remove('is-hidden');
		}
	}

	showActionBlock() {
		if(this.currentPlayer === 'primary') {
			this.toggleShareContainer('show');
		}
	}
}