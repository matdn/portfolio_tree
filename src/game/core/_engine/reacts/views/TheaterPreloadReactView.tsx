import NumberFlow from '@number-flow/react';
import { gsap } from 'gsap';
import { ViewsProxy } from 'pancake';
import { memo, useEffect, useRef, useState } from 'react';
import { TheaterPreloadReactHTMLView } from '../../htmls/views/TheaterPreloadReactHTMLView';
import ReactViewBase, { TransitionProps } from './bases/ReactViewBase';

const TheaterPreloadReactView = memo(({ ...props }: TransitionProps) => {
  const [displayPercent, setDisplayPercent] = useState<number>(0);
  const [targetPercent, setTargetPercent] = useState<number>(0);
  const circleRef = useRef<SVGCircleElement>(null);
  const allowTransitionRef = useRef<boolean>(false);
  const animatingRef = useRef<boolean>(false);

  // useEffect(() => {
  //   // Masquer la page initialement
  //   gsap.set('.page-transition', {
  //     autoAlpha: 0,
  //     y: '100%'
  //   });

  //   // Animation d'entrée de la page
  //   const enterTl = gsap.timeline();

  //   enterTl.to('.page-transition', {
  //     duration: 1,
  //     autoAlpha: 1,
  //     y: '0%',
  //     ease: 'power3.out'
  //   });

  //   // Timeline pour l'animation du cercle
  //   tl.current = gsap.timeline({ paused: true });

  //   // Animation d'entrée du conteneur
  //   gsap.set(containerRef.current, {
  //     autoAlpha: 0,
  //     y: 20,
  //     scale: 0.95
  //   });

  //   gsap.to(containerRef.current, {
  //     duration: 0.8,
  //     autoAlpha: 1,
  //     y: 0,
  //     scale: 1,
  //     ease: 'power2.out',
  //     delay: 0.4, // Délai pour que l'animation commence après l'entrée de la page
  //   });

  //   // Configuration du cercle de chargement
  //   if (circleRef.current) {
  //     const radius = circleRef.current.r.baseVal.value;
  //     const circumference = radius * 2 * Math.PI;

  //     gsap.set(circleRef.current, {
  //       strokeDasharray: circumference,
  //       strokeDashoffset: circumference,
  //     });
  //   }
  // }, []);

  useEffect(() => {
    const view = ViewsProxy.GetView<TheaterPreloadReactHTMLView>(props.viewId);
    const originalExecute = view.onFinishTransition.execute;

    view.onFinishTransition.execute = function () {
      if (allowTransitionRef.current) {
        originalExecute.call(view.onFinishTransition);
      }
    };

    const onChangePercent = (percent: number) => {
      const roundedPercent = Math.round(percent);
      setTargetPercent(roundedPercent);
    };

    view.onPercentChange.add(onChangePercent);

    return () => {
      view.onPercentChange.remove(onChangePercent);
      view.onFinishTransition.execute = originalExecute;
      allowTransitionRef.current = false;
    };
  }, [props.viewId]);

  useEffect(() => {
    if (animatingRef.current) return;

    const updateCircle = (percent: number) => {
      if (circleRef.current) {
        const radius = circleRef.current.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        const offset = circumference - (percent / 100) * circumference;

        gsap.to(circleRef.current, {
          strokeDashoffset: offset,
          duration: 0.3,
          ease: 'power1.out',
        });
      }
    };

    if (displayPercent < targetPercent) {
      const timeout = setTimeout(() => {
        const newPercent = Math.min(displayPercent + 1, targetPercent);
        setDisplayPercent(newPercent);
        updateCircle(newPercent);
      }, 20);

      return () => clearTimeout(timeout);
    }
    else if (
      displayPercent === 100 &&
      targetPercent === 100 &&
      !allowTransitionRef.current
    ) {
      animatingRef.current = true;
      allowTransitionRef.current = true;

      gsap.to('.transition-page', {
        duration: 0.6,
        autoAlpha: 0,
        y: -50,
        ease: 'power3.in',
        onComplete: () => {
          const view = ViewsProxy.GetView<TheaterPreloadReactHTMLView>(
            props.viewId
          );
          if (view) {
            view.onFinishTransition.execute();
          }
        },
      });
    }
  }, [displayPercent, targetPercent]);

  return (
    <ReactViewBase
      className='transition-page fixed inset-0 bg-white h-full w-full flex items-center justify-center'
      {...props}
    >
      <div className='relative flex flex-col items-center justify-center w-64 h-64'>
        {/* <svg className='absolute w-full h-full' viewBox='0 0 100 100'>
          <circle
            cx='50'
            cy='50'
            r='45'
            fill='none'
            stroke='#ffffff'
            strokeWidth='1.5'
          />
          <circle
            ref={circleRef}
            cx='50'
            cy='50'
            r='45'
            fill='none'
            stroke='#333333'
            strokeWidth='2'
            strokeLinecap='round'
            transform='rotate(-90 50 50)'
          />
        </svg> */}

        <div className='absolute max-w-full inset-0 flex items-center justify-center'>
          <span className='text-black flex items-center font-neue  max-w-full text-8xl'>
            <NumberFlow willChange={true} value={displayPercent} className="w-[30dvw] text-right" />
            <span className='ml-1 '>%</span>
          </span>
        </div>

        {/* <div className='absolute bottom-0 transform translate-y-16'>
          <h1 className='text-black font-neue text-3xl uppercase tracking-wider'>
            Loading
          </h1>
        </div> */}
      </div>
    </ReactViewBase>
  );
});

export default TheaterPreloadReactView;
