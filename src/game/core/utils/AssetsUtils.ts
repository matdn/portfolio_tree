import { getAssetUrl } from '../../../helpers/common.helpers.ts';

export class AssetsUtils {

    public static BasePath: string = getAssetUrl('/assets/game/');

    public static GetAssetURL(url: string): string {
        if (url.startsWith('./')) url = url.substring(2, url.length);
        if (url.startsWith('/')) url = url.substring(1, url.length);
        url = this.BasePath + url;
        return url;
    }

}
