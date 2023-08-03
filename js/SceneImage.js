import * as THREE from 'three';

export function SceneImage(scene, pathToImage, parent, children, coords) {
    this.pathToImage = pathToImage;
    this.parent = parent;
    this.children = children;
    this.clickable = null;

    this.setChildren = function(children) {
        // it is a doubly linked tree, so the parent has to know about its children
        this.children = children;
    }

    this.update = function(shouldShowImage, shouldBeClickable) {
        if (shouldShowImage) {
            const map = new THREE.TextureLoader().load( this.pathToImage );
            map.encoding = THREE.sRGBEncoding;
            const material = new THREE.SpriteMaterial( { 
                map: map ,
            } );
            const sprite = new THREE.Sprite( material );
            sprite.scale.set(400, 300, 1);
            scene.add( sprite );

        } else if (shouldBeClickable) {
            const geometry1 = new THREE.BoxGeometry( 100, 100, 1 );
            const material1 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            const cube1 = new THREE.Mesh( geometry1, material1 );
            scene.add( cube1 );
            cube1.position.set(...coords)
            this.clickable = cube1;
        }
    }
}
