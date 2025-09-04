import { AnimatePresence, motion, useTransform } from "framer-motion";
import gsap from "gsap";
import { ViewsManager, ViewsProxy } from "pancake";
import React, { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import { ViewId } from "../../../constants/views/ViewId";
import ReactViewBase, { TransitionProps } from "../../../core/_engine/reacts/views/bases/ReactViewBase";
import MainThreeView from "../../threes/MainThreeView";

export let handleCameraIndexChange: ((index: number) => void) | null = null;


const breakpoints = [
  { title: "", description: "" },
  {
    title: "Musée de <span class='font-bold'>l’Orangerie</span>",
    techno: "[React, Three.js, WebGL, GSAP]",
    disabled: false
  },
  {
    title: "Portfolio <span class='font-bold'>Zoé Michel</span>",
    techno: "[Next, GSAP]",
    disabled: true
  },
  {
    title: "Web App <span class='font-bold'>Kascad</span>",
    techno: "React, Python, Django, PostgreSQL",
    disabled: true
  },
  {
    title: "Landing Page <span class='font-bold'>Kadija Bio</span>",
    techno: "React, GSAP, Storyblok",
    disabled: true
  },
  {
    title: "Website<span class='font-bold'> Emraude</span>",
    techno: "React, GSAP, Storyblok",
    disabled: true
  },
  {
    title: "<span class='font-bold'>Chanel</span>",
    techno: "React, GSAP",
    disabled: true
  },
  {
    title: "Projet <span class='font-bold'>mystère</span>",
    techno: "React, Three.js, WebGL",
    disabled: true
  },
  {
    title: "Projet <span class='font-bold'>expérimental</span>",
    techno: "React, Three.js, WebGL",
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
  const scrollAlpha = scrollY < 150 ? 1 - scrollY / 150 : 0;
 
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


  const scrollPercent = Math.round(scrollProgress * 100);


  const variant = () => {
    if(scrollY > 2) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.5 },
      };
    } else if (scrollY > 98) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.5 },
      };
    }
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

  const ScrollDownIndicator = ({ alpha }: { alpha: number; }) => (
    <AnimatePresence>
      {alpha > 0 && (
        <motion.div
          key="scroll-indicator"
          className="fixed bottom-10 left-1/2 -translate-x-1/2 text-white text-sm z-50 flex flex-col items-center pointer-events-none"
          initial={{ opacity: 0, filter: "blur(10px)", y: 20, transform: "translateX(-50%)" }}
          animate={{ opacity: alpha, filter: `blur(${(1 - alpha) * 10}px)`, y: 0, transform: "translateX(-50%)" }}
          exit={{ opacity: 0, filter: "blur(10px)", y: 20, transform: "translateX(-50%)" }}
          transition={{ duration: 0.5, ease: "easeInOut", transform: "translateX(-50%)" }}
        >
          <span>Scroll down</span>
          <motion.div
            className="w-[2px] h-6 bg-white mt-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );


  return (

    <ReactViewBase {...props} className="w-screen min-h-[900dvh] relative flex flex-col justify-center items-start">
      <ScrollDownIndicator alpha={scrollAlpha} />


      <div className="fixed right-12 top-1/4 h-[50vh] flex items-center gap-8">
        <motion.div
          // initial={{ opacity: 0 }}
          // animate={{ opacity: 1 }}
          // exit={{ opacity: 0 }}
          // transition={{ duration: 0.5 }}
          variants={variant}
        >
          <p className="text-white font-michroma">{scrollPercent}%</p>
        </motion.div>

        <div ref={progressRef} className=" bg-white h-0 w-[2px]" />
      </div>

      {/* Text section */}
      <div className="fixed top-0 left-0 text-white z-4 flex flex-col items-center justify-center h-[100dvh] w-[100vw]">
        <AnimatePresence mode="wait">
          <motion.span
            key={activeIndex}
            className="block text-7xl uppercase font-extralight leading-tight"
            dangerouslySetInnerHTML={{ __html: breakpoints[activeIndex].title }}
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </AnimatePresence>


        <AnimatePresence mode="wait">
          <motion.p
            key={"desc-" + activeIndex}
            className="text-xl mb-8 leading-relaxed opacity-70 font-roboto text-white md:text-[1.2rem] text-[0.8rem]"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {breakpoints[activeIndex].techno}
          </motion.p>
        </AnimatePresence>


      </div>

    </ReactViewBase >
  );
};

export default MainReactView;