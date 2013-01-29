//this function is what sets everything in motion
function init() {
	canvas.addEventListener('keyup', onKeyUp, false);
	canvas.addEventListener('keydown', onKeyDown, false);
	canvas.addEventListener('mousedown', onMouseDown, false);
	canvas.addEventListener('mousemove', onMouseMove, false);
	enemy_list = [];
	projectile = [];
	explosion = [];
	platform = [];
	player_init(); //initializes player attributes
	cannon_init();
	platform_init(); //creates platform objects. For now, is hardcoded, perhaps add randomization later
	enemy_init();
	level_end_init();
	lava.y = 500;
	lava.vy = -.05;
	lava.img = new Image();
	lava.img.src = "lava.png";
	lava.sx = [130, 100];
	lava.sy = [690, 660];
	lava.sWidth = [60, 20];
	lava.sHeight = [10, 40];
	lava.si = 0;
	lava.sdelay = 0;
	r_y = 0;
	death_flag = false;
	victory_flag = false;
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
	player.width = 17; //slightly smaller than actual img to account for player not actually "colliding" with enemy
	player.height = 40;
	player.img = new Image();
	player.img.src = "megaman_run.png";
	player.ri = 0; //0-5 for right, 6-11 for left
	player.rundelay = 0; //TODO: make this a function of velocity
	player.runx = [0,150,360,480,360,150, 0,160,280,480,280,160];
	player.runy = [0, 190];
	player.runwidth = [150,190,120,160,120,190, 160,100,190,150,190,100];
	player.runheight = [170, 170];
	/*
	player.sx = 0;
	player.sy = 0;
	player.sWidth = 50;
	player.sHeight = 103;
	*/
	player.i = 0;
	
}

//initializes cannon attributes
function cannon_init() {
	cannon.x = player.x;
	cannon.y = player.y + r_y;
	cannon.width = 10;
	cannon.height = 5;
	cannon.angle = Math.atan2(y_diff,x_diff);
}

function level_end_init() {
	level_end.x = 200;
	level_end.y = 200;
	level_end.width = 30;
	level_end.height = 45;
}

//creates our platform objects, hardcoded as of now
function platform_init() {
	platform.push(new Platform(0, 400, 400, 0, 0));
	platform.push(new Platform(100, 320, 100, 0, 0));
	platform.push(new Platform(0, 260, 100, 0, 0));
	platform.push(new Platform(200, 200, 100, 0, 0));
	platform.push(new Platform(80, 140, 100, 0, 0));
	platform.push(new Platform(0, 80, 100, 0, 0));
	platform.push(new Platform(200, 20, 100, 0, 0));
	platform.push(new Platform(80, -20, 100, 0, 0));
}

//creates enemy objects, to be finished later
function enemy_init() {
	var i = 0;
	while (i < platform.length) {
		if (platform[i].y < 390) { //tihs is just so it doesnt spawn on base platform which is annoying
			enemy_list.push(new Enemy(platform[i].x, platform[i].y, platform[i].width, i));
		}
		i++;
	}
}

