import { TheatersProxy, ViewsProxy } from 'pancake';
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
import TestReactView from '../../../views/doms/reacts/TestReactView';
import TestThreeView from '../../../views/threes/TestThreeView';
import CinemaThreeView from '../../../views/threes/CinemaThreeView';
import { CinemaCameraController } from '../../../cameras/CinemaCameraController';
import ProjectHeroSection from '../../../views/doms/reacts/ProjectPageTemplate';
import ProjectPageTemplate from '../../../views/doms/reacts/ProjectPageTemplate';


export class MainInitCommand extends InitCommandBase {

    public override async initProxies(): Promise<void> {
        ThreeCamerasProxy.AddCamera(new MainCameraController());
        ThreeCamerasProxy.AddCamera(new CinemaCameraController());

    }

    public override async initManagers(): Promise<void> {
        // 
    }


    public override async initCommon(): Promise<void> {
        ThreeAssetsManager.AddTexture(AssetId.IMAGE_ONE, this._getAssetPath('images/or1.png'));
        ThreeAssetsManager.AddTexture(AssetId.IMAGE_TWO, this._getAssetPath('images/or2.png'));
        ThreeAssetsManager.AddTexture(AssetId.IMAGE_THREE, this._getAssetPath('images/or3.png'));
        ThreeAssetsManager.AddTexture(AssetId.IMAGE_FOUR, this._getAssetPath('images/or4.png'));
        ThreeAssetsManager.AddTexture(AssetId.IMAGE_FIVE, this._getAssetPath('images/or5.png'));
        ThreeAssetsManager.AddTexture(AssetId.IMAGE_SIX, this._getAssetPath('images/or6.png'));
        ThreeAssetsManager.AddTexture(AssetId.IMAGE_SEVEN, this._getAssetPath('images/or2.png'));
        ThreeAssetsManager.AddTexture(AssetId.IMAGE_EIGHT, this._getAssetPath('images/or3.png'));
        ThreeAssetsManager.AddTexture(AssetId.IMAGE_NINE, this._getAssetPath('images/or6.png'));
        ThreeAssetsManager.AddTexture(AssetId.IMAGE_DUDV, this._getAssetPath('images/or5.png'));
        ThreeAssetsManager.AddTexture(AssetId.TEXT_BLUR, this._getAssetPath('images/or4.png'));
    }

    public override async initPixi(): Promise<void> {
        // 
    }

    public override async initThree(): Promise<void> {
        ThreeAssetsManager.AddRGBE(AssetId.HDR_STUDIO, this._getAssetPath('hdr/studio.hdr'));
        ThreeAssetsManager.AddTexture(AssetId.TEXTURE_BAKE_MOUNTAIN, this._getAssetPath('textures/commons/mountainBake.png'));

    }

    public override async addViews(): Promise<void> {
        // ViewsProxy.AddViewConstructor(ViewId.THREE_MAIN, MainThreeView);
        ViewsProxy.AddViewConstructor(ViewId.TEST_THREE, TestThreeView);
        ViewsProxy.AddViewConstructor(ViewId.THREE_CINEMA, CinemaThreeView);

        // ViewsProxy.AddView(new ReactHTMLView(ViewId.MAIN_REACT, ViewPlacementId.REACT_VIEWS, MainReactView, 0));
        ViewsProxy.AddView(new ReactHTMLView(ViewId.ENTRY_REACT, ViewPlacementId.REACT_ENTRY, EntryReactView, 0));
        ViewsProxy.AddView(new ReactHTMLView(ViewId.PROJECT_REACT, ViewPlacementId.REACT_VIEWS, ProjectPageTemplate, 0));
        ViewsProxy.AddView(new ReactHTMLView(ViewId.TEST_REACT, ViewPlacementId.REACT_VIEWS, TestReactView, 0));

        ViewsProxy.AddView(new ReactHTMLView(ViewId.ABOUT_REACT, ViewPlacementId.REACT_VIEWS, AboutReactView, 0));


    }

    public override async addTheaters(): Promise<void> {
    }


    public override async initAfterLoad(): Promise<void> {
    }

}
