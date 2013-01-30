//creates enemy objects, to be finished later
function enemy_init() {
	var i = 0;
    var type = "";
	while (i < platform.length) {
		if (platform[i].y < 390) { //tihs is just so it doesnt spawn on base platform which is annoying
			enemy_list.push(new Enemy(platform[i].x, platform[i].y, platform[i].width, i));
		}
		i += 2;
	}
}

function enemy2_init() {
    var i = 1;
    while (i < platform.length) {
        if (platform[i].y < 390) {
            enemy2_list.push(new Enemy2(platform[i].x, platform[i].y, platform[i].width, i));
        }
        i += 2;
    }
}

function enemy_fire() {
    var i =0;
    
    while (i < enemy2_list.length) {
        enemy = enemy2_list[i];
        if ((Math.abs(enemy.x - player.x) < canvas.width)
            && (Math.abs(enemy.y - player.y) < canvas.height/2)) {
                if (++enemy.lastFired > enemy2_fire_rate) {
                    enemy_projectile.push(new Enemy_projectile(i));
                    enemy.lastFired = 0;
                }
            }
        i++;
    }
}


function update_enemies(e_list) {
	var i = 0;
	var plat;
	var enemy;
	while (i < e_list.length) {
		enemy = e_list[i];
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
			if (enemy.si === 10 && enemy.vx > 0)
				enemy.si = 5;
			else if (enemy.si === 5 && enemy.vx < 0)
				enemy.si = 0;
				
		}
	i++;
	}
}

function detect_projectile_collision_enemy() {
    var i = 0;
	var j;
	var k;
	var detected = false;
	while (i < enemy_projectile.length) {
		j = 0;
		while (j < platform.length && (detected === false)) {
			if (detect_collision(enemy_projectile[i], platform[j])) {
				detected = true;
				handle_projectile_platform_collision(i,j, enemy_projectile);
			}
			j++;
		}
        if ((detected === false) && ((enemy_projectile[i].x < 0) 
            || (enemy_projectile[i].x + enemy_projectile[i].width > canvas.width)))
            {
            explosion.push(new Explosion(enemy_projectile[i].x, enemy_projectile[i].y));
            enemy_projectile.splice(i,1);
            detected = true;
        }
        if ((detected === false))
        {
            if (detect_collision(enemy_projectile[i], player)) {
                explosion.push(new Explosion(enemy_projectile[i].x, enemy_projectile[i].y));
                enemy_projectile.splice(i,1);
                detected = true;
                death_flag = true;
            }
        }
        k = 0;
        if ((detected === false) && (k < projectile.length)) {
            if (detect_collision(enemy_projectile[i], projectile[k])) {
                explosion.push(new Explosion(enemy_projectile[i].x, enemy_projectile[i].y));
                enemy_projectile.splice(i,1);
                projectile.splice(k,1);
                detected = true;
            }
        }
        
    if (detected === false) {
			i++;
		}
		detected = false;
    }

}

function detect_projectile_collision(proj_list) {
	var i = 0;
	var j;
	var k;
	var detected = false;
	while (i < proj_list.length) {
		j = 0;
        //console.log(typeof(proj_list[i]));
		while (j < platform.length && (detected === false)) {
			if (detect_collision(proj_list[i], platform[j])) {
				detected = true;
				handle_projectile_platform_collision(i,j, proj_list);
			}
			j++;
		}
        if ((detected === false) && ((proj_list[i].x < 0) 
            || (proj_list[i].x + proj_list[i].width > canvas.width)))
            {
            explosion.push(new Explosion(proj_list[i].x, proj_list[i].y));
            proj_list.splice(i,1);
            detected = true;
        }
		k = 0;
		while (detected === false && (k < enemy_list.length)) {
			if (detect_collision(proj_list[i], enemy_list[k])) {
				detected = true;
				handle_projectile_enemy_collision(i,k, proj_list);
			}
			k++;
		}
        k = 0;
		while (detected === false && (k < enemy2_list.length)) {
			if (detect_collision(proj_list[i], enemy2_list[k])) {
				detected = true;
				handle_projectile_enemy2_collision(i,k, proj_list);
			}
			k++;
		}
		if (detected === false) {
			i++;
		}
		detected = false;
	}
}

