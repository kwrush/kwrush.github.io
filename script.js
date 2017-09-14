(function () {
    var WIDTH = window.innerWidth;
    var HEIGHT = window.innerHeight;
    var aspectRatio = WIDTH / HEIGHT;
    var fieldOfView = 60;
    var nearPlane = 1;
    var farPlane = 2000;

    var mousePos = {
        x: 0,
        y: 0
    };

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

        geometry = new THREE.CubeGeometry(150, 150, 150);
        material = new THREE.MeshNormalMaterial();

        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        renderer = new THREE.WebGLRenderer({
            alpha: true
        });
        renderer.setSize(WIDTH, HEIGHT);

        container.appendChild(renderer.domElement);
        
        document.addEventListener('mousemove', handleMouseMove, false);
    }

    function animate() {
        requestAnimationFrame(animate);
        var vect = new THREE.Vector3(mousePos.x, mousePos.y, 0.5);
        mesh.lookAt(vect);
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

})();