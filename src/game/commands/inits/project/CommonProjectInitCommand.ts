import { ThreeAssetsManager } from '@cooker/three';
import { TheatersProxy, ViewsProxy } from 'pancake';
import { AssetId } from '../../../constants/games/AssetId';
import { ViewPlacementId } from '../../../constants/views/ViewPlacementId';
import ReactHTMLView from '../../../core/_engine/htmls/views/ReactHTMLView';
import MainThreeReactView from '../../../core/_engine/reacts/views/MainThreeReactView';
import { MainThree } from '../../../core/_engine/threejs/MainThree';
import InitCommandBase from "../../../core/commands/inits/initcommands/bases/InitCommandBase";
import { MainTheater } from "../../../theaters/MainThreeTheater";
import { AnalyseGLTFCommand } from '../AnalyseGLTFCommand';
import { ProjectThreeTheater } from '../../../theaters/ProjectThreeTheater';
import CinemaThreeView from '../../../views/threes/CinemaThreeView';


export class CommonProjectInitCommand extends InitCommandBase {

    public override async initProxies(): Promise<void> {
        // 
    }

    public override async initManagers(): Promise<void> {
    }


    public override async initCommon(): Promise<void> {
        // 
    }

    public override async initPixi(): Promise<void> {
        // 
    }

    public override async initThree(): Promise<void> {
        ThreeAssetsManager.AddModel(AssetId.GLTF_COMMON, this._getAssetPath('models/common.glb'));
        ThreeAssetsManager.AddModel(AssetId.GLTF_MAIN, this._getAssetPath('models/model.glb'));
        ThreeAssetsManager.AddModel(AssetId.GLTF_CINEMA, this._getAssetPath('models/cinema.glb'));
    }

    public override async addViews(): Promise<void> {
        ViewsProxy.AddView(new ReactHTMLView(MainThree.VIEW_ID, ViewPlacementId.REACT_THREE, MainThreeReactView));

    }

    public override async addTheaters(): Promise<void> {
        TheatersProxy.AddTheater(new MainTheater());
        TheatersProxy.AddTheater(new ProjectThreeTheater());
    }


    public override async initAfterLoad(): Promise<void> {
        AnalyseGLTFCommand.Analyse(ThreeAssetsManager.GetModel(AssetId.GLTF_COMMON), AssetId.GLTF_COMMON);
        AnalyseGLTFCommand.Analyse(ThreeAssetsManager.GetModel(AssetId.GLTF_MAIN), AssetId.GLTF_MAIN);
        AnalyseGLTFCommand.Analyse(ThreeAssetsManager.GetModel(AssetId.GLTF_CINEMA), AssetId.GLTF_CINEMA);

    }

}
