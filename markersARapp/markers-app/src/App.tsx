import { useState, useRef, useEffect } from "react";
import "./App.css";
import * as THREE from "three";
import { ARButton } from "three/addons/webxr/ARButton.js";
import markerImage from "./assets/entrance1.png";
import markerImage2 from "./assets/entrance2.png";
// https://www.the-qrcode-generator.com/

function App() {
  const [count, setCount] = useState(0);
  const arRef = useRef(null);
  const markerRef = useRef(null);
  const markerRef2 = useRef(null);
  let camera: THREE.PerspectiveCamera,
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer;
  let mesh: THREE.Object3D<THREE.Object3DEventMap>;
  let mesh2: THREE.Object3D<THREE.Object3DEventMap>;
  let forwardConeMesh: THREE.Mesh<THREE.ConeGeometry>;
  let leftConeMesh: THREE.Mesh<THREE.ConeGeometry>;;

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // function animate() {
  //   renderer.setAnimationLoop(render);
  // }

  function render(timestamp: any, frame) {
    // console.log("FRAME: ", frame);
    // find the images we are tracking
    if (frame) {
      // console.log("GOT Frame ", frame);

      const results = frame && frame.getImageTrackingResults();

      //console.log("RESULTS: ", results);

      //checking if there is more than one image
      for (const result of results) {
        const imageIndex = result.index;

        // Get the pose of the image realative to a reference space
        const referenceSpace = renderer.xr.getReferenceSpace();
        const pose = frame.getPose(result.imageSpace, referenceSpace);

        // checking the state of the tracking
        const state = result.trackingState;
        console.log(state);

        // if (state == "tracked") {
        //   console.log("tracking imageIndex: ", imageIndex);
        //   if (imageIndex == 0) {
        //     // update the target mesh when the marker image is found
        //     console.log(`Image target ${imageIndex} has been found`);
        //     mesh.visible = true;
        //     // update the mesh when the image target is found
        //     mesh.matrix.fromArray(pose.transform.matrix);
        //   }
        //   if (imageIndex == 1) {
        //     // update the target mesh when the marker image is found
        //     console.log(`Image target ${imageIndex} has been found`);
        //     mesh2.visible = true;
        //     // update the mesh when the image target is found
        //     mesh2.matrix.fromArray(pose.transform.matrix);
        //   }
        // } else if (state == "emulated") {
        //   console.log("Image target no longer seen");
        //   if (imageIndex == 0) {
        //     // update the target mesh when the marker image is found
        //     console.log(
        //       `Hiding image ${imageIndex} since marker is not visible`
        //     );
        //     mesh.visible = false;
        //   }
        //   if (imageIndex == 1) {
        //     // update the target mesh when the marker image is found
        //     console.log(
        //       `Hiding image ${imageIndex} since marker is not visible`
        //     );
        //     mesh2.visible = false;
        //   }
        //   // anything u want, is overwhelming the console.
        // }


        if (state == "tracked") {
          console.log("tracking imageIndex: ", imageIndex);
          if (imageIndex == 0) {
            // update the target mesh when the marker image is found
            console.log(`Image target ${imageIndex} has been found`);
            forwardConeMesh.visible = true;
            // update the mesh when the image target is found
            forwardConeMesh.matrix.fromArray(pose.transform.matrix);
          }
          if (imageIndex == 1) {
            // update the target mesh when the marker image is found
            console.log(`Image target ${imageIndex} has been found`);
            leftConeMesh.visible = true;
            // update the mesh when the image target is found
            leftConeMesh.matrix.fromArray(pose.transform.matrix);
          }
        } else if (state == "emulated") {
          console.log("Image target no longer seen");
          if (imageIndex == 0) {
            // update the target mesh when the marker image is found
            console.log(
              `Hiding image ${imageIndex} since marker is not visible`
            );
            forwardConeMesh.visible = false;
          }
          if (imageIndex == 1) {
            // update the target mesh when the marker image is found
            console.log(
              `Hiding image ${imageIndex} since marker is not visible`
            );
            leftConeMesh.visible = false;
          }
          // anything u want, is overwhelming the console.
        }



      }
    }

    renderer.render(scene, camera);
  }

  const init = async () => {
    const container = document.createElement("div");
    arRef.current.appendChild(container);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      50
    );

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(render);
    // This next line is important to to enable the renderer for WebXR
    renderer.xr.enabled = true; // New!
    container.appendChild(renderer.domElement);

    var light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);







    // geometry 1
    // ---------------------------------------------
    const geometry = new THREE.IcosahedronGeometry(0.1, 1);
    geometry.translate(0, 0.1, 0);
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color("rgb(226,35,213)"),
      shininess: 6,
      flatShading: true,
      transparent: true,
      opacity: 0.8,
    });
    mesh = new THREE.Mesh(geometry, material);
    // mesh.position.set(0, 0, -1.5);
    mesh.name = "GeometricOverMarker";
    mesh.matrixAutoUpdate = false;
    mesh.visible = false;
    scene.add(mesh);

    // geometry 2
    // ---------------------------------------------
    const geometry2 = new THREE.IcosahedronGeometry(0.1, 1);
    geometry.translate(0, -0.1, 0);
    const material2 = new THREE.MeshPhongMaterial({
      color: new THREE.Color("rgb(52 255 98)"),
      shininess: 6,
      flatShading: true,
      transparent: true,
      opacity: 0.8,
    });
    mesh2 = new THREE.Mesh(geometry2, material2);
    // mesh.position.set(0, 0, -1.5);
    mesh2.name = "GeometricOverMarker2";
    mesh2.matrixAutoUpdate = false;
    mesh2.visible = false;
    scene.add(mesh2);






    // Arrow Cone 1
    // ---------------------------------------------
    const forwardConeGeometry = new THREE.ConeGeometry(
      0.05,
      0.1,
      4
    );
    forwardConeGeometry.translate(0, -0.1, 0);
    // forwardConeGeometry.rotateY(-0.5);
    forwardConeGeometry.rotateX(-2.1);
    //forwardConeGeometry.rotateZ(0);

    const forwardConeGeometryMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color("rgb(76,175,87)"),
      shininess: 6,
      flatShading: true,
      transparent: true,
      opacity: 1,
    });
    forwardConeMesh = new THREE.Mesh(
      forwardConeGeometry,
      forwardConeGeometryMaterial
    );
    // forwardConeMesh.position.set(-1, -2, -8.5);
    forwardConeMesh.visible = false;
    forwardConeMesh.name = "ForwardCone";
    forwardConeMesh.matrixAutoUpdate = false;

    scene.add(forwardConeMesh);

    // Arrow Cone 2
    // ---------------------------------------------
    const leftConeGeometry = new THREE.ConeGeometry(
      0.05,
      0.1,
      4
    );

    leftConeGeometry.translate(0, 0.1, 0);
    leftConeGeometry.rotateZ(1.5);
    
    const leftConeGeometryMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color("rgb(76,175,87)"),
      shininess: 6,
      flatShading: true,
      transparent: true,
      opacity: 1,
    });
    leftConeMesh = new THREE.Mesh(
      leftConeGeometry,
      leftConeGeometryMaterial
    );
    // leftConeMesh.position.set(-1, -2, -8.5);
    leftConeMesh.visible = false;
    leftConeMesh.name = "LeftCone";
    leftConeMesh.matrixAutoUpdate = false;
    scene.add(leftConeMesh);









    // ======= Arrows
    // const dir = new THREE.Vector3(0, 1, 0);
    // //normalize the direction vector (convert to vector of length 1)
    // dir.normalize();
    // const origin = new THREE.Vector3( 0, 0, 0 );
    // const length = 0.3;
    // const hex = 0xffff00;
    // const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
    // console.log("arrowHelper", arrowHelper);
    // scene.add(arrowHelper);
    // ======= End Arrows

    // set up the image markers
    const markerBitmap = await createImageBitmap(markerRef.current);
    const markerBitmap2 = await createImageBitmap(markerRef2.current);
    console.log(markerBitmap);

    // Add the AR button to the body of the DOM

    // container.appendChild(ARButton.createButton(renderer));

    container.appendChild(
      ARButton.createButton(renderer, {
        requiredFeatures: ["image-tracking"],
        trackedImages: [
          {
            image: markerBitmap,
            widthInMeters: 0.2,
          },
          {
            image: markerBitmap2,
            widthInMeters: 0.2,
          },
        ],
        //this is for the mobile debug
        optionalFeatures: ["dom-overlay", "dom-overlay-for-handheld-ar"],
        domOverlay: {
          root: document.body,
        },
      })
    );

    window.addEventListener("resize", onWindowResize, false);
  };

  useEffect(() => {
    init();
    // animate();
  }, []);

  return (
    <div>
      <img
        ref={markerRef}
        id="marker-image"
        style={{ display: "none" }}
        src={markerImage}
        alt="Logo"
      />
      <img
        ref={markerRef2}
        id="marker-image"
        style={{ display: "none" }}
        src={markerImage2}
        alt="Logo"
      />
      <div ref={arRef} id="ar-container"></div>
    </div>
  );
}

export default App;
