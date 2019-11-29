var Sprite = function(sourceX, sourceY, width, height, x, y){
    this.sourceX = sourceX;
    this.sourceY = sourceY;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
}

Sprite.prototype.centerX = () => {
    return this.x + (this.width / 2);
}

Sprite.prototype.centerY = () => {
    return this.y + (this.height / 2);
}

Sprite.prototype.halfWidht = () => {
    return this.width / 2;
}

Sprite.prototype.halfHeight = () => {
    return this.height / 2;
}