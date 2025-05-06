import { ThreeAssetsManager } from '@cooker/three';
import { Action, Ticker } from 'cookware';
import { TheatersManager, ViewsManager } from 'pancake';
import { DomEvent, KeyboardConstant } from 'spices';
import {
  Color,
  EquirectangularReflectionMapping,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  SRGBColorSpace,
  Scene,
  Texture,
  WebGLRenderer,
} from 'three';
import { DebugManager } from '../../debugs/DebugManager';
import ThreeTheaterBase, { EnvironmentType } from '../../theaters/ThreeTheaterBase';
import { SuperViewBase } from '../../views/bases/SuperViewBase';
import { ThreeCameraControllerBase } from './cameras/bases/ThreeCameraControllerBase';
import { ThreeCamerasManager } from './managers/ThreeCamerasManager';
import { ThreeInteractiveManager } from './managers/ThreeInteractiveManager';
import { ThreeMouseManager } from './managers/ThreeMouseManager';
import { ThreePostProcessingBase } from './postprocessings/bases/ThreePostProcessingBase';
import { ThreePostProcessingsProxy } from './proxies/ThreePostProcessingsProxy';
import { ThreeUtils } from './utils/ThreeUtils';
import { ThreeViewBase } from './views/bases/ThreeViewBase';
import { Object3DBase } from './views/components/Object3DBase';

export class MainThree {

  public static UseThree: boolean = false;

  public static readonly VIEW_ID = 'MainThreeReactView';

  private static _Scene: Scene;
  private static _Renderer: WebGLRenderer;
  private static _DomElementContainer: HTMLElement | null;

  private static _CameraController: ThreeCameraControllerBase | null = null;
  private static _MainContainer: Object3DBase;
  private static _DOMRect: DOMRect;
  private static _IsStart: boolean = false;
  protected static _CurrentPostProcessing: ThreePostProcessingBase | null = null;
  private static _backColor = new Color();

  public static readonly OnResize = new Action();

  private static _LastTimeRendering: number = 0;
  private static _FPS: number = Math.floor(1000 / 60);
  private static _MaxPixelRatio: number = 2;

  private static _LastWidth: number = 0;
  private static _LastHeight: number = 0;

  public static Init() {
    console.log('MainThree Init');
    this._CurrentPostProcessing = null;
    this._CreateScene();
    this._CreateObjects();
    ViewsManager.OnShowView.add(this._OnShowView);
    ViewsManager.OnRemoveView.add(this._OnRemoveView);
    this._Resize();
    window.addEventListener(DomEvent.RESIZE, this._Resize);

    if (DebugManager.IsDev) {
      const wire = new MeshStandardMaterial({ wireframe: true });
      window.addEventListener(DomEvent.KEY_DOWN, (e: KeyboardEvent) => {
        if (e.shiftKey && e.code == KeyboardConstant.Codes.KeyZ) {
          if (this._Scene.overrideMaterial == null) {
            this._Scene.overrideMaterial = wire;
          } else {
            this._Scene.overrideMaterial = null;
          }
        }
      });
    }
  }

  public static SetDomElementContainer(element: HTMLElement | null): void {
    this._DomElementContainer = element;
    if (this._DomElementContainer) {
      this._DomElementContainer.appendChild(this._Renderer.domElement);
      ThreeCamerasManager.SetDomElement(this._DomElementContainer);
      if (this._IsStart) ThreeInteractiveManager.Start(this._DomElementContainer);
      this._Resize();
    }
  }

