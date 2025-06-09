import React, { useEffect, useRef, useState } from "react";
import Image from "../../../../components/Image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Liste des images utilisées pour l'animation d'intro
const images = [
    "images/orangerie0.png",
    "images/orangerie2.png",
    "images/orangerie3.png",
    "images/orangerie1.png",
    "images/orangerie0.png",
];

const ProjectHeroSection = () => {
    const [currentImage, setCurrentImage] = useState(0);

    const [showText, setShowText] = useState(false);

    const textRef = useRef<HTMLHeadingElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const sideTextRef = useRef<HTMLDivElement>(null);
    const leftTextRef = useRef<HTMLParagraphElement>(null);
    const rightTextRef = useRef<HTMLParagraphElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const gridImagesRef = useRef<(HTMLImageElement | null)[]>([]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);

    useEffect(() => {
        const frameDuration = 150;
        let frameIndex = 0;
        let timeout: NodeJS.Timeout;

        const animateFrames = () => {
            gsap.to(imageRef.current, {
                opacity: 0,
                duration: 0.1,
                onComplete: () => {
                    setCurrentImage(frameIndex);

                    gsap.to(imageRef.current, {
                        opacity: 1,
                        duration: 0.1,
                    });

                    frameIndex++;
                    if (frameIndex < images.length - 1) {
                        timeout = setTimeout(animateFrames, frameDuration);
                    } else {
                        setTimeout(() => setShowText(true), 300);
                    }
                },
            });
        };

        animateFrames();

        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (showText && textRef.current) {
            gsap.fromTo(
                textRef.current,
                { filter: "blur(20px)", opacity: 0 },
                { filter: "blur(0px)", opacity: 1, duration: 1.5, ease: "power3.out" }
            );
        }
    }, [showText]);

    useEffect(() => {
        if (sideTextRef.current && leftTextRef.current && rightTextRef.current) {
            gsap.fromTo(
                [leftTextRef.current, rightTextRef.current],
                {
                    opacity: 0,
                    filter: "blur(20px)",
                },
                {
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 1.5,
                    ease: "power3.out",
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: sideTextRef.current,
                        start: "top+=200 center", // 🔧 modifie ici le déclenchement
                        end: "bottom-=200 center",
                        toggleActions: "play reverse play reverse"
                        // markers: true,
                    },
                }
            );
        }
    }, []);

    // ✨ Animation GSAP des images de la grille en ordre aléatoire
    useEffect(() => {
        if (gridRef.current && gridImagesRef.current) {
            const imgs = gridImagesRef.current.filter(Boolean);
            const shuffled = imgs
                .map((img) => ({ img, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map((obj) => obj.img);

            gsap.fromTo(
                shuffled,
                {
                    opacity: 0,
                    filter: "blur(20px)",
                },
                {
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 1,
                    ease: "power3.out",
                    stagger: 0.15,
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: "center center",
                        end: "bottom center",
                        toggleActions: "play none none reverse",
                        markers: true,
                    },
                }
            );
        }
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);

        gsap.config({ autoSleep: 60 });
        ScrollTrigger.config({
            autoRefreshEvents: "DOMContentLoaded,load,resize",
        });

        return () => clearTimeout(timeout);
    }, []);

    return (
        <>
            <section className="relative w-full bg-white min-h-[300vh]">

                <div className="h-[100dvh] flex items-center justify-center">
                    {showText && (
                        <h1
                            ref={textRef}
                            className="text-6xl md:text-[10rem] font-light font-mabry text-white mix-blend-difference z-20 tracking-tight text-center"
                        >
                            L’ORANGERIE
                        </h1>
                    )}
                </div>

                <div className="absolute top-6 left-6 text-sm text-black font-light z-30">
                    Musée de l’Orangerie
                </div>
                <div className="absolute top-6 right-6 text-sm text-black font-light z-30">
                    ©2025
                </div>

                <div
                    ref={imageRef}
                    className="fixed top-1/2 -translate-y-1/2 w-full flex justify-center items-center z-10"
                >
                    <Image
                        src={images[currentImage]}
                        alt="Orangerie sticky"
                        width={800}
                        height={1200}
                        className="w-[18dvh] h-[22dvh] object-cover grayscale"
                        onLoad={() => ScrollTrigger.refresh()}
                    />
                </div>

                <div
                    ref={sideTextRef}
                    className="flex justify-around items-center h-[100dvh] font-mabry text-[2dvh]"
                >
                    <p
                        ref={leftTextRef}
                        className="w-[20%] text-gray-400 opacity-0 blur-md"
                    >
                        La section musée nous plonge au cœur d’un{" "}
                        <span className="text-black">parcours narratif</span> autour de et
                        de son <span className="text-black">l’Orangerie.</span>
                    </p>
                    <p
                        ref={rightTextRef}
                        className="w-[20%] text-gray-400 text-end opacity-0 blur-md"
                    >
                        La section musée nous plonge au cœur d’un{" "}
                        <span className="text-black">parcours narratif</span> autour de et
                        de son <span className="text-black">l’Orangerie.</span>
                    </p>
                </div>

                <div ref={gridRef} className="grid grid-cols-3 gap-12 h-[100dvh]">
                    {[...Array(9)].map((_, index) =>
                        index === 4 ? (
                            <div key={index} />
                        ) : (
                            <div
                                key={index}
                                className="flex justify-center items-center w-full h-full"
                            >
                                <img
                                    ref={(el) => (gridImagesRef.current[index] = el)}
                                    src={`/assets/game/images/orangerie_grid_${index + 1}.png`}
                                    alt={`Grid ${index + 1}`}
                                    className="w-[18dvh] h-[22dvh] object-cover grayscale opacity-0 blur-md"
                                />
                            </div>
                        )
                    )}
                </div>
            </section>
        </>
    );
};

export default ProjectHeroSection;
