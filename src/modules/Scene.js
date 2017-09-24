import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
import { names } from '../constants';
import { normalize } from '../utils';
import Avatar from './Avatar';
import Glasses from './Glasses';

export default class Scene {

    constructor() {
        this.container = document.querySelector('.world');
        this.deviceWidth = this.container.clientWidth;
        this.deviceHeight = this.container.clientHeight;
        
        this.mouseVector = new THREE.Vector3(0, 0, 0.5);

        this.init();
    }

    init = () => {
        this.createScene();
        this.createLight();
        this.createAvatar();
        this.createGlasses();
    }

    createScene = () => {
        const aspectRatio = this.deviceWidth / this.deviceHeight;
        const fieldOfView = 60;
        const nearPlane = 0.1;
        const farPlane = 2000;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        this.camera.position.z = 400;
        this.scene.add(this.camera);

        this.raycaster = new THREE.Raycaster();
        this.controls = new OrbitControls(this.camera);

        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(this.deviceWidth, this.deviceHeight);
        this.renderer.shadowMap.enabled = true;

        this.container.appendChild(this.renderer.domElement);

        this.container.addEventListener('mousedown', this._handleMouseDown, false);
        this.container.addEventListener('mouseup', this._handleMouseUp, false);
        this.container.addEventListener('mousemove', this._handleMouseMove, false);
        this.container.addEventListener('mouseenter', this._handleMouseOutAndOver, false);
        this.container.addEventListener('mouseover', this._handleMouseOutAndOver, false);
        window.addEventListener('resize', this._handleWindowResize, false);
    }

    createLight = () => {
        let hemisphereLight = new THREE.HemisphereLight(0xeeeeee, 0xaaaaaa, 0.7);
        let shadowLight = new THREE.DirectionalLight(0xffffff, 0.5);

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

        this.scene.add(hemisphereLight);
        this.scene.add(shadowLight);
    }

    createAvatar = () => {
        this.avatar = new Avatar();
        this.scene.add(this.avatar.mesh);
    }
    
    createGlasses = () => {
        this.glasses = new Glasses();
        this.scene.add(this.glasses.mesh);
    }

    toggleWearingGlasses = () => {
        const gl = this.avatar.isWearingGlasses();
        if (!gl) {
            this.avatar.wearGlasses(this.glasses.mesh);
        } else {
            this.scene.add(this.glasses.mesh);
        }
    }

    loop = () => {
        this.avatar.lookAt(this.mouseVector);
        this.animate();
    }

    animate = () => {
        window.requestAnimationFrame(this.loop);
        this.renderer.render(this.scene, this.camera);
    }

    _handleMouseDown = (e) => {
        this.raycaster.setFromCamera(this.mouseVector, this.camera);
        const intersects = this.raycaster.intersectObjects(this.glasses.mesh.children);
        if (intersects.length > 0) {
            this._clickOnGlasses = true;
        }
    }

    _handleMouseup = (e) => {
        this._clickOnGlasses = false;
    }

    _handleMouseMove = (e) => {
        const mousePos = normalize(e.clientX, e.clientY, this.deviceWidth, this.deviceHeight);
        this.mouseVector.setX(mousePos.x);
        this.mouseVector.setY(mousePos.y);

        if (this._clickOnGlasses) {
            if (this.mouseVector.x > 0.08 || this.mouseVector.y > 0.08) {
                if (this.avatar.isWearingGlasses()) {
                    this.scene.add(this.glasses.mesh);
                    this.glasses.mesh.position.x = this.mouseVector.x
                    this.glasses.mesh.position.y = this.mouseVector.y;
                    this.glasses.mesh.position.z = 100;
                }

                console.log(this.glasses.mesh.position.toArray());

            } else if (this.mouseVector.x <= 0.08 || this.mouseVector.y <= 0.08) {
                this.avatar.wearGlasses(this.glasses.mesh);
            }
        }
    }

    _handleMouseOutAndOver = (e) => {
        if (e.type === 'mouseenter') {
            this.avatar.isLookingAround = true;
        } else if (e.type === 'mouseout') {
            this.avatar.isLookingAround = false;
        }
    }

    _handleWindowResize = (e) => {
        this.deviceWidth = this.container.clientWidth;
        this.deviceHeight = this.container.clientHeight;
        this.camera.aspect = this.deviceWidth / this.deviceHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.deviceWidth, this.deviceHeight);
    }
}