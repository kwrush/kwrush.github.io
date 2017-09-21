import * as THREE from 'three';
import { TweenMax } from 'gsap';
import { colors } from '../constants';

export default class Avatar {

    constructor () {
        this.mesh = new THREE.Object3D();
        this.mesh.name = 'avatar';
        this.mesh.castShadow = true;

        this._isBlinking = false;
        this._isConfusing = false;
        this._isWearingGlasses = false;

        this.willDizzy = false;
        this.isLookingAround = true;

        this._createHead();
        this._createNormalEyes();
        this._createDizzyEyes();
        this._createIris();
        this._createNose();
        this._createMouth();
        this._createEars();
        this._createHair();

        //this.mesh.applyMatrix(new THREE.Matrix4().makeTranslation(0, 60, 0));

        this._trackMouseSpeed();
    }

    behave = () => {
        if (this.willDizzy) {
            this.dizzy();
        } else if (this._canBlink() && Math.random() > 0.99) {
            this.blink();
        }
        //this.dizzy();
    }

    blink = () => {
<<<<<<< HEAD
        if (!this._isBlinking) {
            this._isBlinking = true;
            TweenMax.to(this.eyes.scale, 0.07, {y: 0, yoyo: true, repeat: 1, delay: 3});
            TweenMax.to(this.iris.scale, 0.07, {y: 0.01, yoyo: true, repeat: 1, delay: 3, onComplete: () => {
                this._isBlinking = false;
            }
        });
    }

    confuse = () => {
        const self = this;
        this._isConfusing = true;
        TweenMax.to(this.normalEyes.scale, 0.1, { y: 0.4, repeat: 1 });
        TweenMax.to(this.iris.scale, 0.1, { y: 0.5, repeat: 1 });
        TweenMax.to(this.mouth.scale, 0.1, {
            x: 2, y: 0.5, repeat: 1, onComplete: () => {
                TweenMax.to(this.normalEyes.scale, 0.1, { y: 1, repeat: 1, delay: 3 });
                TweenMax.to(this.iris.scale, 0.1, { y: 1, repeat: 1, delay: 3 });
                TweenMax.to(this.mouth.scale, 0.1, {
                    x: 1, y: 1, repeat: 1, delay: 3, onComplete: () => {
                        self._isConfusing = false;
                    }
                });
            }
        });
    }

    dizzy = () => {
        const self = this;
        if (this.willDizzy && !this._isDizzy) {
            // The avatar will keep looking at the vertices of this circle, which
            // gives the avatar a dizzy feeling
            this._dizzyCircle = new THREE.CircleGeometry(30, 100);
            this._dizzyCircle.applyMatrix(new THREE.Matrix4().makeTranslation(0, -70, -90));
            this._dizzyCircle.applyMatrix(new THREE.Matrix4().makeRotationX(3.1));

            // index of the vertices, ignore the first vertex that is the circle center
            this._dizzyFrame = 1;
            this._isDizzy = true;
            this._toggleDizzyFace(this._isDizzy);
        } 

        if (this._isDizzy) {
            // repeat from the first vertex
            if (this._dizzyFrame > 100) this._dizzyFrame = 1;
            this.mesh.lookAt(this._dizzyCircle.vertices[this._dizzyFrame++]);

            setTimeout(() => {
                this._isDizzy = false;
                this.willDizzy = false;
                this._toggleDizzyFace(this._isDizzy);
            }, 5000);
>>>>>>> 8153d55... mouse moves fast makes avatar dizzy
        }
    }

    lookAt = (target) => {
        const vector = this._constrainHeadRotation(target);
        if (!this.oldTargetLookPos) this.oldTargetLookPos = new THREE.Vector3();
        this.newTargetLookPos = vector.clone();

        // Gradually rotate head to the final target
        this.lookPos = this.oldTargetLookPos.clone()
            .add(this.newTargetLookPos.sub(this.oldTargetLookPos).multiplyScalar(0.15));
        this.mesh.lookAt(this.lookPos);

        this.oldTargetLookPos = this.lookPos;
    }

    _toggleDizzyFace = (dizzy) => {
        this.dizzyEyes.visible = dizzy;
        this.normalEyes.visible = !dizzy;
        this.iris.visible = !dizzy;

        const mouthScaleX = dizzy ? 0.7 : 1;
        const mouthScaleY = dizzy ? 2 : 1;       
        this.mouth.scale.set(mouthScaleX, mouthScaleY, 1);
    }

    _canBlink = () => {
        return !this._isBlinking && !this._isConfusing && !this.willDizzy; 
    }

    _canConfuse = () => {
        return !this._isBlinking && !this._isConfusing && !this.willDizzy && !this.isLookingAround; 
    }

    _createHead = () => {
        const headGeom = new THREE.BoxGeometry(60, 56, 54);
        const headMat = new THREE.MeshPhongMaterial({
            color: colors.skin,
            flatShading: THREE.FlatShading
        });
        this.head = new THREE.Mesh(headGeom, headMat);
        this.head.receiveShadow = true;
        this.mesh.add(this.head);
    }

    _createNormalEyes = () => {
        const eyeGeom = new THREE.BoxGeometry(20, 20, 1);
        const eyeMat = new THREE.MeshPhongMaterial({
            color: colors.eye,
            flatShading: THREE.FlatShading
        });

        const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
        leftEye.position.set(18, 0, 0);

        const rightEye = leftEye.clone();
        rightEye.position.set(-18, 0, 0);

        this.normalEyes = new THREE.Object3D();
        this.normalEyes.position.set(0, 6, 28);
        this.normalEyes.add(leftEye);
        this.normalEyes.add(rightEye);
        
        this.mesh.add(this.normalEyes);
    }

    _createDizzyEyes = () => {
        const eyeGeom = new THREE.PlaneGeometry(14, 3, 1, 1);
        const eyeMat = new THREE.MeshLambertMaterial({
            color: colors.iris
        });

        const leftEye1 = new THREE.Mesh(eyeGeom, eyeMat);
        const leftEye2 = leftEye1.clone();

        const rightEye1 = leftEye1.clone();
        const rightEye2 = leftEye1.clone();

        leftEye1.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -7, 0));
        leftEye1.rotation.z = Math.PI / 4;
        leftEye2.rotation.z = -Math.PI / 4;
        
