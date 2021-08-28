import * as THREE from "./three.js/build/three.module.js";
import { GLTFLoader } from "./three.js/examples/jsm/loaders/GLTFLoader.js";
import { ARButton } from "./three.js/examples/jsm/webxr/ARButton.js";
import { OrbitControls } from "./three.js/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "./three.js/examples/jsm/loaders/RGBELoader.js";

var canvas;
var renderer;
var camera;
var scene;
var clock;
var directionalLight;
var envMap;
var orbitControls;
var raycaster;
var mouse;
var modelUrl;

var arController;
var isPlaced = false;
var reticle;
let hitTestSource = null;
let hitTestSourceRequested = false;

var mainScene;
var sceneMeshes = [];

const xrmodestate = {
  ARMode:"ARMODE",
  ObjectMode:"OBJECTMODE",
}

let xrStateToggle = xrmodestate.ObjectMode;

function Init() {
  // Canvas
  canvas = document.querySelector("#threejscanvas");

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.xr.enabled = true;

  // Scene
  scene = new THREE.Scene();

  clock = new THREE.Clock();

  // HDRI
  setupHDRI("three.js/main/hdr/", "christmas_photo_studio_04_1k.hdr");
  // Camera
  setupCamera();
  // Lights
  setupLights();
  // GLFT Model Import
  modelUrl = localStorage.getItem("productModelURL");
  importGltfModel(modelUrl);
 
  //AR Controller
  const xr = navigator.xr;
    if ("xr" in window.navigator) {
        //WebXR supported
        console.log("WebXR is supported");
        ARController();
    } else {
        console.log("WebXR not supported");
    }
}

function Animate() {
  requestAnimationFrame(Animate);
  renderer.setAnimationLoop(Render);
}

function Render(time, frame) {
  time *= 0.001; // Time in seconds

  // Responsive display
  if (resizeRendererToDisplaySize(renderer)) {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

if(!isPlaced){
  if (frame) {
    const referenceSpace = renderer.xr.getReferenceSpace();
    const session = renderer.xr.getSession();
    
    if (hitTestSourceRequested === false) {
      console.log("Session started");
      session.requestReferenceSpace("viewer").then(function (referenceSpace) {
        session
          .requestHitTestSource({ space: referenceSpace })
          .then(function (source) {
            hitTestSource = source;
          });
      });      

      session.addEventListener("end", function () {
        hitTestSourceRequested = false;
        hitTestSource = null;
        console.log("session ended");        
      });

      hitTestSourceRequested = true;
    }

    if (hitTestSource) {
      const hitTestResults = frame.getHitTestResults(hitTestSource);
      if (hitTestResults.length) {
        const hit = hitTestResults[0];
        reticle.visible = true;
        reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
      } else {
        reticle.visible = false;
      }
    }
  }  
}

  renderer.render(scene, camera);
}

function resizeRendererToDisplaySize(renderer) {
  const pixelRatio = window.devicePixelRatio;
  const width = (canvas.clientWidth * pixelRatio) | 0;
  const height = (canvas.clientHeight * pixelRatio) | 0;
  const isResized = canvas.width !== width || canvas.height !== height;
  if (isResized) {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  }
  return isResized;
}

function setupLights() {
  // Directional Light
  const color = 0xffffff;
  const intensity = 1;
  directionalLight = new THREE.DirectionalLight(color, intensity);
  directionalLight.position.set(-1, 2, 4);
  scene.add(directionalLight);
}

function setupCamera() {
  const fov = 60;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 100;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;
  orbitControls = new OrbitControls(camera, canvas);
  orbitControls.target.set(0, 0, 0);
  orbitControls.update();
}

function setupHDRI(path, name) {
  new RGBELoader()
    .setDataType(THREE.UnsignedByteType)
    .setPath(path)
    .load(name, function (texture) {
      envMap = pmremGenerator.fromEquirectangular(texture).texture;

      //scene.background = envMap;
      scene.environment = envMap;

      texture.dispose();
      pmremGenerator.dispose();
    });

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
}

function importGltfModel(path) {
  const gltfLoader = new GLTFLoader();
  gltfLoader.load(path, (loadedModel) => {
    mainScene = loadedModel.scene;
    mainScene.traverse(function (child) {
      if (child.isMesh) {
        child.material.envMap = envMap;
      }
    });

    scene.add(mainScene);
     });
}

function RaycasterOnMouseDown(event) {
  event.preventDefault();

  //1. sets the mouse position with a coordinate system where the center
  //   of the screen is the origin

  mouse.x = ((event.clientX + canvas.offsetLeft) / canvas.width) * 2 - 1;
  mouse.y = -((event.clientY - canvas.offsetTop) / canvas.height) * 2 + 1;

  //console.log("x : " + mouse.x + " y : " + mouse.y);

  //2. set the picking ray from the camera position and mouse coordinates
  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    if (intersects[0].object) {
      console.log(intersects[0].object.name);      
      // intersects[0].object.material.color.setHex(0xffff00);
      // console.log(intersects[0].object.material.color.getHex());
    }
  }
}

function ARController() {
  arController = renderer.xr.getController(0);
  arController.addEventListener("select", OnSelect);
  scene.add(arController);

  reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial()
  );
  reticle.matrixAutoUpdate = false;
  reticle.visible = false;
  scene.add(reticle);

  let options = {
    requiredFeatures: ["hit-test"],
    optionalFeatures: ["dom-overlay", 'dom-overlay-for-handheld-ar'],
	  domOverlay: { root: document.body }
  };

  document.body.appendChild(ARButton.createButton(renderer, options));

  var arButton = document.getElementById("ARButton");
  arButton.addEventListener("click", XRModeSwitch, false);
}

function OnSelect() {
  if (reticle.visible) {
    mainScene.position.setFromMatrixPosition(reticle.matrix);
    mainScene.visible = true;
    isPlaced = true;
    reticle.visible = false;
  }
}

function XRModeSwitch(){
  if(xrStateToggle == xrmodestate.ObjectMode){
    xrStateToggle = xrmodestate.ARMode;
    mainScene.visible = false;    
    isPlaced = false;
  }
  else{
    xrStateToggle = xrmodestate.ObjectMode;
    reticle.visible = false;
    mainScene.visible = true;
    mainScene.position.set(0, 0, 0);  
    mainScene.scale.set(1,1,1);
    mainScene.rotation.set(0,0,0);
    camera.position.set(0,0,2);
    orbitControls.update();
  }
}

Init();
Animate();
