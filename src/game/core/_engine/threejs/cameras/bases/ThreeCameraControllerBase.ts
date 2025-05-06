import { CameraHelper, Object3D, PerspectiveCamera } from 'three';
import { MainThree } from '../../MainThree';

export class ThreeCameraControllerBase extends Object3D {
  protected _camera: PerspectiveCamera;
  protected _domElement: HTMLElement | null = null;
  protected _isStart: boolean = false;
  protected _cameraId: string;
  protected _cameraContainer: Object3D;
  protected _addInScene: boolean = true;
  public debug: boolean = false;
  private _isCameraHelper: boolean = false;

  constructor(cameraId: string) {
    super();
    this._cameraId = cameraId;
    this._camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 10000);
    this._cameraContainer = new Object3D();
    this.add(this._cameraContainer);
    this._cameraContainer.add(this._camera);
  }

  public setDomElement(dom: HTMLElement): void {
    this._domElement = dom;
  }

  public start(): void {
    this._isStart = true;
    if (this.debug && !this._isCameraHelper) {
      this._isCameraHelper = true;
      MainThree.Scene.add(new CameraHelper(this._camera));
    }
  }

  public stop(): void {
    this._isStart = false;
  }

  //#region getetr/setter
  public get camera(): PerspectiveCamera {
    return this._camera;
  }
  public get cameraId(): string {
    return this._cameraId;
  }
  public get cameraContainer(): Object3D {
    return this._cameraContainer;
  }
  public get isActiv(): boolean {
    return this._isStart;
  }
  public get addInScene(): boolean {
    return this._addInScene;
  }
  //#endregion
}
