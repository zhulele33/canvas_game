// status  当前游戏状态  1：失败  2：胜利  3:暂停
var status = 3;var startBtn;
// 获取开始和暂停dom

// pauseBtn = 
// 这是我们的玩家要躲避的敌人
/**
 * @param x:敌人的横坐标 y：敌人的纵坐标  s:敌人的速度
 *
 * */
var Enemy = function(x,y,s) {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多
    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.s = s;
    this.atom = 83; //设置纵坐标单位
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    // 每次移动都仅是横坐标在移动
    // 第一次dt为undefined 
    if(!dt) dt = 0;
    this.x = this.x + dt * this.s;
    // console.log(this.x,ctx.width)
    if(this.x >= ctx.canvas.width){
        this.x = -10;
        this.reset();
    }
    this.render();

    // 判断是否装上玩家
    if(Math.abs(this.x - player.x) < 101/2 &&this.y == player.y){
        status = 1;
    }
    if(player.y == player.initY){
        status = 2;
    }
};
Enemy.prototype.reset = function () {
    var randomY = parseInt(Math.random() * (4 - 1) + 1,10) * this.atom -20;
    var s = Math.random() * 1000 ;
    this.x = -10;
    this.s = s;
    this.y = randomY;
}

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    // console.log(this.x,this.y)
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function(role,x,y){
    this.role = role;
    this.x = x;
    this.y = y;

    this.initY = -20; // 纵坐标起始位置为 20
    this.atom = 83; //设置纵坐标单位
    this.atomX = 101; //设置横坐标单位
    this.rolesImages = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/char-cat-girl.png'
    ];
}
/**
 * @param
 * 更新 x，y 并判断是否与敌人相撞*/
Player.prototype.update = function () {
    //  这里为什么就停止不了
    if(status == 1){
        status = 3;
        pauseBtn = document.getElementById("pause");
        pauseBtn.click();
        if(confirm("哈哈！你输啦啊,重新开始吧")){
            startBtn = document.getElementById("start");
            this.reset();
            startBtn.click();
        }else{
            this.reset();
        }

    }else if(status == 2){
        startBtn = document.getElementById("start");
        if(confirm("恭喜你，过关！")){
            /*this.reset();
            status = 0;*/
            startBtn.click();
        }
    }
        //判断是否与敌人相撞
        // 两者横坐标相差不到一个格子的距离 并且纵坐标相等的时候 定为碰撞
      /*  for(var i=0;i<allEnemies.length;i++){
            if(this.x!==-20 && Math.abs(allEnemies[i].x - this.x) < 101/2 && allEnemies[i].y == this.y){
                status = 1; break;
                /!*if(confirm("哈哈！你输啦啊,重新开始吧")){
                    window.location.reload();
                    break;
                }*!/
            }
        }*/

        //判断是否已经过河  河岸的 纵坐标值为 initY
       /* if(this.y == this.initY){
            status = 2
           /!* if(confirm("恭喜你，过关！")){
                window.location.reload();
            }*!/
        }*/

}
Player.prototype.render = function(){
    if(!this.role) this.role = 0;
    ctx.drawImage(Resources.get(this.rolesImages[this.role]), this.x, this.y);
}
/*
* direction 方向
* */
Player.prototype.handleInput = function(direction){
    var afterTranslate;
    switch (direction){
        case 'up' :
            afterTranslate = this.y-this.atom;
            if(afterTranslate>= this.initY && afterTranslate<=  this.atom*5 +this.initY){
                this.y = afterTranslate;
            }
            break;
        case 'down':
            afterTranslate = this.y + this.atom;
            console.log(afterTranslate,this.atom*5 +this.initY)
            if(afterTranslate>= this.initY && afterTranslate<= this.atom*5 +this.initY){
                this.y = afterTranslate;
            }
            break;
        case 'left':
            afterTranslate = this.x - this.atomX;
            if(afterTranslate>= 0 && afterTranslate< ctx.canvas.width) {
                this.x = afterTranslate;
            }
            break;
        case 'right':
            afterTranslate = this.x + this.atomX;
            if(afterTranslate>= 0 && afterTranslate< ctx.canvas.width) {
                this.x = afterTranslate;
            }
            break;
        default:
            alert("请传入正确的参数");
    }
    this.render();
}
Player.prototype.reset = function(){
    this.x = 0;
    this.y = this.atom * 4+this.initY;
}
// 现在实例化你的所有对象
// 把玩家对象放进一个叫 player 的变量里面
var player = new Player();
player.reset();
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
var allEnemies = [];
var initEnemy = function(){
    var e = new Enemy();
    e.reset();
    return e;
}
for(var i=0;i<3;i++){
    allEnemies.push(initEnemy());
}


// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
