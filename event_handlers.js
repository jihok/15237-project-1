function onKeyDown(event) {
	if(game_state > 0) {
		//going left
		if (event.keyCode === 65) {
			key_pressed_left = true;
		}
		//going right
		else if (event.keyCode === 68) {
			key_pressed_right = true;
		}
		else if (event.keyCode === 82 && death_flag === true) {
			clearInterval(intervalId);
			init();
		}

		//below is for cheating purposes
		else if (event.keyCode === 73) {
			alert("toggled invincibility");
			invinc_flag = !invinc_flag;
		}
        else if (event.keyCode === 37) {
            player.x -= 5;
        }
        else if (event.keyCode === 38) {
            player.y -= 5;
        }
        else if (event.keyCode === 39) {
            player.x += 5;
        }
        else if (event.keyCode === 40) {
            player.y += 5;
        }
        else if (event.keyCode === 71) {
            gravity = 0;
            alert('no gravity');
        }
		//makes the player jump. The velocity check makes it
		//so you cannot jump in mid air, only while resting.
		
		//the extra .05 check is because of the constant ticking gravity.
		//since if you jump exactly in sync as gravity is constantly
		//updating you will not be able to jump, unless we allow for
		//jumps at .05 velocity.
		
		//Dw, it's thoroughly tested, double jumping is not possible
		//since because of float subtraction you will never hit exactly throughout
		//any fall or jump.
		else if (event.keyCode === 87 && (player.vy === 0 || player.vy === 0.05)) {
			player.vy -= 3;
            player.vx += platform[player.i].vx/5;
		}
	}

	//now that i think about it there'd be a better way to do this by
	//changing the speed directly in update and having this simply
	//set a boolean
	//but fuck it this works very well for now

	if(event.keyCode === 49) {
		game_state = 1;
		alert("Level 1");
		clearInterval(intervalId);
		init();
	}
	else if (event.keyCode === 50) {
		game_state = 2;
		alert("Level 2");
		clearInterval(intervalId);
		init();
	}
	else if (event.keyCode === 51) {
		game_state = 3;
		clearInterval(intervalId);
		init();
	}
}

function onKeyUp(event) {
	if (event.keyCode === 65) {
		key_pressed_left = false;
	}
	else if (event.keyCode === 68) {
		key_pressed_right = false;
	}
}

function onMouseDown(event) {
	if (game_state === 0) {
		if (story_flag === false && control_flag === false && credit_flag === false) {
			if(event.pageX >= 125 && event.pageX <= 295) {
				//start
				if(event.pageY >= 250 && event.pageY <= 300) {
					clearInterval(intervalId);
					story_flag = true;
					ctx.fillStyle = "black";
					ctx.fillRect(0,0,400,500);
					ctx.fillStyle = "white";
					ctx.font = "30px Arial";
					ctx.textAlign = "left";
					ctx.fillText("Somehow our favorite hero,",15,50);
					ctx.fillText("Megaman, finds himself",15,80);
					ctx.fillText("in another world. With a",15,110);
					ctx.fillText("broken arm and a new gun,",15,140);
					ctx.fillText("all he can hope is that at",15,170);
					ctx.fillText("the end of this journey,",15,200);
					ctx.fillText("he'll find a way home...",15,230);
					ctx.fillStyle = "grey";
					ctx.fillText("Cheat codes:",15,300);
					ctx.font = "20px Arial";
					ctx.fillText("i = invincibility to enemy collisions",15,320);
					ctx.fillText("1 = advance to level 1",15,340);
					ctx.fillText("2 = advance to level 2",15,360);
					ctx.fillText("3 = beat the game",15,380);
				}

				//controls
				if(event.pageY >= 310 && event.pageY <= 360) {
					clearInterval(intervalId);
					control_flag = true;
					control_img.src = "control.jpg";
					ctx.drawImage(control_img,0,0,400,500);
					ctx.font = "30px Arial";
					ctx.fillText("W = Jump",300,80);
					ctx.fillText("A = Left",300,110);
					ctx.fillText("D = Right",300,140);
					ctx.fillText("Left Click",300,240);
					ctx.fillText("to shoot",300,280);
					ctx.fillText("Utilize your gun's recoil",200,390);
					ctx.fillText(" to double jump or run faster!",200,420);
					ctx.textAlign = "center";
					ctx.font = "20px Arial";
					ctx.fillText("(Click anywhere to return to the title screen)",200,450);
				}

				//credits
				if(event.pageY >= 370 && event.pageY <= 420) {
					clearInterval(intervalId);
					credit_flag = true;
					ctx.fillStyle = "black";
					ctx.fillRect(0,0,400,500);
					ctx.fillStyle = "white";
					ctx.textAlign = "center";
					ctx.font = "40px Arial";
					ctx.fillText("Norbert Chu, nchu",200,200);
					ctx.fillText("Jiho Kim, jihok",200,250);
					ctx.fillText("Deanna Zhu, dzw",200,300);
					ctx.font = "20px Arial";
					ctx.fillText("(Click anywhere to return to the title screen)",200,450);
				}
			}
		}
		else if (story_flag === true) {
			clearInterval(intervalId);
			game_state = 1;
			init();
		}
		else if (control_flag === true) {
			clearInterval(intervalId);
			control_flag = false;
			init();
		}
		else if (credit_flag === true) {
			clearInterval(intervalId);
			credit_flag = false;
			init();
		}
	}
	else {
		if (lastFired > fireRate) {
			var x = event.pageX - canvas.offsetLeft;
			var y = event.pageY - canvas.offsetTop - r_y;
			var i = projectile.push(new Projectile(x,y)) - 1;
			player.vx -= recoil*(projectile[i].vx);
			player.vy -= recoil*(projectile[i].vy);
			lastFired = 0;
		}
		if (victory_flag === true) {
			clearInterval(intervalId);
			init();
		}
	}
}

function onMouseMove(event) {
	var cursor_x = event.pageX;
	var cursor_y = event.pageY;

	//for the cannon rotation angle
	if (cursor_x !== undefined)
		x_diff = cursor_x - cannon.x;
	if (cursor_y !== undefined)
		y_diff = cursor_y - cannon.y;
}