var projectile_height = 10;
var projectile_width = 10;
var projectile_speed = 4;
var explosion_diameter = 20;

//Platform constructor. x is leftmost point. 
function Platform(x, y, width) { 
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = platform_height;
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