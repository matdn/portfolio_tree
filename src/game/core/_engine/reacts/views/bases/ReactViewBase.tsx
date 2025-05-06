import { ViewState, ViewsProxy } from 'pancake';
import React, { HTMLAttributes, useEffect, useRef, useState } from 'react';
import { SuperViewBase } from '../../../../views/bases/SuperViewBase';
import ReactHTMLView from '../../../htmls/views/ReactHTMLView';

export interface TransitionProps extends HTMLAttributes<HTMLDivElement> {
  viewId: string;
  children?: React.ReactNode;
  className?: string;
  handleChange?: (target: HTMLElement, value: number) => void;
}

export default function ReactViewBase({
  viewId,
  children,
  className = '',
  handleChange,
  ...props
}: TransitionProps) {
  const target = useRef<HTMLDivElement>(null);
  const [targetClass, setTargetClass] = useState<string>(
    ViewsProxy.GetView(viewId).viewState
  );

  useEffect(() => {
    const view = ViewsProxy.GetView<ReactHTMLView>(viewId);

    view.setHTMLElement(target.current);

    const onViewStateChange = (
      view: SuperViewBase,
      viewState: ViewState
    ): void => {
      updateState(viewState);
    };

    const updateState = (viewState: ViewState) => {
      if (target.current) setTargetClass(viewState);
    };

    const onTransitionChange = (value: number): void => {
      if (handleChange && target.current) {
        handleChange(target.current, value);
      }
    };

    updateState(view.viewState);
    onTransitionChange(view.value);
    view.onStateChangeAction?.add(onViewStateChange);
    view.onTransitionChangeAction?.add(onTransitionChange);

    return () => {
      view.onStateChangeAction?.delete(onViewStateChange);
      view.onTransitionChangeAction?.remove(onTransitionChange);
    };
  }, []);

  return (
    <div
      {...props}
      id={viewId}
      className={`h-dvh w-screen ${className} ${targetClass}`}
      ref={target}
      key={viewId}
    >
      {children}
    </div>
  );
}
