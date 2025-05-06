import { CommonAssetsManager } from "@cooker/common";
import { Ticker } from "cookware";
import { TheatersManager, TheatersProxy, ViewsManager, ViewsProxy } from "pancake";
import ReactHTMLView from "../../../_engine/htmls/views/ReactHTMLView";
import { TheaterPreloadReactHTMLView } from "../../../_engine/htmls/views/TheaterPreloadReactHTMLView";
import QuickLinksReactView, { QuickLinksReactViewId } from "../../../_engine/reacts/views/QuickLinksReactView";
import TheaterPreloadReactView from "../../../_engine/reacts/views/TheaterPreloadReactView";
import { DebugManager } from "../../../debugs/DebugManager";
import { KeyboardManager } from "../../../managers/KeyboardManager";
import { SoundsManager } from "../../../managers/SoundsManager";
import { GamesProxy } from "../../../proxies/GamesProxy";
import InitCommandBase from "./bases/InitCommandBase";
import { FullscreenManager } from "../../../managers/FullscreenManager";
import { PoolsProxy } from "../../../proxies/PoolsProxy";
import { VirtualGamePadConfigsProxy } from "../../../proxies/VirtualGamePadConfigsProxy";
import { VirtualGamePadConfigsManager } from "../../../managers/VirtualGamePadConfigsManager";


export class CoreInitCommand extends InitCommandBase {

    public override async initProxies(): Promise<void> {
        ViewsProxy.Init();
        TheatersProxy.Init();
        GamesProxy.Init();
        PoolsProxy.Init();
        VirtualGamePadConfigsProxy.Init();
    }

    public override async initManagers(): Promise<void> {
        ViewsManager.Init();
        KeyboardManager.Init();
        TheatersManager.Init();
        SoundsManager.Init();
        FullscreenManager.Init();
        VirtualGamePadConfigsManager.Init();
    }

    public override async addViews(): Promise<void> {
        ViewsProxy.AddView(new TheaterPreloadReactHTMLView(TheaterPreloadReactHTMLView.ViewId, TheaterPreloadReactHTMLView.PlacementId, TheaterPreloadReactView));

        if (DebugManager.IsDev) {
            ViewsProxy.AddView(new ReactHTMLView(QuickLinksReactViewId, 0, QuickLinksReactView));
        }
    }

    public override async addTheaters(): Promise<void> {
    }

    public override async initCommon(): Promise<void> {
        CommonAssetsManager.Init();
    }

    public override async initPixi(): Promise<void> {
    }

    public override async initThree(): Promise<void> {
    }

    public override async initAfterLoad(): Promise<void> {
        Ticker.Start();
        KeyboardManager.Start();
        VirtualGamePadConfigsManager.Start();
    }
}