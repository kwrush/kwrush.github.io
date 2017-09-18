import * as THREE from 'three';
import Avatar from './Avatar';

export default function () {
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

    var target = new THREE.Vector3(0, 0, 0.5);

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
        var shadowLight = new THREE.DirectionalLight(0xffffff, .8);
 
        shadowLight.position.set(150, 350, 350);
        shadowLight.castShadow = true;

        shadowLight.shadow.camera.left = -200;
        shadowLight.shadow.camera.right = 200;
        shadowLight.shadow.camera.top = 200;
        shadowLight.shadow.camera.bottom = -200;
        shadowLight.shadow.camera.near = 1;
        shadowLight.shadow.camera.far = 1000;

        shadowLight.shadow.mapSize.width = 2048;
	    shadowLight.shadow.mapSize.height = 2048;

        scene.add(hemisphereLight);
        scene.add(shadowLight);

        container.appendChild(renderer.domElement);
        document.addEventListener('mousemove', handleMouseMove, false);

        window.addEventListener('resize', onWindowResize, false);
        window.addEventListener('mouseout', () => {
            avatar.isLookingAround = true;
        }, false);

        window.addEventListener('mouseover', () => {
            avatar.isLookingAround = false;
        }, false);

    }

    function onWindowResize() {
        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
        renderer.setSize(WIDTH, HEIGHT);
    }

    function animate() {
        requestAnimationFrame(animate);

        if (avatar.isLookingAround) {
            if (avatar._lookAroundInterval === null) {
                avatar._lookAroundInterval = setInterval(() => {
                    target.set((Math.random() > 0.5 ? 1 : -1) * Math.random(), 
                        (Math.random() > 0.5 ? 1 : -1) * Math.random(), 0.5);
                }, 6000);
            }
        } else {
            if (avatar._lookAroundInterval !== null) {
                clearInterval(avatar._lookAroundInterval);
                avatar._lookAroundInterval = null;
            }
            target.set(mousePos.x, mousePos.y, 0.5);
        }
        avatar.lookAt(target);
        avatar.behave();
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