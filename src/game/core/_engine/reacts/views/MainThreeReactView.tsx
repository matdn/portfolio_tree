import React, { memo, useEffect } from "react";
import { MainThree } from "../../threejs/MainThree";
import ReactViewBase, { TransitionProps } from "./bases/ReactViewBase";


const MainThreeReactView = memo(({ className = '', ...props }: TransitionProps) => {

    const refContainer = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        MainThree.SetDomElementContainer(refContainer.current);
        MainThree.Start();
        return () => {
            MainThree.Stop();
        };
    }, []);

    return (
        <ReactViewBase {...props} className={`three fixed ${className}`}>
            <div ref={refContainer} className="three-container">
            </div>
        </ReactViewBase>
    );

});
export default MainThreeReactView;