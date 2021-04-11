(()=>{"use strict";var e={n:t=>{var n=t&&t.__esModule?()=>t.default:()=>t;return e.d(n,{a:n}),n},d:(t,n)=>{for(var o in n)e.o(n,o)&&!e.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:n[o]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)};const t=THREE,n=TWEEN;var o=e.n(n);function r(e,t,n,o){return{x:e/n*2-1,y:-t/o*2+1}}function a(e){var t=e.target.getBoundingClientRect();return{x:e.clientX-t.left,y:e.clientY-t.top}}function i(e,t){return e+Math.floor(Math.random()*(t-e+1))}function s(e){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(e,t){return(c=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function u(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,o=h(e);if(t){var r=h(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return l(this,n)}}function l(e,t){return!t||"object"!==s(t)&&"function"!=typeof t?d(e):t}function d(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function h(e){return(h=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function m(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var f=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&c(e,t)}(o,e);var n=u(o);function o(e,a,i){var s;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,o),m(d(s=n.call(this)),"activate",(function(){s.domElement.addEventListener("mousemove",s.onDocumentMouseMove,!1),s.domElement.addEventListener("mousedown",s.onDocumentMouseDown,!1),s.domElement.addEventListener("mouseup",s.onDocumentMouseCancel,!1),s.domElement.addEventListener("mouseleave",s.onDocumentMouseCancel,!1),s.domElement.addEventListener("touchmove",s.onDocumentTouchMove,!1),s.domElement.addEventListener("touchstart",s.onDocumentTouchStart,!1),s.domElement.addEventListener("touchend",s.onDocumentTouchEnd,!1)})),m(d(s),"deactivate",(function(){s.domElement.removeEventListener("mousemove",s.onDocumentMouseMove,!1),s.domElement.removeEventListener("mousedown",s.onDocumentMouseDown,!1),s.domElement.removeEventListener("mouseup",s.onDocumentMouseCancel,!1),s.domElement.removeEventListener("mouseleave",s.onDocumentMouseCancel,!1),s.domElement.removeEventListener("touchmove",s.onDocumentTouchMove,!1),s.domElement.removeEventListener("touchstart",s.onDocumentTouchStart,!1),s.domElement.removeEventListener("touchend",s.onDocumentTouchEnd,!1)})),m(d(s),"onDocumentMouseMove",(function(e){if(e.preventDefault(),s._handleCursorMove(e.clientX,e.clientY),!s.isDragging){s.raycaster.setFromCamera(s.mouse,s.camera);var t=s.raycaster.intersectObjects(s.object.children);if(t.length>0){var n=t[0].object;s.plane.setFromNormalAndCoplanarPoint(s.camera.getWorldDirection(s.plane.normal),n.parent.position),s.hovered!==n&&(s.dispatchEvent({type:"hoveron",object:n}),s.domElement.style.cursor="pointer",s.hovered=n)}else null!==s.hovered&&(s.dispatchEvent({type:"hoveroff",object:s.hovered}),s.domElement.style.cursor="auto",s.hovered=null)}})),m(d(s),"onDocumentMouseDown",(function(e){e.preventDefault(),s.raycaster.setFromCamera(s.mouse,s.camera);var t=s.raycaster.intersectObjects(s.object.children);t.length>0&&(s.selected=t[0].object,s.raycaster.ray.intersectPlane(s.plane,s.intersection)&&s.offset.copy(s.intersection).sub(s.selected.parent.position),s.domElement.style.cursor="move",s.isDragging=!0,s.dispatchEvent({type:"dragstart",object:s.selected}))})),m(d(s),"onDocumentMouseCancel",(function(e){e.preventDefault(),s.selected&&(s.dispatchEvent({type:"dragend",object:s.selected}),s.selected=null),s.isDragging=!1,s.domElement.style.cursor="auto"})),m(d(s),"onDocumentTouchMove",(function(e){e.preventDefault(),e=e.changedTouches[0],s._handleCursorMove(e.clientX,e.clientY)})),m(d(s),"onDocumentTouchStart",(function(e){e.preventDefault(),e=e.changedTouches[0];var t=s.domElement.getBoundingClientRect(),n=r(e.clientX-t.left,e.clientY-t.top,t.width,t.height);s.mouse.x=n.x,s.mouse.y=n.y,s.raycaster.setFromCamera(s.mouse,s.camera);var o=s.raycaster.intersectObjects(s.object.children);o.length>0&&(s.selected=o[0].object,s.plane.setFromNormalAndCoplanarPoint(s.camera.getWorldDirection(s.plane.normal),s.selected.parent.position),s.raycaster.ray.intersectPlane(s.plane,s.intersection)&&s.offset.copy(s.intersection).sub(s.selected.parent.position),s.domElement.style.cursor="move",s.isDragging=!0,s.dispatchEvent({type:"dragstart",object:s.selected}))})),m(d(s),"onDocumentTouchEnd",(function(e){e.preventDefault(),s.selected&&(s.dispatchEvent({type:"dragend",object:s.selected}),s.selected=null),s.isDragging=!1,s.domElement.style.cursor="auto"})),m(d(s),"_handleCursorMove",(function(e,t){var n=s.domElement.getBoundingClientRect(),o=r(e-n.left,t-n.top,n.width,n.height);if(s.mouse.x=o.x,s.mouse.y=o.y,s.raycaster.setFromCamera(s.mouse,s.camera),s.selected&&s.enabled){if(s.raycaster.ray.intersectPlane(s.plane,s.intersection)){var a=s.intersection.sub(s.offset),i=(n.width+n.left)/2,c=(n.height+n.top)/2,u=Math.abs(a.x),l=Math.abs(a.y);u>.4*i&&(a.x=a.x/u*.4*i),l>.4*c&&(a.y=a.y/l*.4*c),s.selected.parent.position.copy(a)}s.dispatchEvent({type:"drag",object:s.selected})}})),s.object=e,s.camera=a,s.domElement=i,s.plane=new t.Plane,s.raycaster=new t.Raycaster,s.mouse=new t.Vector2,s.offset=new t.Vector3,s.intersection=new t.Vector3,s.selected=null,s.hovered=null,s.isDragging=!1,s.enabled=!0,s.activate(),s}return o}(t.EventDispatcher),v=15647149,y=2892331,p=16756064,w=14900586,g=16579836,M=591878,E=6139362,b=5812956,z="[THREE Glasses]",D="[THREE Avatar]",_="[THREE Scene]";function L(){}function P(e){return function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];try{return Promise.resolve(e.apply(this,t))}catch(e){return Promise.reject(e)}}}function S(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var x=function e(){var n=this,r=this,a=this,s=this,c=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),S(this,"act",P((function(){return r.isDizzy?r._nextAction=r.stopDizzy:r._nextAction=Math.random()<.7?r.blink:r.confuse,e=function(){if(null!=r._nextAction)return function(e){if(e&&e.then)return e.then(L)}(function(e,t){try{var n=e()}catch(e){return t(e)}return n&&n.then?n.then(void 0,t):n}((function(){return function(e,t){if(!t)return e&&e.then?e.then(L):Promise.resolve()}(r._nextAction.call())}),(function(e){console.error(e.message)})))},t=function(){r.act()},(n=e())&&n.then?n.then(t):t(n);var e,t,n}))),S(this,"blink",P((function(){var e=new(o().Tween)(a.normalEyes.scale);return new Promise((function(t){e.to({y:.01},70).repeat(1).yoyo(!0).onUpdate((function(){a.isDizzy?(a.iris.scale.y=1,t()):a.iris.scale.y=a.normalEyes.scale.y})).onComplete((function(){setTimeout(t,i(1e3,3e3))})).start()})).then((function(){return e.stop()}))}))),S(this,"confuse",P((function(){var e={mouthX:1,mouthY:1,eyeY:1},t=new(o().Tween)(e);return new Promise((function(n){t.to({mouthX:2,mouthY:.3,eyeY:.35},100).repeat(1).delay(i(1e3,3e3)).yoyo(!0).onUpdate((function(){s.isDizzy?(s.normalEyes.scale.y=1,s.iris.scale.y=1,n()):(s.normalEyes.scale.y=e.eyeY,s.iris.scale.y=e.eyeY,s.mouth.scale.x=e.mouthX,s.mouth.scale.y=e.mouthY)})).onComplete((function(){setTimeout(n,i(2e3,4e3))})).start()})).then((function(){return t.stop()}))}))),S(this,"lookAt",(function(e){var o=n._constrainHeadRotation(e);n.oldTargetLookPos||(n.oldTargetLookPos=new t.Vector3),n.newTargetLookPos=o.clone(),n.lookPos=n.oldTargetLookPos.clone().add(n.newTargetLookPos.sub(n.oldTargetLookPos).multiplyScalar(.15)),n.mesh.lookAt(n.lookPos),n.oldTargetLookPos=n.lookPos})),S(this,"isWearingGlasses",(function(){return!!n.mesh.getObjectByName(z)})),S(this,"wearGlasses",(function(e){e instanceof t.Object3D&&e.name===z&&(n.mesh.add(e),e.position.set(0,5,32))})),S(this,"prepareToBeDizzy",(function(){n._dizzyCircle||(n._dizzyCircle=new t.CircleGeometry(35,100),n._dizzyCircle.applyMatrix4((new t.Matrix4).makeTranslation(0,-50,-100)),n._dizzyCircle.applyMatrix4((new t.Matrix4).makeRotationX(Math.PI))),n._dizzyFrame=1,n._toggleDizzyFace()})),S(this,"dizzy",(function(){if(n.isDizzy&&n._dizzyCircle){n._dizzyFrame>100&&(n._dizzyFrame=1);var e=new t.Vector3;e.fromBufferAttribute(n._dizzyCircle.getAttribute("position"),n._dizzyFrame++),n.mesh.lookAt(e)}})),S(this,"stopDizzy",P((function(){return new Promise((function(e){setTimeout((function(){c._dizzyCircle=null,c._toggleDizzyFace(),e()}),5e3)}))}))),S(this,"_toggleDizzyFace",(function(){n.isDizzy=!n.isDizzy,n.dizzyEyes.visible=n.isDizzy,n.normalEyes.visible=!n.isDizzy,n.iris.visible=!n.isDizzy;var e=n.isDizzy?.7:1,t=n.isDizzy?2:1;n.mouth.scale.set(e,t,1)})),S(this,"_constrainHeadRotation",(function(e){var t=Math.PI/5;return e.x>t?e.x=t:e.x<-t&&(e.x=-t),e.y>t?e.y=t:e.y<-t&&(e.y=-t),e})),S(this,"_createHead",(function(){var e=new t.BoxBufferGeometry(60,56,54),o=new t.MeshPhongMaterial({color:v,flatShading:t.FlatShading});n.head=new t.Mesh(e,o),n.head.receiveShadow=!0,n.mesh.add(n.head)})),S(this,"_createNormalEyes",(function(){var e=new t.BoxBufferGeometry(20,20,1),o=new t.MeshLambertMaterial({color:g}),r=new t.Mesh(e,o);r.position.x=18;var a=r.clone();a.position.x=-18,n.normalEyes=new t.Object3D,n.normalEyes.position.set(0,6,28),n.normalEyes.add(r),n.normalEyes.add(a),n.mesh.add(n.normalEyes)})),S(this,"_createDizzyEyes",(function(){var e=new t.PlaneBufferGeometry(14,3,1,1),o=new t.MeshLambertMaterial({color:M}),r=new t.Mesh(e,o),a=r.clone(),i=r.clone(),s=r.clone();r.rotation.z=Math.PI/4,a.rotation.z=-Math.PI/4,i.rotation.z=Math.PI/4,s.rotation.z=-Math.PI/4;var c=new t.Object3D,u=c.clone();c.add(r),c.add(a),u.add(i),u.add(s),c.position.set(17,0,0),u.position.set(-17,0,0),n.dizzyEyes=new t.Object3D,n.dizzyEyes.position.set(0,6,28),n.dizzyEyes.add(c),n.dizzyEyes.add(u),n.dizzyEyes.visible=!1,n.mesh.add(n.dizzyEyes)})),S(this,"_createIris",(function(){var e=new t.BoxBufferGeometry(5,5,1),o=new t.MeshLambertMaterial({color:M}),r=new t.Mesh(e,o);r.position.set(15,0,0);var a=r.clone();a.position.set(-15,0,0),n.iris=new t.Object3D,n.iris.position.set(0,6,30),n.iris.add(r),n.iris.add(a),n.mesh.add(n.iris)})),S(this,"_createNose",(function(){var e=new t.BufferGeometry,o=[new t.Vector3(0,18,0),new t.Vector3(-7,0,0),new t.Vector3(0,0,10),new t.Vector3(0,0,10),new t.Vector3(7,0,0),new t.Vector3(0,18,0),new t.Vector3(-7,0,0),new t.Vector3(7,0,0),new t.Vector3(0,0,10),new t.Vector3(0,18,0),new t.Vector3(7,0,0),new t.Vector3(-7,0,0)];e.setFromPoints(o),e.computeVertexNormals();var r=new t.MeshPhongMaterial({color:p,flatShading:t.FlatShading});n.nose=new t.Mesh(e,r),n.nose.position.set(0,-8,26),n.nose.castShadow=!0,n.nose.receiveShadow=!0,n.mesh.add(n.nose)})),S(this,"_createMouth",(function(){var e=new t.PlaneBufferGeometry(6,4,1,1),o=new t.MeshLambertMaterial({color:w});n.mouth=new t.Mesh(e,o),n.mouth.position.set(0,-20,28),n.mesh.add(n.mouth)})),S(this,"_createEars",(function(){var e=new t.BoxBufferGeometry(4,18,12),o=new t.MeshPhongMaterial({color:v,flatShading:t.FlatShading}),r=new t.Mesh(e,o);r.position.set(33,0,0),r.rotation.y=-Math.PI/6,r.castShadow=!0,r.receiveShadow=!0;var a=r.clone();a.position.set(-33,0,0),a.rotation.y=Math.PI/6,a.castShadow=!0,a.receiveShadow=!0,n.ears=new t.Object3D,n.ears.add(r),n.ears.add(a),n.ears.position.set(0,5,-5),n.mesh.add(n.ears)})),S(this,"_createHair",(function(){var e=new t.BoxBufferGeometry(16,18,15),o=new t.MeshLambertMaterial({color:y}),r=new t.Mesh(e,o);r.geometry.applyMatrix4((new t.Matrix4).makeTranslation(0,9,0)),n.hairs=new t.Object3D,n.hairTop=new t.Object3D;for(var a=Math.PI/2,i=0;i<16;i++){var s=r.clone(),c=i%4,u=Math.floor(i/4);s.position.set(16*u-24,0,15*c-22),a=1===u?Math.PI/3:2===u?Math.PI/2.5:Math.PI/2,s.scale.y=1*Math.cos(c/3)/Math.sin(a),n.hairTop.add(s)}n.hairTop.position.y+=28,n.hairs.add(n.hairTop),n.hairSide=new t.Object3D;var l=(new t.Matrix4).set(1,0,0,0,0,1,.2,0,0,0,1,0,0,0,0,1),d=new t.BoxBufferGeometry(4,36,32),h=new t.Mesh(d.applyMatrix4(l),o),m=h.clone();h.position.set(-30,0,0),m.position.set(30,0,0),n.hairSide.add(m),n.hairSide.add(h),n.hairSide.position.set(0,18,-10),n.hairs.add(n.hairSide);var f=new t.BoxBufferGeometry(64,62,10);n.hairBack=new t.Mesh(f,o),n.hairBack.position.set(0,15,-25),n.hairs.add(n.hairBack),n.hairs.traverse((function(e){e instanceof t.Mesh&&(e.castShadow=!0,e.receiveShadow=!0)})),n.mesh.add(n.hairs)})),this.mesh=new t.Object3D,this.mesh.name=D,this.isDizzy=!1,this.isLookingAround=!0,this._nextAction=null,this._createHead(),this._createNormalEyes(),this._createDizzyEyes(),this._createIris(),this._createNose(),this._createMouth(),this._createEars(),this._createHair()};var T=function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.mesh=new t.Object3D,this.mesh.name=z;var n=new t.TorusBufferGeometry(16,2,16,4),o=new t.MeshPhongMaterial({color:E,flatShading:!0}),r=new t.Mesh(n,o);r.rotation.z=Math.PI/4;var a=r.clone();r.position.x=18,a.position.x=-18,this.mesh.add(r),this.mesh.add(a);var i=new t.TorusBufferGeometry(10,1.2,16,4,Math.PI/2),s=new t.Mesh(i,o);s.rotation.z=Math.PI/4,this.mesh.add(s);var c=new t.BoxBufferGeometry(3,3,40),u=new t.MeshPhongMaterial({color:E}),l=new t.Mesh(c,u),d=l.clone();l.position.set(32,10,-19),d.position.set(-32,10,-19),this.mesh.add(l),this.mesh.add(d),this.mesh.traverse((function(e){e instanceof t.Mesh&&(e.castShadow=!0)}));var h=new t.PlaneBufferGeometry(24,24,1,1),m=new t.MeshPhongMaterial({transparent:!0,color:b,opacity:.1}),f=new t.Mesh(h,m),v=f.clone();f.position.x=18,v.position.x=-18,this.mesh.add(f),this.mesh.add(v)};function j(e){return(j="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function O(e,t){return(O=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function A(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,o=B(e);if(t){var r=B(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return C(this,n)}}function C(e,t){return!t||"object"!==j(t)&&"function"!=typeof t?k(e):t}function k(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function B(e){return(B=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function V(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var R=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&O(e,t)}(i,e);var n=A(i);function i(){var e;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,i),V(k(e=n.call(this)),"createScene",(function(){var n=e.deviceWidth/e.deviceHeight;e.scene=new t.Scene,e.camera=new t.PerspectiveCamera(60,n,.1,2e3),e.camera.position.z=420,e.scene.add(e.camera),e.renderer=new t.WebGLRenderer({alpha:!0,antialias:!0}),e.renderer.setSize(e.deviceWidth,e.deviceHeight),e.renderer.shadowMap.enabled=!0,e.container.appendChild(e.renderer.domElement),e.container.addEventListener("mousemove",e._handleMouseMove,!1),e.container.addEventListener("mouseover",e._handleMouseEnterAndOut,!1),e.container.addEventListener("mouseout",e._handleMouseEnterAndOut,!1),e.container.addEventListener("touchmove",e._handleTouchMove,!1),e.container.addEventListener("touchstart",e._handleTouchStartAndEnd,!1),e.container.addEventListener("touchend",e._handleTouchStartAndEnd,!1),window.addEventListener("resize",e._handleWindowResize,!1)})),V(k(e),"createLight",(function(){var n=new t.HemisphereLight(15658734,11184810,.8),o=new t.DirectionalLight(16777215,.4);o.position.set(150,350,350),o.castShadow=!0,o.shadow.camera.left=-200,o.shadow.camera.right=200,o.shadow.camera.top=200,o.shadow.camera.bottom=-200,o.shadow.camera.near=1,o.shadow.camera.far=1e3,o.shadow.mapSize.width=2048,o.shadow.mapSize.height=2048,e.scene.add(n),e.scene.add(o)})),V(k(e),"createAvatar",(function(){e.avatar=new x,e.scene.add(e.avatar.mesh)})),V(k(e),"createGlasses",(function(){e.glasses=new T,e.scene.add(e.glasses.mesh),e.glasses.mesh.position.set(0,-100,80),e.avatar.wearGlasses(e.glasses.mesh),e.dragControls=new f(e.glasses.mesh,e.camera,e.renderer.domElement),e.dragControls.addEventListener("dragstart",(function(t){e.scene.add(e.glasses.mesh),e.glasses.mesh.position.z=80,e.dispatchEvent({type:"glassesoff"})})),e.dragControls.addEventListener("drag",(function(t){e.glasses.mesh.position.z=80})),e.dragControls.addEventListener("dragend",(function(t){var n=e.glasses.mesh.position;Math.abs(n.x)<20&&Math.abs(n.y)<=20&&(e.avatar.wearGlasses(e.glasses.mesh),!e.avatar.isDizzy&&e.avatar.isWearingGlasses()&&e.dispatchEvent({type:"glasseson"}))}))})),V(k(e),"setAvatarLookAround",(function(t){t?null===e._lookAroundInterval&&(e._lookAroundInterval=setInterval((function(){e.mouseVector.set((Math.random()>.5?.5:-.5)*Math.random(),(Math.random()>.5?.3:-.4)*Math.random(),.5)}),5e3)):null!==e._lookAroundInterval&&(clearInterval(e._lookAroundInterval),e._lookAroundInterval=null)})),V(k(e),"loop",(function(){e.setAvatarLookAround(e.avatar.isLookingAround),e.avatar.isDizzy?(e.avatar.dizzy(),e.avatar.isLookingAround&&e.mouseVector.set(0,0,.5)):(e.avatar.isWearingGlasses()&&e.dispatchEvent({type:"glasseson"}),e.avatar.lookAt(e.mouseVector)),e.animate()})),V(k(e),"animate",(function(){window.requestAnimationFrame(e.loop),o().update(),e.renderer.render(e.scene,e.camera)})),V(k(e),"_handleMouseMove",(function(t){t.preventDefault();var n=a(t);e._updateMouseVector(n.x,n.y)})),V(k(e),"_handleMouseEnterAndOut",(function(t){t.preventDefault(),e.avatar.isLookingAround="mouseout"===t.type})),V(k(e),"_handleTouchMove",(function(t){t.preventDefault();var n=a(t=t.changedTouches[0]);e._updateMouseVector(n.x,n.y)})),V(k(e),"_handleTouchStartAndEnd",(function(t){t.preventDefault(),e.avatar.isLookingAround="touchend"===t.type})),V(k(e),"_handleWindowResize",(function(){e.deviceWidth=e.container.clientWidth,e.deviceHeight=e.container.clientHeight,e.camera.aspect=e.deviceWidth/e.deviceHeight,e.camera.updateProjectionMatrix(),e.renderer.setSize(e.deviceWidth,e.deviceHeight)})),V(k(e),"_updateMouseVector",(function(t,n){var o=r(t,n,e.deviceWidth,e.deviceHeight);e.mouseVector.setX(o.x),e.mouseVector.setY(o.y)})),V(k(e),"_trackMouseSpeed",(function(){var t,n=-1,o=-1,r=0,a=!1;e.container.addEventListener("mousemove",(function(e){e.preventDefault(),a=!!e.touches,i(e.clientX,e.clientY)}),!1),e.container.addEventListener("touchmove",(function(e){e.preventDefault(),a=!!e.touches,e=e.changedTouches[0],i(e.clientX,e.clientY)}),!1);var i=function(t,a){var i,s;n>-1&&!e.avatar.isDizzy&&(r+=(i={x:t,y:a},s={x:n,y:o},Math.sqrt(Math.pow(i.x-s.x,2)+Math.pow(i.y-s.y,2)))),n=t,o=a};setTimeout((function n(){var o=Date.now();if(t&&t!==o){var i=a?3500:5e3;!e.avatar.isDizzy&&r>i&&e.avatar.prepareToBeDizzy(),r=0}t=o,setTimeout(n,1200)}),1200)})),e.name=_,e.container=document.querySelector(".world"),e.deviceWidth=e.container.clientWidth,e.deviceHeight=e.container.clientHeight,e.mouseVector=new t.Vector3(0,0,.5),e._lookAroundInterval=null,e.createScene(),e.createLight(),e.createAvatar(),e.createGlasses(),e._trackMouseSpeed(),e.avatar.act(),e}return i}(t.EventDispatcher);document.addEventListener("DOMContentLoaded",(function(){var e=new R,t=document.querySelector(".intro"),n=document.querySelector(".tooltips");!function(e,t){var n=0,o="",r=!1;!function a(){var i=t[n],s=200-100*Math.random();o=r?i.substring(0,o.length-1):i.substring(0,o.length+1),e.innerHTML="<span>".concat(o,"</span>"),r&&(s/=2),r||o!==i?r&&""===o&&(r=!1,n=n===t.length-1?0:n+1,s=500):(r=!0,s=1500),setTimeout((function(){a()}),s)}()}(document.querySelector(".hobby"),["watching movies.","playing video games.","reading manga.","drawing.","football.","coding!"]),e.addEventListener("glassesoff",(function(e){t.classList.add("blur")}),!1),e.addEventListener("glasseson",(function(e){t.classList.remove("blur")}),!1),n.addEventListener("touchstart",(function(e){e.preventDefault(),n.classList.contains("hover")?n.classList.remove("hover"):n.classList.add("hover")}),!1),document.addEventListener("touchstart",(function(e){e.preventDefault(),e.target!==n&&n.classList.contains("hover")&&n.classList.remove("hover")}),!1),e.loop()}),!1)})();