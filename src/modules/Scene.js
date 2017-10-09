import * as THREE from 'three';
import DragControls from './DragControls';
import { names } from '../constants';
import { normalize } from '../utils';
import Avatar from './Avatar';
import Glasses from './Glasses';

export default class Scene extends THREE.EventDispatcher {

    constructor () {
        super();
        this.container = document.querySelector('.world');
        this.deviceWidth = this.container.clientWidth;
        this.deviceHeight = this.container.clientHeight;
        
        this.mouseVector = new THREE.Vector3(0, 0, 0.5);

        this._lookAroundInterval = null;

        this.createScene();
        this.createLight();
        this.createAvatar();
        this.createGlasses();

        this._trackMouseSpeed();
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

        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(this.deviceWidth, this.deviceHeight);
        this.renderer.shadowMap.enabled = true;

        this.container.appendChild(this.renderer.domElement);

        this.container.addEventListener('mousemove', this._handleMouseMove, false);
        this.container.addEventListener('mouseover', this._handleMouseEnterAndOut, false);
        this.container.addEventListener('mouseout', this._handleMouseEnterAndOut, false);
        this.container.addEventListener('touchmove', this._handleTouchMove, false);
        this.container.addEventListener('touchstart', this._handleTouchStartAndEnd, false);
        this.container.addEventListener('touchend', this._handleTouchStartAndEnd, false);
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
        this.avatar.behave();
        //this.avatar.addEventListener('behave', e => console.log(e.message));
    }
    
    createGlasses = () => {
        this.glasses = new Glasses();
        this.scene.add(this.glasses.mesh);
        this.glasses.mesh.position.set(0, -100, 60);

        this.dragControls = new DragControls(this.glasses.mesh, this.camera, this.renderer.domElement );

        this.dragControls.addEventListener('dragstart', e => {
            this.scene.add(this.glasses.mesh);
            this.glasses.mesh.position.z = 60;
            this.dispatchEvent({ type: 'glassesoff' });
        });

        this.dragControls.addEventListener('drag', e => {
            this.glasses.mesh.position.z = 60;
        });

        this.dragControls.addEventListener('dragend', e => {
            const pos = this.glasses.mesh.position;
            if (Math.abs(pos.x) < 20 && Math.abs(pos.y) < 20) {
                this.avatar.wearGlasses(this.glasses.mesh);
                this.dispatchEvent({ type: 'glasseson' });
            }
        });
    }

    toggleAvatarLookAround = (lookAround) => {
        if (lookAround) {
            if (this._lookAroundInterval === null) {
                this._lookAroundInterval = setInterval(() => {
                   this.mouseVector.set((Math.random() > 0.5 ? 0.8 : -0.8) * Math.random(),
                        (Math.random() > 0.5 ? 0.8 : -0.8) * Math.random(), 0.5);
                }, 5000);
            }
        } else {
            if (this._lookAroundInterval !== null) {
                clearInterval(this._lookAroundInterval);
                this._lookAroundInterval = null;
            }
        }
    }

    loop = () => {
        // swtich between looking at a random location or the cursor
        this.toggleAvatarLookAround(this.avatar.isLookingAround);

        if (this.avatar.isDizzy) {
            this.avatar.dizzy();
            this.mouseVector.set(0, 0, 0.5);
        } else {
            this.avatar.lookAt(this.mouseVector)
        };

        this.animate();
    }

    animate = () => {
        window.requestAnimationFrame(this.loop);
        this.renderer.render(this.scene, this.camera);
    }

    _handleMouseMove = evt => {
        evt.preventDefault();
        this._updateMouseVector(evt.clientX, evt.clientY);
    }

    _handleMouseEnterAndOut = evt => {
        evt.preventDefault();
        
        if (evt.type === 'mouseover') {
            this.avatar.isLookingAround = false;
        } else if (evt.type === 'mouseout') {
            this.avatar.isLookingAround = true;
        }
    }

    _handleTouchMove = evt => {
        evt.preventDefault();
        evt = evt.changedTouches[0];
        this._updateMouseVector(evt.clientX, evt.clientY);
    }

    _handleTouchStartAndEnd = evt => {
        evt.preventDefault();
        if (evt.type === 'touchstart') {
            this.avatar.isLookingAround = false;
        } else if (evt.type === 'touchend') {
            this.avatar.isLookingAround = true;
        }
    }

    _handleWindowResize = (e) => {
        this.deviceWidth = this.container.clientWidth;
        this.deviceHeight = this.container.clientHeight;
        this.camera.aspect = this.deviceWidth / this.deviceHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.deviceWidth, this.deviceHeight);
    }

    _updateMouseVector = (px, py) => {
        const mousePos = normalize(px, py, this.deviceWidth, this.deviceHeight);
        this.mouseVector.setX(mousePos.x);
        this.mouseVector.setY(mousePos.y);
    }

    /**
     * Mouse moves too fast can make the avatar dizzy
     * Basic idea here is accumulate the distance of mouse movement
     * within a certain amount of time, if the distance if too high then
     * the avatar will be dizzy
     */
    _trackMouseSpeed = () => {
        let lastMouseX = -1;
        let lastMouseY = -1;
        let lastMouseTime;
        let mouseTravel = 0;

        this.container.addEventListener('mousemove', evt => {
            evt.preventDefault();
            calcualteDistance(evt.clientX, evt.clientY);
        }, false);

        this.container.addEventListener('touchmove', evt => {
            evt.preventDefault();
            evt = evt.changedTouches[0];
            calcualteDistance(evt.clientX, evt.clientY);
        }, false);

        const calcualteDistance = (mouseX, mouseY) => {
            if (lastMouseX > -1 && !this.willDizzy) {
                mouseTravel += Math.max(Math.abs(mouseX - lastMouseX), Math.abs(mouseY - lastMouseY));
            }
            lastMouseX = mouseX;
            lastMouseY = mouseY;
        }

        const checkTravelDistance = () => {
            let current = (new Date()).getTime();

            if (lastMouseTime && lastMouseTime !== current) {
                if (!this.avatar.isDizzy && mouseTravel > 9000) {
                    this.avatar.prepareToBeDizzy();
                }
                mouseTravel = 0;
            }

            lastMouseTime = current;
            // trigger next round of checking
            setTimeout(checkTravelDistance, 2000);
        };

        // start checking
        setTimeout(checkTravelDistance, 2000);
    }
}