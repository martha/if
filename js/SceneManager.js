import * as THREE from 'three';
import SceneImage from './SceneImage.js'
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
    const sceneSubjects = createSceneSubjects(scene);

    function buildScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#000");

        return scene;
    }

    function buildRenderer({ width, height }) {
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); 
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
        // TODO: why is key control not enabled?
        // TODO: set maxDistance and minDistance it so that the close position never gets too close
        // TODO: use two finger scroll for horizontal mvt
        // TODO: scroll in to pointer
        return controls;
    }

    function createSceneSubjects(scene) {
        const baseSceneImage = new SceneImage(scene, '/IMG_3756.jpeg');
        // TODO!: make these the correct coords
        const child1 = new SceneImage(scene, '/IMG_3757.jpeg', baseSceneImage, [-100, 0, 0]);
        const child2 = new SceneImage(scene, '/IMG_3758.jpeg', baseSceneImage, [100, 0, 0]);
        const sceneSubjects = [
            // new GeneralLights(scene),
            baseSceneImage,
            child1,
            child2
        ];

        return sceneSubjects;
    }

    this.update = function() {
        // update the picking ray with the camera and pointer position
        raycaster.setFromCamera( pointer, camera );

        const elapsedTime = clock.getElapsedTime();

        for (let i = 0; i < sceneSubjects.length; i++) {
            const sceneSubject = sceneSubjects[i];
            sceneSubject.update(elapsedTime);
            if (sceneSubject.clickable) {
                // TODO: change colors
                // TODO: add pointer mouse
                const intersection = raycaster.intersectObject(sceneSubject.clickable);
                if (intersection.length) {
                    sceneSubject.clickable.material.color.set(0xff0000);
                } else {
                    sceneSubject.clickable.material.color.set(0x00ff00);
                }
            }
        }

        renderer.render(scene, camera);

        TWEEN.update(elapsedTime);
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

    this.onClick = function() {
        const clickables = sceneSubjects.map(subj => subj.clickable).filter(subj => subj);
        const intersects = raycaster.intersectObjects(clickables);
        if (intersects.length) {
            // console.log(intersects[0].object);
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
            
        }
    }
}
