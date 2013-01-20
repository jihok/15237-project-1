
					   


//this function is what sets everything in motion
function init() {
	canvas.addEventListener('keyup', onKeyUp, false);
	canvas.addEventListener('keydown', onKeyDown, false);
	canvas.addEventListener('mousedown', onMouseDown, false);
	player_init(); //initializes player attributes
	platform_init(); //creates platform objects. For now, is hardcoded, perhaps add randomization later
	canvas.setAttribute('tabindex','0'); 
	canvas.focus();
	intervalId = setInterval(update, timerDelay); //starts the timer
}

//initializes player attributes
function player_init() {
	player.vx = 0; 
	player.vy = 0;
	player.x = 0;
	player.y = 360;
	player.width = 40;
	player.height = 40;
}

//creates our platform objects, hardcoded as of now
function platform_init() {
	platform.push(new Platform(100, 320, 100));
	platform.push(new Platform(0, 260, 100));
	platform.push(new Platform(200, 200, 100));
	platform.push(new Platform(0, 400, 400));
	platform.push(new Platform(80, 140, 100));
	platform.push(new Platform(0, 80, 100));
	platform.push(new Platform(200, 20, 100));
	platform.push(new Platform(80, -20, 100));
}

//creates enemy objects, to be finished later
function enemy_init() {

}

//equivalent of onTimer. this is what we do every "tick". 
//Currently code is rather complicated and maybe should be
//separated into helper functions. 
function update() { 
	var i = 0; //just a variable for traversing indices
	
	//movement is done indirectly by giving a player acceleration. 
	//note you can only accelerate
    if (key_pressed_left && player.vy === 0) {
		player.vx -= .06;
		//player.vx = Math.max(player.vx - .06, -1 * max_speed);
	}
    if (key_pressed_right && player.vy === 0) {
		player.vx += .06;
		//player.vx = Math.min(player.vx + .06, max_speed);
    }
	player.x += player.vx;
	player.y += player.vy;
	
	//gives constant accleration downwards
	player.vy += gravity;
	//player.vy = Math.min(player.vy + gravity, free_fall_speed);
	
	//make sure player is inside the canvas
	check_inbounds();
	
	//check collisions with platforms
	player_platform_collision_handler();
	
	//friction
	if (player.vy === 0) {
		player.vx -= (player.vx * .04)
	}
	lava.y += lava.vy;
	if (lava.y <= player.y + player.height) {
		alert("died");
	}
	update_projectiles();
	detect_projectile_collision();
	//redraw the board
	if (lastFired <= fireRate) {
		lastFired++;
	}
	
	if (player.y + r_y < threshold) {
		r_y++;
	}
	
	draw();
}


function update_projectiles() {
	var i = 0;
	while (i < projectile.length) {
	
		//PERHAPS NOT NEEDED
		if (projectile[i].time === 200) {
			projectile.shift();
			continue;
		}
		projectile[i].x += projectile[i].vx;
		projectile[i].y += projectile[i].vy;
		projectile[i].time += 1;
		i++;
	}
}

function detect_projectile_collision() {
	var i = 0;
	var j;
	var detected = false;
	while (i < projectile.length) {
		j = 0;
		while (j < platform.length && (detected === false)) {
			if (detect_collision(projectile[i], platform[j])) {
				//projectile.splice(i, 1);
				detected = true;
				handle_projectile_collision(i,j);
			}
			j++;
		}
		if (detected === false) {
			i++;
		}
		detected = false; 
	}
}

function handle_projectile_collision(i,j) {
	explosion.push(new Explosion(projectile[i].x, projectile[i].y));
	projectile.splice(i,1);
}
	/*
	if (projectile[i].x - projectile[i].vx + projectile_width <= platform[j].x) {
		explosion.push(new Explosion(platform[j].x - projectile_width, 
		projectile[i].vx = 0;
	} else if (projectile[i].x - projectile[i].vx >= platform[j].x + platform[j].width) {
			projectile[i].x = platform[j].x + platform_width;
			projectile[i].vx = 0;
	} else if (projectile[i].y - projectile[i].vy + projectile_height <= platform[j].y) { 
		projectile[i].y = platform[j].y - projectile_height;
		projectile[i].vy = 0;
	} else  {
		projectile[i].y = platform[j].y + platform[j].height;
		projectile[i].vy = 0;	
	}
}*/

