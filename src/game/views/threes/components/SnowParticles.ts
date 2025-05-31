import {
    Color,
    Group,
    Mesh,
    MeshStandardMaterial,
    PointLight,
    SphereGeometry,
    Vector3
} from "three";

export class SnowParticles extends Group {
    private _particles: Mesh[] = [];
    private _velocities: Vector3[] = [];
    private _count = 100;
    private _spawnArea: {
        x: [number, number];
        y: [number, number];
        z: [number, number];
    } = {
            x: [-100, 100],
            y: [30, 80],
            z: [-400, -200]
        };

    constructor() {
        super();

        const geometry = new SphereGeometry(0.3, 8, 8);
        const material = new MeshStandardMaterial({
            color: new Color(0xffffff),
            emissive: new Color(0xffffff),
            emissiveIntensity: 1.5
        });

        for (let i = 0; i < this._count; i++) {
            const mesh = new Mesh(geometry, material);
            this.resetParticlePosition(mesh);
            this._particles.push(mesh);
            this._velocities.push(new Vector3(0, -Math.random() * 0.2 - 0.05, 0));
            this.add(mesh);
        }

        const light = new PointLight(0xffffff, 1.5, 200);
        light.position.set(0, 60, -150);
        this.add(light);
    }

    private resetParticlePosition(p: Mesh) {
        p.position.set(
            this.randomInRange(this._spawnArea.x),
            this.randomInRange(this._spawnArea.y),
            this.randomInRange(this._spawnArea.z)
        );
    }

    private randomInRange([min, max]: [number, number]) {
        return Math.random() * (max - min) + min;
    }

    public update(dt: number) {
        for (let i = 0; i < this._particles.length; i++) {
            const p = this._particles[i];
            const v = this._velocities[i];
            p.position.addScaledVector(v, dt * 0.01);

            if (p.position.y < 10) {
                this.resetParticlePosition(p);
            }
        }
    }
}
