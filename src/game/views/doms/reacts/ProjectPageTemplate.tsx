import React, { useEffect, useRef, useState } from "react";
import ReactViewBase, { TransitionProps } from "../../../core/_engine/reacts/views/bases/ReactViewBase";
import { AssetsUtils } from "../../../core/utils/AssetsUtils";
import gsap from "gsap";
import { ViewsManager } from "pancake";
import { ViewId } from "../../../constants/views/ViewId";
import HeroCarousel from "../../../../components/HeroCarousel";
import Footer from "../../../../components/Footer";
import HeroSlider from "../../../../components/HeroCarousel";
import StickyTitleScroll from "../../../../components/StickyTitleScroll";

// Types

type ProjectData = {
    title: string;
    subtitle: string;
    videoUrl: string;
    description: string[];
    mission: string;
    values: string;
    vision: string;
    heroImage: string;
    sections: {
        images: string[];
        paragraphs: string[];
    }[];
};

const ProjectPage: React.FC<TransitionProps> = (props) => {
    const progressRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [data, setData] = useState<ProjectData | null>(null);
    const imagesRef = useRef<HTMLDivElement[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch("./jsons/data/orangerieproject.json")
            .then((res) => res.json())
            .then((json: ProjectData) => setData(json));
    }, []);

    useEffect(() => {
        const onScroll = () => {
            const scrollY = window.scrollY;
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
            setScrollProgress(progress);

            if (progressRef.current) {
                gsap.to(progressRef.current, {
                    width: `${progress * 100}%`,
                    duration: 0.3,
                    ease: "power2.out",
                });
            }
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (imagesRef.current.length && containerRef.current) {
            const loopAnimation = () => {
                const [first, ...rest] = imagesRef.current;

                gsap.to(first, {
                    y: -200,
                    scale: 0.8,
                    duration: 1.5,
                    ease: "power2.inOut",
                    onComplete: () => {
                        containerRef.current?.appendChild(first);
                        gsap.set(first, { y: 100, scale: 1.2 });
                        gsap.to(first, {
                            y: 0,
                            scale: 1,
                            duration: 1.5,
                            ease: "power2.inOut",
                        });
                        imagesRef.current = [...rest, first];
                    },
                });
            };

            const interval = setInterval(loopAnimation, 5000);
            return () => clearInterval(interval);
        }
    }, [data]);

    const handleCloseProject = () => {
        ViewsManager.ShowById(ViewId.MAIN_REACT);
        ViewsManager.ShowById(ViewId.THREE_MAIN);
        ViewsManager.HideById(ViewId.PROJECT_REACT);
    };

    const heroImages = "./images/orangerie0.png";



    if (!data) return null;

    return (
        <ReactViewBase {...props}>
            <div className="fixed left-0 top-0 h-[2px] w-full bg-white/20 z-50">
                <div ref={progressRef} className="h-full bg-white w-0" />
            </div>

            <div className="bg-black text-white w-full min-h-screen">
                <HeroSlider image={heroImages} />
                <StickyTitleScroll />
                <div className="infoSection bg-white text-black py-24 px-16 h-[80dvh] grid grid-cols-2 gap-12 items-center">
                    <div className="text-white text-lg px-16 pt-12 max-w-4xl mx-auto space-y-6">
                        {data.description.map((text, index) => (
                            <p
                                key={index}
                                dangerouslySetInnerHTML={{ __html: text }}
                                className="text-[#9D9D9D] font-neue text-3xl mb-4"
                            />
                        ))}
                    </div>
                    <div className="text-right">
                        <h4 className="text-gray-500 font-neue text-xl mb-2">expérience</h4>
                        <h2 className="text-4xl font-extrabold mb-4">INTERACTIVE EN 3D</h2>
                        <img
                            src={AssetsUtils.GetAssetURL("./images/orangerie2.png")}
                            alt="Vue musée"
                            className="w-[20dvw] h-[20dvh] max-w-md object-cover ml-auto"
                        />
                    </div>
                </div>

                {/* Section avec image + texte */}
                {data.sections.map((section, i) => (
                    <div key={i} className="w-full bg-white px-16 md:px-16 py-20 flex flex-col lg:flex-row items-start gap-12">

                        {/* Texte à droite */}
                        <div className=" w-full flex flex-col px-16 justify-center space-y-6 text-sm md:text-base">
                            {section.paragraphs.map((text, k) => (
                                <p key={k} dangerouslySetInnerHTML={{ __html: text }} className="text-[#C7C7C7] text-7xl font-light font-neue leading-relaxed" />
                            ))}
                        </div>
                    </div>
                ))}

                {/* Mission / Values / Vision */}
                <div className="bg-black text-white px-6 md:px-16 py-24 flex flex-col lg:flex-row items-start gap-16">
                    <div className="w-full lg:w-1/2">
                        {data.sections?.[0]?.images?.[0] && (
                            <img
                                src={data.sections[0].images[0]}
                                alt="Mission Visual"
                                className="w-full object-cover rounded-md"
                            />
                        )}
                    </div>

                    <div className="w-full lg:w-1/2 grid grid-cols-1 gap-12">
                        {[
                            { title: "MISSION", content: data.mission },
                            { title: "VALUES", content: data.values },
                            { title: "VISION", content: data.vision },
                        ].map(({ title, content }, index) => (
                            <div key={index}>
                                <h3 className="text-white font-medium tracking-wide uppercase text-xl mb-2">
                                    {title}
                                </h3>
                                <hr className="border-t border-white/40 mb-4 w-full" />
                                <p className="text-sm text-white/80 leading-relaxed">{content}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Video Footer */}
                <div className="py-12 px-16">
                    <video
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                    >
                        <source src={AssetsUtils.GetAssetURL(data.videoUrl)} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                <div className="text-white text-sm text-left px-16 pb-12">MATIS DENE</div>

                <button
                    onClick={handleCloseProject}
                    className="group mt-6 ml-16 inline-flex items-center gap-2 border border-white text-white px-4 py-2 bg-transparent transition-all duration-300 ease-out hover:bg-white hover:text-black"
                >
                    Retour aux projets
                    <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
            </div>
            {/* <Footer /> */}
        </ReactViewBase>
    );
};

export default ProjectPage;
