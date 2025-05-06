import { Object3D } from "three";

export class AugmentedObject3D {
    public static Init(): void {
        return;
        // Adding the 'init' method to the Object3D prototype
        Object3D.prototype['init'] = function (): void {
            for (const child of this.children) {
                if ((this as any)._isChildObject3DBase(child)) {
                    (child as any).init();
                }
            }
        };

        // Adding the 'start' method to the Object3D prototype
        Object3D.prototype['start'] = function (): void {
            for (const child of this.children) {
                if ((this as any)._isChildObject3DBase(child)) {
                    (child as any).start();
                }
            }
        };

        // Adding the 'stop' method to the Object3D prototype
        Object3D.prototype['stop'] = function (): void {
            for (const child of this.children) {
                if ((this as any)._isChildObject3DBase(child)) {
                    (child as any).stop();
                }
            }
        };

        // Adding the 'reset' method to the Object3D prototype
        Object3D.prototype['reset'] = function (): void {
            for (const child of this.children) {
                if ((this as any)._isChildObject3DBase(child)) {
                    (child as any).reset();
                }
            }
        };

        // Adding the 'update' method to the Object3D prototype
        Object3D.prototype['update'] = function (dt: number): void {
            for (const child of this.children) {
                if ((this as any)._isChildObject3DBase(child)) {
                    (child as any).update(dt);
                }
            }
        };

        // Adding the 'resize' method to the Object3D prototype
        Object3D.prototype['resize'] = function (width: number, height: number): void {
            for (const child of this.children) {
                if ((this as any)._isChildObject3DBase(child)) {
                    (child as any).resize(width, height);
                }
            }
        };

        // Adding the '_isChildObject3DBase' method to the Object3D prototype
        Object3D.prototype['_isChildObject3DBase'] = function (child: Object3D): boolean {
            // Placeholder implementation; adjust logic as needed.
            // Uncomment the below lines and adjust as per your class hierarchy
            // if (child instanceof Object3DBase) return true;
            // if ((child as any)._isExtendedObject3D) return true;
            return true; // Default implementation returns true for all children
        };
    }
}
