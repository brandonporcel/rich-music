"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { CinematicCamera } from "three/addons/cameras/CinematicCamera.js";
import { BokehShaderUniforms } from "three/examples/jsm/shaders/BokehShader2.js";
import { getVinyls } from "@/services/vinyls";
import { Vinyl } from "@/utils/Definitions";

export default function ThreeScene() {
  const canvasRef = useRef<HTMLCanvasElement | undefined>(undefined);

  const handleScene = (ITEMS: Vinyl[]) => {
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

      const geometry = new THREE.BoxGeometry(20, 20, 20);
      const textureLoader = new THREE.TextureLoader();

      for (let i = 0; i < ITEMS.length; i++) {
        const item = ITEMS[i];
        const materials = [
          new THREE.MeshLambertMaterial({
            map: textureLoader.load(item.face1 ?? item.thumbnail),
          }),
          new THREE.MeshLambertMaterial({
            map: textureLoader.load(item.face2 ?? item.thumbnail),
          }),
          new THREE.MeshLambertMaterial({
            map: textureLoader.load(item.face3 ?? item.thumbnail),
          }),
          new THREE.MeshLambertMaterial({
            map: textureLoader.load(item.face4 ?? item.thumbnail),
          }),
          new THREE.MeshLambertMaterial({
            map: textureLoader.load(item.face5 ?? item.thumbnail),
          }),
          new THREE.MeshLambertMaterial({
            map: textureLoader.load(item.face6 ?? item.thumbnail),
          }),
        ];

        const object = new THREE.Mesh(geometry, materials);
        // Ajustar rango para menos separación
        object.position.x = Math.random() * 200 - 100;
        object.position.y = Math.random() * 200 - 100;
        object.position.z = Math.random() * 200 - 100;

        scene.add(object);
      }

      raycaster = new THREE.Raycaster();

      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
      });
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

      matChanger();
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
      theta += 0.2;
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
      document.body.removeChild(renderer.domElement);
    };
  };
  useEffect(() => {
    const getItems = async () => await getVinyls();
    getItems().then((items) => {
      handleScene(items);
    });
  }, []);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
