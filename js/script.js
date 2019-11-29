(() => {
    //canvas
    var cnv = document.querySelector('canvas');

    //render contex
    var ctx = cnv.getContext('2d');

    //resourses of the game
    let sprites = [];
    let assetsToLoad = [];

    let background = new Sprite(0, 56, 400, 500, 0, 0);
    // sprites.push(background);

    let defender = new Sprite(0, 0, 30, 50, 185, 450);
    sprites.push(defender);

    let img = new Image();
    img.addEventListener('load', loadHandler, false);
    img.src = "img/img.png";
    assetsToLoad.push(img);

    let loadedAssets = 0;

    //inputs
    const LEFT = 37, RIGHT = 39, ENTER = 13, SPACE = 32

    //directions

    let mvLeft = mvRight = false;

    //game states

    let LOADING = 0;
    let PLAYING = 1;
    let PAUSED = 2;
    let OVER = 3;

    let gameState = LOADING;

    //listeners 

    window.addEventListener('keydown', (e) => {
        let key = e.keyCode;
        switch (key) {
            case LEFT:
                mvLeft = true;
                break;
            case RIGHT:
                mvRight = true;
                break;
        }

    }, false);

    window.addEventListener('keyup', (e) => {
        let key = e.keyCode;
        switch (key) {
            case LEFT:
                mvLeft = false;
                break;
            case RIGHT:
                mvRight = false;
                break;
            case ENTER:
                gameState != PLAYING ? gameState = PLAYING : gameState = PAUSED;
        }
    }, false);

    //functions

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
                break;
            case PLAYING:
                update();
                break;
        }
        render();
    }

    function update() {
        if (mvLeft && !mvRight) defender.vx = -5;
        if (mvRight && !mvLeft) defender.vx = +5;
        if (!mvLeft && !mvRight) defender.vx = 0;
        defender.x = Math.max(0, Math.min(cnv.width - defender.width, defender.x + defender.vx));
    }

    function render() {
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        if (sprites.length !== 0) {
            for (let i in sprites) {
                var spr = sprites[i];
                ctx.drawImage(img, spr.sourceX, spr.sourceY, spr.width, spr.height, Math.floor(spr.x), Math.floor(spr.y), spr.width, spr.height);
            }
        }
    }

    loop();
})();