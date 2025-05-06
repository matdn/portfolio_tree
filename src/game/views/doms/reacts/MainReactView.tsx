import React, { useEffect, useState, useRef } from "react";
import ReactViewBase, { TransitionProps } from "../../../core/_engine/reacts/views/bases/ReactViewBase";
import { ViewId } from "../../../constants/views/ViewId";
import { ViewsManager, ViewsProxy } from "pancake";
import gsap from "gsap";
import Button from "./components/Button";

// 🔹 Handler exporté pour la vue Three
export let handleCameraIndexChange: ((index: number) => void) | null = null;


const breakpoints = [
  { title: "", description: "" },
  { title: "Musée <span class='font-bold'>de l’Orangerie</span>", description: "Musée de l’Orangerie – Expérience interactive 3D Une exploration immersive autour de l’univers de Monet et de l’architecture du musée de l’Orangerie. Ce projet mêle narration interactive, animation au scroll, shaders inspirés des Nymphéas et modélisation 3D avec Blender et Three.js. L’objectif : créer une expérience web sensible et fluide, entre technique et poésie visuelle." },
  { title: "Musée <span class='font-bold'>de l’Orangerie</span>", description: "Musée de l’Orangerie – Expérience interactive 3D Une exploration immersive autour de l’univers de Monet et de l’architecture du musée de l’Orangerie. Ce projet mêle narration interactive, animation au scroll, shaders inspirés des Nymphéas et modélisation 3D avec Blender et Three.js. L’objectif : créer une expérience web sensible et fluide, entre technique et poésie visuelle." },
  { title: "Musée <span class='font-bold'>de l’Orangerie</span>", description: "Musée de l’Orangerie – Expérience interactive 3D Une exploration immersive autour de l’univers de Monet et de l’architecture du musée de l’Orangerie. Ce projet mêle narration interactive, animation au scroll, shaders inspirés des Nymphéas et modélisation 3D avec Blender et Three.js. L’objectif : créer une expérience web sensible et fluide, entre technique et poésie visuelle." },
  { title: "Musée <span class='font-bold'>de l’Orangerie</span>", description: "Musée de l’Orangerie – Expérience interactive 3D Une exploration immersive autour de l’univers de Monet et de l’architecture du musée de l’Orangerie. Ce projet mêle narration interactive, animation au scroll, shaders inspirés des Nymphéas et modélisation 3D avec Blender et Three.js. L’objectif : créer une expérience web sensible et fluide, entre technique et poésie visuelle." },
  { title: "Musée <span class='font-bold'>de l’Orangerie</span>", description: "Musée de l’Orangerie – Expérience interactive 3D Une exploration immersive autour de l’univers de Monet et de l’architecture du musée de l’Orangerie. Ce projet mêle narration interactive, animation au scroll, shaders inspirés des Nymphéas et modélisation 3D avec Blender et Three.js. L’objectif : créer une expérience web sensible et fluide, entre technique et poésie visuelle." },
  { title: "Musée <span class='font-bold'>de l’Orangerie</span>", description: "Musée de l’Orangerie – Expérience interactive 3D Une exploration immersive autour de l’univers de Monet et de l’architecture du musée de l’Orangerie. Ce projet mêle narration interactive, animation au scroll, shaders inspirés des Nymphéas et modélisation 3D avec Blender et Three.js. L’objectif : créer une expérience web sensible et fluide, entre technique et poésie visuelle." },
  { title: "Musée <span class='font-bold'>de l’Orangerie</span>", description: "Musée de l’Orangerie – Expérience interactive 3D Une exploration immersive autour de l’univers de Monet et de l’architecture du musée de l’Orangerie. Ce projet mêle narration interactive, animation au scroll, shaders inspirés des Nymphéas et modélisation 3D avec Blender et Three.js. L’objectif : créer une expérience web sensible et fluide, entre technique et poésie visuelle." },
  { title: "Musée <span class='font-bold'>de l’Orangerie</span>", description: "Musée de l’Orangerie – Expérience interactive 3D Une exploration immersive autour de l’univers de Monet et de l’architecture du musée de l’Orangerie. Ce projet mêle narration interactive, animation au scroll, shaders inspirés des Nymphéas et modélisation 3D avec Blender et Three.js. L’objectif : créer une expérience web sensible et fluide, entre technique et poésie visuelle." },
  { title: "", description: "" },
];

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

