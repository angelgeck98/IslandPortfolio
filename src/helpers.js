import * as THREE from 'three';

export function loadModel(assetLoader, url, position, scale, material, scene) {
    return new Promise((resolve, reject) => {
        assetLoader.load(
            url, 
            function(gltf) {
                const model = gltf.scene;
                model.position.set(position.x, position.y, position.z);
                model.scale.set(scale.x, scale.y, scale.z)
                
                if (material) {
                    model.traverse((child) => {
                        if (child.isMesh) {
                            child.material = material;
                        }
                    });
                }
                
                scene.add(model);
                console.log('Model loaded!', model);
                resolve(model);
            }, 
            undefined, 
            function(error) {
                console.error(error);
                reject(error);
            }
        );
    });
}