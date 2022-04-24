import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextMesh } from "./TextMesh";

// ページロード完了イベント
window.onload = async function () {
  // DOMを取得
  const appElement = document.querySelector<HTMLElement>(`#myApp`)!;

  // フォントローダー
  const fontLoader = new FontLoader();

  // フォントを読み込む
  const font = await fontLoader.loadAsync(`/fonts/droid_sans_mono_regular.typeface.json`);

  // テキストメッシュ: タイトル表示用テキスト
  const titleTextMesh = new TextMesh(font, {
    text: `[ TextGeometry Scene ]\nDEEP TONE COLOR ANIMATION`,
    translate: new THREE.Vector3(-100, 10, 0),
    rotate: new THREE.Vector3(0, 0, 0),
    scale: new THREE.Vector3(0.01, 0.01, 0.01),
  });

  // シーンを初期化
  const scene = new THREE.Scene();
  scene.add(titleTextMesh);

  // カメラを初期化
  const camera = new THREE.PerspectiveCamera(
    50,
    appElement.offsetWidth / appElement.offsetHeight,
    0.01,
    1000
  );
  camera.position.set(1, 1, 1);
  camera.lookAt(scene.position);

  // レンダラーの初期化
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(appElement.offsetWidth, appElement.offsetHeight);
  renderer.shadowMap.enabled = true; // レンダラー：シャドウを有効にする

  // カメラコントローラー設定
  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.maxPolarAngle = Math.PI * 0.5;
  orbitControls.minDistance = 0.1;
  orbitControls.maxDistance = 100;
  orbitControls.autoRotate = false; // カメラの自動回転設定
  orbitControls.autoRotateSpeed = 1.0; // カメラの自動回転速度

  // 描画ループを開始
  renderer.setAnimationLoop((time: number) => {
    // カメラコントローラーを更新
    orbitControls.update();

    // 描画する
    renderer.render(scene, camera);
  });

  /// 
  /// ブラウザーDOM操作
  /// 

  // DOMに追加
  appElement.appendChild(renderer.domElement);
}
