/**
 * @author mrdoob / http://mrdoob.com/
 * Small modifications by Sam Trent
 */


 //                *** READ ME !! ***
 //
 //    To add first person controls to your project just
 //    call initPointerLock(), setupControls(), and
 //    updateMovement() in your script. Thats it! You
 //    should be good to go!
 //
 //
 //  Note:
 //
 //    PointerLock does not work properly in Atom's
 //    HTML preview, you will need to open your HTML
 //    file in your browser (just double click it)
 //    and everything should work.
 //
 //

//footsteps
var footStepAudio = new Audio('footstep.mp3');

// loop the sound when ended
footStepAudio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);


 //FOR MOVEMENT (leave these here, don't add to your script)
 var controls;
 var raycaster;
 var objects = [];




 //init controls!! (leave these here, don't add to your script)
 var controlsEnabled = true;
 var moveForward = false;
 var moveBackward = false;
 var moveLeft = false;
 var moveRight = false;
 var canJump = false;
 var isRunning = false;
 var prevTime = performance.now();
 var velocity = new THREE.Vector3();

 /***************************************************
 * initPointerLock()
 *   Call this funciton in the beginning of your script.
 * This will lock in the mouse so that the camera will
 * follow it.
 *
 * NOTICE:
 *   I have commented out the parts here that will
 * display instuctions at the beginning, if you wish
 * to add them, just uncomment everything that says
 * "instructions" or "blocker". HOWEVER, if you do this
 * you will NEED to add some tags to your HTML file
 * or else it will crash, I have provided a template you
 * can copy at the bottom of this file.
 ****************************************************/
initPointerLock = function()
{

	// var instructions = document.getElementById( 'instructions' );
  // var blocker = document.getElementById( 'blocker' );
	// // http://www.html5rocks.com/en/tutorials/pointerlock/intro/
	var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
	if ( havePointerLock ) {
		var element = document.body;
		var pointerlockchange = function ( event ) {
			if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
				controlsEnabled = true;
				controls.enabled = true;
				// blocker.style.display = 'none';
			} else {
				controls.enabled = false;
				blocker.style.display = '-webkit-box';
				blocker.style.display = '-moz-box';
				// blocker.style.display = 'box';
				// instructions.style.display = '';
			}
		};
		var pointerlockerror = function ( event ) {
			//instructions.style.display = '';
		};
		// Hook pointer lock state change events
		document.addEventListener( 'pointerlockchange', pointerlockchange, false );
		document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
		document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
		document.addEventListener( 'pointerlockerror', pointerlockerror, false );
		document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
		document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );
		document.addEventListener( 'click', function ( event ) {
			// instructions.style.display = 'none';
	// 		// Ask the browser to lock the pointer
			element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
			element.requestPointerLock();
		}, false );
	} else {
		// instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
	}
}

/***************************************************
* setupControls()
*   Call this funciton in your scripts "init" function.
* This adds the controls for the keyboard so you can
* walk around with WSAD or arrow keys.
*
* Params - camera
* This is pretty simple, just pass in your scenes "camera"
* object and your good to go!
****************************************************/
 setupControls = function(camera)
 {
	 // RULES FOR CONTORLS
	 controls = new THREE.PointerLockControls( camera );
	 scene.add( controls.getObject() );
	 var onKeyDown = function ( event ) {
		 switch ( event.keyCode ) {
			 case 38: // up
			 case 87: // w
				 moveForward = true;

         footStepAudio.play();

				 break;
			 case 37: // left
			 case 65: // a
				 moveLeft = true;
         footStepAudio.play();
         break;
			 case 40: // down
			 case 83: // s
				 moveBackward = true;
         footStepAudio.play();
				 break;
			 case 39: // right
			 case 68: // d
				 moveRight = true;
         footStepAudio.play();
				 break;
			 case 32: // space
				 if ( canJump === true ) velocity.y += 300;
         footStepAudio.pause();
         footStepAudio.currentTime = 0;
				 canJump = false;
         if(canJump === true && moveForward === true)
         {
           footStepAudio.play();
         }

				 break;
			 case 16:
				 isRunning = true;
				 break;

		 }
	 };
	 var onKeyUp = function ( event ) {
		 switch( event.keyCode ) {
			 case 38: // up
			 case 87: // w
				 moveForward = false;
         if(moveLeft === false && moveRight === false && moveBackward === false)
         {
           footStepAudio.pause();
          footStepAudio.currentTime = 0;
         }
				 break;
			 case 37: // left
			 case 65: // a
				 moveLeft = false;
         if(moveForward === false)
         {
         footStepAudio.pause();
         footStepAudio.currentTime = 0;
        }

				 break;
			 case 40: // down
			 case 83: // s
				 moveBackward = false;
         if(moveForward === false)
         {
         footStepAudio.pause();
         footStepAudio.currentTime = 0;
        }
				 break;
			 case 39: // right
			 case 68: // d
				 moveRight = false;
         if(moveForward === false)
         {
         footStepAudio.pause();
         footStepAudio.currentTime = 0;
        }

				 break;
			 case 16:
				 isRunning = false;

				 break;
		 }
	 };
	 document.addEventListener( 'keydown', onKeyDown, false );
	 document.addEventListener( 'keyup', onKeyUp, false );
	 raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );




 }


 /***************************************************
 * updateMovement()
 *   Call this funciton in your scripts "animate" function.
 *  This updates the scene creating the appearance that you
 *  are walking around.
 *
 *  Params - movementSpeed
 *  you need to enter a value for how fast you want the
 *  player to move, I have found values ranging from
 *  400 - 2000 work pretty good.
 ****************************************************/
