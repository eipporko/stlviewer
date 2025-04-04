import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { STLLoader } from 'three/addons/loaders/STLLoader.js'
import GUI from 'lil-gui'

const textureLoader = new THREE.TextureLoader();
const loader = new STLLoader();

/**
 * Textures
 */
const matcapTexture = textureLoader.load('./textures/matcaps/312D20_80675C_8B8C8B_85848C-256px.png');
const matcap = new THREE.MeshMatcapMaterial({ matcap: matcapTexture, side: THREE.DoubleSide });
const normalMaterial = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
const depthMaterial = new THREE.MeshDepthMaterial({ side: THREE.DoubleSide });


const materialOptions = {
    Matcap: 'matcap',
    Depth: 'depth',
    Normal: 'normal'
};
const materialSelector = { description: 'matcap', material: matcap };


/**
 * Base
 */
// Debug
const gui = new GUI();
gui.add({
    loadModel: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.stl';
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {

                    scene.clear();

                    const geometry = loader.parse(e.target.result);
                    geometry.computeBoundingBox();
                    const boundingBox = geometry.boundingBox;
                    const center = new THREE.Vector3();
                    boundingBox.getCenter(center);
                    geometry.translate(-center.x, -center.y, -center.z);
                    geometry.rotateX(- Math.PI / 2);

                    mesh = new THREE.Mesh(geometry, materialSelector.material);

                    adjustCameraToGeometry(camera, controls, geometry);

                    scene.add(mesh);
                };
                reader.readAsArrayBuffer(file);
            }
        });
        input.click();
    }
}, 'loadModel').name('Load Model');

gui.add(materialSelector, 'description', materialOptions).name('Material').onChange((value) => {
    switch (value) {
        case 'matcap':
            materialSelector.material = matcap;
            break;
        case 'depth':
            materialSelector.material = depthMaterial;
            break;
        case 'normal':
            materialSelector.material = normalMaterial;
            break;
    }

    if (mesh) {
        mesh.material = materialSelector.material;
    }
});



// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff)


/**
 * STL
 */
function adjustCameraToGeometry(camera, controls, geometry) {
    geometry.computeBoundingBox();
    const boundingBox = geometry.boundingBox;

    const center = new THREE.Vector3();
    boundingBox.getCenter(center);

    const size = new THREE.Vector3();
    boundingBox.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    const cameraZ = Math.abs(maxDim / (2 * Math.tan(fov / 2)));

    const near = cameraZ - maxDim * 2;
    const far = cameraZ + maxDim * 2;

    camera.position.set(center.x, center.y, cameraZ + center.z);
    camera.near = Math.max(0.1, near);
    camera.far = far;
    camera.updateProjectionMatrix();

    controls.target.copy(center);
    controls.update();
}

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
camera.position.y = 3;
camera.position.x = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


/**
 * Default model
 */
let mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    matcap
);
scene.add(mesh);



/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();