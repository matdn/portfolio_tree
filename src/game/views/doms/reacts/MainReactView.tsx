import { AnimatePresence, motion } from "framer-motion";
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
    subtitle: "awwward project",
    techno: "[React, Three.js, WebGL, GSAP]",
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

      <div className="fixed right-4 md:right-12 top-1/4 h-[50vh] hidden md:flex">
        <div ref={progressRef} className="bg-white h-0 w-[2px]" />
      </div>

      <div className="fixed top-0 left-0 text-white z-4 flex flex-col items-center justify-center h-[100svh] w-screen px-4 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={"desc-" + activeIndex}
            className="text-[clamp(1.2rem,4vw,2rem)] mb-4 opacity-70 font-[800] font-nympha italic mix-blend-difference"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {breakpoints[activeIndex].subtitle}
          </motion.p>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.span
            key={activeIndex}
            className="block text-[clamp(2rem,6vw,4rem)] uppercase font-extralight leading-tight"
            dangerouslySetInnerHTML={{ __html: breakpoints[activeIndex].title }}
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={"desc-techno-" + activeIndex}
            className="text-[clamp(0.8rem,2.5vw,1.2rem)] mb-8 leading-relaxed opacity-70 font-roboto"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {breakpoints[activeIndex].techno}
          </motion.p>
        </AnimatePresence>
      </div>
      {/* <footer className="fixed bottom-0 w-[100dvw] flex justify-around text-white p-16">
        <p>MATIS DENE</p>
        <p>portfolio</p>
        <p>sound</p>
      </footer> */}
    </ReactViewBase>
  );
};

export default MainReactView;
