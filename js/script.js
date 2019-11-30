(() => {
    //canvas
    var cnv = document.querySelector('canvas');

    //render contex
    var ctx = cnv.getContext('2d');


    //resourses of the game
    var sprites = [];
    var assetsToLoad = [];
    var missiles = [];
    var aliens = [];

    //utilitarios de controle
    var alienFrequency = 100;
    var alienTimer = 0;

    //criando o defender
    var defender = new Sprite(0, 0, 30, 50, 185, 450);
    sprites.push(defender);

    var img = new Image();
    img.addEventListener('load', loadHandler, false);
    img.src = "img/img.png";
    assetsToLoad.push(img);

    var loadedAssets = 0;

    //inputs
    const LEFT = 37, RIGHT = 39, ENTER = 13, SPACE = 32

    //directions
    var mvLeft = mvRight = shoot = spaceIsDown = false;


    //game states

    var LOADING = 0;
    var PLAYING = 1;
    var PAUSED = 2;
    var OVER = 3;

    var gameState = LOADING;

    //listeners 

    window.addEventListener('keydown', (e) => { // funcao que verifica evento de pressão na tecla
        var key = e.keyCode;
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

    window.addEventListener('keyup', (e) => { // funcação que verifica evento de tecla levantada
        var key = e.keyCode;
        switch (key) {
            case LEFT:
                mvLeft = false;
                break;
            case RIGHT:
                mvRight = false;
                break;
            case ENTER:
                gameState != PLAYING ? gameState = PLAYING : gameState = PAUSED;
                break;
            case SPACE:
                spaceIsDown = false;
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

  

    function loop() { // metodo que fica realizando o looping eterno com o update
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

     //nesse método são realizados as atualizaçoes de movimento na tela
     function update() {
        if (mvLeft && !mvRight) defender.vx = -5;
        if (mvRight && !mvLeft) defender.vx = +5;
        if (!mvLeft && !mvRight) defender.vx = 0;
        defender.x = Math.max(0, Math.min(cnv.width - defender.width, defender.x + defender.vx));

        if (shoot) {
            fireMissile();
            shoot = false;
        }

        //atualizar possição dos misseis
        for (let i in missiles) {
            let missil = missiles[i];
            missil.y += missil.vy;
            if (missil.y < -missil.height) {
                removeObjects(missil, missiles);
                removeObjects(missil, sprites);
                i--;
            }
        }

        //encremento do alienTimer
        alienTimer++;

        //criando alien quando o timer == frequencia
        if (alienTimer == alienFrequency) {
            makeAlien();
            alienTimer = 0;
            if (alienFrequency > 2) {
                alienFrequency--;
            }
        }

        //movimento a posição dos aliens
        for (let i in aliens) {
            let alien = aliens[i];
            if (alien.state !== alien.EXPLODED) {
                alien.y += alien.vy;

                if (alien.state === alien.CRAZY) {//Se o alien receber o estasdo CRAZY ele andaram em 'zig-zag'
                    if (alien.x > cnv.width - alien.width || alien.x < 0) {
                        alien.vx *= -1; // revertendo o deslocamento quando chegar na borda
                    }
                    alien.x += alien.vx;
                }
            }
            //conferindo se alguma nave passou por pela defender, se passou o jogo morre ( pode ser implementando diminuição de pontos futuramente )
            if (alien.y > cnv.height + alien.height) {
                gameState = OVER;
            }
            //nesse momento eu verificado se algum aliente esta colidindo com algum missil
            for (let j in missiles) {
                let missile = missiles[i]
                if (colide(missile, alien) && alien.state !== alien.EXPLODED) {
                    alienDestroy(alien);
                    removeObjects(missile, missiles);
                    removeObjects(missile, sprites);
                    j--;
                    
                }
            }

        }

    }


    //metodo de criação dos misseis
    function fireMissile() {
        var x = defender.centerX();
        var missile = new Sprite(136, 12, 8, 13, x - 4, defender.y - 13); // criando os misseis na tela
        missile.vy = -8;
        sprites.push(missile);
        missiles.push(missile);
    }

    //metodo de criação de aliens
    function makeAlien() {
        let alienPosition = (Math.floor(Math.random() * 8)) * 50; // Valor do canvas /alienes em 8 colunas 
        var alien = new Alien(30, 0, 50, 50, alienPosition, -50); // criando em -50 pra criar o alien fora da tela
        alien.vy = 1;

        if (Math.floor(Math.random() * 11) > 7) {
            alien.state = alien.CRAZY;
            alien.vx = 2;
        }

        if (Math.floor(Math.random() * 11) > 5) {
            alien.vy = 2;
        }

        aliens.push(alien);
        sprites.push(alien);
    }

    function alienDestroy(alien) {
        alien.state = alien.EXPLODED;
        alien.explode();
        setTimeout(() => {
            removeObjects(alien, aliens);
            removeObjects(alien, sprites);
        }, 1000);
    }


    //remove missei do array para não ocupar spaço na memória
    function removeObjects(objectToRemove, array) {
        let i = array.indexOf(objectToRemove);
        if (i !== -1) {
            array.splice(i, 1);
        }
    }

    function render() { // metodo para renderizar todos os sprites na tela em um looping infinito
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        if (sprites.length !== 0) {
            for (var i in sprites) {
                var spr = sprites[i];
                ctx.drawImage(img, spr.sourceX, spr.sourceY, spr.width, spr.height, Math.floor(spr.x), Math.floor(spr.y), spr.width, spr.height);
            }
        }
    }


    loop();
})();

