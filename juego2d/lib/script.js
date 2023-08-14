
var config={
    type: Phaser.AUTO,
    width: 800,
    height:600,
    physics:{
        default:'arcade',
        arcade:{
            gravity:{y:300}, //añadimos la gravedad para tener caida al saltar
            debug: false,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var score = 0;
var scoreText;
var game= new Phaser.Game(config);
var gameOver=false;

function preload(){
    this.load.image('sky','../assets/sky.png'); //cargar imagen, nombre de la imagen, ruta
    this.load.image('platform','../assets/platform.png');
    this.load.image('bomb','../assets/bomb.png');
    this.load.image('star','../assets/star.png');
    this.load.spritesheet('player','../assets/dude.png',{frameWidth: 32, frameHeight: 48}); //nombre pj, ruta, tamaño de cada cara del pj

}

function create(){
    this.add.image(400,300,'sky'); //posicionx,posiciony,nombre img ponemos anchura y altura entre dos para centrarlo
    //colocar las cosas por orden, se superponen
    platform=this.physics.add.staticGroup();
    platform.create(400,568,'platform').setScale(2).refreshBody();
    platform.create(600,400,'platform');
    platform.create(50,250,'platform');
    platform.create(750,220,'platform');
    player= this.physics.add.sprite(100,450,'player'); //cords x de inicio, cords y, personaje 
    player.setCollideWorldBounds(true);
    player.setBounce(0.2);
    //player.setGravityY(300);
    //crear animaciones
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player',{ start: 0, end:3}), //frame de inicio de la imagen al moverse y frame de fin
        frameRate: 10, //velocidad de fotogramas
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [{key: 'player', frame: 4}],
        frameRate: 20, //velocidad de fotogramas
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player',{ start: 5, end:8}), //frame de inicio de la imagen al moverse y frame de fin
        frameRate: 10, //velocidad de fotogramas
        repeat: -1 //repite
    });
    this.physics.add.collider(player, platform);
    cursor=this.input.keyboard.createCursorKeys();
    stars=this.physics.add.group({
        key:'star',
        repeat:11,
        setXY:{ x: 12, y: 0, stepX:70}
    });
    stars.children.iterate(function(child){
        child.setBounceY(Phaser.Math.FloatBetween(0.4,0.8));
    });
    this.physics.add.collider(stars,platform);
    this.physics.add.overlap(player, stars, collectStar, null, true);

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platform);
    this.physics.add.collider(player, bombs, hitBomb, null, this); 

}   
function update(){
    if(gameOver){
        return;
    }
    if(cursor.left.isDown){
        player.setVelocityX(-160);
        player.anims.play('left',true); //animacion, activar o desactivar
    } else if(cursor.right.isDown){
        player.setVelocityX(160);
        player.anims.play('right',true); //animacion, activar o desactivar
    } else{
        player.setVelocityX(0);
        player.anims.play('turn'); //animacion, activar o desactivar
    }
    if(cursor.up.isDown && player.body.touching.down){
        player.setVelocityY(-330);
    }




}
function collectStar(player, star){
    star.disableBody(true,true);
    score += 10;
    scoreText.setText('Score: ' + score);
    if (stars.countActive(true) === 0)
    {
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);
        });
        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);


    }
}
function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}
function saltar(){
    if(player.body.touching.down){
        player.setVelocityY(-330);
    }
}
function izquierda(){
    player.setVelocityX(-160);
    player.anims.play('left',true);
}
function derecha(){
    player.setVelocityX(160);
    player.anims.play('right',true);
}
$(document).ready(function(){

    $(".izq").click(function(){
        izquierda();
    })
    $(".der").click(function(){
        derecha();
    })
    $(".saltar").click(function(){
        saltar();
    })
})