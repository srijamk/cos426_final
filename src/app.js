/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import * as THREE from 'three';
import { WebGLRenderer, PerspectiveCamera, OrthographicCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene, MainScene, StartScene } from 'scenes';


function handleKey() {

}

// Initialize core ThreeJS components
// const scene = new SeedScene();
//const scene = new MainScene();
let scene = new StartScene();
let sceneNumber = 0;
let camera = new PerspectiveCamera();
//camera.position.set(0, 50, 0);
camera.position.set(0, 300, 400);
camera.up.set(0, 0, -10);
camera.lookAt(0, 0, 0);

// Set up Top-down camera
const aspect = window.innerWidth / window.innerHeight;
// const fov = 45;
// const near = 0.1;
// const far = 100;

// const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
// camera.position.set(0, 20, 0);
// camera.up.set(0, 0, -1);
// camera.lookAt(0, 0, 0);

const cameraWidth = 25;
const cameraHeight = cameraWidth / aspect;

// Set up renderer, canvas, and minor CSS adjustments
const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// handle user input

const keyActions = {
    ArrowLeft: { isPressed: false}, 
    ArrowRight: { isPressed: false}
};

// https://stackoverflow.com/questions/4416505/how-to-take-keyboard-input-in-javascript
window.addEventListener("keydown", function (event) {

    // if we're on start scene and user presses Space, move to game scene (MainScene)
    if (event.keyCode == 32 && sceneNumber == 0) {
        sceneNumber++;
        scene = new MainScene();
        camera = new THREE.OrthographicCamera(
            cameraWidth / -2, cameraWidth / 2, cameraHeight / 2, cameraHeight / -2, 0, 1000
        );
        camera.position.set(0, 50, 0);
        camera.up.set(0, 0, -1);
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
        scene.update && scene.update(timeStamp);
        window.requestAnimationFrame(onAnimationFrameHandler);
    }
    if (event.defaultPrevented) return; 

    if (!keyActions.hasOwnProperty(event.key)) return;

    keyActions[event.key].isPressed = true;

    event.preventDefault();
  }, true);

window.addEventListener("keyup", function (event) {
    if (event.defaultPrevented) return; 

    if (!keyActions.hasOwnProperty(event.key)) return;

    keyActions[event.key].isPressed = false;

    event.preventDefault();
  }, true)

// Render loop
const onAnimationFrameHandler = (timeStamp) => {

    // handle player events
    scene.resetPlayerStatus();
    if (keyActions['ArrowLeft'].isPressed) {
        scene.updatePlayerLocation(-1);
    }

    if (keyActions['ArrowRight'].isPressed) {
        scene.updatePlayerLocation(1);
    }


    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};

windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);