        rightEye1.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 7, 0));
        rightEye1.rotation.z = Math.PI / 4;
        rightEye2.rotation.z = -Math.PI / 4;

        const leftEye = new THREE.Object3D();
        const rightEye = leftEye.clone();

        leftEye.add(leftEye1);
        leftEye.add(leftEye2);
        rightEye.add(rightEye1);
        rightEye.add(rightEye2);

        leftEye.position.set(17, 0, 0);        
        rightEye.position.set(-17, 0, 0);

        this.dizzyEyes = new THREE.Object3D();
        this.dizzyEyes.position.set(0, 8, 28);
        this.dizzyEyes.add(leftEye);
        this.dizzyEyes.add(rightEye);
        this.dizzyEyes.visible = false;

        this.mesh.add(this.dizzyEyes);
    }

    _createIris = () => {
        const irisGeom = new THREE.BoxGeometry(5, 5, 1);
        const irisMat = new THREE.MeshPhongMaterial({
            color: colors.iris,
            flatShading: THREE.FlatShading
        });

        const leftIris = new THREE.Mesh(irisGeom, irisMat);
        leftIris.position.set(15, 0, 0);

        const rightIris = leftIris.clone();
        rightIris.position.set(-15, 0, 0);

        this.iris = new THREE.Object3D();
        this.iris.position.set(0, 6, 30);
        this.iris.add(leftIris);
        this.iris.add(rightIris);
        
        this.mesh.add(this.iris);
    }

    _createNose = () => {
        const noseGeom = new THREE.Geometry();
        noseGeom.vertices = [
            new THREE.Vector3(0, 0, 10),
            new THREE.Vector3(-7, 0, 0),
            new THREE.Vector3(0, 18, 0),
            new THREE.Vector3(7, 0, 0)
        ];
        noseGeom.faces = [
            new THREE.Face3(0, 1, 3),
            new THREE.Face3(2, 1, 0),
            new THREE.Face3(0, 3, 2)
        ];
        const noseMat = new THREE.MeshPhongMaterial({
            color: colors.nose,
            flatShading: THREE.FlatShading
        });

        this.nose = new THREE.Mesh(noseGeom, noseMat);
        this.nose.position.set(0, -8, 26);
        this.nose.castShadow = true;
        this.mesh.add(this.nose);
    } 
    
    _createMouth = () => {
        const mouthGeom = new THREE.PlaneGeometry(6, 4, 1, 1);
        const mouthMat = new THREE.MeshLambertMaterial({
            color: colors.lip
        });

        this.mouth = new THREE.Mesh(mouthGeom, mouthMat);
        this.mouth.position.set(0, -20, 28);
        this.mesh.add(this.mouth);
    }

    _createEars = () => {
        const earGeom = new THREE.BoxGeometry(4, 18, 12);
        const earMat = new THREE.MeshPhongMaterial({
            color: colors.skin,
            flatShading: THREE.FlatShading
        });

        const leftEar = new THREE.Mesh(earGeom, earMat);
        leftEar.position.set(33, 0, 0);
        leftEar.rotation.y = -Math.PI / 6;
        leftEar.castShadow = true;

        const rightEar = leftEar.clone();
        rightEar.position.set(-33, 0, 0);
        rightEar.rotation.y = Math.PI / 6;
        rightEar.castShadow = true;

        this.ears = new THREE.Object3D();
        this.ears.add(leftEar);
        this.ears.add(rightEar);
        this.ears.position.set(0, 5, -5);

        this.mesh.add(this.ears);
    }
    
    _createHair = () => {
        const hairGeom = new THREE.BoxGeometry(16, 18, 15);
        const hairMat = new THREE.MeshLambertMaterial({
            color: colors.hair
        });
        const hair = new THREE.Mesh(hairGeom, hairMat);
        hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 9, 0));

        this.hairs = new THREE.Object3D();
        this.hairTop = new THREE.Object3D();

        // create hair combined by 4*4 box grid
        const startPosX = -24;
        const startPosZ = -22;
        let hairAngle = Math.PI / 2;
        for (let i = 0; i < 16; i++) {
            let h = hair.clone();
            let row = i % 4; 
            let col = Math.floor(i / 4);
            h.position.set(startPosX + col * 16, 0, startPosZ + row * 15);
            // Make hair cube in the middle a bit higher
            if (col === 1) {
                hairAngle = Math.PI / 3;
            } else if (col === 2) {
                hairAngle = Math.PI / 2.5;
            } else {
                hairAngle = Math.PI / 2;
            }
            h.scale.y = 1 * Math.cos(row / 3) / Math.sin(hairAngle);
            this.hairTop.add(h);
        }

        this.hairTop.position.y += 28;
        this.hairs.add(this.hairTop);

        this.hairSide = new THREE.Object3D();

        const skewMatrix = new THREE.Matrix4().set(
            1, 0, 0, 0,
            0, 1, 0.2, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );

        const hairSideGeom = new THREE.BoxGeometry(4, 36, 32);
        const hairSideRight = new THREE.Mesh(hairSideGeom.applyMatrix(skewMatrix), hairMat);
        const hairSideLeft = hairSideRight.clone();

        hairSideRight.position.set(-30, 0, 0);
        hairSideLeft.position.set(30, 0, 0);

        this.hairSide.add(hairSideLeft);
        this.hairSide.add(hairSideRight);
        this.hairSide.position.set(0, 18, -10);
        this.hairs.add(this.hairSide);

        const hairBackGeom = new THREE.BoxGeometry(64, 62, 10);
        this.hairBack = new THREE.Mesh(hairBackGeom, hairMat);
        this.hairBack.position.set(0, 15, -25);
        this.hairs.add(this.hairBack);

        this.hairs.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
            }
        });

        this.mesh.add(this.hairs);
    }

    _constrainHeadRotation(vector) {
        const minRad = Math.PI / 5;
        if (vector.x > minRad) {
            vector.x = minRad;
        } else if (vector.x < -minRad) {
            vector.x = -minRad;
        }

        if (vector.y > minRad) {
            vector.y = minRad;
        } else if (vector.y < -minRad) {
            vector.y = -minRad;
        } 

        return vector;
    }

    /**
     * Moves mouse fast can make the avatar dizzy
     * Basic idea here is accumulate the distance of mouse movement
     * within a certain amount of time
     */
    _trackMouseSpeed = () => {
        let lastMouseX = -1;
        let lastMouseY = -1;
        let lastMouseTime;
        let mouseTravel = 0;

        document.addEventListener('mousemove', (e) => {
            let mouseX = e.clientX;
            let mouseY = e.clientY;
            if (lastMouseX > -1 && !this.willDizzy) {
                mouseTravel += Math.max(Math.abs(mouseX - lastMouseX), Math.abs(mouseY - lastMouseY));
            }
            lastMouseX = mouseX;
            lastMouseY = mouseY;
        }, false);

        const calculateDistance = () => {
            let current = (new Date()).getTime();

            if (lastMouseTime && lastMouseTime !== current) {
                if (!this.willDizzy && mouseTravel > 6000) {
                    this.willDizzy = true;
                }
                mouseTravel = 0;
            }

            lastMouseTime = current;
            // trigger next round of checking
            setTimeout(calculateDistance, 1500);
        };

        setTimeout(calculateDistance, 1500);
    }
}