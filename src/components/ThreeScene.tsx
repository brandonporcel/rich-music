"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { CinematicCamera } from "three/addons/cameras/CinematicCamera.js";
import { BokehShaderUniforms } from "three/examples/jsm/shaders/BokehShader2.js";
import { getRandomVinyls } from "@/services/vinyls";
import { Vinyl } from "@/utils/Definitions";

export default function ThreeScene() {
  const gui = useRef<dat.GUI | null>(null);
  const [existGUI, setExistGUI] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleScene = useCallback(
    async (ITEMS: Vinyl[]) => {
      const dat = await import("dat.gui");
      if (gui.current) {
        gui.current.destroy();
        gui.current = null;
      }
      const oldGUIS = document.querySelectorAll(".dg.main.a");
      oldGUIS.forEach((guiElement) => {
        guiElement.remove();
      });
      if (!gui.current && !existGUI) {
        gui.current = new dat.GUI();
        setExistGUI(true);
      }

      gui.current?.destroy();
      gui.current = new dat.GUI({ autoPlace: true });

      const effectFolder = gui.current?.addFolder(
        `General ${(Date.now() + "").at(-1)}`
      );

      const paramsGUI = {
        separation: 50,
        cubeSize: 20,
        rotationSpeed: 0.2,
      };

      let speed = paramsGUI.rotationSpeed;
      gui.current
        ?.add(paramsGUI, "rotationSpeed", 0, 1, 0.1)
        .onChange(updateRotationSpeed);
      gui.current
        ?.add(paramsGUI, "separation", 25, 100, 5)
        .onChange(updatePositions);
      gui.current
        ?.add(paramsGUI, "cubeSize", 20, 50, 5)
        .onChange(updateCubeSize);

      if (ITEMS.length === 0) return;
      let camera: CinematicCamera,
        scene: THREE.Scene,
        raycaster: THREE.Raycaster,
        renderer: THREE.WebGLRenderer;

      const mouse = new THREE.Vector2();
      let INTERSECTED: THREE.Object3D | null = null;
      const radius = 100;
      let theta = 0;

      init();
      animate();

      function init() {
        camera = new CinematicCamera(
          60,
          window.innerWidth / window.innerHeight,
          1,
          1000
        );
        camera.setLens(5);
        camera.position.set(2, 1, 500);

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000);

        scene.add(new THREE.AmbientLight(0xffffff));

        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(1, 1, 1).normalize();
        scene.add(light);

        const geometry = new THREE.BoxGeometry(
          paramsGUI.cubeSize,
          paramsGUI.cubeSize,
          paramsGUI.cubeSize
        );

        const textureLoader = new THREE.TextureLoader();

        for (let i = 0; i < ITEMS.length; i++) {
          const item = ITEMS[i];
          const thumbnail = { map: textureLoader.load(item.thumbnail) };
          const materials = [
            new THREE.MeshLambertMaterial(thumbnail),
            new THREE.MeshLambertMaterial(thumbnail),
            new THREE.MeshLambertMaterial(thumbnail),
            new THREE.MeshLambertMaterial(thumbnail),
            new THREE.MeshLambertMaterial(thumbnail),
            new THREE.MeshLambertMaterial(thumbnail),
          ];

          const object = new THREE.Mesh(geometry, materials);
          updateObjectPosition(object);

          scene.add(object);
        }

        raycaster = new THREE.Raycaster();
        if (canvasRef.current) {
          renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
          });
        }
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.addEventListener("mousemove", onDocumentMouseMove);

        window.addEventListener("resize", onWindowResize);

        const effectController = {
          focalLength: 15,
          fstop: 2.8,
          showFocus: false,
          focalDepth: 3,
        };

        const matChanger = function () {
          for (const e in effectController) {
            if (e in camera.postprocessing.bokeh_uniforms) {
              const eC: Record<any, any> = effectController;
              camera.postprocessing.bokeh_uniforms[
                e as keyof BokehShaderUniforms
              ].value = eC[e];
            }
          }
          camera.postprocessing.bokeh_uniforms["znear"].value = camera.near;
          camera.postprocessing.bokeh_uniforms["zfar"].value = camera.far;
          camera.setLens(
            effectController.focalLength,
            undefined,
            effectController.fstop,
            camera.coc
          );
          effectController["focalDepth"] =
            camera.postprocessing.bokeh_uniforms["focalDepth"].value;
        };

        effectFolder
          ?.add(effectController, "focalLength", 5, 75, 5)
          .onChange(matChanger);
        matChanger();
      }

      function updateObjectPosition(object: THREE.Mesh) {
        object.position.x =
          Math.random() * paramsGUI.separation - paramsGUI.separation / 2;
        object.position.y =
          Math.random() * paramsGUI.separation - paramsGUI.separation / 2;
        object.position.z =
          Math.random() * paramsGUI.separation - paramsGUI.separation / 2;
      }

      function updatePositions() {
        scene.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            updateObjectPosition(child);
          }
        });
      }

      function updateCubeSize() {
        scene.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            const newGeometry = new THREE.BoxGeometry(
              paramsGUI.cubeSize,
              paramsGUI.cubeSize,
              paramsGUI.cubeSize
            );
            child.geometry.dispose();
            child.geometry = newGeometry;
          }
        });
      }

      function updateRotationSpeed() {
        speed = paramsGUI.rotationSpeed;
      }

      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }

      function onDocumentMouseMove(event: MouseEvent) {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      }

      function animate() {
        requestAnimationFrame(animate);
        render();
      }

      function render() {
        theta += speed;
        camera.position.x = radius * Math.sin(THREE.MathUtils.degToRad(theta));
        camera.position.y = radius * Math.sin(THREE.MathUtils.degToRad(theta));
        camera.position.z = radius * Math.cos(THREE.MathUtils.degToRad(theta));
        camera.lookAt(scene.position);
        camera.updateMatrixWorld();

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, false);

        if (intersects.length > 0) {
          const targetDistance = intersects[0].distance;
          camera.focusAt(targetDistance);

          if (INTERSECTED !== intersects[0].object) {
            if (INTERSECTED) {
              const m: any = INTERSECTED["material" as keyof THREE.Object3D];
              m.forEach((mat: any) => (mat.opacity = 1.0));
            }
            INTERSECTED = intersects[0].object;
          }
        } else {
          if (INTERSECTED) {
            const m: any = INTERSECTED["material" as keyof THREE.Object3D];
            m.forEach((mat: any) => (mat.opacity = 1.0));
          }
          INTERSECTED = null;
        }

        if (camera.postprocessing.enabled) {
          camera.renderCinematic(scene, renderer);
        } else {
          scene.overrideMaterial = null;
          renderer.clear();
          renderer.render(scene, camera);
        }
      }

      return () => {
        document.removeEventListener("mousemove", onDocumentMouseMove);
        window.removeEventListener("resize", onWindowResize);
        if (gui.current) {
          gui.current.destroy();
          gui.current = null;
        }
      };
    },
    [existGUI]
  );

  useEffect(() => {
    const getItems = async () => await getRandomVinyls();
    getItems().then((items) => {
      handleScene(items);
    });
  }, [handleScene]);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
