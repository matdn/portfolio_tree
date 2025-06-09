import gsap from "gsap";
import { ViewsManager, ViewsProxy } from "pancake";
import React, { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import { ViewId } from "../../../constants/views/ViewId";
import ReactViewBase, { TransitionProps } from "../../../core/_engine/reacts/views/bases/ReactViewBase";
import MainThreeView from "../../threes/MainThreeView";
import Button from "./components/Button";
import { motion, AnimatePresence } from "framer-motion";

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
  const [scrollY, setScrollY] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef(1);

  useEffect(() => {
    const onScroll = () => {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? y / maxScroll : 0;
        setScrollProgress(progress);
        setScrollY(y);
      });
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleOpenProject = () => {
    ViewsManager.HideById(ViewId.MAIN_REACT);
    ViewsManager.HideById(ViewId.THREE_MAIN);
    ViewsManager.ShowById(ViewId.PROJECT_REACT);
  };

  const aboutCall = () => {
    const mainView = ViewsProxy.GetView(ViewId.THREE_MAIN) as MainThreeView;
    ViewsManager.HideById(ViewId.MAIN_REACT);
    setTimeout(() => ViewsManager.ShowById(ViewId.ABOUT_REACT), 1000);
    mainView.rotateCameraYBy(new Vector3(0, 0, 0), new Vector3(0, 0, 0), 2.5);
  };

  useEffect(() => {
    handleCameraIndexChange = (index: number) => {
      if (index !== activeIndex) {
        const direction = index > activeIndex ? 1 : -1;
        directionRef.current = direction;

        setActiveIndex(index);

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

    gsap.to(progressRef.current, {
      height: `${scrollProgress * 100}%`,
      duration: 0.3,
      ease: "power2.out",
    });
  }, [scrollProgress]);

  return (
    <ReactViewBase {...props} className="w-screen min-h-[900dvh] relative flex flex-col justify-center items-start">
      <div className="fixed right-12 top-1/4 h-[50vh] flex">
        <div className="top-0 h-full flex flex-col justify-between text-white text-right text-sm pr-4">
          <AnimatePresence mode="wait">
            {activeIndex > 0 && activeIndex < breakpoints.length - 1 && (
              <motion.div
                key={"title-" + activeIndex}
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="cursor-default select-none"
                dangerouslySetInnerHTML={{ __html: breakpoints[activeIndex].title }}
              />
            )}
          </AnimatePresence>
        </div>
        <div ref={progressRef} className=" bg-white h-0 w-[2px]" />

      </div>

      <div className="top-0 h-full flex flex-col justify-between text-white text-right text-sm pr-4">
        <div className="flex flex-col gap-4 h-full justify-between">
          {breakpoints.map((bp, i) => {
            if (i <= 0 || i >= breakpoints.length - 1) return null;

            return (
              <AnimatePresence key={i} mode="wait">
                {activeIndex === i && (
                  <motion.div
                    key={"nav-title-" + i}
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(10px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    dangerouslySetInnerHTML={{ __html: bp.title }}
                    className="cursor-default select-none"
                  />
                )}
                {activeIndex !== i && (
                  <div className="h-[1.5rem]" /> // Placeholder pour garder la structure
                )}
              </AnimatePresence>
            );
          })}
        </div>
      </div>



      {/* Text section */}
      <div className="fixed left-16 top-16 text-white z-4 flex flex-col justify-between h-[90vh] w-[70vw]">
        <div className="overflow-hidden h-[6rem]">
          <div className="flex fixed top-8 right-10 opacity-60 z-20 gap-8 items-center justify-center">
            <div onClick={aboutCall}><p>about me</p></div>
            <div className="text-sm text-white">©2025</div>
          </div>
          <AnimatePresence mode="wait">
            <motion.span
              key={activeIndex}
              className="block text-4xl font-extralight leading-tight"
              dangerouslySetInnerHTML={{ __html: breakpoints[activeIndex].title }}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </AnimatePresence>
        </div>
        <div className="mb-10 h-full flex flex-col gap-8 justify-end max-w-[20vw]">
          <AnimatePresence mode="wait">
            <motion.p
              key={"desc-" + activeIndex}
              className="text-xl mb-8 leading-relaxed opacity-70 font-roboto text-white"
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {breakpoints[activeIndex].description}
            </motion.p>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {activeIndex !== 0 && activeIndex !== breakpoints.length - 1 && (
              breakpoints[activeIndex].disabled ? (
                <motion.p
                  key="disabled"
                  className="italic text-sm opacity-50"
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(10px)" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  Projet en cours…
                </motion.p>
              ) : (
                <motion.div
                  key="button"
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(10px)" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <Button title="Voir le projet" onClick={handleOpenProject} className="w-fit" />
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>

    </ReactViewBase>
  );
};

export default MainReactView;