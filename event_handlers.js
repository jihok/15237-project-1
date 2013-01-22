function onKeyDown(event) {
	//going left
    if (event.keyCode === 37) {
        key_pressed_left = true;
    }
	//going right
	else if (event.keyCode === 39) {
		key_pressed_right = true;
	}
	else if (event.keyCode === 82) {
		clearInterval(intervalId);
		init();
	}
	else if (event.keyCode === 73) {
		alert("toggled invincibility");
		invinc_flag = !invinc_flag;
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
	else if (event.keyCode === 38 && (player.vy === 0 || player.vy === .05)) {
		player.vy -= 3;
	}
	
	//now that i think about it there'd be a better way to do this by 
	//changing the speed directly in update and having this simply 
	//set a boolean
	//but fuck it this works very well for now
}

function onKeyUp(event) {
	if (event.keyCode === 37) {
		key_pressed_left = false;
	}
	else if (event.keyCode === 39) {
		key_pressed_right = false;
	}
}

function onMouseDown(event) {
	if (lastFired > fireRate) {
		var x = event.pageX - canvas.offsetLeft
		var y = event.pageY - canvas.offsetTop - r_y;
		var i = projectile.push(new Projectile(x,y)) - 1;
		player.vx -= recoil*(projectile[i].vx);
		player.vy -= recoil*(projectile[i].vy);
		lastFired = 0;
	}
}