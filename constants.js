var player = new Object();
var fireRate = 29;
var lastFired = fireRate + 1;
var lava = new Object();
var platform = []; //list of platform objects
var enemy_list = [];
var enemy2_list = [];
var projectile = [];
var enemy_projectile = [];
var explosion = [];
var bkg_img = new Image();
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
var recoil = 0.18; //this is how much velocity the rocket imparts on the player in the opposite direction.
var threshold_up = 80;
var threshold_down = 360;
var r_y = 0;
var death_flag = false;
var victory_flag = false;
var invinc_flag = false;

var story_flag = false;
var control_flag = false;
var credit_flag = false;

var cannon = new Object();
var x_diff = 0;
var y_diff = 0;

var level_end = new Object();
var game_state = 0;
var title_img = new Image();
//var power_jump = false;

//enemy constants
var enemy_height = 40;
var enemy_width = 30;
var enemy_speed = 0.3;

//enemy type 2 constants
var enemy2_height = 10;
var enemy2_width = 10;
var enemy2_speed = .22;
var enemy2_fire_rate = 150;

var enemy_projectile_speed = 2;
