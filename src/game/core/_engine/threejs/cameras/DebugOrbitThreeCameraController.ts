import { Raycaster, Vector2, Vector3 } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ThreeCameraControllerBase } from "./bases/ThreeCameraControllerBase";
import { DomEvent, KeyboardConstant } from "spices";
import { ThreeMouseManager } from "../managers/ThreeMouseManager";
import { KeyboardManager } from "../../../managers/KeyboardManager";
import { MainThree } from "../MainThree";

export class DebugOrbitThreeCameraController extends ThreeCameraControllerBase {

    public static readonly CAMERA_ID: string = 'debug';

    private _orbit: OrbitControls | null = null;

    private _raycaster: Raycaster;

    constructor(dom?: HTMLElement) {
        super(DebugOrbitThreeCameraController.CAMERA_ID);
        if (dom) {
            this.setDomElement(dom);
        }
        this._camera.position.set(0, 10, 20);
        this._camera.lookAt(new Vector3(0, 0, 0));

        this._raycaster = new Raycaster();
    }

    public override setDomElement(dom: HTMLElement): void {
        super.setDomElement(dom);
        this._orbit = new OrbitControls(this._camera, dom);
        this._orbit.enabled = this._isStart;
    }

    public setPosition(x: number, y: number, z: number): void {
        this._camera.position.set(x, y, z);
        if (this._orbit) {
            this._orbit.target.set(x, y, z - 20);
            this._orbit.update();
        }
    }

    public override start(): void {
        super.start();
        if (this._orbit) this._orbit.enabled = true;
        this._addCallbacks();
    }

    public override stop(): void {
        super.stop();
        if (this._orbit) this._orbit.enabled = false;
        this._removeCallbacks();
    }

    private _addCallbacks(): void {
        this._removeCallbacks();
        ThreeMouseManager.OnMouseDown.add(this._onMouseDown);
    }

    private _removeCallbacks(): void {
        ThreeMouseManager.OnMouseDown.remove(this._onMouseDown);
    }

    private _onMouseDown = (): void => {
        if (KeyboardManager.IsDown(KeyboardConstant.Codes.ControlLeft)) {
            this._raycaster.setFromCamera(new Vector2(ThreeMouseManager.RelativeMouseX, ThreeMouseManager.RelativeMouseY), this._camera);
            const intersect = this._raycaster.intersectObjects(MainThree.Scene.children, true);
            if(intersect.length > 0) {
                this._orbit.target.copy(intersect[0].point);
                this._orbit.update();
            }
        }

    }
}