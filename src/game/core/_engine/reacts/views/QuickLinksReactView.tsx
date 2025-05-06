import { TheatersManager, TheatersProxy } from 'pancake';
import { useCallback, useEffect, useState } from 'react';
import { DomEvent, KeyboardConstant } from 'spices';
import { TheaterTransitionCommand } from '../../../commands/TheaterTransitionCommand';
import { KeyboardManager } from '../../../managers/KeyboardManager';

export const QuickLinksReactViewId = 'quickLinks';

export const QuickLinksReactViewOptions = {
  className: 'bottom center',
};

export const QuickLinksExcludedID = [];

export default function QuickLinksReactView() {
  const [buttons, setButtons] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOpenButton = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const showTheater = (theaterId: string) => {
    setIsOpen(false);
    TheaterTransitionCommand.Show(theaterId);
    TheatersManager.ShowById(theaterId);
  };

  useEffect(() => {
    KeyboardManager.OnKeyUp.add((e) => {
      if (e.key === KeyboardConstant.Keys.Escape) {
        setIsOpen(false);
      }
    });

    const onClickWindow = (e: any) => {
      if (e.target !== document.querySelector('.openButton')) {
        setIsOpen(false);
      }
    };

    window.addEventListener(DomEvent.CLICK, onClickWindow);
    return () => {
      window.removeEventListener(DomEvent.CLICK, onClickWindow);
    };
  }, []);

  useEffect(() => {
    let buttons: any[] = [];
    for (const theaterId of TheatersProxy.TheatersMap.keys()) {
      if (!QuickLinksExcludedID.includes(theaterId)) {
        buttons.push(<li key={theaterId}></li>);
      }
    }
    setButtons(buttons);
  }, []);

  return <></>;
}
