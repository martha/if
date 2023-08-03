import * as THREE from 'three';

export function SceneImage(scene, pathToImage, parent, scale, coords) {
    this.pathToImage = pathToImage;
    this.parent = parent;
    this.children = [];
    this.clickable = null;

    this.setChildren = function(children) {
        // it is a doubly linked tree, so the parent has to know about its children,
        // but they are not initialized yet when the parent is initialized, so we
        // have to provide this method to add them later
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
            sprite.scale.set(scale.x, scale.y, scale.z);
            scene.add( sprite );
            if (coords) {
                sprite.position.set(coords.x, coords.y, coords.z)
            }

        } else if (shouldBeClickable) {
            const geometry = new THREE.BoxGeometry( scale.x, scale.y, 1 );
            const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            const cube = new THREE.Mesh( geometry, material );
            scene.add( cube );
            cube.position.set(coords.x, coords.y, coords.z)
            this.clickable = cube;
        }
    }
}
