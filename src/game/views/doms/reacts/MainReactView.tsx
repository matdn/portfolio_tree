import { AnimatePresence, motion, useTransform } from "framer-motion";
import gsap from "gsap";
import { TheatersManager, TheatersProxy, ViewsManager, ViewsProxy } from "pancake";
import React, { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import { ViewId } from "../../../constants/views/ViewId";
import ReactViewBase, { TransitionProps } from "../../../core/_engine/reacts/views/bases/ReactViewBase";
import MainThreeView from "../../threes/MainThreeView";
import Button from "./components/Button";
import { TheaterId } from "../../../constants/theaters/TheaterId";

export let handleCameraIndexChange: ((index: number) => void) | null = null;

const breakpoints = [
  { title: "", description: "" },
  {
    title: "Musée de <span class='font-bold'>l’Orangerie</span>",
    techno: "[React, Three.js, GSAP]",

    subtitle: "awwward project",

    disabled: false
  },
  {
    title: "Portfolio <span class='font-bold'>Zoé Michel</span>",
    subtitle: "School project",
    techno: "[Next, GSAP]",
    disabled: true
  },
  {
    title: "Web App <span class='font-bold'>Kascad</span>",
    subtitle: "School project",
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
    subtitle: "School project",
    techno: "React, GSAP, Storyblok",
    disabled: true
  },
  {
    title: "<span class='font-bold'>Chanel</span>",
    subtitle: "School project",
    techno: "React, GSAP",
    disabled: true
  },
  {
    title: "Projet <span class='font-bold'>mystère</span>",
    techno: "React, Three.js, WebGL",
    subtitle: "School project",
    disabled: true
  },
  {
    title: "Projet <span class='font-bold'>expérimental</span>",
    techno: "React, Three.js, WebGL",
    subtitle: "School project",
    disabled: true
  },
  { title: "", description: "" },
];

const MainReactView: React.FC<TransitionProps> = (props) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
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
    // ViewsManager.HideById(ViewId.MAIN_REACT);
    // ViewsManager.HideById(ViewId.THREE_MAIN);
    // ViewsManager.ShowById(ViewId.TEST_REACT);
    TheatersManager.ShowById(TheaterId.PROJECT);
  };

  const aboutCall = () => {
    const mainView = ViewsProxy.GetView(ViewId.THREE_MAIN) as MainThreeView;
    ViewsManager.HideById(ViewId.MAIN_REACT);
    setTimeout(() => ViewsManager.ShowById(ViewId.ABOUT_REACT), 1000);
    mainView.rotateCameraYBy(new Vector3(0, 0, 0), new Vector3(0, 0, 0), 2.5);
  };
  useEffect(() => {
    const updateCameraFov = () => {
      console.log("📏 resize triggered");
      const mainView = ViewsProxy.GetView(ViewId.THREE_MAIN);
      console.log("🎥 mainView:", mainView);

      if (!mainView) {
        console.warn("⚠️ mainView is undefined!");
        return;
      }

      (mainView as MainThreeView).updateCameraFov(window.innerWidth);
    };

    window.addEventListener("resize", updateCameraFov);

    const waitUntilReady = setInterval(() => {
      const mainView = ViewsProxy.GetView(ViewId.THREE_MAIN);
      if (mainView) {
        console.log("✅ mainView is finally ready, calling updateCameraFov");
        (mainView as MainThreeView).updateCameraFov(window.innerWidth);
        clearInterval(waitUntilReady);
      }
    }, 200);

    return () => {
      window.removeEventListener("resize", updateCameraFov);
      clearInterval(waitUntilReady);
    };
  }, []);


  const scrollPercent = Math.round(scrollProgress * 100);


  const variant = () => {
    if (scrollY > 2) {
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

  const viewProject = () => {
    const projectView = ViewsProxy.GetView(ViewId.TEST_REACT);
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

  const viewProject = () => {
    const projectView = ViewsProxy.GetView(ViewId.TEST_REACT);
  }

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


      // Mobile: grow horizontally (width), Desktop: grow vertically (height)
      const isMobile = window.innerWidth <= 768;
      if (progressRef.current) {
        if (isMobile) {
          gsap.to(progressRef.current, {
            width: `${scrollProgress * 100}%`,
            height: "2px",
            duration: 0.3,
            ease: "power2.out",
          });
        } else {
          gsap.to(progressRef.current, {
            height: `${scrollProgress * 100}%`,
            width: "2px",
            duration: 0.3,
            ease: "power2.out",
          });
        }
      }

  }, [scrollProgress]);

  const ScrollDownIndicator = ({ alpha }: { alpha: number; }) => (
    <AnimatePresence>
      {alpha > 0 && (
        <motion.div
          key="scroll-indicator"
          className="fixed bottom-6 left-[47.5%]  text-white text-xs md:text-sm z-50 flex flex-col items-center pointer-events-none"
          initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
          animate={{ opacity: alpha, filter: `blur(${(1 - alpha) * 10}px)`, y: 0 }}
          exit={{ opacity: 0, filter: "blur(10px)", y: 20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <span>Scroll down</span>
          <motion.div
            className="w-[1px] h-4 md:h-6 bg-white mt-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <ReactViewBase {...props} className="w-screen min-h-[600dvh] md:min-h-[900dvh] relative flex flex-col justify-center items-start">
      <ScrollDownIndicator alpha={scrollAlpha} />


      <div className="phone-scrollCounter font-mabry fixed right-12 top-1/4 h-[50vh] flex items-center gap-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="scrollPercent text-white font-michroma">{scrollPercent}%</p>
        </motion.div>

        {/* Mobile: horizontal bar, Desktop: vertical bar */}
        <div
          ref={progressRef}
          className="bg-white"
          style={window.innerWidth <= 768
            ? { height: "2px", width: 0, position: "absolute", left: 0, bottom: 0 }
            : { width: "2px", height: 0 }
          }
        />

      </div>

      {/* Text section */}
      <div className="fixed top-0 left-0 text-white z-4 flex flex-col items-center justify-center text-center h-[100dvh] w-[100vw]">
        <AnimatePresence mode="wait">
          <motion.span
            key={activeIndex}
            className="title block md:text-7xl uppercase font-extralight leading-tight"
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

        <AnimatePresence mode="wait">
          {breakpoints[activeIndex] && !breakpoints[activeIndex].disabled && breakpoints[activeIndex].title && (
           <motion.div
            key={"desc-" + activeIndex}
            className="text-xl mb-8 leading-relaxed opacity-70 font-michroma text-white md:text-[1.2rem] text-[0.8rem]"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
             <Button
              onClick={handleOpenProject}
              className="text-white font-michroma text-lg"
              title={"View Project"}
            />
          </motion.div> 
           
        )}
        </AnimatePresence>        


      </div>
    </ReactViewBase>

  );
};
export default MainReactView;
