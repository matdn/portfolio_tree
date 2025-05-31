import { ViewsProxy } from 'pancake';
import { ViewId } from '../../../constants/views/ViewId';
import InitCommandBase from "../../../core/commands/inits/initcommands/bases/InitCommandBase";
import MainThreeView from "../../../views/threes/MainThreeView";
import { ThreeCamerasProxy } from '../../../core/_engine/threejs/proxies/ThreeCamerasProxy';
import { MainCameraController } from '../../../cameras/MainCameraController';
import { ThreeAssetsManager } from '@cooker/three';
import { AssetId } from '../../../constants/games/AssetId';
import ReactHTMLView from '../../../core/_engine/htmls/views/ReactHTMLView';
import { ViewPlacementId } from '../../../constants/views/ViewPlacementId';
import MainReactView from '../../../views/doms/reacts/MainReactView';
import OrangerieProjectPage from '../../../views/doms/reacts/ProjectPageTemplate';
import EntryReactView from '../../../views/doms/reacts/EntryReactView';
import ProjectPage from '../../../views/doms/reacts/ProjectPageTemplate';
import AboutReactView from '../../../views/doms/reacts/AboutReactView';


export class MainInitCommand extends InitCommandBase {

    public override async initProxies(): Promise<void> {
        ThreeCamerasProxy.AddCamera(new MainCameraController());

    }

    public override async initManagers(): Promise<void> {
        // 
    }


    public override async initCommon(): Promise<void> {
        ThreeAssetsManager.AddTexture(AssetId.IMAGE_ONE, this._getAssetPath('images/img1.png'));
        ThreeAssetsManager.AddTexture(AssetId.IMAGE_TWO, this._getAssetPath('images/img2.png'));
        ThreeAssetsManager.AddTexture(AssetId.IMAGE_THREE, this._getAssetPath('images/img3.png'));
        ThreeAssetsManager.AddTexture(AssetId.IMAGE_FOUR, this._getAssetPath('images/img4.png'));
        ThreeAssetsManager.AddTexture(AssetId.IMAGE_FIVE, this._getAssetPath('images/img0.png'));
        ThreeAssetsManager.AddTexture(AssetId.IMAGE_SIX, this._getAssetPath('images/image1.jpg'));
        ThreeAssetsManager.AddTexture(AssetId.IMAGE_SEVEN, this._getAssetPath('images/kaskad.png'));
        ThreeAssetsManager.AddTexture(AssetId.IMAGE_EIGHT, this._getAssetPath('images/orangerie.png'));
        ThreeAssetsManager.AddTexture(AssetId.IMAGE_NINE, this._getAssetPath('images/orangerie2.png'));
        ThreeAssetsManager.AddTexture(AssetId.IMAGE_DUDV, this._getAssetPath('images/waterdudv.jpg'));
    }

    public override async initPixi(): Promise<void> {
        // 
    }

    public override async initThree(): Promise<void> {
        ThreeAssetsManager.AddRGBE(AssetId.HDR_STUDIO, this._getAssetPath('hdr/studio.hdr'));
        ThreeAssetsManager.AddTexture(AssetId.TEXTURE_BAKE_MOUNTAIN, this._getAssetPath('textures/commons/mountainBake.png'));

    }

    public override async addViews(): Promise<void> {
        ViewsProxy.AddViewConstructor(ViewId.THREE_MAIN, MainThreeView);
        ViewsProxy.AddView(new ReactHTMLView(ViewId.MAIN_REACT, ViewPlacementId.REACT_VIEWS, MainReactView, 0));
        ViewsProxy.AddView(new ReactHTMLView(ViewId.ENTRY_REACT, ViewPlacementId.REACT_ENTRY, EntryReactView, 0));
        ViewsProxy.AddView(new ReactHTMLView(ViewId.PROJECT_REACT, ViewPlacementId.REACT_VIEWS, ProjectPage, 0));
        ViewsProxy.AddView(new ReactHTMLView(ViewId.ABOUT_REACT, ViewPlacementId.REACT_VIEWS, AboutReactView, 0));


    }

    public override async addTheaters(): Promise<void> {
        // 
    }


    public override async initAfterLoad(): Promise<void> {
    }

}
