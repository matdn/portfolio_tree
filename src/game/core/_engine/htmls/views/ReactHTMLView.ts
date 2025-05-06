import { TransitionProps } from "../../reacts/views/bases/ReactViewBase";
import { AnimatedHTMLView } from "./AnimatedHTMLView";


// type ReturnJSXElement = () => JSX.Element;
export type ReturnJSXElement = React.FC<{}>;
// type ReturnJSXElement = ComponentType<()=>JSX.Element>;

export default class ReactHTMLView extends AnimatedHTMLView {

    private _reactComponent: ReturnJSXElement;
    private _props: TransitionProps;
    // private _reactComponent: (Component: React.ComponentType<any>) => JSX.Element;


    constructor(viewId: string, placementId: number, reactComponent: ReturnJSXElement, animationDuration?: number, props?: TransitionProps) {
        super(viewId, placementId);
        if (animationDuration !== undefined) this._animationDuration = animationDuration;
        this._reactComponent = reactComponent;
        this._props = {
            viewId: viewId,
            ...props
        };
        // this._reactComponent = memo(reactComponent);
    }

    //#region getter/setter
    public get reactComponent(): ReturnJSXElement { return this._reactComponent; }
    public get props(): any { return this._props; }
    // public get reactComponent(): () => JSX.Element { return this._reactComponent; }
    //#endregion
}