const MainReactView: React.FC<TransitionProps> = (props) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const prevScroll = useRef(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const smoothScroll = useRef(0);
  const directionRef = useRef(1);

  useEffect(() => {
    const onScroll = () => {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
        setScrollProgress(progress);
      });
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleOpenProject = (projectId: string) => {
    ViewsManager.HideById(ViewId.MAIN_REACT);
    ViewsManager.HideById(ViewId.THREE_MAIN);
    ViewsManager.ShowById(ViewId.PROJECT_REACT);
  };

  useEffect(() => {
    handleCameraIndexChange = (index: number) => {
      if (index !== activeIndex) {
        const direction = index > activeIndex ? 1 : -1;
        directionRef.current = direction;

        const currentSpan = textRef.current?.querySelector("span");
        const currentPara = textRef.current?.querySelector("p");
        const currentButton = textRef.current?.querySelector("button");

        const timeline = gsap.timeline({ defaults: { ease: "power2.inOut" } });

        timeline.to([currentSpan, currentPara, currentButton], {
          y: -20 * direction,
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            setActiveIndex(index);
            requestAnimationFrame(() => {
              const newSpan = textRef.current?.querySelector("span");
              const newPara = textRef.current?.querySelector("p");
              const newButton = textRef.current?.querySelector("button");

              gsap.fromTo(
                [newSpan, newPara, newButton],
                { y: 20 * direction, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.6,
                }
              );
            });
          },
        });
      }
    };

    return () => {
      handleCameraIndexChange = null;
    };
  }, [activeIndex]);

  useEffect(() => {
    const mainView = ViewsProxy.GetView(ViewId.THREE_MAIN) as any;
    if (mainView && mainView.setScrollProgress) {
      mainView.setScrollProgress(scrollProgress);
    }

    smoothScroll.current = lerp(smoothScroll.current, scrollProgress, 0.15);

    prevScroll.current = smoothScroll.current;

    if (progressRef.current) {
      gsap.to(progressRef.current, {
        height: `${smoothScroll.current * 100}%`,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [scrollProgress]);

  return (
    <ReactViewBase
      {...props}
      className="w-screen min-h-[900dvh] relative flex flex-col justify-center items-start"
    >

      <div className="fixed right-12 top-1/4 h-[50vh] w-[2px] bg-black">
        <div ref={progressRef} className="w-full bg-white h-0" />
      </div>
      <div
        ref={textRef}
        className="fixed left-16 top-16 text-white z-4 flex flex-col justify-between h-[90vh] w-[70vw]"
      >
        {/* Titre haut gauche */}
        <div className="overflow-hidden h-[6rem]">
          <div className="fixed top-8 right-10 text-sm text-white opacity-60 z-20">©2025</div>
          <span
            key={activeIndex}
            className="block text-4xl font-extralight leading-tight"
            dangerouslySetInnerHTML={{ __html: breakpoints[activeIndex].title }}
          />
        </div>

        {/* Description en bas gauche */}
        <div className="mb-10">
          <p className="text-ml mb-8 leading-relaxed max-w-3xl opacity-70">
            {breakpoints[activeIndex].description}
          </p>

          {activeIndex !== 0 && activeIndex !== breakpoints.length - 1 && (
            <Button title={"Voir le projet"} onClick={() => handleOpenProject("monet_orangerie")} />

          )}
        </div>
      </div>
    </ReactViewBase>
  );
};

export default MainReactView;

