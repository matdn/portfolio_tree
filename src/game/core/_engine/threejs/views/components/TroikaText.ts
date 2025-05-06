import { Action } from 'cookware';
import { Color, Material } from 'three';
import { Text } from 'troika-three-text';
import { AssetsUtils } from '../../../../utils/AssetsUtils';
import { Object3DBase } from './Object3DBase';

export enum TroikaTextAlignOptions {
	LEFT = 'left',
	CENTER = 'center',
	RIGHT = 'right',
}

export enum TroikaTextAnchorXOptions {
	LEFT = 'left',
	CENTER = 'center',
	RIGHT = 'right',
}
export enum TroikaTextAnchorYOptions {
	TOP = 'top',
	CENTER = 'middle',
	BOTTOM = 'bottom',
}

export class TroikaText extends Object3DBase {

	private _intervalId: ReturnType<typeof setTimeout>;
	private _callback: () => void | null = null;

	private _text: Text;
	private _content: string = '';

	private _width: number = 0;
	private _height: number = 0;

	public readonly onReflow = new Action<[TroikaText]>();

	constructor() {
		super();
		this._text = new Text();
		this._text.fontSize = 0.45;
		this._text.color = 0x715843;
		this.add(this._text);
		this.setTextAlign(TroikaTextAlignOptions.CENTER);
		this.setAnchorX(TroikaTextAnchorXOptions.CENTER);
		this.setAnchorY(TroikaTextAnchorYOptions.CENTER);

		// this.add(new Mesh(new BoxGeometry(0.1, 0.1, 0.1), new MeshBasicMaterial({ color: 0xff0000 })));
	}

	public override init(): void {
		super.init();
		this._doRefresh();
	}

	public override reset(): void {
		super.reset();
		this._callback = null;
		clearTimeout(this._intervalId);
	}

	public setLineHeight(lineHeight: number): void {
		this._text.lineHeight = lineHeight;
		this._refresh();
	}

	public setMaxWidth(maxWidth: number): void {
		this._text.maxWidth = maxWidth;
		this._refresh();
	}

	public setText(value: string) {
		value = value.replace(/<br\/>/gmi, '\n');
		this._content = value;
		this._refresh();
	}

	public setFontSize(value: number, callback?: () => void): void {
		this._text.fontSize = value;
		this._refresh(callback);
	}

	public setColor(color: Color): void {
		this._text.color = color;
	}

	public setFont(font: string): void {
		this._text.font = AssetsUtils.GetAssetURL(`fonts/${font}`);
		this._refresh();
	}

	public setTextAlign(align: TroikaTextAlignOptions): void {
		this._text.textAlign = align;
		this._refresh();
	}

	public setAnchorX(anchorX: TroikaTextAnchorXOptions): void {
		this._text.anchorX = anchorX;
		this._refresh();
	}

	public setAnchorY(anchorY: TroikaTextAnchorYOptions): void {
		this._text.anchorY = anchorY;
		this._refresh();
	}

	private _refresh(callback?: () => void): void {
		clearTimeout(this._intervalId);
		this._callback = callback;
		this._intervalId = setTimeout(this._doRefresh, 0);
	}


	private _doRefresh = (): void => {
		this._text.text = this._content;
		this._text.sync(() => {
			this._text.geometry.computeBoundingBox();
			const box = this._text.geometry.boundingBox;
			this._width = Math.abs(box.max.x - box.min.x);
			this._height = Math.abs(box.max.y - box.min.y);
			if (this._callback) {
				const cb = this._callback;
				this._callback = null;
				cb();
			}
			this.onReflow.execute(this);
		});
	}

	//#region Getters & Setters
	public get width(): number { return this._width; }
	public get height(): number { return this._height; }
	public get fontSize(): number { return this._text.fontSize; }
	public get material(): Material | Material[] { return this._text.material; }
	public get text(): Text { return this._text; }
	//#endregion
}