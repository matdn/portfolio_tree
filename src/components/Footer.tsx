import { useState } from "react";

const Footer = () => {
    const [isMuted, setIsMuted] = useState(false);

    return (
        <footer className="absolute bottom-4 w-full px-6 flex justify-between text-sm z-10">
            <span>MATIS DENE</span>
            <span className="text-sm font-neue md:text-[1rem] pb-8 font-light text-[#626262]">Mon portefolio est actuellement en cours développement</span>

            <button
                onClick={() => setIsMuted(!isMuted)}
                aria-label="Toggle sound"
                className="w-12 h-6 flex items-center justify-center overflow-hidden"
            >
                <svg width="100%" height="100%" viewBox="0 0 48 24" fill="none" preserveAspectRatio="none">
                    {isMuted ? (
                        <line x1="0" y1="12" x2="48" y2="12" stroke="white" strokeWidth="1.5" />
                    ) : (
                        <path
                            d="M0 12 Q6 4, 12 12 T24 12 T36 12 T48 12"
                            stroke="white"
                            strokeWidth="1.5"
                            fill="none"
                        >
                            <animate
                                attributeName="d"
                                dur="2s"
                                repeatCount="indefinite"
                                values="
                                    M0 12 Q6 4, 12 12 T24 12 T36 12 T48 12;
                                    M0 12 Q6 20, 12 12 T24 12 T36 12 T48 12;
                                    M0 12 Q6 4, 12 12 T24 12 T36 12 T48 12
                                "
                            />
                        </path>
                    )}
                </svg>
            </button>
        </footer>
    );
};

export default Footer;