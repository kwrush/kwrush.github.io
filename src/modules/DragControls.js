/*
 * @author zz85 / https://github.com/zz85
 * @author mrdoob / http://mrdoob.com
 * Modified to fit my requirements
 * Running this will allow you to drag three.js objects around the screen.
 */

import * as THREE from 'three';
import { normalize } from '../utils';

export default class DragControls extends THREE.EventDispatcher {
  constructor(object, camera, domElement) {
    super();

    this.object = object;
    this.camera = camera;
    this.domElement = domElement;

    this.plane = new THREE.Plane();
    this.raycaster = new THREE.Raycaster();

    this.mouse = new THREE.Vector2();
    this.offset = new THREE.Vector3();
    this.intersection = new THREE.Vector3();

    this.selected = null;
    this.hovered = null;

    this.isDragging = false;
    this.enabled = true;

    this.activate();
  }

  activate = () => {
    this.domElement.addEventListener(
      'mousemove',
      this.onDocumentMouseMove,
      false,
    );
    this.domElement.addEventListener(
      'mousedown',
      this.onDocumentMouseDown,
      false,
    );
    this.domElement.addEventListener(
      'mouseup',
      this.onDocumentMouseCancel,
      false,
    );
    this.domElement.addEventListener(
      'mouseleave',
      this.onDocumentMouseCancel,
      false,
    );
    this.domElement.addEventListener(
      'touchmove',
      this.onDocumentTouchMove,
      false,
    );
    this.domElement.addEventListener(
      'touchstart',
      this.onDocumentTouchStart,
      false,
    );
    this.domElement.addEventListener(
      'touchend',
      this.onDocumentTouchEnd,
      false,
    );
  };

  deactivate = () => {
    this.domElement.removeEventListener(
      'mousemove',
      this.onDocumentMouseMove,
      false,
    );
    this.domElement.removeEventListener(
      'mousedown',
      this.onDocumentMouseDown,
      false,
    );
    this.domElement.removeEventListener(
      'mouseup',
      this.onDocumentMouseCancel,
      false,
    );
    this.domElement.removeEventListener(
      'mouseleave',
      this.onDocumentMouseCancel,
      false,
    );
    this.domElement.removeEventListener(
      'touchmove',
      this.onDocumentTouchMove,
      false,
    );
    this.domElement.removeEventListener(
      'touchstart',
      this.onDocumentTouchStart,
      false,
    );
    this.domElement.removeEventListener(
      'touchend',
      this.onDocumentTouchEnd,
      false,
    );
  };

  onDocumentMouseMove = (event) => {
    event.preventDefault();

    this._handleCursorMove(event.clientX, event.clientY);

    if (this.isDragging) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.object.children);

    if (intersects.length > 0) {
      const obj = intersects[0].object;

      // Here to use the position of parent mesh
      // since we are moving the objects all together
      this.plane.setFromNormalAndCoplanarPoint(
        this.camera.getWorldDirection(this.plane.normal),
        obj.parent.position,
      );

      if (this.hovered !== obj) {
        this.dispatchEvent({ type: 'hoveron', object: obj });

        this.domElement.style.cursor = 'pointer';
        this.hovered = obj;
      }
    } else {
      if (this.hovered !== null) {
        this.dispatchEvent({ type: 'hoveroff', object: this.hovered });

        this.domElement.style.cursor = 'auto';
        this.hovered = null;
      }
    }
  };

  onDocumentMouseDown = (event) => {
    event.preventDefault();

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.object.children);

    if (intersects.length > 0) {
      this.selected = intersects[0].object;

      if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
        this.offset.copy(this.intersection).sub(this.selected.parent.position);
      }

      this.domElement.style.cursor = 'move';
      this.isDragging = true;

      this.dispatchEvent({ type: 'dragstart', object: this.selected });
    }
  };

  onDocumentMouseCancel = (event) => {
    event.preventDefault();

    if (this.selected) {
      this.dispatchEvent({ type: 'dragend', object: this.selected });
      this.selected = null;
    }

    this.isDragging = false;
    this.domElement.style.cursor = 'auto';
  };

  onDocumentTouchMove = (event) => {
    event.preventDefault();
    event = event.changedTouches[0];

    this._handleCursorMove(event.clientX, event.clientY);
  };

  onDocumentTouchStart = (event) => {
    event.preventDefault();
    event = event.changedTouches[0];

    const rect = this.domElement.getBoundingClientRect();
    const tmp = normalize(
      event.clientX - rect.left,
      event.clientY - rect.top,
      rect.width,
      rect.height,
    );
    this.mouse.x = tmp.x;
    this.mouse.y = tmp.y;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.object.children);

    if (intersects.length > 0) {
      this.selected = intersects[0].object;

      // Here to use the position of parent mesh
      // since we are moving the objects all together
      this.plane.setFromNormalAndCoplanarPoint(
        this.camera.getWorldDirection(this.plane.normal),
        this.selected.parent.position,
      );

      if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
        this.offset.copy(this.intersection).sub(this.selected.parent.position);
      }

      this.domElement.style.cursor = 'move';
      this.isDragging = true;

      this.dispatchEvent({ type: 'dragstart', object: this.selected });
    }
  };

  onDocumentTouchEnd = (event) => {
    event.preventDefault();

    if (this.selected) {
      this.dispatchEvent({ type: 'dragend', object: this.selected });
      this.selected = null;
    }

    this.isDragging = false;
    this.domElement.style.cursor = 'auto';
  };

  _handleCursorMove = (cursorX, cursorY) => {
    const rect = this.domElement.getBoundingClientRect();
    const tmp = normalize(
      cursorX - rect.left,
      cursorY - rect.top,
      rect.width,
      rect.height,
    );

    this.mouse.x = tmp.x;
    this.mouse.y = tmp.y;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    if (this.selected && this.enabled) {
      if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
        const vect = this.intersection.sub(this.offset);

        const w = (rect.width + rect.left) / 2;
        const h = (rect.height + rect.top) / 2;
        const vx = Math.abs(vect.x);
        const vy = Math.abs(vect.y);

        if (vx > 0.4 * w) {
          vect.x = (vect.x / vx) * 0.4 * w;
        }

        if (vy > 0.4 * h) {
          vect.y = (vect.y / vy) * 0.4 * h;
        }

        this.selected.parent.position.copy(vect);
      }

      this.dispatchEvent({ type: 'drag', object: this.selected });
    }
  };
}