//equivalent of onTimer. this is what we do every "tick".
//Currently code is rather complicated and maybe should be
//separated into helper functions.
function update() {
	var i = 0; //just a variable for traversing indices
	
	//movement is done indirectly by giving a player acceleration.
	//note you can only accelerate
    if (key_pressed_left && player.vy === 0) {
		if (player.ri < 6)
			player.ri = 6;
		if (player.rundelay !== 3)
			player.rundelay++;
		else {
			player.rundelay = 0;
			player.ri++;
			//console.log(player.ri, player.rundelay);
			if (player.ri === 12)
				player.ri = 7;
		}
		
		player.vx -= 0.06;
		//player.vx = Math.max(player.vx - .06, -1 * max_speed);
	}
    if (key_pressed_right && player.vy === 0) {
		if (player.ri > 5)
			player.ri = 0;
		if (player.rundelay !== 3)
			player.rundelay++;
		else {
			player.rundelay = 0;
			player.ri++;
			//console.log(player.ri, player.rundelay);
			if (player.ri === 6)
				player.ri = 0;
		}
		
		player.vx += 0.06;
		//player.vx = Math.min(player.vx + .06, max_speed);
    }
	//console.log(platform[0].vx);
	player.x += player.vx + platform[player.i].vx;
	player.y += player.vy + platform[player.i].vy;
	update_platforms();
	if (Math.abs(player.vy) >= 2*gravity) {
		player.i = 0;
	}
	//gives constant accleration downwards
	player.vy += gravity;
	//player.vy = Math.min(player.vy + gravity, free_fall_speed);
	
	//make sure player is inside the canvas
	check_inbounds();
	
	//check collisions with platforms
	player_platform_collision_handler();
	
	victory_collision_handler();

	if (!invinc_flag) {
		player_enemy_collision_handler();
	}
	
	//friction
	if (player.vy === 0) {
		player.vx -= (player.vx * 0.04);
	}
	lava.y += lava.vy;
	if (lava.y <= player.y + player.height) {
		death_flag = true;
	}
	update_projectiles();
	detect_projectile_collision();
	//redraw the board
	if (lastFired <= fireRate) {
		lastFired++;
	}
	
	if (player.y + r_y < threshold_up) {
		r_y++;
	}
	else if (player.y + r_y > threshold_down) {
		r_y--;
	}
	update_enemies();
	update_cannon();
	draw();
	if(game_state === 0) {
		clearInterval(intervalId);
		ctx.fillStyle = "black";
		ctx.fillRect(0,0,400,500);
		ctx.strokeStyle = "white";
		ctx.strokeRect(115,240,170,50);
		ctx.strokeRect(115,300,170,50);
		ctx.strokeRect(115,360,170,50);
		ctx.fillStyle = "white";
		ctx.font = "60px Arial";
		ctx.textAlign = "center";
		ctx.fillText("Project 1",200,150);
		ctx.font = "40px Arial";
		ctx.fillText("Start",200,280);
		ctx.fillText("Controls",200,340);
		ctx.fillText("Credits",200,400);
	}
	if (victory_flag) {
		clearInterval(intervalId);
		ctx.fillStyle = "rgba(0,0,0,0.5)";
		ctx.fillRect(0,0,400,500);
		ctx.font = "60px Arial";
		ctx.textAlign = "center";
		ctx.fillText("Stage Cleared!",200,200);
		game_state++;
	}
	if (death_flag) {
		clearInterval(intervalId);
		ctx.fillStyle = "rgba(255,255,255,0.9)";
		ctx.fillRect(0,0,400,500);
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.font = "60px Arial";
		ctx.textAlign = "center";
		ctx.fillText("G A M E",200,200);
		ctx.fillText("O V E R",200,270);
		ctx.font = "30px Arial";
		ctx.fillText("Press 'r' to restart",200,350);
	}
}

function update_cannon() {
	cannon.x = player.x;
	cannon.y = player.y + r_y;
	cannon.angle = Math.atan2(y_diff,x_diff);
}

function update_platforms() {
	var i =0;
	var plat;
    console.log("moving platforms");
	while (i < platform.length) {
        console.log("" + i + " is i");
		plat = platform[i];
		plat.x += plat.vx;
		plat.y += plat.vy;
		if (plat.x <= plat.left) {
			plat.vx = Math.abs(plat.vx);
		}
		if (plat.x >= plat.right) {
			plat.vx = -Math.abs(plat.vx);
		}
		if (plat.y + r_y <= plat.up) {
			plat.vy = Math.abs(plat.vy);
		}
		if (plat.y + r_y >= plat.down) {
			plat.vy = -Math.abs(plat.vy);
		}
		i++;
	}
}

function update_enemies() {
	var i = 0;
	var plat;
	var enemy;
	while (i < enemy_list.length) {
		enemy = enemy_list[i];
		plat = platform[enemy.i];
		if (enemy.x <= plat.x + 5) {
			enemy.vx = Math.abs(enemy.vx);
			enemy.si = 5;
		}
		else if (enemy.x + enemy.width >= plat.x + plat.width - 5) {
			enemy.vx = -Math.abs(enemy.vx);
			enemy.si = 0;
		}
		
		enemy.x += enemy.vx + plat.vx;
		enemy.y = plat.y - enemy.height;
		if (enemy.sdelay !== 3)
			enemy.sdelay++;
		else {
			enemy.sdelay = 0;
			enemy.si++;
			//console.log(enemy.si, enemy.sdelay);
			if (enemy.si === 10 && enemy.vx > 0)
				enemy.si = 5;
			else if (enemy.si === 5 && enemy.vx < 0)
				enemy.si = 0;
				
		}
	i++;
	}
}

