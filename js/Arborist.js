import * as THREE from 'three';
import { SceneImage } from './SceneImage.js'
import { ImageTree } from './ImageTree.js'

export function createImageTree(scene, screenDimensions) {
    const initScale = new THREE.Vector3(screenDimensions.width, screenDimensions.width * 3/4, 1);
    const baseSceneImage = new SceneImage(
        scene,
        '/IMG_3756.jpeg',
        null,
        initScale,
        null,
        null
    );

    const treeScaleFactor = 1/12;
    const childScale = new THREE.Vector3(initScale.x * treeScaleFactor, initScale.y * treeScaleFactor, 1);

    const child1 = new SceneImage(
        scene,
        '/IMG_3757.jpeg',
        baseSceneImage,
        childScale,
        new THREE.Vector3(-125, 40, 0),
        "Beijing - Nilote colonized",
    );

    const child2 = new SceneImage(
        scene,
        '/IMG_3758.jpeg',
        baseSceneImage,
        childScale,
        new THREE.Vector3(-240, 135, 0),
        "Beijing - Africa colonized",
    );

    baseSceneImage.setChildren([child1, child2]);

    const grandchildScale = new THREE.Vector3(childScale.x * treeScaleFactor, childScale.y * treeScaleFactor, 1);
    const grandchild = new SceneImage(scene, '/IMG_3997.jpeg', child2, grandchildScale, new THREE.Vector3(0, 0, 0));
    child2.setChildren([grandchild]);

    const tree = new ImageTree(baseSceneImage);
    return tree;
}
