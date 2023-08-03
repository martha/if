import * as THREE from 'three';
import SpriteText from 'three-spritetext';

export function SceneImage(scene, pathToImage, parent, scale, coords, label) {
    this.parent = parent;
    this.children = [];

    this.setChildren = function(children) {
        // it is a doubly linked tree, so the parent has to know about its children,
        // but they are not initialized yet when the parent is initialized, so we
        // have to provide this method to add them later
        this.children = children;
    }

    // initialize the image sprite
    const map = new THREE.TextureLoader().load(pathToImage);
    map.encoding = THREE.sRGBEncoding;
    const spriteMaterial = new THREE.SpriteMaterial({
        map: map ,
    });
    this.sprite = new THREE.Sprite(spriteMaterial);
    this.sprite.scale.set(scale.x, scale.y, scale.z);

    // initialize the clickable box
    const geometry = new THREE.BoxGeometry( scale.x, scale.y, scale.z );
    const clickableMaterial = new THREE.MeshBasicMaterial({
        opacity: 0,
        transparent: true
    });
    this.clickable = new THREE.Mesh( geometry, clickableMaterial );

    // set their location if coords are provided
    if (coords) {
        this.sprite.position.set(coords.x, coords.y, coords.z);
        this.clickable.position.set(coords.x, coords.y, coords.z);
    }

    if (label && coords) {
        this.textSprite = new SpriteText(label);
        this.textSprite.textHeight = 10; 
        this.textSprite.color = "black";
        this.textSprite.strokeWidth = 1;
        this.textSprite.strokeColor = "white";
        this.textSprite.position.set(coords.x, coords.y - 40, coords.z + 10);
    }

    this.update = function(shouldShowImage, shouldBeClickable) {
        if (shouldShowImage) {
            scene.add(this.sprite);
            if (this.textSprite) {
                scene.add(this.textSprite);
            }
        } else if (shouldBeClickable) {
            scene.add(this.textSprite);
            scene.add(this.clickable);
        }
    }

    this.hover = function() {
        this.textSprite.color = "blue";
    }

    this.unhover = function() {
        this.textSprite.color = "black";
    }
}
