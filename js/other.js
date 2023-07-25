import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as TWEEN from "@tweenjs/tween.js";

const clickables = [cube1, cube2];

function onClick(event) {
	const intersects = raycaster.intersectObjects(clickables);
	if (intersects.length) {
		console.log(intersects[0].object);
		// intersects[0].object.material.color.set(0x0000ff);
		const clickedObject = intersects[0].object;
		// camera.position.set(clickedObject.position.x, clickedObject.position.y, 100);
		console.log(clickedObject);

		const coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
		console.log(coords);
		new TWEEN.Tween(coords)
	      .to({ x: clickedObject.position.x, y: clickedObject.position.y, z: 300 })
	      .onUpdate(() =>
	        camera.position.set(coords.x, coords.y, coords.z)
	      )
	      .start();
		// camera.Translate(0, 0, 100); // where `r` is the desired distance

      	// Create sprite with image
		const map = new THREE.TextureLoader().load( '/IMG_3757.jpeg' );
		const material = new THREE.SpriteMaterial( { 
			map: map ,
			color: 0xffffff,
			opacity: 1,
			transparent: false
			// why is opacity still wonky?
		} );
		const sprite = new THREE.Sprite( material );
		sprite.scale.set(400, 300, 1);
		scene.add( sprite );
	}
}

window.addEventListener('click', onClick);


function animate(time) {

	// update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	// const intersects = raycaster.intersectObjects( clickables );

	for (let child of clickables) {
		const intersection = raycaster.intersectObject(child);
		if (intersection.length) {
			// console.log('yes', child, intersection)
			child.material.color.set(0xff0000);
		} else {
			// console.log('no', child, intersection)
			child.material.color.set(0x00ff00);
		}
	}

	requestAnimationFrame( animate );

	renderer.render( scene, camera );

	TWEEN.update(time);
}

animate();
