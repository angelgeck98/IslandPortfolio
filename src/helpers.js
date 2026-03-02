import * as THREE from 'three';

export function loadModel(
    assetLoader, 
    url, 
    position, 
    scale, 
    material, 
    scene, 
    rotation = null  // Optional parameter with default value
) {
    return new Promise((resolve, reject) => {
        assetLoader.load(
            url, 
            function(gltf) {
                const model = gltf.scene;
                
                // Position
                model.position.set(position.x, position.y, position.z);
                
                // Scale
                model.scale.set(scale.x, scale.y, scale.z);
                
                // Rotation (optional)
                if (rotation) {
                    model.rotation.set(rotation.x, rotation.y, rotation.z);
                }
                
                // Material
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