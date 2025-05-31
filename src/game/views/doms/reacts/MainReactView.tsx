import gsap from "gsap";
import { ViewsManager, ViewsProxy } from "pancake";
import React, { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import { ViewId } from "../../../constants/views/ViewId";
import ReactViewBase, { TransitionProps } from "../../../core/_engine/reacts/views/bases/ReactViewBase";
import MainThreeView from "../../threes/MainThreeView";
import Button from "./components/Button";

export let handleCameraIndexChange: ((index: number) => void) | null = null;


const breakpoints = [
  { title: "", description: "" },
  {
    title: "Musée <span class='font-bold'>de l’Orangerie</span>",
    description: "Une expérience interactive en 3D inspirée des Nymphéas de Monet. Conçue pour plonger l'utilisateur dans l’univers poétique du musée, à travers shaders, animations synchronisées au scroll, et modélisation immersive.",
    disabled: false
  },
  {
    title: "Portfolio <span class='font-bold'>Zoé Michel</span>",
    description: "Un portfolio digital raffiné pour une directrice artistique. Navigation fluide, typographie élégante et animations subtiles pour refléter une identité créative forte.",
    disabled: false
  },
  {
    title: "Web App <span class='font-bold'>Kascad</span>",
    description: "Plateforme dédiée à la mise en relation entre sponsors et athlètes extrêmes. Architecture pensée pour l'évolutivité, interface claire et API robuste en backend Python.",
    disabled: false
  },
  {
    title: "Landing Page <span class='font-bold'>Kadija Bio</span>",
    description: "Site vitrine pour une cheffe à domicile, spécialisée en cuisine bio. Design naturel, storytelling visuel et intégration CMS pour gestion des menus et commandes.",
    disabled: false
  },
  {
    title: "Website<span class='font-bold'> Emraude</span>",
    description: "Site de présentation pour l’agence de jeux immersifs Emraude Escape. Design contemporain, interaction ludique, back-office CMS Storyblok customisé.",
    disabled: false
  },
  {
    title: "<span class='font-bold'>Chanel</span>",
    description: "Prototype de mini-site événementiel pour la maison Chanel. Allie luxe visuel, animations GSAP soignées et navigation immersive sur mesure.",
    disabled: true
  },
  {
    title: "Projet <span class='font-bold'>mystère</span>",
    description: "Un projet artistique en préparation… Fusion d’interaction sensorielle et de technologie visuelle. Plus d’infos bientôt.",
    disabled: true
  },
  {
    title: "Projet <span class='font-bold'>expérimental</span>",
    description: "Exploration autour de la physique des fluides et du motion design WebGL. Encore en phase de R&D.",
    disabled: true
  },
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

  const aboutCall = () => {
    const mainView = ViewsProxy.GetView(ViewId.THREE_MAIN) as MainThreeView;
    ViewsManager.HideById(ViewId.MAIN_REACT);
    setTimeout(() => {
      ViewsManager.ShowById(ViewId.ABOUT_REACT);
    }, 1000);
    const aboutPos = new Vector3(0, 0, 0);
    const aboutTarget = new Vector3(0, 0, 0);
    mainView.rotateCameraYBy(aboutPos, aboutTarget, 2.5);
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
      className={`w-screen min-h-[900dvh] relative flex flex-col justify-center items-start`}
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
          <div className="flex fixed top-8 right-10 opacity-60 z-20 gap-8 items-center justify-center">
            <div onClick={aboutCall}><p>about me</p></div>

            <div className="text-sm text-white ">©2025</div>
          </div>

          <span
            key={activeIndex}
            className="block text-4xl font-extralight leading-tight"
            dangerouslySetInnerHTML={{ __html: breakpoints[activeIndex].title }}
          />
        </div>

        {/* Description en bas gauche */}
        <div className="mb-10 h-full flex flex-col gap-8 justify-end">
          <p className="text-base sm:text-sm md:text-md lg:text-lg xl:text-xl mb-8 leading-relaxed max-w-[50vw] md:max-w-[70vw] lg:max-w-[40vw] xl:max-w-[20vw] opacity-70 font-roboto transition-all duration-300 text-white">

            {breakpoints[activeIndex].description}
          </p>

          {activeIndex !== 0 && activeIndex !== breakpoints.length - 1 && (
            breakpoints[activeIndex].disabled ? (
              <p className="italic text-sm opacity-50">Projet en cours…</p>
            ) : (
              <Button title="Voir le projet" onClick={() => handleOpenProject("monet_orangerie")} className="w-fit" />
            )
          )}
        </div>
      </div>
    </ReactViewBase>
  );
};

export default MainReactView;

