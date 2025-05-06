import { LineSegments, Vector3 } from "three";

export class Path3D {

    private _points = new Array<Vector3>();
    private _distances = new Array<number>();
    private _length: number;

    private _tmpVector: Vector3 = new Vector3();
    private _loop: boolean;

    private _minVector = new Vector3();
    private _maxVector = new Vector3();


    constructor() {
    }


    public initFromLineSegment(line: LineSegments, loop: boolean = false, direction: number = 1): void {
        const positionAttribute = line.geometry.attributes.position;
        const tab = new Array<Vector3>();
        for (let i = 0; i < positionAttribute.count; i++) {
            let pos: Vector3 = new Vector3();
            pos.fromBufferAttribute(positionAttribute, i);
            const p = new Vector3(pos.x, pos.y, pos.z).add(line.position);
            tab.push(p);
        }
        this.initFromVector3Array(tab, loop, direction);
    }

    public initFromVector3Array(pointsList: Vector3[], loop: boolean = false, direction: number = 1): void {
        this.reset();
        let total = 0;

        this._distances.push(total);
        this._minVector.set(Infinity, Infinity, Infinity);
        this._maxVector.set(-Infinity, -Infinity, -Infinity);

        for (let i = 0; i < pointsList.length; i++) {
            let index = i;
            if (direction < 0) {
                index = pointsList.length - i - 1;
            }
            const pos = pointsList[i].clone();
            this._testMinMax(pos);
            this._points.push(pos);
            if (i > 0) {
                const pA = this._points[i - 1];
                const pB = this._points[i];
                const d = pA.distanceTo(pB);
                total += d;
                this._distances.push(total);
            }
        }
        this._loop = loop;;
        if (this._loop) {
            const ps = this._points[0];
            const pe = this._points[this._points.length - 1];
            const d = pe.distanceTo(ps);
            total += d;
            this._distances.push(total);
            this._points.push(ps);
        }
        this._length = total;
    }


    private _testMinMax(pos: Vector3): void {

        if (pos.x < this._minVector.x) this._minVector.x = pos.x;
        if (pos.y < this._minVector.y) this._minVector.y = pos.y;
        if (pos.z < this._minVector.z) this._minVector.z = pos.z;

        if (pos.x > this._maxVector.z) this._maxVector.x = pos.x;
        if (pos.y > this._maxVector.y) this._maxVector.y = pos.y;
        if (pos.z > this._maxVector.z) this._maxVector.z = pos.z;


    }

    public getPositionAtDistance(distance: number): { x: number, y: number, z: number } {
        if (this._loop) {
            distance = (distance % this._length + this._length) % this._length;
        } else {
            if (distance < 0) distance = 0;
            if (distance > this._length) distance = this._length;
        }
        this._search(distance, 0, this._distances.length);
        return {
            x: this._tmpVector.x,
            y: this._tmpVector.y,
            z: this._tmpVector.z,
        };
    }

    private _search(distance: number, start: number, end: number, deep: number = 0) {
        let mid = start + (((end - start) * 0.5) >> 0);
        if (distance > this._distances[mid]) {
            start = mid;
        } else {
            end = mid;
        }
        if (end - start == 1) {
            const ds = this._distances[start];
            const de = this._distances[end];
            const d = (distance - ds) / (de - ds);
            const vs = this._points[start];
            const ve = this._points[end];
            this._tmpVector.set(vs.x, vs.y, vs.z);
            this._tmpVector.lerp(ve, d);
        } else {
            if (deep < 10) {
                this._search(distance, start, end, deep + 1);
            }
        }
    }

    public reset(): void {
        this._points.length = 0;
        this._distances.length = 0;
        this._length = 0;
        this._loop = false;

        this._tmpVector.set(0, 0, 0);
        this._minVector.set(Infinity, Infinity, Infinity);
        this._maxVector.set(-Infinity, -Infinity, -Infinity);

    }

    //#region getter/setter
    public get length(): number { return this._length; }
    //#endregion

}