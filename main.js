function init() {
    var scene = new THREE.Scene();

    var box = getBox(1, 2, 1);
    var plane = getPlane(4);

    // Position the box on the ground
    box.position.y = box.geometry.parameters.height / 2;
    // Three.js uses radians
    plane.rotation.x = Math.PI / 2;

    scene.add(box);
    scene.add(plane);

    var camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );

    // Move camera away from the scene origin
    camera.position.x = 1;
    camera.position.y = 2;
    camera.position.z = 5;

    // Look at the origin
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("webgl").appendChild(renderer.domElement);
    update(renderer, scene, camera);

    return scene;
}

function getBox(w, h, d) {
    var geometry = new THREE.BoxGeometry(w, h, d);
    var material = new THREE.MeshBasicMaterial({
        color: 0x00f6fa,
    });
    var mesh = new THREE.Mesh(geometry, material);

    return mesh;
}

function getPlane(size) {
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshBasicMaterial({
        color: 0xf2ff00,
        side: THREE.DoubleSide,
    });
    var mesh = new THREE.Mesh(geometry, material);

    return mesh;
}

function update(renderer, scene, camera) {
    renderer.render(scene, camera);
    requestAnimationFrame(function () {
        // Recursively call update to continue grabbing the new animation frames
        update(renderer, scene, camera);
    });
}

var scene = init();
