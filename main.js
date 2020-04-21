function init() {
    window.frame = 0;

    var scene = new THREE.Scene();
    var gui = new dat.GUI();
    gui.closed = true;
    var clock = new THREE.Clock();

    var enableFog = false;

    if (enableFog){
        scene.fog = new THREE.FogExp2(0xfc0303, 0.2);
    }

    // var box = getBox(1, 1, 1);
    var plane = getPlane(30);
    // var pointLight = getPointLight(1);
    // var spotLight = getSpottLight(1);
    var directionalLight = getDirectionalLight(1);
    // var ambientLight = getAmbientLight(1);
    var sphere = getSphere(0.05);
    var boxGrid = getBoxGrid(10, 1.5);
    boxGrid.name = 'boxGrid';
    // var helper = new THREE.CameraHelper(directionalLight.shadow.camera);

    plane.name = 'plane-1';
    // box.name = "box-1";

    // Position the box on the ground
    // box.position.y = box.geometry.parameters.height / 2;
    // Three.js uses radians
    plane.rotation.x = Math.PI / 2;
    // plane.position.y = 1;
    directionalLight.intensity = 2;
    directionalLight.position.x = 13;
    directionalLight.position.y = 10;
    directionalLight.position.z = 10;
    // directionalLight.penumbra =.25;

    gui.add(directionalLight, 'intensity', 0, 10);
    gui.add(directionalLight.position, 'x', -20, 20);
    gui.add(directionalLight.position, 'y', 0, 20);
    gui.add(directionalLight.position, 'z', -20, 20);
    // gui.add(directionalLight, 'penumbra', 0, 1);

    // Add geometry to plane
    // plane.add(box);
    // Add geometry to scene
    // scene.add(box);
    scene.add(plane);
    scene.add(directionalLight);
    directionalLight.add(sphere);
    // scene.add(ambientLight);
    scene.add(boxGrid);
    // scene.add(helper);

    var camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );

    // Move camera away from the scene origin
    camera.position.x = 10;
    camera.position.y = 18;
    camera.position.z = -18;

    // Look at the origin
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('rgb(120,120,120)'/*0xfc0303*/);
    document.getElementById("webgl").appendChild(renderer.domElement);
    
    var controls = new THREE.OrbitControls(camera, renderer.domElement);


    updateScene(renderer, scene, camera, controls, clock);

    return scene;
}

function getBox(w, h, d) {
    var geometry = new THREE.BoxGeometry(w, h, d);
    var material = new THREE.MeshPhongMaterial({
        color: '#900303',
        //0x0366fc,
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    mesh.castShadow = true;
    
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

function getBoxGrid(amount, separationMultiplier) {
	var group = new THREE.Group();

	for (var i=0; i<amount; i++) {
		var obj = getBox(1, 1, 1);
		obj.position.x = i * separationMultiplier;
		obj.position.y = obj.geometry.parameters.height/2;
		group.add(obj);
		for (var j=1; j<amount; j++) {
			var obj = getBox(1, 1, 1);
			obj.position.x = i * separationMultiplier;
			obj.position.y = obj.geometry.parameters.height/2;
			obj.position.z = j * separationMultiplier;
			group.add(obj);
		}
	}

	group.position.x = -(separationMultiplier * (amount-1))/2;
	group.position.z = -(separationMultiplier * (amount-1))/2;

	return group;
}

function getPlane(size) {
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshPhongMaterial({
        color: 'rgb(120,120,120)',
        // 0xf2ff00,
        side: THREE.DoubleSide,
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    mesh.receiveShadow = true;

    return mesh;
}

function getSphere(size) {
    var geometry = new THREE.SphereGeometry(size, 24, 24);
    var material = new THREE.MeshBasicMaterial({
        color: '#FCFF18',
        //0x0366fc,
    });
    var mesh = new THREE.Mesh(geometry, material);

    return mesh;
}

function getPointLight(intensity) {
    var light = new THREE.PointLight(0xffffff, intensity);
    light.castShadow = true;

    return light;
}

function getSpottLight(intensity) {
    var light = new THREE.SpotLight(0xffffff, intensity);
    light.castShadow = true;

    light.shadow.bias = 0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

    return light;
}

function getDirectionalLight(intensity) {
    var light = new THREE.DirectionalLight(0xffffff, intensity);
    light.castShadow = true;

    // Default vaules: 5, -5
    light.shadow.camera.top = 10;
    light.shadow.camera.right = 10;
    light.shadow.camera.bottom = -10;
    light.shadow.camera.left = -10;

    return light;
}

function getAmbientLight(intensity) {
    var light = new THREE.AmbientLight(0x30f9ff, intensity);

    return light;
}

function updateScene(renderer, scene, camera, controls, clock) {
    if (window.frame == 30){
        window.frame = 0;
    }
    renderer.render(
        scene, 
        camera
    );

    controls.update();

    var timeElapsed = clock.getElapsedTime();

    var boxGrid = scene.getObjectByName('boxGrid');
    boxGrid.children.forEach(function(child, index) {
        var x = timeElapsed * 5 + index;
        child.scale.y = (noise.simplex2(x,x) + 1) / 2 + 0.001;
        child.position.y = child.scale.y/2;
    });
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

    // Apply methods to all children of scene object
    // scene.traverse(function(child) {
    //     child.scale.x += 0.001;
    // })

    // #endregion

    var info = document.getElementById("info");
    var xp = document.getElementById("xpos");
    var yp = document.getElementById("ypos");
    var zp = document.getElementById("zpos");

    xp.innerHTML = camera.position.x.toFixed(2);
    yp.innerHTML = camera.position.y.toFixed(2);
    zp.innerHTML = camera.position.z.toFixed(2);

    requestAnimationFrame(function () {
        // Recursively call update to continue grabbing the new animation frames
        updateScene(renderer, scene, camera, controls, clock);
        
    });

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
