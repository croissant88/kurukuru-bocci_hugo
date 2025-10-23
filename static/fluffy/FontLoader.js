// FontLoader.js

import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

const scene = new THREE.Scene(); // Three.jsのシーンを作成
let textMesh; // テキストメッシュを保持する変数

const fontLoader = new FontLoader();
fontLoader.load("/fluffy/fonts/Rounded_Mplus_1c_Regular.json", (font) => {
  if (textMesh) {
    scene.remove(textMesh); // 既存のテキストメッシュがあればシーンから削除
  }

  const textGeometry = new TextGeometry("初期テキスト", {
    font: font,
    size: 0.5,
    height: 0.1,
  });

  const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
  textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.set(0, 1, 0); // テキストメッシュの位置を設定

  scene.add(textMesh); // テキストメッシュをシーンに追加
});

function updateText(newText) {
  if (!textMesh) return; // textMeshがまだ初期化されていなければ何もしない

  const newGeometry = new TextGeometry(newText, {
    font: textMesh.geometry.parameters.font,
    size: 0.5,
    height: 0.1,
  });

  textMesh.geometry.dispose(); // 既存のジオメトリを削除
  textMesh.geometry = newGeometry; // 新しいテキストでジオメトリを更新
  textMesh.geometry.center(); // テキストを中央寄せ
}

// 他の必要なThree.jsの設定コードはここに追加

export { updateText, textMesh, scene };
