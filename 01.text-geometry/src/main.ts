import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import * as chroma from "chroma-js";
import TWEEN from "@tweenjs/tween.js";
import { TextMesh } from "./TextMesh";

// ページロード完了イベント
window.onload = async function () {
  // DOMを取得
  const appElement = document.querySelector<HTMLElement>(`#myApp`)!;

  // メインプログラム開始
  await main(appElement);
}

/**
 * メインプログラム
 */
async function main(element: HTMLElement) {
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

  /** 角度90°の定数 */
  const DEGREE_90 = (Math.PI / 180) * 90;

  // フォントローダー
  const fontLoader = new FontLoader();

  // フォントを読み込む
  const font = await fontLoader.loadAsync(`/fonts/droid_sans_mono_regular.typeface.json`);

  // テキストメッシュ: タイトル表示用テキスト
  const titleTextMesh = new TextMesh(font, {
    text: `[ TextGeometry Scene ]\nDEEP TONE COLOR ANIMATION`,
    translate: new THREE.Vector3(-100, 50, 0),
    rotate: new THREE.Vector3(-DEGREE_90, 0, 0),
    scale: new THREE.Vector3(0.004, 0.004, 0.004),
  });

  // テキストメッシュ: カラー表示用テキスト
  const colorTextMesh = new TextMesh(font, {
    size: 120,
    height: 5,
    translate: new THREE.Vector3(-340, -100, 0),
    rotate: new THREE.Vector3(-DEGREE_90, 0, 0),
    scale: new THREE.Vector3(0.002, 0.002, 0.002),
  });

  // シーンを初期化
  const scene = new THREE.Scene();
  scene.add(titleTextMesh);
  scene.add(colorTextMesh);

  // カメラを初期化
  const camera = new THREE.PerspectiveCamera(
    50,
    element.offsetWidth / element.offsetHeight,
    0.01,
    1000
  );
  camera.position.set(1, 1, 1);
  camera.lookAt(scene.position);

  // レンダラーの初期化
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(element.offsetWidth, element.offsetHeight);
  renderer.shadowMap.enabled = true; // レンダラー：シャドウを有効にする

  // カメラコントローラー設定
  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.maxPolarAngle = Math.PI * 0.5;
  orbitControls.minDistance = 1;
  orbitControls.maxDistance = 100;
  orbitControls.autoRotate = false; // カメラの自動回転設定
  orbitControls.autoRotateSpeed = 1.0; // カメラの自動回転速度

  // Tween: 色の変更アニメーション
  {
    // Tween: アニメーション生成
    const tweens = DEEP_TONE.map((color, i) => {
      return new TWEEN.Tween(color.rgb())
        .to(DEEP_TONE[(i + 1) % DEEP_TONE.length].rgb(), 2000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate((val: number[]) => {
          const color = chroma.rgb(val[0], val[1], val[2]);

          // テキストの文字と色を変更
          colorTextMesh.text = color.hex().toUpperCase();
          colorTextMesh.color = color.brighten(3.0).hex();
          titleTextMesh.color = color.brighten(3.0).hex();

          // 背景を変更
          renderer.setClearColor(color.hex());
        });
    });

    // Tween: アニメーション･チェイン
    for (let i = 0; i < tweens.length; i++) {
      const next = (i + 1) % tweens.length;
      tweens[i].chain(tweens[next]);
    }

    // Tween: アニメーションスタート
    tweens[0].start();
  }

  // 最終更新時間
  let lastTime = 0;

  // 描画ループを開始
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

  /// 
  /// ブラウザーDOM操作
  /// 

  // DOMに追加
  element.appendChild(renderer.domElement);

  // DOMイベントの登録: Windowサイズ変更イベントハンドラ
  window.addEventListener(`resize`, () => {
    const width = element.offsetWidth;
    const height = element.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  }, false);
}
