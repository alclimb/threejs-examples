import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { MeshText2D, textAlign } from "three-text2d";
import * as chroma from "chroma-js";
import TWEEN from "@tweenjs/tween.js";

/** ディープトーンのカラーリスト */
const DEEP_TONE = [
  chroma.hex(`#C7000B`),
  chroma.hex(`#D28300`),
  chroma.hex(`#DFD000`),
  chroma.hex(`#7BAA17`),
  chroma.hex(`#00873C`),
  chroma.hex(`#008A83`),
  chroma.hex(`#008DCB`),
  chroma.hex(`#005AA0`),
  chroma.hex(`#181878`),
  chroma.hex(`#800073`),
  chroma.hex(`#C6006F`),
  chroma.hex(`#C70044`),
];

export module utils {
  export function toRadian(degree: number) {
    return (Math.PI / 180) * degree;
  }
}

async function main(element: HTMLElement) {
  const width = element.offsetWidth;
  const height = element.offsetHeight;

  // ライト：平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(7, 10, -2);
  directionalLight.color.set(0xffffff);
  directionalLight.intensity = 0.3;
  directionalLight.shadow.radius = 3.0;
  directionalLight.castShadow = true; // ライトの影を有効

  // ライト：環境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);

  //   // 3Dテキストを追加
  //   {
  //     this.titleTextMesh = new MeshText2D(`100 DAYS OF CODE\nDAY 9`, {
  //       align: textAlign.bottom,
  //       font: `120px Arial`,
  //       antialias: true,
  //       shadowColor: `#909090`,
  //       shadowBlur: 4,
  //       shadowOffsetX: 2,
  //       shadowOffsetY: 2,
  //       lineHeight: 1.0,
  //     });
  //     this.titleTextMesh.position.set(0, 0, -0.3);
  //     this.titleTextMesh.rotateX(utils.toRadian(-90));
  //     this.titleTextMesh.scale.set(0.001, 0.001, 0.001);

  //     // シーンに追加
  //     this.scene.add(this.titleTextMesh);
  //   }

  // // 3Dテキストを追加
  // {
  //   this.colorTextMesh = new MeshText2D(``, {
  //     align: textAlign.center,
  //     font: `120px monospace`,
  //     antialias: true,
  //     shadowColor: `#909090`,
  //     shadowBlur: 4,
  //     shadowOffsetX: 2,
  //     shadowOffsetY: 2,
  //   });
  //   this.colorTextMesh.position.set(0.0, 0, 0.0);
  //   this.colorTextMesh.rotateX(utils.toRadian(-90));
  //   this.colorTextMesh.scale.set(0.004, 0.004, 0.004);

  //   // シーンに追加
  //   this.scene.add(this.colorTextMesh);
  // }

  // シーンを初期化
  const scene = new THREE.Scene();
  scene.add(directionalLight);
  scene.add(ambientLight);

  // カメラを初期化
  const camera = new THREE.PerspectiveCamera(
    50,
    width / height,
    0.01,
    1000
  );
  camera.position.set(1, 1, 1);
  camera.lookAt(scene.position);

  // レンダラーの初期化
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true; // レンダラー：シャドウを有効にする
  // renderer.toneMapping = THREE.ReinhardToneMapping;
  // renderer.toneMappingExposure = Math.pow(1.0, 4.0);

  // カメラコントローラー設定
  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.maxPolarAngle = Math.PI * 0.5;
  orbitControls.minDistance = 1;
  orbitControls.maxDistance = 100;
  orbitControls.autoRotate = false; // カメラの自動回転設定
  orbitControls.autoRotateSpeed = 1.0; // カメラの自動回転速度

  // Windowサイズ変更イベントハンドラ
  const onWindowResize = () => {
    const width = element.offsetWidth;
    const height = element.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  }

  // DOMに追加
  element.appendChild(renderer.domElement);

  // DOMイベントの登録
  window.addEventListener(`resize`, onWindowResize, false);

  animate();
  
  function animate() {
    // Tween: 色の変更アニメーション
    {
      // アニメーション変化時の処理
      const onUpdate = (val: number[]) => {
        const color = chroma.rgb(val[0], val[1], val[2]);

        // // テキストの色を変更
        // this.titleTextMesh.fillStyle = color.darken(2.0).hex();

        // // テキストの色を変更
        // this.colorTextMesh.fillStyle = color.brighten(3.0).hex();
        // this.colorTextMesh.text = color.hex();

        // 背景を変更
        renderer.setClearColor(color.hex());
      };

      // Tween: アニメーション生成
      const tweens = DEEP_TONE.map((color, i) => {
        return new TWEEN.Tween(color.rgb())
          .to(DEEP_TONE[(i + 1) % DEEP_TONE.length].rgb(), 1000)
          .easing(TWEEN.Easing.Elastic.InOut)
          .onUpdate(onUpdate);
      });

      // Tween: アニメーションチェイン
      for (let i = 0; i < tweens.length; i++) {
        const next = (i + 1) % tweens.length;
        tweens[i].chain(tweens[next]);
      }

      // Tween: アニメーションスタート
      tweens[0].start();
    }

    let lastTime = 0;

    // アニメーションループを開始
    renderer.setAnimationLoop((time: number) => {
      // deltaを算出
      const delta = (time - lastTime) / 1000;

      // Tween: アニメーション更新
      TWEEN.update(time);

      // カメラコントローラーを更新
      orbitControls.update();

      // 描画する
      renderer.render(scene, camera);

      lastTime = time;
    });
  }
}

window.onload = function () {
  // DOMを取得
  const appElement = document.querySelector<HTMLElement>(`#myApp`)!;
  main(appElement);
}
