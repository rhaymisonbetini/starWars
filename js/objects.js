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

Sprite.prototype.centerX = function(){
	return this.x + (this.width/2);
}

Sprite.prototype.centerY = function(){
	return this.y + (this.height/2);
}

Sprite.prototype.halfWidth = function(){
	return this.width/2;
}

Sprite.prototype.halfHeight = function(){
	return this.height/2;
}

//classe aliente que recebe a herança de sprites
var Alien = function(sourceX, sourceY, width, height, x, y){
    Sprite.call(this,sourceX, sourceY, width, height, x, y); // aqui eu to chamando o proprio sprite e seus atributos como parametro;

    //atributos da classe alien propriamente dita
    this.NORMAL = 1;
    this.EXPLODED = 2;
    this.CRAZY = 3;
    this.state = this.NORMAL;
    this.mvStyle = this.NORMAL;

}

Alien.prototype = Object.create(Sprite.prototype); // recebento todos os metodo como prototipo

Alien.prototype.explode = function(){ // metodo que subistitui o sprite quando ele explode na tela
    this.sourceX = 80;
    this.width = this.height = 56; 
}