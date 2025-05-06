export class MathUtils {


    //
    // RandomSeed
    //
    private static _Seed: number = 42;
    private static _RandomMultiplier = 1664525;
    private static _RandomIncrement = 1013904223;
    private static _MaxSeedValue = 4294967296;

    public static InitSeed(seed: number) {
        this._Seed = seed;
    }

    public static RandomSeed(): number {
        this._Seed = (this._Seed * this._RandomMultiplier + this._RandomIncrement) % this._MaxSeedValue;
        return this._Seed / this._MaxSeedValue;
    }


    //
    // Get Random Value in Array
    //
    public static GetRandomInArray<T>(array: Array<T>): T {
        const num = array.length;
        const index = (Math.random() * num) >> 0;
        return array[index];
    }

    //
    // Get Random Value in Array
    //
    public static GetRandomSeedInArray<T>(array: Array<T>): T {
        const num = array.length;
        const index = (MathUtils.RandomSeed() * num) >> 0;
        return array[index];
    }


    //
    // Get value inside loop
    //
    public static Loop(value: number, loop: number): number {
        return ((value % loop + loop) % loop);
    }

    //
    // Get value between 0 : 2PI
    //
    public static LoopZeroTo2PI(value: number): number {
        return this.Loop(value, Math.PI * 2);
    }

    //
    // Get value between -PI : PI
    //
    public static LoopMinusPIToPI(value: number): number {
        value = this.LoopZeroTo2PI(value);
        if (value > Math.PI) value -= Math.PI * 2;
        else if (value < -Math.PI) value += Math.PI * 2;
        return value;
    }

    //
    // Clamp
    //
    public static Clamp(value: number, min: number, max: number): number {
        if (value < min) return min;
        if (value > max) return max;
        return value;
    }
}
