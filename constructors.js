var projectile_height = 10;
var projectile_width = 10;
var projectile_speed = 4;
var explosion_diameter = 20;

//Platform constructor. x is leftmost point. 
function Platform(x, y, width, horizontal, vertical) {
	horizontal = 0;
	vertical = 0;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = platform_height;
	this.left = x - horizontal;
	this.right = x + width + horizontal;
	this.up = y - vertical;
	this.down = y + this.height + vertical;
	this.vx = horizontal/50;
	this.vy = vertical/50;
}

function Enemy(x, y, width, i) {
	this.x = x + 5 + Math.floor(Math.random()*(width - enemy_width - 5));
	this.y = y - enemy_height;
	this.left = x;
	this.right = x+width;
	if (Math.random() > .5) {
		this.vx = enemy_speed;
	}
	else {
		this.vx = -enemy_speed;
	}
	this.vy = 0;
	this.width = enemy_width;
	this.height = enemy_height;
	this.img = new Image();
	this.img.src = "enemy1.png";
	this.sx = [0,40,80,115,150, 490,525,565,605,640];
	this.sy = [0];
	this.sWidth = [35,30,30,30,30, 30,35,30,30,30];
	this.sHeight = [50];
	this.si = 0;
	this.sdelay = 0;
	this.i = i
}

function Explosion(x,y) {
	this.x = x;
	this.y = y;
	this.width = explosion_diameter;
	this.height = explosion_diameter;
	this.time = 0;
}

//Projectile constructor. 
function Projectile(x, y) {
	var center_x = player.x + (player.width/2) - (projectile_width/2);
	var center_y = player.y + (player.height/2) - (projectile_height/2);
	var hypotenuse = Math.sqrt( Math.pow(x - center_x,2) + Math.pow(y - center_y,2));
	this.vx = projectile_speed * ((x - center_x)/hypotenuse);
	this.vy = projectile_speed * ((y - center_y)/hypotenuse);
	this.x = center_x - (projectile_width/2);
	this.y = center_y - (projectile_height/2);
	this.time = 0;
	this.height = projectile_height;
	this.width = projectile_width;
}