updateMovement = function(movementSpeed)
{
	if ( controlsEnabled ) {
			// console.log("are the controls updating???");
		raycaster.ray.origin.copy( controls.getObject().position );
		raycaster.ray.origin.y -= 10;
		var intersections = raycaster.intersectObjects( objects );
		var isOnObject = intersections.length > 0;
		var time = performance.now();
		var delta = ( time - prevTime ) / 1000;
		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;
		velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

		if(isRunning === false)
		{
			if ( moveForward ) velocity.z -= movementSpeed * delta;
		}
		else {
			if ( moveForward ) velocity.z -= (movementSpeed + movementSpeed) * delta;
		}

		if ( moveBackward ) velocity.z += movementSpeed * delta;
		if ( moveLeft ) velocity.x -= movementSpeed * delta;
		if ( moveRight ) velocity.x += movementSpeed * delta;
		if ( isOnObject === true ) {
			velocity.y = Math.max( 0, velocity.y );
			canJump = true;
		}
		controls.getObject().translateX( velocity.x * delta );
		controls.getObject().translateY( velocity.y * delta );
		controls.getObject().translateZ( velocity.z * delta );
		if ( controls.getObject().position.y < 10 ) {
			velocity.y = 0;
			controls.getObject().position.y = 10;
			canJump = true;
		}
		prevTime = time;
	}

}




// *** You dont need to do anything with the stuff below here, your done! ***


THREE.PointerLockControls = function ( camera ) {

	var scope = this;

	camera.rotation.set( 0, 0, 0 );

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	yawObject.position.y = 10;
	yawObject.add( pitchObject );

	var PI_2 = Math.PI / 2;

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.002;
		pitchObject.rotation.x -= movementY * 0.002;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

	};

	this.dispose = function() {

		document.removeEventListener( 'mousemove', onMouseMove, false );

	};

	document.addEventListener( 'mousemove', onMouseMove, false );

	this.enabled = false;

	this.getObject = function () {

		return yawObject;

	};

	this.getDirection = function() {

		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3( 0, 0, - 1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {

			rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

			v.copy( direction ).applyEuler( rotation );

			return v;

		};

	}();

};



/***************************************************
    *** HTML template for adding instructions ***

// in your HEAD tag, add these styles

<style>
  canvas { width: 100%; height: 100% }

    html, body {
      width: 100%;
      height: 100%;
    }
    body {
      background-color: #ffffff;
      margin: 0;
      overflow: hidden;
      font-family: arial;
    }
    #blocker {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.5);
    }
    #instructions {
      width: 100%;
      height: 100%;
      display: -webkit-box;
      display: -moz-box;
      display: box;
      -webkit-box-orient: horizontal;
      -moz-box-orient: horizontal;
      box-orient: horizontal;
      -webkit-box-pack: center;
      -moz-box-pack: center;
      box-pack: center;
      -webkit-box-align: center;
      -moz-box-align: center;
      box-align: center;
      color: #ffffff;
      text-align: center;
      cursor: pointer;
    }
</style>


// In the beginning of your BODY tag add these div's


<div id="blocker">

  <div id="instructions">
    <span> Your Message Here </span>
    <br />

  </div>

</div>



****************************************************/
