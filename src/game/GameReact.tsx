import { ViewsManager } from 'pancake';
import React, { useEffect, useState } from 'react';

// Game Init
import GameMain from './GameMain';

// Loader
import PreloadReactView from './views/doms/reacts/preloads/PreloadReactView';

// Views
import ReactHTMLView from './core/_engine/htmls/views/ReactHTMLView';

export default function GameReact() {
  const [isInit, setIsInit] = useState<boolean>(GameMain.IsInit);
  const [views, setViews] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    if (GameMain.IsInit) {
      onInitFinished();
    } else {
      GameMain.OnInitFinish.add(onInitFinished);
      GameMain.Init();
    }

    function onInitFinished() {
      setIsInit(GameMain.IsInit);
      GameMain.OnInitFinish.remove(onInitFinished);
      GameMain.Start();
    }

    return () => {
      GameMain.OnInitFinish.remove(onInitFinished);
    };
  }, []);

  useEffect(() => {
    const OnChangeView = () => {
      const newViews: React.ReactNode[] = [];
      ViewsManager.DisplayedViewsList.forEach(view => {
        if (view instanceof ReactHTMLView) {
          if (view?.reactComponent) {
            newViews.push(<view.reactComponent key={view.viewId} {...view.props} />);
          }
        }
      });
      setViews(newViews);
    };

    ViewsManager.OnShowView.add(OnChangeView);
    ViewsManager.OnRemoveView.add(OnChangeView);
    OnChangeView();

    return () => {
      ViewsManager.OnShowView.delete(OnChangeView);
      ViewsManager.OnRemoveView.delete(OnChangeView);
    };
  }, []);

  return (
    <div id="GAME">
      {isInit && views}
    </div>
  );
}
