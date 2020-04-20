function init() {
    window.frame = 0;

    var scene = new THREE.Scene();
    var gui = new dat.GUI();

    var enableFog = false;

    if (enableFog){
        scene.fog = new THREE.FogExp2(0xfc0303, 0.2);
    }

    /* Lights in Three.js:
        - PointLight (lightbulb)
        - 

    */
    var pointLight = getPointLight(1);
    var sphere = getSphere(0.05);

    var box = getBox(1, 1, 1);
    var plane = getPlane(20);

    plane.name = 'plane-1';
    box.name = "box-1";

    // Position the box on the ground
    box.position.y = box.geometry.parameters.height / 2;
    // Three.js uses radians
    plane.rotation.x = Math.PI / 2;
    // plane.position.y = 1;
    pointLight.position.y = 2;
    pointLight.intensity = 2;

    gui.add(pointLight, 'intensity', 0, 10);
    gui.add(pointLight.position, 'y', 0, 5);

    // Add geometry to plane
    // plane.add(box);
    // Add geometry to scene
    scene.add(box);
    scene.add(plane);
    scene.add(pointLight);
    pointLight.add(sphere);

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
    renderer.setClearColor('rgb(120,120,120)'/*0xfc0303*/);
    document.getElementById("webgl").appendChild(renderer.domElement);
    
    var controls = new THREE.OrbitControls(camera, renderer.domElement);


    updateScene(renderer, scene, camera, controls);

    return scene;
}

function getBox(w, h, d) {
    var geometry = new THREE.BoxGeometry(w, h, d);
    var material = new THREE.MeshPhongMaterial({
        color: 'rgb(120,120,120)',
        //0x0366fc,
    });
    var mesh = new THREE.Mesh(geometry, material);

    return mesh;

    new TWEEN.Tween(mesh.material.color.getHSV())
    .to({h: h, s: s, v: v}, 200)
    .easing(TWEEN.Easing.Quartic.In)
    .onUpdate(
        function()
        {
            mesh.material.color.setHSV(this.h, this.s, this.v);
        }
    )
    .start();
}

function getPlane(size) {
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshPhongMaterial({
        color: 'rgb(120,120,120)',
        // 0xf2ff00,
        side: THREE.DoubleSide,
    });
    var mesh = new THREE.Mesh(geometry, material);

    return mesh;
}

function getSphere(size) {
    var geometry = new THREE.SphereGeometry(size, 24, 24);
    var material = new THREE.MeshBasicMaterial({
        color: 'rgb(255,255,255)',
        //0x0366fc,
    });
    var mesh = new THREE.Mesh(geometry, material);

    return mesh;
}

function getPointLight(intensity) {
    var light = new THREE.PointLight(0xffffff, intensity);

    return light;
}

function updateScene(renderer, scene, camera, controls) {
    if (window.frame == 30){
        window.frame = 0;
    }
    renderer.render(
        scene, 
        camera
    );
    // #region Extraneous
    // var plane = scene.getObjectByName('plane-1');
    // var box = scene.getObjectByName('box-1');

    // plane.rotation.y += 0.001;
    // plane.rotation.z += 0.001;

    // if (window.frame < 15) {
    //     box.scale.x += 0.1
    // } else {
    //     box.scale.x -= 0.1
    // }
    
    // window.frame += 1;

    // console.info(window.frame);

    // var info = document.getElementById("info");

    // info.innerHTML = window.frame;

    // Apply methods to all children of scene object
    // scene.traverse(function(child) {
    //     child.scale.x += 0.001;
    // })
    // #endregion

    requestAnimationFrame(function () {
        // Recursively call update to continue grabbing the new animation frames
        updateScene(renderer, scene, camera, controls);
        
    });

    controls.update();
}

THREE.Color.prototype.getHSV = function()
{
    var rr, gg, bb,
        h, s,
        r = this.r,
        g = this.g,
        b = this.b,
        v = Math.max(r, g, b),
        diff = v - Math.min(r, g, b),
        diffc = function(c)
        {
            return (v - c) / 6 / diff + 1 / 2;
        };

    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(r);
        gg = diffc(g);
        bb = diffc(b);

        if (r === v) {
            h = bb - gg;
        } else if (g === v) {
            h = (1 / 3) + rr - bb;
        } else if (b === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        } else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: h,
        s: s,
        v: v
    };
};

var scene = init();
