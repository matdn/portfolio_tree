"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AssetsUtils } from "../game/core/utils/AssetsUtils";

gsap.registerPlugin(ScrollTrigger);

const StickyTitleScroll: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!sectionRef.current || !titleRef.current || !imageRef.current || !textRef.current) return;

            // Title becomes sticky
            gsap.set(titleRef.current, { position: "relative" });

            ScrollTrigger.create({
                trigger: titleRef.current,
                start: "top 20vh",
                endTrigger: textRef.current,
                end: "top 20vh",
                scrub: true,
                pin: true,
                pinSpacing: false,
                onLeave: () => {
                    gsap.set(titleRef.current, { position: "relative" });
                },
                onEnterBack: () => {
                    gsap.set(titleRef.current, { position: "sticky", top: "20vh" });
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="w-full bg-[#F6EFE8] text-black">
            <div className="h-[200vh] relative px-8">
                {/* Title */}
                <div
                    ref={titleRef}
                    className="text-8xl left-1/2 font-norman text-center -translate-x-1/2 font-bold text-[#291809] w-full sticky top-[20vh] py-4"
                >
                    project speach
                </div>

                {/* Image scroll underneath */}
                <div ref={imageRef} className="h-[100vh] w-full mt-12">
                    <img
                        src={AssetsUtils.GetAssetURL("images/orangerie0.png")}
                        alt="Scrolling"
                        className="w-1/2 h-1/2 object-cover relative left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
                    />
                </div>

                {/* Text after image */}
                <div ref={textRef} className="mt-[20vh] text-[#010614] text-lg text-center uppercase leading-relaxed max-w-3xl mx-auto pt-32">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in
                        eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum
                        nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id
                        rutrum lorem imperdiet.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default StickyTitleScroll;