function player_enemy_collision_handler() {
	var i = 0;
	while (i < enemy_list.length) {
		if (detect_collision(player, enemy_list[i])) {
			death_flag = true;
			break;
		}
		i++;
	}
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
	var k;
	var detected = false;
	while (i < projectile.length) {
		j = 0;
		while (j < platform.length && (detected === false)) {
			if (detect_collision(projectile[i], platform[j])) {
				//projectile.splice(i, 1);
				detected = true;
				handle_projectile_platform_collision(i,j);
			}
			j++;
		}
		k = 0;
		while (k < enemy_list.length && (detected === false)) {
			if (detect_collision(projectile[i], enemy_list[k])) {
				detected = true;
				handle_projectile_enemy_collision(i,k);
				//console.log('supss');
			}
			k++;
		}
		if (detected === false) {
			i++;
		}
		detected = false;
	}
}

function handle_projectile_enemy_collision(i,k) {
	handle_projectile_platform_collision(i,k); //placeholder code
	//currently this is identical, but we might want different behavior in the future
	
	enemy_list.splice(k,1);
}

function handle_projectile_platform_collision(i,j) {
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
					player.i = i;
					//console.log('fml');
				} else  {
					player.y = player.y - player.vy;//platform[i].y + platform[i].height;
					player.vy = 0;
				}
			}
			i++;
		}
}

function victory_collision_handler() {
	if(detect_collision(player, level_end))
		victory_flag = true;
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
	
	ctx.clearRect(0,0,400,500);
	ctx.fillStyle = "black";
		//ctx.fillRect(player.x, player.y + r_y, 40,40);
	while (i < platform.length) {
		ctx.fillRect(platform[i].x, platform[i].y + r_y, platform[i].width, platform[i].height);
		i++;
	}
	//draw the cannon
	ctx.save();
	ctx.translate(cannon.x, cannon.y);
	ctx.rotate(cannon.angle);
	ctx.translate(-cannon.x, -cannon.y - r_y);
	ctx.fillRect(cannon.x, cannon.y + r_y, cannon.width, cannon.height);
	ctx.restore();
	
	//draw the player
	ctx.drawImage(player.img, player.runx[player.ri], player.runy[Math.floor(player.ri/7)], 
					player.runwidth[player.ri], 170, player.x, player.y + r_y, 24, 40);

	ctx.fillStyle = "red";
	console.log(canvas.height);
	ctx.fillRect(0, lava.y + r_y, canvas.width, canvas.height - lava.y);
	if (lava.y < (canvas.height - lava.sHeight[0])) {
		ctx.drawImage(lava.img, lava.sx[0], lava.sy[0], lava.sWidth[0], lava.sHeight[0], 20, lava.y + r_y, lava.sWidth[0], lava.sHeight[0]);
	}
	
	ctx.drawImage(lava.img, lava.sx[1], lava.sy[1], lava.sWidth[1], lava.sHeight[1], 100, lava.y-lava.sHeight[1] + r_y, lava.sWidth[1], lava.sHeight[1]);
	
	//ctx.fillRect(player.x, player.y + (player.height/2) + r_y, 40, 2);
	i = 0;
	while (i < projectile.length) {
		//ctx.fillRect(projectile[i].x, projectile[i].y, projectile_width, projectile_height);
		ctx.fillRect(projectile[i].x, projectile[i].y + r_y, projectile[i].width, projectile[i].height);
		i++;
	}
	i = 0;
	while (i < explosion.length) {
		//The following two lines are identical because width/height is always being assigned to
		//explosion_diameter but for consistency i thought it would be nice s.t.
		//all our objects have a width and height, and that we always reference it.
		//Same for projectile
	
		//We subtract half of explosion diameter so that the explosion is centered rather than
		//simply sharing the same corner as the projectile.
		
		//ctx.fillRect(explosion[i].x - explosion_diameter/2, explosion[i].y - explosion_diameter/2, explosion_diameter, explosion_diameter);
		ctx.fillRect(explosion[i].x - explosion[i].width/2, explosion[i].y - explosion[i].height/2 + r_y, explosion[i].width, explosion[i].height);
		explosion[i].time +=1;
		if (explosion[i].time === explosion_timeout) {
			explosion.splice(i,1);
		}
		else {
			i++;
		}
	}
	
	//draw the enemies
	ctx.fillStyle = "blue";
	i = 0;
	while (i < enemy_list.length) {
		var si = enemy_list[i].si
		ctx.drawImage(enemy_list[i].img, enemy_list[i].sx[si], 0, 
					enemy_list[i].sWidth[si], 50, enemy_list[i].x, enemy_list[i].y + r_y, enemy_list[i].width, enemy_list[i].height);
		//ctx.fillRect(enemy_list[i].x, enemy_list[i].y + r_y, enemy_list[i].width, enemy_list[i].height);
		i++;
	}



	//draw the level end
	ctx.fillRect(level_end.x,level_end.y,level_end.width,level_end.height);
}

init();