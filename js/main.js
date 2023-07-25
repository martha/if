import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as TWEEN from "@tweenjs/tween.js";


// Init scene and camera
const scene = new THREE.Scene();

// use orthographic camera
const width = window.innerWidth;
const height = window.innerHeight;
const camera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 );
camera.position.set( 0, 0, 600 );
camera.lookAt( 0, 0, 0 );

// Create sprite with image
const map = new THREE.TextureLoader().load( '/IMG_3756.jpeg' );
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

// Add renderer to dom
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Init controls for the panning and zooming
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableRotate = false;
controls.touches = {
	ONE: THREE.TOUCH.ROTATE,
	TWO: THREE.TOUCH.DOLLY_PAN
}
controls.mouseButtons = {
	LEFT: THREE.MOUSE.PAN,
	MIDDLE: THREE.MOUSE.DOLLY,
	RIGHT: THREE.MOUSE.PAN
}
// why is key control not enabled?
// set maxDistance and minDistance it so that the close position never gets too close
// use two finger scroll for horizontal mvt

const geometry1 = new THREE.BoxGeometry( 100, 100, 1 );
const material1 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube1 = new THREE.Mesh( geometry1, material1 );
scene.add( cube1 );
cube1.position.set(-100, 0, 0)

const material2 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube2 = new THREE.Mesh( geometry1, material2 );
scene.add( cube2 );
cube2.position.set(100, 0, 0)

const clickables = [cube1, cube2];

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	// console.log(pointer)

}

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

window.addEventListener( 'pointermove', onPointerMove );
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