function player_platform_collision_handler() {
	var i = 0;
	while (i < platform.length) {
			if (detect_collision(player, platform[i])) { //okay cool we hit a platform.
			
				//now have to determine which direction we're hitting it from.
				/*Note that you can't just undo the change in position
				because that might leave a small gap between
				the two objects instead of having them touch like you'd expect.*/ 
				//colliding sets velocity to 0 and position accordingly. 
				if (player.x - player.vx + player.width <= platform[i].x) {
					player.x = platform[i].x - player.width;
					player.vx = 0;
				} else if (player.x - player.vx >= platform[i].x + platform[i].width) {
						player.x = platform[i].x + platform[i].width;
						player.vx = 0;
				} else if (player.y - player.vy + player.height <= platform[i].y) { 
					player.y = platform[i].y - player.height;
					player.vy = 0;
				} else  {
					player.y = platform[i].y + platform[i].height;
					player.vy = 0;	
				}
			}
			i++;
		}
}

//for the player, checks to see if you're in the boundaries of the canvas
function check_inbounds() {
	if (player.x < 0) {
		player.vx = 0;
		player.x = 0;
	}
	else if (player.x + player.width > canvas.width) {
		player.vx = 0;
		player.x = canvas.width - player.width;
	}
	/*if (player.y < 0) {
		player.vy = 0;
		player.y = 0;
	}
	else*/ if (player.y + player.height > canvas.height) {
		player.vy = 0;
		player.y = canvas.height - player.height;
	}
}

//detects collisions, returns boolean.
/*General purpose so can be used for any two 
objects with x,y,width,height attributes.*/
function detect_collision(obj1, obj2) {
	if ((obj1.x + obj1.width > obj2.x) && 
		(obj1.x < obj2.x + obj2.width) &&
		(obj1.y + obj1.height > obj2.y) &&
		(obj1.y < obj2.y + obj2.height)) {
			return true;
	}
	return false;
}


//draws our board
function draw() {
	var i = 0;
	var j = 0;
	var k = 0;
	ctx.clearRect(0,0,400,500);
	ctx.fillStyle = "black";
	ctx.fillRect(player.x, player.y + r_y, 40,40);
	while (i < platform.length) {
		ctx.fillRect(platform[i].x, platform[i].y + r_y, platform[i].width, platform[i].height);
		i++;
	}
	ctx.fillStyle = "red";
	ctx.fillRect(0, lava.y + r_y, canvas.width, canvas.height - lava.y);
	ctx.fillRect(player.x, player.y + (player.height/2) + r_y, 40, 2);
	while (j < projectile.length) {
		//ctx.fillRect(projectile[j].x, projectile[j].y, projectile_width, projectile_height);
		ctx.fillRect(projectile[j].x, projectile[j].y + r_y, projectile[j].width, projectile[j].height);
		j++;
	}
	while (k < explosion.length) {
		//The following two lines are identical because width/height is always being assigned to
		//explosion_diameter but for consistency i thought it would be nice s.t. 
		//all our objects have a width and height, and that we always reference it.
		//Same for projectile
	
		//We subtract half of explosion diameter so that the explosion is centered rather than
		//simply sharing the same corner as the projectile.
		
		//ctx.fillRect(explosion[k].x - explosion_diameter/2, explosion[k].y - explosion_diameter/2, explosion_diameter, explosion_diameter);
		ctx.fillRect(explosion[k].x - explosion[k].width/2, explosion[k].y - explosion[k].height/2 + r_y, explosion[k].width, explosion[k].height);
		explosion[k].time +=1;
		if (explosion[k].time === explosion_timeout) {
			explosion.splice(k,1);
		}
		else { 
			k++;
		}
	}
}

init();