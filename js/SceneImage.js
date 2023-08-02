import * as THREE from 'three';

export function SceneImage(scene, pathToImage, parent, children, coords) {
    this.pathToImage = pathToImage;
    this.parent = parent;
    this.children = children;

    this.siblings = [];
    if (this.parent && this.parent.children) {
        this.siblings = this.parent.children; // todo - make more elegant, explain that sibs includes self
    }

    this.clickable = null;

    this.setChildren = function(children) {  // todo: explain why this is needed
        this.children = children;
    }

    this.update = function(shouldShowImage, shouldBeClickable) {
        if (shouldShowImage) {
            const map = new THREE.TextureLoader().load( this.pathToImage );
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
