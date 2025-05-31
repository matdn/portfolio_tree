import React, { useEffect, useRef, useState } from "react";
import Button from "./components/Button";

const AboutReactView: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setVisible(true);
        }, 100); // petit délai pour éviter l'effet instantané

        return () => clearTimeout(timeout);
    }, []);

    const handleClick = () => {
        console.log("Button clicked from AboutReactView");
    };

    return (
        <div
            ref={containerRef}
            className={`fixed max-w-[50vw] bottom-0 left-1/2 flex flex-col items-center gap-[5rem] -translate-x-1/2 w-full z-50 pointer-events-auto transition-all duration-1200 ease-out ${visible ? "blur-0 opacity-100" : "blur-md opacity-0"
                }`}
        >
            <div className="text-center px-8 pb-6 text-base sm:text-lg md:text-xl font-roboto font-light text-white opacity-50">
                Développeur créatif passionné par les expériences interactives et visuelles.
                J’allie technologie, design et narration pour créer des interfaces immersives.
            </div>
            <div className="text-center pb-10">
                <Button title="back" className="z-40 py-12" onClick={handleClick} iconPosition="right" />

            </div>
        </div>
    );
};

export default AboutReactView;
