import { io } from 'socket.io-client';

import { Ui } from '../components/Ui.js';

// singleton
export class ConnectorService {
	constructor(params) {
		this.currentPlayer = params.currentPlayer;

		this.uiInstance = new Ui();

		this.socket = io('http://localhost:4242'); // Укажите ваш сервер
		this.roomIdLoc = null;
	}

	// Функция для получения значения `roomId` из URL
	#getRoomIdFromUrl() {
		const params = new URLSearchParams(window.location.search);
		return params.get('roomId');
	};

	// Создание игры
	createGame() {
		// Если игрок первый, то создаем игру
		if(this.currentPlayer === 'primary') {
			this.socket.emit('createGame', ({ roomId }) => {
				this.roomIdLoc = roomId;

				this.uiInstance.createShareLink(roomId);
			});
		} else {
			// Если игрок второй, то присоединяемся к игре
			this.roomIdLoc = this.#getRoomIdFromUrl();
			this.socket.emit('joinGame', this.roomIdLoc, (response) => {
				if (response.error) {
					console.error(response.error);
				} else {
					console.log('Joined game successfully!');
					window.history.replaceState(null, null, `?roomId=${this.roomIdLoc}`);
				}
			});
		}
	};

	makeMove(action) {
		if (!this.roomIdLoc) {
			console.error('You are not in a room!');
			return;
		}

		const move = {
			playerId: this.socket.id,  // ID игрока
			action,               // Действие игрока (например, "drawCard" или "playCard")
		};

		this.socket.emit('makeMove', { 
			roomIdLoc: this.roomIdLoc,
			move
		}); // Отправляем ход на сервер
	};

	onEvent(event, handler) {
		this.socket.on(event, handler);
	}

	sendEvent(event, data) {
		this.socket.emit(event, data);
	}
}
