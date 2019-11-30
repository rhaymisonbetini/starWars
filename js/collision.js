function colide(sprite1, sprite2) {
    var hit = false;

    //calculando distancia entre 2 sprites pelo centro
    var vetorX = sprite1.centerX() - sprite2.centerX();
    var vetorY = sprite1.centerY() - sprite2.centerY();

    // guarda soma das metades dos sprites na largura e altura
    var sumHalfWidth = sprite1.halfWidth() + sprite2.halfWidth();
    var sumHalfHeight = sprite1.halfHeight() + sprite2.halfHeight();

    //verificando se houve colisao

    if (Math.abs(vetorX) < sumHalfWidth && Math.abs(vetorY) < sumHalfHeight) {
        hit = true;
    }

    return hit;

}

