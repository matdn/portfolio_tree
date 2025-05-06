type Color = { r: number, g: number, b: number, a: number };


export class ImageUtils {

    private static _Canvas: HTMLCanvasElement;
    private static _LastImage: HTMLImageElement;
    private static _LastImageData: ImageData;

    public static GetImageData(image: HTMLImageElement): ImageData {
        if (!this._Canvas) {
            this._Canvas = document.createElement('canvas');
        }
        if (this._LastImage != image) {
            this._LastImage = image;
            const canvas = this._Canvas;
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext('2d',{ willReadFrequently: true }) as CanvasRenderingContext2D;
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            this._LastImageData = imageData;
        }
        return this._LastImageData;
    }

    // x, y corrdonées absolue
    public static GetHexColorFromImageAt(image: HTMLImageElement, x: number, y: number): number {
        const imageData = this.GetImageData(image);
        const color = this.GetColorAt(imageData, x, y);
        return ImageUtils.getHexFromColor(color.r, color.g, color.b);
    }

    // r, g, b entre 0 et 1
    // x, y corrdonées absolue
    public static GetColorFromImageAt(image: HTMLImageElement, x: number, y: number): Color {
        const imageData = this.GetImageData(image);
        return this.GetColorAt(imageData, x, y);
    }


    // r, g, b entre 0 et 1
    // x, y corrdonées entre 0 et 1
    public static GetColorAtNormalized(imageData: ImageData, x: number, y: number): { r: number, g: number, b: number, a: number } {
        const num = imageData.data.length;
        x = (x * (imageData.width - 1)) >> 0;
        y = (y * (imageData.height - 1)) >> 0;
        return this.GetColorAt(imageData, x, y);
    }

    // r, g, b entre 0 et 1
    // x, y corrdonées absolue
    public static GetColorAt(imageData: ImageData, x: number, y: number): Color {
        const num = imageData.data.length;
        // x = (x * (imageData.width - 1)) >> 0;
        // y = (y * (imageData.height - 1)) >> 0;
        let index = (y * imageData.width + x) * 4;
        if (index > num) index = num;
        const r = imageData.data[index] / 0xff;
        const g = imageData.data[index + 1] / 0xff;
        const b = imageData.data[index + 2] / 0xff;
        const a = imageData.data[index + 3] / 0xff;
        // console.log(x, y, r, g, b, a);
        return { r: r, g: g, b: b, a: a };
    }

    // r, g, b entre 0 et 1
    public static getHexFromColor(r: number, g: number, b: number): number {
        r *= 0xff << 16;
        g *= 0xff << 8;
        b *= 0xff;
        const c = r + g + b;
        return c;
    }

    // color RGB
    public static getColorFromHex(hex: number): Color {
        const r = ((hex & 0xff0000) >> 16) / 0xff;
        const g = ((hex & 0x00ff00) >> 8) / 0xff;
        const b = ((hex & 0x0000ff) >> 0) / 0xff;
        return { r: r, g: g, b: b, a: 1 };
    }
}