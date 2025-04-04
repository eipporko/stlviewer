import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { STLLoader } from 'three/addons/loaders/STLLoader.js'
import GUI from 'lil-gui'


/**
 * Base
 */
// Debug
const gui = new GUI();
gui.add({ loadModel: () => {
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

                const mesh = new THREE.Mesh(geometry, material);

                adjustCameraToGeometry(camera, controls, geometry);

                scene.add(mesh);
            };
            reader.readAsArrayBuffer(file);
        }
    });
    input.click();
}}, 'loadModel').name('Load Model');



// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('./textures/matcaps/312D20_80675C_8B8C8B_85848C-256px.png');
const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

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

const loader = new STLLoader();
loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/stl/ascii/pr2_head_pan.stl', function (geometry) {

    const mesh = new THREE.Mesh(geometry, material);
    geometry.computeBoundingBox();
    const boundingBox = geometry.boundingBox;
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);

    geometry.translate(-center.x, -center.y, -center.z);

    adjustCameraToGeometry(camera, controls, geometry);

    scene.add(mesh);

});

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
camera.position.z = 1;
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