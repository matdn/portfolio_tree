import React, { ImgHTMLAttributes, forwardRef } from "react";
import { AssetsUtils } from "../game/core/utils/AssetsUtils";


export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt?: string;
}


const Image = forwardRef(({ src, alt, ...props }: ImageProps, ref: React.ForwardedRef<HTMLImageElement>) => {
    return (
        <img {...props} ref={ref} src={AssetsUtils.GetAssetURL(src)} alt={alt || ''} />
    );
});

export default Image;