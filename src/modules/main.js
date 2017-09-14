import * as THREE from 'three';
import Avatar from './Avatar';

export function main () {
    var WIDTH = window.innerWidth;
    var HEIGHT = window.innerHeight;
    var aspectRatio = WIDTH / HEIGHT;
    var fieldOfView = 60;
    var nearPlane = 0.1;
    var farPlane = 2000;

    var mousePos = {
        x: 0,
        y: 0
    };

    var avatar = new Avatar();

    var container,
        scene,
        camera,
        renderer,
        geometry,
        material,
        mesh;

    init();
    animate();

    function init() {
        container = document.querySelector('#world');

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        camera.position.z = 400;
        scene.add(camera);

        scene.add(avatar.mesh);

        renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true 
        });
        renderer.setSize(WIDTH, HEIGHT);
        renderer.shadowMap.enabled = true;

        var hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9)
 
        var shadowLight = new THREE.DirectionalLight(0xffffff, .6);
 
        shadowLight.position.set(150, 350, 350);
        shadowLight.castShadow = true;

        scene.add(hemisphereLight);
        scene.add(shadowLight);

        container.appendChild(renderer.domElement);
        document.addEventListener('mousemove', handleMouseMove, false);
    }

    function animate() {
        requestAnimationFrame(animate);
        avatar.lookAt({
            x: mousePos.x,
            y: mousePos.y,
            z: 0.5
        });
        render();
    }

    function render() {
        renderer.render(scene, camera);
    }

    function handleMouseMove(event) {
        mousePos = {
            x: event.clientX / WIDTH * 2 - 1,
            y: -event.clientY / HEIGHT * 2 + 1
        };
    }

};