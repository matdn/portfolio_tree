import { TheatersProxy, ViewsProxy } from 'pancake';
import { MainCameraController } from '../../../cameras/MainCameraController';
import { ViewId } from '../../../constants/views/ViewId';
import { ViewPlacementId } from '../../../constants/views/ViewPlacementId';
import ReactHTMLView from '../../../core/_engine/htmls/views/ReactHTMLView';
import { ThreeCamerasProxy } from '../../../core/_engine/threejs/proxies/ThreeCamerasProxy';
import InitCommandBase from "../../../core/commands/inits/initcommands/bases/InitCommandBase";
import MainReactView from '../../../views/doms/reacts/MainReactView';
import ProjectPage from '../../../views/doms/reacts/ProjectPageTemplate';
import { ProjectThreeTheater } from '../../../theaters/ProjectThreeTheater';


export class ProjectInitCommand extends InitCommandBase {

    public override async initProxies(): Promise<void> {
        ThreeCamerasProxy.AddCamera(new MainCameraController());
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

    }

    public override async addViews(): Promise<void> {
        ViewsProxy.AddView(new ReactHTMLView(ViewId.MAIN_REACT, ViewPlacementId.REACT_VIEWS, MainReactView, 0));
        console.log("ADDING PROJECT VIEW");
        ViewsProxy.AddView(new ReactHTMLView(ViewId.PROJECT_REACT, ViewPlacementId.REACT_VIEWS, ProjectPage, 0));
    }

    public override async addTheaters(): Promise<void> {
        TheatersProxy.AddTheater(new ProjectThreeTheater());
    }


    public override async initAfterLoad(): Promise<void> {

    }

}
