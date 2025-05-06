export class RandomSeed {

    private _randomMultiplier = 1664525;
    private _randomIncrement = 1013904223;
    private _maxSeedValue = 4294967296;
    
    private _seed: number = 42;

    constructor(seed: number = 512) {
        this._seed = seed;
    }

    public randomSeed(): number {
        this._seed = (this._seed * this._randomMultiplier + this._randomIncrement) % this._maxSeedValue;
        return this._seed / this._maxSeedValue;
    }

} 