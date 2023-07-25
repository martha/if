import * as THREE from 'three';

export default function SceneImage(scene, pathToImage, parent, coords) {
    // TODO - i haven't achieved the depth that I had in mind

    this.clickable = null;

    if (parent && coords) {
        const geometry1 = new THREE.BoxGeometry( 100, 100, 1 );
        const material1 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const cube1 = new THREE.Mesh( geometry1, material1 );
        scene.add( cube1 );
        cube1.position.set(...coords)
        this.clickable = cube1;

    } else {
        const map = new THREE.TextureLoader().load( pathToImage );
        const material = new THREE.SpriteMaterial( { 
            map: map ,
            color: 0xffffff,
            opacity: 1,
            transparent: false
            // TODO: why is opacity still wonky?
        } );
        const sprite = new THREE.Sprite( material );
        sprite.scale.set(400, 300, 1);  // TODO: make it fill the whole screen on init
        scene.add( sprite );
    }


    this.update = function(time) {
        // empty function
    }
}
