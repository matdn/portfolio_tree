import React, { useEffect, useRef, useState } from "react";
import { ViewsManager, ViewsProxy } from "pancake";
import { ViewId } from "../../../constants/views/ViewId";
import TestThreeView from "../../threes/TestThreeView";
import { gsap } from "gsap";


const TestReactView: React.FC = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const blurLayerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!blurLayerRef.current) return;

        const blurValue = scrollProgress * 60;
        gsap.to(blurLayerRef.current, {
            duration: 0.3,
            ease: "power2.out",
            backdropFilter: `blur(${blurValue}px)`,
            webkitBackdropFilter: `blur(${blurValue}px)`,
        });
    }, [scrollProgress]);


    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;

            if (containerRef.current && blurLayerRef.current) {
                const blurTop = blurLayerRef.current.offsetTop;
                const blurHeight = blurLayerRef.current.offsetHeight;

                const start = blurTop - windowHeight;
                const end = blurTop + blurHeight;

                // Clamp le scroll entre 0 et 1
                const progress = (scrollTop - start) / (end - start);
                const clamped = Math.min(1, Math.max(0, progress));

                setScrollProgress(clamped);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);



    useEffect(() => {
        const carouselView = ViewsProxy.GetView(ViewId.TEST_THREE) as TestThreeView;

        if (carouselView) {
            carouselView.setRotationProgress(scrollProgress);
            // carouselView.setCarouselInclination(inclinationX, inclinationZ);
        }
    }, [scrollProgress]);

    return (
        <div className="relative h-[1000dvh]" ref={containerRef}>
            {/* Hero flouté (scrollable) */}
            <div
                className="fixed top-0 left-0 w-full h-[100dvh] flex justify-center items-center px-8 pb-6 text-base md:text-[12dvh] uppercase font-mabry font-light z-50"
                style={{
                    mixBlendMode: "difference"
                }}
            >
                <h1 className="text-white ">l'Orangerie</h1>
            </div>

            {/* Calque flou (scrollable mais en haut visuellement) */}
            <div
                ref={blurLayerRef}
                className="h-[900dvh] bg-black/0 relative z-10"
                style={{
                    backdropFilter: "blur(0px)", // départ à 0
                    WebkitBackdropFilter: "blur(0px)",
                }}
            >

                {/* 1er écran vide */}
                <div className="h-[100dvh]"></div>

                {/* 2e écran : image + fond sous image */}
                <div className="h-[100dvh] relative">
                    {/* Image au-dessus du flou */}
                    <img
                        src="./assets/game/images/orangerie_grid_7.png"
                        alt=""
                        className="w-[45dvw] absolute left-10 top-20 z-30 grayscale"
                    />
                    <img
                        src="./assets/game/images/orangerie_grid_7.png"
                        alt=""
                        className="w-[45dvw] absolute bottom-10 right-20 z-30 grayscale"
                    />

                    {/* Bloc blur sous l’image */}
                    <div className="absolute left-20 top-20 bg-black/60 h-[25dvh] w-[40dvw] z-100 " style={{
                        backdropFilter: "blur(60px)",
                        WebkitBackdropFilter: "blur(60px)",
                    }}></div>
                </div>
            </div>
        </div>

    );
};

export default TestReactView;