function handle_projectile_enemy_collision(i,k, proj_list) {
	handle_projectile_platform_collision(i,k, proj_list); //placeholder code
	//currently this is identical, but we might want different behavior in the future
	
	enemy_list.splice(k,1);
}

function handle_projectile_enemy2_collision(i,k, proj_list) {
	handle_projectile_platform_collision(i,k, proj_list); //placeholder code
	//currently this is identical, but we might want different behavior in the future
	
	enemy2_list.splice(k,1);
}

function handle_projectile_platform_collision(i,j, proj_list) {
	explosion.push(new Explosion(proj_list[i].x, proj_list[i].y));
	proj_list.splice(i,1);
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

//this function is what sets everything in motion
function init() {
	canvas.addEventListener('keyup', onKeyUp, false);
	canvas.addEventListener('keydown', onKeyDown, false);
	canvas.addEventListener('mousedown', onMouseDown, false);
	canvas.addEventListener('mousemove', onMouseMove, false);
	enemy_list = [];
    enemy2_list = [];
    enemy_projectile = [];
	projectile = [];
	explosion = [];
	platform = [];
	bkg_img.src = "lava_background.png";
	lava_init(); //initializes lava attributes and animation
	player_init(); //initializes player attributes
	cannon_init();
	platform_init(); //creates platform objects. For now, is hardcoded, perhaps add randomization later
	enemy_init();
    enemy2_init();
	level_end_init();
	r_y = 0;
	death_flag = false;
	victory_flag = false;
	canvas.setAttribute('tabindex','0');
	canvas.focus();

	intervalId = setInterval(update, timerDelay); //starts the timer
}

//initializes lava attributes
function lava_init() {
	lava.y = 500;
	lava.vy = -.05; //rate of lava flow
	lava.img = new Image();
	lava.img.src = "lava1.png";

	lava.anim_x = [0,0,0,0,0,0,0,0];
	lava.anim_y = [0,0,0,0,0,0,0,0];
	lava.sx = [0, 0, 195, 290, 290, 0, 0, 290];
	lava.sy = [0, 160, 148, 235, 235, 160, 160, 235];
	lava.sWidth = [120, 60, 40, 65, 65, 60, 60, 65];
	lava.sHeight = [60, 10, 25, 7, 7, 10, 10, 7];
	lava.sdelay = [0,0,0,0,0,0,0,0];
	lava.smax = 20;
}

//initializes player attributes
//Sprite movement is based on an index into the arrays of src img info needed to draw the image. 
function player_init() {
	player.vx = 0;
	player.vy = 0;
	player.x = 0;
	player.y = 360;

	player.width_min = 24; //slightly smaller than actual img width to account for player not actually appearing to "collide" with enemy 
	player.height = 40;
	
	player.img = new Image();
	player.img.src = "megaman_run.png";
	
	player.ri = 0; //running index to determine which sprite is drawn in movement
	player.rright = 5; //right movements are sprites 0-5
	player.rleft = 11; //left movements are sprites 6-11
	player.rdelay = 0; //determines when next sprite is drawn
	player.rdelay_max = 5; //delays sprite image change so movement looks less choppy. TODO: make this a function of velocity	
	//source img x, y coordinates and width/height
	player.rx = [0,160,360,480,360,160, 480,290,160,0,160,290];
	player.ry = [0, 180];
	player.rWidth = [150,180,110,150,120,190, 150,180,110,150,110,180];
	player.rHeight = [170, 170];
	
	player.i = 0;
}

//initializes cannon attributes
function cannon_init() {
	cannon.x = player.x+player.width-10; //subtract a little so the hand is actually holding it
	cannon.y = player.y + r_y+(player.height/3);
	cannon.width = 40;
	cannon.height = 20;
	cannon.angle = Math.atan2(y_diff,x_diff);
	cannon.img = new Image();
	cannon.img.src = "gun.png";
	cannon.sx = [0,120];
	cannon.sy = [0,0];
	cannon.sWidth = [113,30];
	cannon.sHeight = [35,35];
	cannon.i = 0;
    cannon.hoz_adj = 4.5;
}

function level_end_init() {
    var plat = platform[platform.length-1];
    plat.vx = 0;
	level_end.x = plat.x + 35;
	level_end.y = plat.y - 50; //where is this supposed to be?!?!
	level_end.width = 30;
	level_end.height = 45;
	level_end.img = new Image();
	level_end.img.src = "9_door.jpg";
}

//creates our platform objects, hardcoded as of now
function platform_init() {
	platform.push(new Platform(0, 400, 400, 0, 0));
		var plat_num = 0;
		var plat_y = 400;
		var plat_x = Math.floor(Math.random()*300);
		while (plat_num < 10) {
			var next_plat_y = Math.floor(Math.random()*35) + 50;
			plat_y -= next_plat_y;
            horiz = Math.min(canvas.width - (plat_x + 200), Math.min(plat_x, Math.random() * 300));
            if (horiz < 5) {
                horiz = 0;
            }
			platform.push(new Platform(plat_x, plat_y, 100, horiz, 0));
			var next_plat_x = Math.floor(Math.random()*150);
			if(plat_num % 2 === 1)
				next_plat_x += 150;
			plat_x = next_plat_x;
			if (plat_x > 300 || plat_x < 0)
				plat_x = Math.floor(Math.random()*200) + Math.floor(Math.random()*100);
			plat_num++;
		}
}

//equivalent of onTimer. this is what we do every "tick".
//Currently code is rather complicated and maybe should be
//separated into helper functions.
function update() {
	var i = 0; //just a variable for traversing indices
	
	//movement is done indirectly by giving a player acceleration.
	//note you can only accelerate
	//moving left only (player.ri: 6-11)
    if (key_pressed_left && player.vy === 0) {
		if (player.ri <= (player.rright)) //changing direction from right to left
			player.ri = (player.rright); //
		if (player.rdelay !== player.rdelay_max) 
			player.rdelay++;
		else {
			player.rdelay = 0; //reset delay
			player.ri++; //draw next sprite
			if (player.ri === (player.rleft+1)) //last left sprite so reset to first left sprite
				player.ri = (player.rright+1);
		}
		
		player.vx -= 0.08;
		//player.vx = Math.max(player.vx - .06, -1 * max_speed);
	}
	//moving right only (player.ri: 0-5)
    if (key_pressed_right && player.vy === 0) {
		if (player.ri > player.rright) //changing direction from left to right
			player.ri = 0;
		if (player.rdelay !== player.rdelay_max)
			player.rdelay++;
		else {
			player.rdelay = 0; //reset delay
			player.ri++; //draw next sprite
			if (player.ri === (player.rright+1)) //last right sprite so reset to first right sprite
				player.ri = 0;
		}
		
		player.vx += 0.08;
		//player.vx = Math.min(player.vx + .06, max_speed);
    }
	
	if (player.vy < 0 && key_pressed_left) {
		player.ri = 7;
	}
	else if (player.vy < 0 && key_pressed_right) {
		player.ri = 1;
	}
	player.width = (player.rWidth[player.ri]/player.rWidth[0])*player.width_min;
	player.x += player.vx + platform[player.i].vx;
	player.y += player.vy + platform[player.i].vy;
	update_platforms();
	if (Math.abs(player.vy) >= 2*gravity) {
        player.vx += platform[player.i].vx;
		player.i = 0;
	}
	//gives constant accleration downwards
	player.vy += gravity;
	//player.vy = Math.min(player.vy + gravity, free_fall_speed);
	
	//make sure player is inside the canvas
	check_inbounds();
	
	//check collisions with platforms
	player_platform_collision_handler();
	
	//check if player hits level end
	victory_collision_handler();

	if (!invinc_flag) {
		player_enemy_collision_handler();
	}

	//friction
	if (player.vy === 0) {
		player.vx -= (player.vx * 0.045);
	}
	lava.y += lava.vy;
	if (lava.y <= player.y + player.height) {
		death_flag = true;
	}
	var temp = 0;
	while (temp < enemy_list.length) {
		if (lava.y <= enemy_list[temp].y + enemy_list[temp].height) {
			enemy_list.splice(temp,1);
		}
		temp++;
	}
	update_enemies(enemy_list);
    update_enemies(enemy2_list);
    enemy_fire();
	update_cannon();
	update_projectiles(projectile);
	update_projectiles(enemy_projectile);
	detect_projectile_collision(projectile);
	detect_projectile_collision_enemy();
	//redraw the board
	if (lastFired <= fireRate) {
		lastFired++;
	}
	
	if (player.y + r_y < threshold_up) {
		r_y++;
	}
	else if (player.y + r_y > threshold_down) {
		r_y -= 3;
	}
	draw();
	if(game_state === 0) {
		clearInterval(intervalId);
		title_img.src = "title.jpg";
		ctx.fillStyle = "black";
		ctx.fillRect(0,0,400,500);
		ctx.drawImage(title_img,0,0,400,200);
		ctx.strokeStyle = "white";
		ctx.strokeRect(115,240,170,50);
		ctx.strokeRect(115,300,170,50);
		ctx.strokeRect(115,360,170,50);
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
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
		ctx.fillText("Stage",200,200);
		ctx.fillText("Cleared!",200,270);
		ctx.font = "30px Arial";
		ctx.fillText("Click anywhere to continue",200,350);
		game_state++;
	}
	if (death_flag) {
		clearInterval(intervalId);
		ctx.fillStyle = "rgba(255,255,255,0.5)";
		ctx.fillRect(0,0,400,500);
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.font = "60px Arial";
		ctx.textAlign = "center";
		ctx.fillText("G A M E",200,200);
		ctx.fillText("O V E R",200,270);
		ctx.font = "30px Arial";
		ctx.fillText("Press 'r' to restart",200,350);
	}
	if (game_state === 3) {
		clearInterval(intervalId);
		ctx.fillRect(0,0,400,500);
		ctx.fillStyle = "white";
		ctx.font = "60px Arial";
		ctx.textAlign = "center";
		ctx.fillText("GAME BEAT",200,200);
	}
}

function update_cannon() {
	if (key_pressed_right) {
		cannon.si = 0; //right gun sprite
        cannon.hoz_adj = 4.5;
		//cannon.x = player.x+player.width-10; //subtract a little so player hand is "holding" gun
	}
	else if (key_pressed_left) {
		cannon.si = 1; //left gun sprite
		cannon.hoz_adj = -4.5;
        //cannon.x = player.x+10;
	}
	cannon.y = player.y + r_y +(player.height/2);
	cannon.angle = Math.atan2(y_diff,x_diff);
}

function update_platforms() {
	var i =0;
	var plat;
	while (i < platform.length) {
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
/*
function update_enemies() {
	var i = 0;
	var plat;
	var enemy;
	while (i < enemy_list.length) {
		enemy = enemy_list[i];
		plat = platform[enemy.i];
		//going left, turn right
		if (enemy.x <= plat.x + 5) {
			enemy.vx = Math.abs(enemy.vx);
			enemy.si = enemy.sright+1;
		}
		//going right, turn left
		else if (enemy.x + enemy.width >= plat.x + plat.width - 5) {
			enemy.vx = -Math.abs(enemy.vx);
			enemy.si = 0;
		}
		
		enemy.x += enemy.vx + plat.vx;
		enemy.y = plat.y - enemy.height;
		if (enemy.sdelay !== enemy.smax)
			enemy.sdelay++;
		else {
			enemy.sdelay = 0;
			enemy.si++;
			//moving right and last right sprite so reset to first right sprite
			if (enemy.si > (enemy.sleft) && enemy.vx > 0)
				enemy.si = (enemy.sright+1);
			//moving left and last left sprite so reset to first left sprite
			else if (enemy.si > (enemy.sright) && enemy.vx < 0)
				enemy.si = 0;
		}
	i++;
	}
}*/

function player_enemy_collision_handler() {
	var i = 0;
	while (i < enemy_list.length) {
		if (detect_collision(player, enemy_list[i])) {
			death_flag = true;
			break;
		}
		i++;
	}
    i = 0;
    while (i < enemy2_list.length) {
        if (detect_collision(player, enemy2_list[i])) {
            death_flag = true;
            break;
        }
        i++;
    }
}

function update_projectiles(proj_list) {
	var i = 0;
	while (i < proj_list.length) {
		//PERHAPS NOT NEEDED
		if (proj_list[i].time === 200) {
			proj_list.shift();
			continue;
		}
		proj_list[i].x += proj_list[i].vx;
		proj_list[i].y += proj_list[i].vy;
        //console.log(proj_list[i].x, proj_list[i].y);
        ctx.fill
		proj_list[i].time += 1;
		i++;
	}
}
function player_platform_collision_handler() {
	var i = 0;
	while (i < platform.length) {
			if (detect_collision(player, platform[i])) { //okay cool we hit a platform.
				//now have to determine which direction we're hitting it from.
				/*Note that you can't just undo the change in position
				because that might leave a small gap between
				the two objects instead of having them touch like you'd expect.*/
				//colliding sets velocity to 0 and position accordingly.
                
				if (player.x - player.vx + platform[i].vx + player.width <= platform[i].x) {
					player.x = platform[i].x - player.width;
					player.vx = 0;
                    if (platform[i].vx < 0 ) {
                        player.x += platform[i].vx;
                        player.vx = platform[i].vx;
                    }
				} else if (player.x - player.vx + platform[i].vx >= platform[i].x + platform[i].width) {
						player.x = platform[i].x + platform[i].width;
						player.vx = 0;
                        if (platform[i].vx > 0) {
                            player.x += platform[i].vx;
                            player.vx = platform[i].vx;
                        }
				} if (player.y - player.vy + player.height + platform[i].vy <= platform[i].y) {
					player.y = platform[i].y - player.height;
					player.vy = 0;
					player.i = i;
                    if (platform[i].vy < 0) {
                        player.y += platform[i].vy;
                        player.vy = platform[i].vy;
                    }
                    //player.vx += platform[i].vx;
				} else if (player.y - player.vy + platform[i].vy >= platform[i].y + platform[i].height) {
					player.y = player.y - player.vy;//platform[i].y + platform[i].height;
					player.vy = 0;
                    if (platform[i].vy > 0) {
                        player.y += platform[i].vy;
                        player.vy = platform[i].vy;
                    }
				}
			}
			i++;
		}
}

//if the player hits level_end then he passes the stage
function victory_collision_handler() {
	if(detect_collision(player, level_end))
		victory_flag = true;
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
	ctx.clearRect(0,0,canvas.width,canvas.height);
	
	//draw the background
	ctx.drawImage(bkg_img, 0, 0, bkg_img.width, bkg_img.height, 0, 0, canvas.width, canvas.height);
	
	//draw the platforms
	while (i < platform.length) {
		ctx.drawImage(platform[i].img, platform[i].sx, platform[i].sy, platform[i].sWidth, platform[i].sHeight, platform[i].x, platform[i].y + r_y, platform[i].width, platform[i].height);
		i++;
	}

	//draw the lava
	ctx.fillStyle = "red";
	ctx.fillRect(0, lava.y + r_y, canvas.width, canvas.height - lava.y);
	for (var li = 0; li < lava.sx.length; li++) {
		var ran = Math.random();
		var ranx = Math.random()*canvas.width;
		var rany = canvas.height-Math.random()*(canvas.height-lava.y);
		
		if (lava.sdelay[li] > 0) {
			lava.sdelay[li]++;
			ctx.drawImage(lava.img, lava.sx[li], lava.sy[li], lava.sWidth[li], lava.sHeight[li], 
				lava.anim_x[li], lava.anim_y[li]+r_y, lava.sWidth[li], lava.sHeight[li]);
		}
		else if (ran > 0.5 && (lava.y < (canvas.height - lava.sHeight[li]))) {
			lava.sdelay[li]++;
			ctx.drawImage(lava.img, lava.sx[li], lava.sy[li], lava.sWidth[li], lava.sHeight[li], 
				ranx, rany+r_y, lava.sWidth[li], lava.sHeight[li]);
			lava.anim_x[li] = ranx;
			lava.anim_y[li] = rany;
			
		}
		if (lava.sdelay[li] === lava.smax)
			lava.sdelay[li] = 0;
	}

	//draw the player
	ctx.drawImage(player.img, player.rx[player.ri], player.ry[Math.floor((player.ri+1)/7)], 
					player.rWidth[player.ri], 170, player.x, player.y + r_y, player.width, player.height);
					
	//draw the cannon
	ctx.save();
	ctx.translate(player.x + cannon.hoz_adj, cannon.y);
    if (cannon.si === 0) {
        ctx.rotate(cannon.angle);
    } else {
        ctx.rotate(-cannon.angle);
    }
	ctx.translate(-player.x + cannon.hoz_adj, -cannon.y - r_y);
	ctx.drawImage(cannon.img, cannon.sx[cannon.si], cannon.sy[cannon.si], 
				cannon.sWidth[cannon.si], cannon.sHeight[cannon.si], 
				player.x + cannon.hoz_adj, cannon.y + r_y, cannon.width, cannon.height);
	//ctx.fillRect(cannon.x, cannon.y + r_y, cannon.width, cannon.height);
	ctx.restore();
	
	
	//draw the level end
	ctx.drawImage(level_end.img,level_end.x,level_end.y+r_y,level_end.width,level_end.height);

	//draw projectiles and explosions
	i = 0;
	while (i < projectile.length) {
		//ctx.fillRect(projectile[i].x, projectile[i].y, projectile_width, projectile_height);
		var ei = projectile[i].si;
		ctx.drawImage(projectile[i].img, projectile[i].sx[ei], projectile[i].sy[ei], projectile[i].sWidth[ei], projectile[i].sHeight[ei], projectile[i].x, projectile[i].y + r_y, projectile[i].width, projectile[i].height);
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
		var ei = explosion[i].si;
		ctx.drawImage(explosion[i].img, explosion[i].sx[ei], explosion[i].sy[ei], explosion[i].sWidth[ei], explosion[i].sHeight[ei], explosion[i].x - explosion[i].width/2, explosion[i].y - explosion[i].height/2 + r_y, explosion[i].width, explosion[i].height);
		//ctx.fillRect(explosion[i].x - explosion[i].width/2, explosion[i].y - explosion[i].height/2 + r_y, explosion[i].width, explosion[i].height);
		explosion[i].time +=1;
		if (explosion[i].time === explosion_timeout) {
			explosion.splice(i,1);
		}
		else {
			i++;
		}
	}
	
	//draw the enemies
	i = 0;
	while (i < enemy_list.length) {
		var si = enemy_list[i].si
		ctx.drawImage(enemy_list[i].img, enemy_list[i].sx[si], 0, 
					enemy_list[i].sWidth[si], 50, enemy_list[i].x, enemy_list[i].y + r_y, enemy_list[i].width, enemy_list[i].height);
		//ctx.fillRect(enemy_list[i].x, enemy_list[i].y + r_y, enemy_list[i].width, enemy_list[i].height);
		i++;
	}
    i = 0;
    ctx.fillStyle = 'blue';
    while (i < enemy2_list.length) {
		var si = enemy_list[i].si
		ctx.drawImage(enemy2_list[i].img, enemy2_list[i].sx[si], 0, 
					enemy2_list[i].sWidth[si], 50, enemy2_list[i].x, enemy2_list[i].y + r_y, enemy2_list[i].width, enemy2_list[i].height);
        //ctx.fillRect(enemy2_list[i].x, enemy2_list[i].y + r_y, enemy2_list[i].width, enemy2_list[i].height);
        i++;
    }
    i = 0;
    ctx.fillStyle = 'red';
    while (i < enemy_projectile.length) {
        //ctx.fillRect(enemy_projectile[i].x, enemy_projectile[i].y + r_y, enemy_projectile.width, enemy_projectile.height);
        ctx.fillRect(enemy_projectile[i].x, enemy_projectile[i].y + r_y, enemy_projectile[i].width, enemy_projectile[i].height);
        //alert(enemy_projectile[i].x + " " + enemy_projectile[i].y);
        i++;
    }
}
init();