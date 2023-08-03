import * as THREE from 'three';
import { createImageTree } from './Arborist.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as TWEEN from "@tweenjs/tween.js";

export default function SceneManager(canvas) {

    const clock = new THREE.Clock();
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    
    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }
    
    const scene = buildScene();
    const renderer = buildRenderer(screenDimensions);
    const camera = buildCamera(screenDimensions);
    const controls = buildControls(renderer);
    const imageTree = createImageTree(scene, screenDimensions);

    function buildScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#000");

        return scene;
    }

    function buildRenderer({ width, height }) {
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            antialias: true, 
            alpha: true,
        }); 
        const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
        renderer.setPixelRatio(DPR);
        renderer.setSize(width, height);

        renderer.gammaInput = true;
        renderer.gammaOutput = true; 

        document.body.appendChild( renderer.domElement );

        return renderer;
    }

    function buildCamera({ width, height }) {
        const aspectRatio = width / height;
        const fieldOfView = 60;
        const nearPlane = 1;
        const farPlane = 1000; 
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        // todo - explore orthographic?
        // const camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
        camera.position.set( 0, 0, 600 );
        camera.lookAt( 0, 0, 0 );

        return camera;
    }

    function buildControls(renderer) {
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
        return controls;
    }

    this.onWindowResize = function() {
        const { width, height } = canvas;

        screenDimensions.width = width;
        screenDimensions.height = height;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
    }

    this.onPointerMove = function(x, y) {
        // calculate pointer position in normalized device coordinates (-1 to +1)
        pointer.x = ( x / window.innerWidth ) * 2 - 1;
        pointer.y = - ( y / window.innerHeight ) * 2 + 1;
    }

    this.update = function() {
        raycaster.setFromCamera( pointer, camera );

        // first check if there are any intersections
        const intersects = raycaster.intersectObjects(imageTree.clickables);
        if (intersects.length) {  // if so, set the cursor so it looks clickable on hover
            document.body.style.cursor = "pointer";
        } else {  // otherwise, set the cursor back to default
            document.body.style.cursor = "default";
        }

        // get the list of objects the raycaster intersected with
        const intersectObjects = intersects.map(i => i.object);

        // iterate through each of the currently clickable objects and check if it's in the intersection
        for (const clickable of imageTree.clickables) {
            if (intersectObjects.indexOf(clickable) >= 0) {
                imageTree.hoverImage(clickable.uuid);
            } else {
                imageTree.unhoverImage(clickable.uuid);
            }
        }

        renderer.render(scene, camera);

        TWEEN.update();
    }

    this.onClick = function() {
        const intersects = raycaster.intersectObjects(imageTree.clickables);
        if (intersects.length) {
            const clickedObject = intersects[0].object;

            const coords = {
                x: camera.position.x,
                y: camera.position.y,
                z: camera.position.z,
                opacity: 0.0,
            };
            const target = {
                x: clickedObject.position.x,
                y: clickedObject.position.y,
                z: camera.position.z * 1/5,
                opacity: 1.0,
            }
            const speed = 700;

            // todo - the 1/5 constant may need to be fixed, it should be related to the Arborist
            new TWEEN.Tween(coords)
              .to(target, speed)
              .onStart(() => {
                scene.clear();
                imageTree.selectImage(clickedObject.uuid);
              })
              .onUpdate(() => {
                camera.position.set(coords.x, coords.y, coords.z);
                imageTree.setImageOpacity(clickedObject.uuid, coords.opacity);
              })
              .start();
        }
    }
}
