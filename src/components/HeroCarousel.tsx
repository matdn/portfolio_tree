"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AssetsUtils } from "../game/core/utils/AssetsUtils";

gsap.registerPlugin(ScrollTrigger);

const HeroSlider: React.FC<{ image: string; }> = ({ image }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const leftTextRef = useRef<HTMLDivElement>(null);
  const rightTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const imageEl = imageRef.current;
    const leftText = leftTextRef.current;
    const rightText = rightTextRef.current;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom top",
        scrub: true,
        pin: true,
        onUpdate: (self) => {
          const progress = self.progress;

          // Scale image instantly
          const scale = 0.7 + (1 - 0.7) * progress;
          const vw = 70 + (100 - 70) * progress;
          const vh = 70 + (100 - 70) * progress;

          gsap.set(imageEl, {
            width: `${vw}vw`,
            height: `${vh}vh`,
          });

          // Text movement
          gsap.set(leftText, {
            xPercent: 450 * progress,
          });
          gsap.set(rightText, {
            xPercent: -200 * progress,
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-[100vh] w-full bg-[#F6EFE8] text-[#291809] overflow-hidden"
    >
      {/* Textes de part et d’autre */}
      <div
        ref={leftTextRef}
        className="absolute -left-1/4 top-1/2 -translate-y-1/2 text-[3vw] font-light  z-10"
      >
        MUSÉE
      </div>
      <div
        ref={rightTextRef}
        className="absolute -right-1/4 top-1/2 -translate-y-1/2 text-[3vw] font-light z-10"
      >
        ORANGERIE
      </div>

      {/* Image centrale */}
      <div className="flex items-center justify-center w-full h-[100vh]">
        <img
          ref={imageRef}
          src={AssetsUtils.GetAssetURL(image)}
          alt="hero"
          className="object-cover w-[70vw] h-[70dvh] will-change-transform"
        />
      </div>
    </section>
  );
};

export default HeroSlider;
