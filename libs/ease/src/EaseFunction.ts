export class EaseFunction {
    static Linear(t: number): number {
        return t;
    }

    static EaseInQuad(t: number): number {
        return t * t;
    }

    static EaseOutQuad(t: number): number {
        return t * (2 - t);
    }

    static EaseInOutQuad(t: number): number {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    static EaseInCubic(t: number): number {
        return t * t * t;
    }

    static EaseOutCubic(t: number): number {
        return (--t) * t * t + 1;
    }

    static EaseInOutCubic(t: number): number {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    static EaseInQuart(t: number): number {
        return t * t * t * t;
    }

    static EaseOutQuart(t: number): number {
        return 1 - (--t) * t * t * t;
    }

    static EaseInOutQuart(t: number): number {
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    }

    static EaseInQuint(t: number): number {
        return t * t * t * t * t;
    }

    static EaseOutQuint(t: number): number {
        return 1 + (--t) * t * t * t * t;
    }

    static EaseInOutQuint(t: number): number {
        return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    }

    static EaseOutBack(t: number, overshoot: number = 1.70158): number {
        return 1 + (--t) * t * ((overshoot + 1) * t + overshoot);
    }

    static EaseInBack(t: number, overshoot: number = 1.70158): number {
        return t * t * ((overshoot + 1) * t - overshoot);
    }

    static EaseInExpo(t: number): number {
        return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
    }

    static EaseOutExpo(t: number): number {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    static EaseInOutExpo(t: number): number {
        if (t === 0) return 0;
        if (t === 1) return 1;
        if (t < 0.5) return 0.5 * Math.pow(2, 20 * t - 10);
        return 1 - 0.5 * Math.pow(2, -20 * t + 10);
    }

    static EaseInOutBack(t: number): number {
        const c1 = 1.70158;
        const c2 = c1 * 1.525;

        return t < 0.5
            ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
            : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
    }

    static EaseInElastic(t: number, amplitude: number = 1, period: number = 0.3): number {
        if (t === 0 || t === 1) return t;

        const s = period / (2 * Math.PI) * Math.asin(1 / amplitude);

        return (
            -amplitude *
            Math.pow(2, 10 * (t - 1)) *
            Math.sin(((t - s) * (2 * Math.PI)) / period)
        );
    }

    static EaseOutElastic(t: number, amplitude: number = 1, period: number = 0.3): number {
        if (t === 0 || t === 1) return t;

        const s = period / (2 * Math.PI) * Math.asin(1 / amplitude);

        return (
            amplitude *
            Math.pow(2, -10 * t) *
            Math.sin(((t - s) * (2 * Math.PI)) / period) +
            1
        );
    }

    static EaseInOutElastic(t: number, amplitude: number = 1, period: number = 0.3): number {
        if (t === 0 || t === 1) return t;
        if (t < 0.5) {
            return (
                -0.5 *
                (amplitude *
                    Math.pow(2, 20 * t - 10) *
                    Math.sin(((20 * t - 11.125) * (2 * Math.PI)) / period))
            );
        } else {
            return (
                amplitude *
                Math.pow(2, -20 * t + 10) *
                Math.sin(((20 * t - 11.125) * (2 * Math.PI)) / period) *
                0.5 +
                1
            );
        }
    }

    static EaseInBounce(t: number): number {
        return 1 - EaseFunction.EaseOutBounce(1 - t);
    }

    static EaseOutBounce(t: number): number {
        if (t < 1 / 2.75) {
            return 7.5625 * t * t;
        } else if (t < 2 / 2.75) {
            t -= 1.5 / 2.75;
            return 7.5625 * t * t + 0.75;
        } else if (t < 2.5 / 2.75) {
            t -= 2.25 / 2.75;
            return 7.5625 * t * t + 0.9375;
        } else {
            t -= 2.625 / 2.75;
            return 7.5625 * t * t + 0.984375;
        }
    }

    static EaseInOutBounce(t: number): number {
        if (t < 0.5) {
            return EaseFunction.EaseInBounce(t * 2) * 0.5;
        } else {
            return EaseFunction.EaseOutBounce(t * 2 - 1) * 0.5 + 0.5;
        }
    }
}
