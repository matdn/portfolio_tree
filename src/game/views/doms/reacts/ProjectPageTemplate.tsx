import React, { useEffect, useRef, useState } from "react";
import Image from "../../../../components/Image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReactViewBase, { TransitionProps } from "../../../core/_engine/reacts/views/bases/ReactViewBase";
import { ViewsProxy } from "pancake";
import { ViewId } from "../../../constants/views/ViewId";
import TestThreeView from "../../threes/TestThreeView";

gsap.registerPlugin(ScrollTrigger);

const ProjectPageTemplate: React.FC<TransitionProps> = (props) => {

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
        <ReactViewBase {...props} className="z-[500] bg-transparent relative top-0">

            <div ref={containerRef} className="w-full min-h-screen  text-black font-sans flex flex-col items-center ">
                <div className="bg-white w-full px-6 md:px-16 py-12 flex flex-col items-center">
                    <div className="h-[80dvh] flex flex-col justify-between w-full items-center bg-white">
                        {/* Titre principal */}
                        <h1 className=" md:text-[11.75rem] font-medium mb-6 italic uppercase text-center font-mabry">L’orangerie</h1>

                        {/* Infos principales */}
                        <div className="gap-8 w-1/2 text-sm md:text-base uppercase tracking-wider font-medium mb-12">
                            <div className="flex justify-between">
                                <p className="text-black">Service:</p>
                                <p>Design, Dev</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-black">Year:</p>
                                <p>2025</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-black">Category:</p>
                                <p>awwward honorable mention</p>
                            </div>
                        </div>
                    </div>

                    {/* Image principale */}
                    <div className="w-full h-[60vh] md:h-[60vh] mb-16 mt-16">
                        <Image
                            src="./images/tmp1.png"
                            alt="L’orangerie project image"
                            className="w-full h-full object-cover grayscale-100"
                        />
                    </div>

                    {/* Technologies + Description */}
                    <div className="mb-2 max-w-4xl">
                        <p className="text-black text-justify uppercase text-[1.2rem] leading-relaxed font-mabry font-extralight">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                            aliquip ex ea commodo consequat. Duis aute irure dolor in
                            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                            pariatur. Excepteur sint occaecat cupidatat non proident.
                        </p>
                    </div>

                    <div className="flex flex-col w-[56rem] items-center justify-center text-sm pt-20 pb-20">
                        {/* Crédits */}
                        <div className="mb-2 flex justify-between w-full font-mabry uppercase ">
                            <h2 className="font-semibold mb-4 uppercase">Credits</h2>
                            <ul className="space-y-2">
                                <li className="text-right">Augustin Briolon<br /> <span className="opacity-50">Art Director</span></li>
                                <li className="text-right">Marie-Anh Devisy<br /> <span className="opacity-50">Designer</span></li>
                                <li className="text-right">Zoe Michel<br /> <span className="opacity-50">Developer</span></li>
                            </ul>
                        </div>
                        <div className="w-full h-[1px] bg-black m-4"></div>
                        {/* Liens */}
                        <div className="mb-2 flex justify-between w-full">
                            <div className="flex w-full text-black justify-between uppercase">
                                <h3 className="text-ml font-semibold mb-4 uppercase">Links</h3>
                                <ul className="space-y-1 text-right">
                                    <li><a href="#">Marketplace</a></li>
                                    <li><a href="#">Website</a></li>
                                </ul>
                            </div>

                        </div>
                        <div className="w-full h-[1px] bg-black m-4"></div>
                        <div className="flex w-full text-black justify-between uppercase">
                            <h3 className="text-ml font-semibold mb-4 uppercase">Share</h3>
                            <ul className="space-y-1 text-right">
                                <li><a href="#">Pinterest</a></li>
                                <li><a href="#">TwitterX</a></li>
                                <li><a href="#">LinkedIn</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div ref={blurLayerRef} className="bg-transparent h-[350dvh] "></div>
                {/* Autres Projets */}
                <div className="h-[100dvh] flex flex-col items-center justify-center gap-12 bg-transparent w-full">
                    <div className="flex justify-center flex-col items-center">
                        <div className="mb-16 flex w-2/3 justify-between">
                            <h2 className="text-ml font-semibold mb-6">Other works</h2>
                            <p className="text-gray-500 italic">S.2</p>
                        </div>
                        <h3 className="uppercase font-mabry font-medium text-[10rem] text-center text-white leading-none mix-blend-difference">ZOE MICHEL <br /> portfolio</h3>
                    </div>

                    {/* Call-to-action */}
                    <div className="border-t border-gray-200 text-center">
                        <p className="text-lg mb-4 text-white mt-20">
                            Envie de concrétiser un projet futur ensemble<br />
                            ou d’imaginer quelques <span className="font-bold">collaborations à venir</span> ?
                        </p>
                        <p className="text-sm uppercase tracking-widest text-gray-500">
                            Ne disparais pas, restons en contact
                        </p>
                    </div>
                </div>
            </div>
        </ReactViewBase>
    );
};

export default ProjectPageTemplate;