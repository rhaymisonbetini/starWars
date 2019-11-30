(function () {
	//canvas
	let cnv = document.querySelector('canvas');
	//contexto de renderização 2d
	let ctx = cnv.getContext('2d');

	let sprites = [];
	let assetsToLoad = [];
	let missiles = [];
	let aliens = [];
	let messages = [];

	let alienFrequency = 100;
	let alienTimer = 0;

	//naves
	let defender = new Sprite(0, 0, 30, 50, 185, 450);
	sprites.push(defender);

	//Mensangem inicial
	let startMessage = new ObjectMessage(cnv.height / 2, "PRESS ENTER", "#fff");
	messages.push(startMessage);

	let pauseMessage = new ObjectMessage(cnv.height/2, "PAUSED", "#F00")
	pauseMessage.visible = false;
	messages.push(pauseMessage);


	//imagem
	let img = new Image();
	img.addEventListener('load', loadHandler, false);
	img.src = "img/img.png";
	assetsToLoad.push(img);
	//contador de recursos
	let loadedAssets = 0;


	//entradas
	let LEFT = 37, RIGHT = 39, ENTER = 13, SPACE = 32;

	//ações
	let mvLeft = mvRight = shoot = spaceIsDown = false;

	//estados do jogo
	let LOADING = 0, PLAYING = 1, PAUSED = 2, OVER = 3;
	let gameState = LOADING;

	//listeners
	window.addEventListener('keydown', function (e) {
		let key = e.keyCode;
		switch (key) {
			case LEFT:
				mvLeft = true;
				break;
			case RIGHT:
				mvRight = true;
				break;
			case SPACE:
				if (!spaceIsDown) {
					shoot = true;
					spaceIsDown = true;
				}
				break;
		}
	}, false);

	window.addEventListener('keyup', function (e) {
		let key = e.keyCode;
		switch (key) {
			case LEFT:
				mvLeft = false;
				break;
			case RIGHT:
				mvRight = false;
				break;
			case ENTER:
				if (gameState !== PLAYING) {
					gameState = PLAYING;
					startMessage.visible = false;
					pauseMessage.visible = false;
				} else {
					gameState = PAUSED;
					pauseMessage.visible = true;
				}
				break;
			case SPACE:
				spaceIsDown = false;
		}
	}, false);



	function loadHandler() {
		loadedAssets++;
		if (loadedAssets === assetsToLoad.length) {
			img.removeEventListener('load', loadHandler, false);

			gameState = PAUSED;
		}
	}

	function loop() {
		requestAnimationFrame(loop, cnv);
		switch (gameState) {
			case LOADING:
				console.log('LOADING...');
				break;
			case PLAYING:
				update();
				break;
		}
		render();
	}

	function update() {
		if (mvLeft && !mvRight) defender.vx = -5;
		if (mvRight && !mvLeft) defender.vx = 5;
		if (!mvLeft && !mvRight) defender.vx = 0;
		if (shoot) {
			fireMissile();
			shoot = false;
		}
		defender.x = Math.max(0, Math.min(cnv.width - defender.width, defender.x + defender.vx));

		for (let i in missiles) {
			let missile = missiles[i];
			missile.y += missile.vy;
			if (missile.y < -missile.height) {
				removeObjects(missile, missiles);
				removeObjects(missile, sprites);
				i--;
			}
		}

		alienTimer++;

		if (alienTimer === alienFrequency) {
			makeAlien();
			alienTimer = 0;
			if (alienFrequency > 2) {
				alienFrequency--;
			}
		}

		for (let i in aliens) {
			let alien = aliens[i];
			if (alien.state !== alien.EXPLODED) {
				alien.y += alien.vy;
				if (alien.state === alien.CRAZY) {
					if (alien.x > cnv.width - alien.width || alien.x < 0) {
						alien.vx *= -1;
					}
					alien.x += alien.vx;
				}
			}

			if (alien.y > cnv.height + alien.height) {
				gameState = OVER;
			}

			for (let j in missiles) {
				let missile = missiles[j];
				if (collide(missile, alien) && alien.state !== alien.EXPLODED) {
					destroyAlien(alien);

					removeObjects(missile, missiles);
					removeObjects(missile, sprites);
					j--;
				}
			}
		}
	}
	function fireMissile() {
		let missile = new Sprite(136, 12, 8, 13, defender.centerX() - 4, defender.y - 13);
		missile.vy = -8;
		sprites.push(missile);
		missiles.push(missile);
	}

	function makeAlien() {
		let alienPosition = (Math.floor(Math.random() * 8)) * 50;

		let alien = new Alien(30, 0, 50, 50, alienPosition, -50);
		alien.vy = 1;

		if (Math.floor(Math.random() * 11) > 7) {
			alien.state = alien.CRAZY;
			alien.vx = 2;
		}

		if (Math.floor(Math.random() * 11) > 5) {
			alien.vy = 2;
		}

		sprites.push(alien);
		aliens.push(alien);
	}

	function destroyAlien(alien) {
		alien.state = alien.EXPLODED;
		alien.explode();
		setTimeout(function () {
			removeObjects(alien, aliens);
			removeObjects(alien, sprites);
		}, 400);
	}

	function removeObjects(objectToRemove, array) {
		let i = array.indexOf(objectToRemove);
		if (i !== -1) {
			array.splice(i, 1);
		}
	}

	function render() {
		ctx.clearRect(0, 0, cnv.width, cnv.height);
		if (sprites.length !== 0) {
			for (let i in sprites) {
				let spr = sprites[i];
				ctx.drawImage(img, spr.sourceX, spr.sourceY, spr.width, spr.height, Math.floor(spr.x), Math.floor(spr.y), spr.width, spr.height);
			}
		}

		//renderização de textos
		if (messages.length !== 0) {
			for (let j in messages) {
				let msg = messages[j];
				if (msg.visible) {
					ctx.font = msg.font;
					ctx.fillStyle = msg.color;
					ctx.textBaseline = msg.baseline;
					msg.x = (cnv.width - 310);
					ctx.fillText(msg.text, msg.x, msg.y);
				}
			}
		}
	}

	loop();



	//metodo de rolagem de tela
	const bg = document.getElementById('bg');
	let position = 0;
	setInterval( () => {
		bg.style.backgroundPositionY =  position + 'px';
		position += 5;
	},100)
	

}());
