15237-project-1
===============
added: platforms. these are simply hardcoded for now. Constructor takes x,y coordinates for upper left corner, and width. 
height is same for all, set at 4

added: player. just a black box, no graphics

added: movement. Player velocity cannot directly be controlled. is accelerated left or right with arrow keys. 
Acceleration is linear. 

added: Friction. slows the player down opoposite of his velocity whenever he is on the ground. 
Friction's effect is multiplicative, thus effectively limiting player speed indirectly. 

added: jumping. player cannot change their left/right velocity while in midair. can only jump while on a platform or on the ground. 
This is done by checking to see if vy is 0 or not. This might seem to imply that smashing the up arrow key would allow you to jump
again at the apex of your jump, but because we're subtracting floating point numbers it is not precise and you will not reach
*exactly* 0 until you hit the ground in which case my collision function manually sets the speed to 0. 

added: collision. player hitting another object (wall or platform) will stop and have their velocity in that direction changed
to 0. Also did this for projectiles, however projectile collision is not as precise. Collision is done by adding velocity to position
every tick, but before we redraw the board we check to see if the new position intersects the position of any other object. If so,
we undo the last change. However, that's not good enough because it might undo too much movement (since it is not one unit of movement
per unit of time), so after detecting a collision and undoing the movement, i find which side it collided and move the player so that
he becomes adjacent to it. I have not done that with projectiles because projectiles, at point of collision, should *explode* rather than
retaining one of either their x or y velocity, which means i'd have to calculate the fractional x/y coordinate which sounded like too much
work. 

added: projectiles. projectiles originate from center of the player currently. they collide with platforms but not with walls. they have a timer
to expire eventually (if you shoot them off the map) but it's long enough you will not notice it practically speaking. There is a maximum
fire rate so you cannot shoot too frequently. 

added: recoil. shooting a projectile will give the player momentum in the opposite direction. this can be used to maneuver in midair or give
an extra bit of height in a jump, although the bonus and fire rate is not enough to stay in the air indefinitely. 

added: lava. just a red rectangle that slowly flows to the top and if it touches the player you die. 

added: auto scrolling screen. If the player gets high enough, the level automatically scrolls upwards. There is no downward scrolling.
Downward scrolling would be easy to implement but not sure if we just want player to die if he drops back down that far. 

to be done: 

Deanna:
	*projectile and lava animations
	*background image
	*dynamic barriers on platforms

Jiho:
	*menu
	*victory
	
Norbert:

*enemy speedup and move towards player

*randomly generated platform method