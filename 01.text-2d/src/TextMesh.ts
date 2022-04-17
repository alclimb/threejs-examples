import * as THREE from "three";
import { Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export type TextMeshOptions = {
  text?: string,
  size?: number,
  height?: number,
  color?: THREE.ColorRepresentation,
  translate?: THREE.Vector3,
  rotate?: THREE.Vector3,
  scale?: THREE.Vector3,
};

export class TextMesh extends THREE.Object3D {
  private _material = new THREE.MeshBasicMaterial();
  private _mesh = new THREE.Mesh(new THREE.ShapeGeometry(), this._material);

  private _text: string;
  private _size: number;
  private _height: number;
  private _color: THREE.ColorRepresentation;
  private _translate: THREE.Vector3;
  private _rotate: THREE.Vector3;
  private _scale: THREE.Vector3;

  constructor(private _font: Font, options?: TextMeshOptions) {
    super();

    this._text = options?.text ?? ``;
    this._size = options?.size ?? 10;
    this._height = options?.height ?? 1;
    this._color = options?.color ?? `#fff`
    this._translate = options?.translate ?? new THREE.Vector3();
    this._rotate = options?.rotate ?? new THREE.Vector3();
    this._scale = options?.scale ?? new THREE.Vector3(1, 1, 1);

    // 
    this.updateText();

    // 
    this.add(this._mesh);
  }

  get text() { return this._text; }
  set text(value: string) {
    this._text = value;
    this.updateText();
  }

  get color() { return this._color; }
  set color(value: THREE.ColorRepresentation) {
    this._color = value;
    this._material.color.set(this._color)
  }

  private updateText() {
    const geometry = new TextGeometry(this._text, {
      font: this._font,
      size: this._size,
      height: this._height,
    });
    geometry.translate(this._translate.x, this._translate.y, this._translate.z);
    geometry.rotateX(this._rotate.x);
    geometry.rotateY(this._rotate.y);
    geometry.rotateZ(this._rotate.z);
    geometry.scale(this._scale.x, this._scale.y, this._scale.z);

    this._mesh.geometry.dispose();
    this._mesh.geometry = geometry;
  }
}
