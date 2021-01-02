import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import DragControls from './DragControls';
import { names } from '../constants';
import { normalize, distance, relativeCoordinate } from '../utils';
import Avatar from './Avatar';
import Glasses from './Glasses';

export default class Scene extends THREE.EventDispatcher {
  constructor() {
    super();
    this.name = names.scene;
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

    // trigger the behavior loop
    this.avatar.act();
  }

  /**
   * Create the whole scene
   */
  createScene = () => {
    const aspectRatio = this.deviceWidth / this.deviceHeight;
    const fieldOfView = 60;
    const nearPlane = 0.1;
    const farPlane = 2000;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane,
    );
    this.camera.position.z = 420;
    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(this.deviceWidth, this.deviceHeight);
    this.renderer.shadowMap.enabled = true;

    this.container.appendChild(this.renderer.domElement);

    this.container.addEventListener('mousemove', this._handleMouseMove, false);
    this.container.addEventListener(
      'mouseover',
      this._handleMouseEnterAndOut,
      false,
    );
    this.container.addEventListener(
      'mouseout',
      this._handleMouseEnterAndOut,
      false,
    );
    this.container.addEventListener('touchmove', this._handleTouchMove, false);
    this.container.addEventListener(
      'touchstart',
      this._handleTouchStartAndEnd,
      false,
    );
    this.container.addEventListener(
      'touchend',
      this._handleTouchStartAndEnd,
      false,
    );
    window.addEventListener('resize', this._handleWindowResize, false);
  };

  createLight = () => {
    const hemisphereLight = new THREE.HemisphereLight(0xeeeeee, 0xaaaaaa, 0.8);
    const shadowLight = new THREE.DirectionalLight(0xffffff, 0.4);

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
  };

  createAvatar = () => {
    this.avatar = new Avatar();
    this.scene.add(this.avatar.mesh);
  };

  createGlasses = () => {
    this.glasses = new Glasses();
    this.scene.add(this.glasses.mesh);
    this.glasses.mesh.position.set(0, -100, 80);

    this.avatar.wearGlasses(this.glasses.mesh);

    this.dragControls = new DragControls(
      this.glasses.mesh,
      this.camera,
      this.renderer.domElement,
    );

    this.dragControls.addEventListener('dragstart', (e) => {
      this.scene.add(this.glasses.mesh);
      this.glasses.mesh.position.z = 80;
      this.dispatchEvent({ type: 'glassesoff' });
    });

    this.dragControls.addEventListener('drag', (e) => {
      this.glasses.mesh.position.z = 80;
    });

    this.dragControls.addEventListener('dragend', (e) => {
      const pos = this.glasses.mesh.position;
      if (Math.abs(pos.x) < 20 && Math.abs(pos.y) <= 20) {
        this.avatar.wearGlasses(this.glasses.mesh);
        // still blur text if the avatar is a daze
        if (!this.avatar.isDizzy && this.avatar.isWearingGlasses()) {
          this.dispatchEvent({ type: 'glasseson' });
        }
      }
    });
  };

  /**
   * If the cursor stays out of the window, the avatar would look around randomly,
   * otherwise the avatar always look at the cursor
   */
  setAvatarLookAround = (lookAround) => {
    if (lookAround) {
      if (this._lookAroundInterval === null) {
        // Looking at a random location in every 5s
        this._lookAroundInterval = setInterval(() => {
          this.mouseVector.set(
            (Math.random() > 0.5 ? 0.5 : -0.5) * Math.random(),
            (Math.random() > 0.5 ? 0.3 : -0.4) * Math.random(),
            0.5,
          );
        }, 5000);
      }
    } else if (this._lookAroundInterval !== null) {
      clearInterval(this._lookAroundInterval);
      this._lookAroundInterval = null;
    }
  };

  /**
   * Animation loop
   */
  loop = () => {
    // swtich between looking at a random location or the cursor
    this.setAvatarLookAround(this.avatar.isLookingAround);

    if (this.avatar.isDizzy) {
      this.avatar.dizzy();
      if (this.avatar.isLookingAround) {
        this.mouseVector.set(0, 0, 0.5);
      }
    } else {
      if (this.avatar.isWearingGlasses()) {
        this.dispatchEvent({ type: 'glasseson' });
      }
      this.avatar.lookAt(this.mouseVector);
    }

    this.animate();
  };

  /**
   * Render next frame
   */
  animate = () => {
    window.requestAnimationFrame(this.loop);
    TWEEN.update();
    this.renderer.render(this.scene, this.camera);
  };

  /**
   * Callbacks
   */
  _handleMouseMove = (evt) => {
    evt.preventDefault();
    const coords = relativeCoordinate(evt);
    this._updateMouseVector(coords.x, coords.y);
  };

  _handleMouseEnterAndOut = (evt) => {
    evt.preventDefault();
    this.avatar.isLookingAround = evt.type === 'mouseout';
  };

  _handleTouchMove = (evt) => {
    evt.preventDefault();
    evt = evt.changedTouches[0];
    const coords = relativeCoordinate(evt);
    this._updateMouseVector(coords.x, coords.y);
  };

  _handleTouchStartAndEnd = (evt) => {
    evt.preventDefault();
    this.avatar.isLookingAround = evt.type === 'touchend';
  };

  _handleWindowResize = () => {
    this.deviceWidth = this.container.clientWidth;
    this.deviceHeight = this.container.clientHeight;
    this.camera.aspect = this.deviceWidth / this.deviceHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.deviceWidth, this.deviceHeight);
  };

  _updateMouseVector = (px, py) => {
    const mousePos = normalize(px, py, this.deviceWidth, this.deviceHeight);
    this.mouseVector.setX(mousePos.x);
    this.mouseVector.setY(mousePos.y);
  };

  /**
   * Move the cursor quickly can make the avatar dizzy
   * Basic idea here is to accumulate the distance of mouse movement
   * within a certain amount of time. If the distance value is too high then
   * the avatar will be dizzy for seconds
   */
  _trackMouseSpeed = () => {
    let lastMouseX = -1;
    let lastMouseY = -1;
    let lastMouseTime;
    let mouseTravel = 0;
    let isTouch = false;

    this.container.addEventListener(
      'mousemove',
      (evt) => {
        evt.preventDefault();
        isTouch = !!evt.touches;
        calcualteDistance(evt.clientX, evt.clientY);
      },
      false,
    );

    this.container.addEventListener(
      'touchmove',
      (evt) => {
        evt.preventDefault();
        isTouch = !!evt.touches;
        evt = evt.changedTouches[0];
        calcualteDistance(evt.clientX, evt.clientY);
      },
      false,
    );

    const calcualteDistance = (mouseX, mouseY) => {
      if (lastMouseX > -1 && !this.avatar.isDizzy) {
        mouseTravel += distance(
          { x: mouseX, y: mouseY },
          { x: lastMouseX, y: lastMouseY },
        );
      }
      lastMouseX = mouseX;
      lastMouseY = mouseY;
    };

    const checkTravelDistance = () => {
      const current = Date.now();

      if (lastMouseTime && lastMouseTime !== current) {
        const threshold = isTouch ? 3500 : 5000;

        if (!this.avatar.isDizzy && mouseTravel > threshold) {
          this.avatar.prepareToBeDizzy();
        }

        mouseTravel = 0;
      }

      lastMouseTime = current;
      // trigger next round
      setTimeout(checkTravelDistance, 1200);
    };

    // start checking
    setTimeout(checkTravelDistance, 1200);
  };
}
