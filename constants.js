var player = new Object(); 
var fireRate = 19;
var lastFired = fireRate + 1;
var lava = new Object();
lava.y = 500;
lava.vy =  -.02;
var platform = []; //list of platform objects
var enemy_list = [];
var projectile = [];
var explosion = [];
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var intervalId;
var timerDelay = 10; 
var explosion_timeout = 50;
var key_pressed_left = false; //not necessarily needed to initialize here, since undeclared is falsey
							  //but i dislike falsey
var key_pressed_right = false; 
var gravity = .05; //rate at which things fall
var platform_height = 4; //constant thickness of all platforms, since no need to be variable

//var free_fall_speed = 20; //max speed at which you can fall (free fall)
						  //commented out because i realized that
						  //due to how our game works, if you fall far enough
						  //for this to kick in you probably died. 
						  //Might be useful later

//var max_speed = 100; //unused. I found that a multiplicative reduction in speed
					   //via friction serves well enough for limiting your speed
					   //because acceleration is linear. 
					   
					   //However if we want more slide with same top speed, or higher speed
					   //with same amount of slide, then we should rework how friction works
					   //(probably change it to a constant + multiplicative factor of speed)
					   //in combination with a max 

var projectile_height = 10;
var projectile_width = 10;
var projectile_speed = 4;
var explosion_diameter = 20;
var recoil = .3; //this is how much velocity the rocket imparts on the player in the opposite direction. 
var threshold = 60;
var r_y = 0;