connector() {
	const socket = io('http://localhost:4242'); // Укажите ваш сервер
	const gameStateDiv = document.getElementById('gameState');
	const gameLinkDiv = document.getElementById('gameLink');
	let roomIdLoc = null;

	// Функция для получения значения `roomId` из URL
	const getRoomIdFromUrl = () => {
		const params = new URLSearchParams(window.location.search);
		return params.get('roomId');
	};

	// Создание игры
	// Если игрок первый, то создаем игру
	if(this.currentPlayer === 'primary') {
		socket.emit('createGame', ({ roomId }) => {
			roomIdLoc = roomId;
			gameLinkDiv.textContent = `Game Link: ${window.location.origin}?roomId=${roomId}`;
		});
	} else {
		// Если игрок второй, то присоединяемся к игре
		roomIdLoc = getRoomIdFromUrl();
		socket.emit('joinGame', roomIdLoc, (response) => {
			if (response.error) {
				console.error(response.error);
			} else {
				console.log('Joined game successfully!');
				window.history.replaceState(null, null, `?roomId=${roomIdLoc}`);
			}
		});
	}

	// Обновление состояния игры
	socket.on('updateState', (gameState) => {
		gameStateDiv.textContent = `Game State: ${JSON.stringify(gameState, null, 2)}`;
	});

	// Обработка обновлений комнаты
	socket.on('roomUpdate', (room) => {
		console.log('Room updated:', room);
	});

	// Обработка начала игры
	socket.on('gameStart', (gameState) => {
		console.log('Game started:', gameState);
		this.ui.primaryPlayer.score = gameState.primePlayerScore;
		this.ui.secondaryPlayer.score = gameState.secondaryPlayerScore;
		_this.setScore();
		gameStateDiv.textContent = `Game State: ${JSON.stringify(gameState, null, 2)}`;
	});

	// Событие для отправки хода игрока
	const makeMove = (action) => {
		if (!roomIdLoc) {
			alert('You are not in a room!');
			return;
		}

		const move = {
			playerId: socket.id,  // ID игрока
			action,               // Действие игрока (например, "drawCard" или "playCard")
		};

		socket.emit('makeMove', { roomIdLoc, move }); // Отправляем ход на сервер
		console.log('Move sent:', move);
	};

	// Пример интерфейса для хода игрока
	const moveButton = document.createElement('button');
	moveButton.textContent = 'Make Move';
	moveButton.addEventListener('click', () => {
		makeMove({
			currentPlayer: this.currentPlayer,
			action: 'k',
		});
	});
	document.body.appendChild(moveButton);
}