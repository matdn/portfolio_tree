// Type
import { DataTexture, Texture } from 'three';
import { Font } from 'three/examples/jsm/loaders/FontLoader';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import EXRLoader from '../loaders/Three/EXRLoader';
import FontLoader from '../loaders/Three/FontLoader';
import ModelLoader from '../loaders/Three/ModelLoader';
import RGBELoader from '../loaders/Three/RGBELoader';
import TextureLoader from '../loaders/Three/TextureLoader';
import { LoaderBase } from '../loaders/bases/LoaderBase';

export default class ThreeAssetsManager {
  private static _Loaders = new Map<string, LoaderBase>();

  private static _TexturesLoaders = new Map<string, TextureLoader>();
  private static _ModelsLoaders = new Map<string, ModelLoader>();
  private static _ExrsLoaders = new Map<string, EXRLoader>();
  private static _RgbesLoaders = new Map<string, RGBELoader>();
  private static _fontsLoaders = new Map<string, FontLoader>();

  private static _LoadingQueue = Array<LoaderBase>();

  private static _CurrentLoadIndex: number = 0;
  private static _NumToLoad: number = 0;

  private static _IsLoading: boolean = false;


  public static Init() {
    this._Loaders.clear();
    this._TexturesLoaders.clear();
    this._ModelsLoaders.clear();
    this._ExrsLoaders.clear();
    this._RgbesLoaders.clear();
    this._LoadingQueue.length = 0;
    this._CurrentLoadIndex = 0;
  }

  //
  // Add
  //

  public static AddTexture(textureId: string, texturePath: string) {
    if(this._TexturesLoaders.has(textureId)) return 
    const loader = new TextureLoader(textureId, texturePath);
    this._TexturesLoaders.set(textureId, loader);

    this._AddLoader(loader);
  }

  public static AddEXR(textureId: string, texturePath: string) {
    if(this._ExrsLoaders.has(textureId)) return 
    const loader = new EXRLoader(textureId, texturePath);
    this._ExrsLoaders.set(textureId, loader);

    this._AddLoader(loader);
  }

  public static AddRGBE(textureId: string, texturePath: string) {
    if(this._RgbesLoaders.has(textureId)) return 
    const loader = new RGBELoader(textureId, texturePath);
    this._RgbesLoaders.set(textureId, loader);

    this._AddLoader(loader);
  }

  public static AddModel(modelId: string, modelPath: string) {
    if(this._ModelsLoaders.has(modelId)) return 
    const loader = new ModelLoader(modelId, modelPath);
    this._ModelsLoaders.set(modelId, loader);

    this._AddLoader(loader);
  }

  public static AddFont(id: string, path: string) {
    if(this._fontsLoaders.has(id)) return 
    const loader = new FontLoader(id, path);
    this._fontsLoaders.set(id, loader);

    this._AddLoader(loader);
  }

  private static _AddLoader(loader: LoaderBase): void {
    this._LoadingQueue.push(loader);
    this._NumToLoad = this._LoadingQueue.length;
  }

  //
  // Load
  //

  // public static async Load2(): Promise<void> {
  // this._CurrentLoadIndex = 0;
  // this._NumToLoad = this._LoadingQueue.length;
  // if (this._LoadingQueue.length > 0) {
  //   await Promise.all(
  //     this._LoadingQueue.map((queue) =>
  //       queue.load().then(() => {
  //         this._Loaders.set(queue.id, queue);
  //         this._CurrentLoadIndex++;
  //       }),
  //     ),
  //   );
  // }
  // }

  public static async Load(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this._IsLoading) {
        throw new Error('ThreeAssetsManager is already loading');
      }
      this._IsLoading = true;
      this._CurrentLoadIndex = -1;
      this._Load(resolve);
    });
  }

  private static async _Load(cb) {
    this._CurrentLoadIndex++;
    if (this._CurrentLoadIndex < this._LoadingQueue.length) {
      await this._LoadNext();
      this._Load(cb);
    } else {
      this._CurrentLoadIndex = 0;
      this._LoadingQueue.length = 0;
      this._IsLoading = false;
      cb();
    }
  }


  private static async _LoadNext(): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const queue = this._LoadingQueue[this._CurrentLoadIndex];
        await queue.load();
        this._Loaders.set(queue.id, queue);
        resolve();
      }, 0);
    });
  }




  //
  // Get
  //
  public static GetTexture(textureId: string): Texture | undefined {
    if (this._TexturesLoaders.has(textureId)) return this._TexturesLoaders.get(textureId)?.texture;
    if (this._ExrsLoaders.has(textureId)) return this._ExrsLoaders.get(textureId)?.dataTexture;
    if (this._RgbesLoaders.has(textureId)) return this._RgbesLoaders.get(textureId)?.dataTexture;
    else throw new Error(`Texture with id: ${textureId} does not exist.`);
  }

  public static GetModel(modelId: string): GLTF | undefined {
    if (this._ModelsLoaders.has(modelId)) return this._ModelsLoaders.get(modelId)?.model;
    else throw new Error(`Model with id: ${modelId} does not exist.`);
  }

  public static GetEXR(textureId: string): DataTexture | undefined {
    if (this._ExrsLoaders.has(textureId)) return this._ExrsLoaders.get(textureId)?.dataTexture;
    else throw new Error(`EXRTexture with id: ${textureId} does not exist.`);
  }

  public static GetRGBE(textureId: string): DataTexture | undefined {
    if (this._RgbesLoaders.has(textureId)) return this._RgbesLoaders.get(textureId)?.dataTexture;
    else throw new Error(`EXRTexture with id: ${textureId} does not exist.`);
  }

  public static GetFont(fontId: string): Font | undefined {
    if (this._fontsLoaders.has(fontId)) return this._fontsLoaders.get(fontId)?.font;
    else throw new Error(`Font with id: ${fontId} does not exist.`);
  }

  //#region getter/setter
  public static get CurrentLoadIndex(): number {
    return this._CurrentLoadIndex;
  }
  public static get NumToLoad(): number {
    return this._NumToLoad;
  }
  //#endregion
}