  private static _CreateScene() {
    this._Scene = new Scene();
    this._Renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });

    this.Renderer.shadowMap.enabled = true;
    this.Renderer.shadowMap.type = PCFSoftShadowMap;
    this.Renderer.shadowMap.autoUpdate = true;
    // this._Renderer.shadowMap.type = VSMShadowMap; // celle la est la bonne si ca fonctionne
    this._Renderer.outputColorSpace = SRGBColorSpace;
    // this._Renderer.toneMapping = 5;
    // this._Renderer.shadowMap.type =  PCFSoftShadowMap;
    this._Renderer.setPixelRatio(Math.min(window.devicePixelRatio, this._MaxPixelRatio)); // Limit the max pixelRatio
    // this._Renderer.setPixelRatio(window.devicePixelRatio);
    // ThreeDebug.Init(this._Scene);
  }

  private static _CreateObjects() {
    this._MainContainer = new Object3DBase();
    this._Scene.add(this._MainContainer);
  }

  private static _OnShowView = (view: SuperViewBase): void => {
    if (view instanceof ThreeViewBase) {
      this._MainContainer.add(view);
    }
  };

  private static _OnRemoveView = (view: SuperViewBase): void => {
    if (view instanceof ThreeViewBase) {
      this._MainContainer.remove(view);
    }
  };

  public static Start() {
    this._IsStart = true;
    if (this._DomElementContainer) ThreeInteractiveManager.Start(this._DomElementContainer);
    Ticker.Add(this._Render);
    TheatersManager.OnShowTheater.add(this._OnChangeTheater);
    TheatersManager.OnHideTheater.add(this._OnChangeTheater);
    ThreeMouseManager.Start();

    this._OnChangeTheater();
  }

  public static Stop() {
    this._IsStart = false;
    ThreeInteractiveManager.Stop();
    Ticker.Remove(this._Render);
    ThreeMouseManager.Stop();
    TheatersManager.OnShowTheater.delete(this._OnChangeTheater);
    TheatersManager.OnHideTheater.delete(this._OnChangeTheater);
  }

  private static _OnChangeTheater = (): void => {
    this.SetPostProcessing(this._GetTopTheaterPostProcessing());
    this.SetEnvironmentMapId(this._GetTopTheaterEnvironment());
  };

  public static SetCameraController(cameraController: ThreeCameraControllerBase): void {
    this._CameraController = cameraController;
    if (this._CurrentPostProcessing) {
      this._InitPostProcessing();
    }

    ThreeInteractiveManager.SetCamera(this._CameraController.camera);
    if (this._Scene && cameraController.addInScene) {
      this._Scene.add(this._CameraController);
    }
    this._Resize();
  }

  public static SetPostProcessing(postProcessing: ThreePostProcessingBase | null): void {
    this._CurrentPostProcessing = postProcessing;
    this._InitPostProcessing();
    this._Resize();
  }

  public static SetEnvironmentMapId(environment: EnvironmentType): void {
    if (environment) {
      let env: Texture | null = null;
      if (environment.environmentMapId) {
        env = ThreeAssetsManager.GetTexture(environment.environmentMapId) as Texture;
        env.mapping = EquirectangularReflectionMapping;
      }
      this._Scene.environment = env;

      let back: Color | Texture | null = null;
      if (environment.background !== null && environment.background !== undefined) {
        if (typeof environment.background == 'number') {
          this._backColor.set(environment.background);
          back = this._backColor;
        } else {
          back = ThreeAssetsManager.GetTexture(environment.background) as Texture;
          back.mapping = EquirectangularReflectionMapping;
        }
      }
      this._Scene.background = back;
    } else {
      this._Scene.background = null;
      this._Scene.environment = null;
    }
  }

  private static _InitPostProcessing(): void {
    if (this._CurrentPostProcessing && this._CameraController) {
      this._CurrentPostProcessing.init(this._Scene, this._CameraController.camera, this._Renderer);
      this._CurrentPostProcessing.setCamera(this._CameraController.camera);
    }
  }

  private static _Render = (): void => {
    if (!this._CameraController) return;
    const dt = Ticker.CurrentTime - this._LastTimeRendering;

    if (dt >= this._FPS) {
      this._LastTimeRendering = Ticker.CurrentTime;
      if (this._CurrentPostProcessing) {
        this._CurrentPostProcessing.render();
      } else {
        this._Renderer.render(this._Scene, this._CameraController.camera);
      }
    }
    if (window.innerWidth != this._LastWidth || window.innerHeight != this._LastHeight) {
      this._Resize();
    }
  };

  private static _Resize = (): void => {
    if (this._Renderer && this._CameraController && this._DomElementContainer) {
      ThreeUtils.ResizeToDom(
        this._DomElementContainer,
        this._Renderer,
        this._CameraController.camera,
      );
    }
    if (this._DomElementContainer) {
      this._DOMRect = this._DomElementContainer.getBoundingClientRect();
      if (this._CurrentPostProcessing) {
        this._CurrentPostProcessing.resize(this._DOMRect.width, this._DOMRect.height);
      }
      this._MainContainer.resize(this._DOMRect.width, this._DOMRect.height);
    }
    this._LastWidth = window.innerWidth;
    this._LastHeight = window.innerHeight;
    this.OnResize.execute();
  };

  private static _GetTopTheaterPostProcessing(): ThreePostProcessingBase | null {
    let postProcessing: ThreePostProcessingBase | null = null;
    for (let i = TheatersManager.CurrentTheatersList.length - 1; i >= 0; i--) {
      const theater = TheatersManager.CurrentTheatersList[i];
      if (theater instanceof ThreeTheaterBase) {
        if (theater.threePostProcessingId) {
          postProcessing = ThreePostProcessingsProxy.GetPostProcessing(
            theater.threePostProcessingId,
          );
        }
      }
    }
    return postProcessing;
  }

  private static _GetTopTheaterEnvironment(): EnvironmentType {
    let environment: EnvironmentType = null;
    for (let i = TheatersManager.CurrentTheatersList.length - 1; i >= 0; i--) {
      const theater = TheatersManager.CurrentTheatersList[i];
      if (theater instanceof ThreeTheaterBase) {
        if (theater.environment) {
          environment = theater.environment;
        }
      }
    }
    return environment;
  }

  //#region  getter/setter
  public static get Scene(): Scene {
    return this._Scene;
  }
  public static get Renderer(): WebGLRenderer {
    return this._Renderer;
  }
  public static get DomElementContainer(): HTMLElement | null {
    return this._DomElementContainer;
  }
  public static get DomRect(): DOMRect {
    return this._DOMRect;
  }
  public static get CameraController(): ThreeCameraControllerBase | null {
    return this._CameraController;
  }
  public static set MaxPixelRatio(pixelRatio: number) {
    this._MaxPixelRatio = pixelRatio;
  }
  //#endregion
}
