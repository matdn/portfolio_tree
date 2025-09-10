import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import gsap from 'gsap';
import React, {
    useRef,
    forwardRef,
    ForwardedRef,
    useImperativeHandle,
    useState,
} from 'react';
import { motion } from 'framer-motion';

type IconPosition = 'left' | 'right';

interface ButtonProps {
    title: string;
    icon?: React.ReactNode;
    iconPosition?: IconPosition;
    className?: string;
    onClick?: () => void;
}

export interface ButtonRef {
    buttonElement: HTMLButtonElement | null;
    animate: (isEnter: boolean) => gsap.core.Timeline;
}

const Button = forwardRef<ButtonRef, ButtonProps>(
    (
        { title, icon, iconPosition = 'right', className = '', onClick },
        forwardedRef: ForwardedRef<ButtonRef>
    ) => {
        const buttonRef = useRef<HTMLButtonElement>(null);
        const topLettersRef = useRef<(HTMLSpanElement | null)[]>([]);
        const bottomLettersRef = useRef<(HTMLSpanElement | null)[]>([]);
        const iconRef = useRef<HTMLSpanElement>(null);

        const title_top = title.split('');
        const title_bottom = title.split('');

        // const letterAnimation = (isEnter: boolean) => {
        //     const staggerConfig = {
        //         each: 0.008,
        //         from: isEnter ? ('start' as const) : ('end' as const),
        //     };

        //     return gsap
        //         .timeline()
        //         .to(
        //             topLettersRef.current,
        //             {
        //                 yPercent: isEnter ? -100 : 0,
        //                 opacity: isEnter ? 0 : 1,
        //                 duration: 0.4,
        //                 ease: 'power2.out',
        //                 stagger: staggerConfig,
        //             },
        //             0
        //         )
        //         .to(
        //             bottomLettersRef.current,
        //             {
        //                 yPercent: isEnter ? 0 : 100,
        //                 opacity: isEnter ? 1 : 0,
        //                 duration: 0.4,
        //                 ease: 'power2.out',
        //                 stagger: staggerConfig,
        //             },
        //             0
        //         );
        // };

        // useImperativeHandle(forwardedRef, () => ({
        //     buttonElement: buttonRef.current,
        //     animate: letterAnimation,
        // }));

        // useGSAP(() => {
        //     if (!buttonRef.current) return;

        //     gsap.set(bottomLettersRef.current, {
        //         yPercent: 100,
        //         opacity: 0,
        //     });

        //     buttonRef.current.addEventListener('mouseenter', () => {
        //         letterAnimation(true);
        //     });

        //     buttonRef.current.addEventListener('mouseleave', () => {
        //         letterAnimation(false);
        //     });
        // }, []);

        const [isHovered, setIsHovered] = useState(false);

        return (
            <button
                ref={buttonRef}
                onClick={onClick}
                className={clsx(
                    'relative px-6 py-1.5 underlign bg-transparent flex items-center gap-4 text-white will-change-transform',
                    className
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {icon && iconPosition === 'left' && <span ref={iconRef}>{icon}</span>}

                <div className='relative border-white flex flex-col items-center'>
                    <div className='flex overflow-hidden gap-[1px]'>
                        {title_top.map((letter, index) => (
                            <span
                                key={`top-${index}`}
                                className='inline-block relative overflow-hidden'
                            >
                                <span
                                    ref={(el) => (topLettersRef.current[index] = el)}
                                    className='inline-block text-[0.5rem] md:text-sm font-medium uppercase'
                                >
                                    {letter === ' ' ? '\u00A0' : letter}
                                </span>
                            </span>
                        ))}
                    </div>

                    <div className='flex gap-[1px] overflow-hidden absolute top-0 left-0'>
                        {title_bottom.map((letter, index) => (
                            <span
                                key={`bottom-${index}`}
                                className='inline-block relative overflow-hidden'
                            >
                                <span
                                    ref={(el) => (bottomLettersRef.current[index] = el)}
                                    className='inline-block text-[0.5rem] md:text-sm font-medium uppercase'
                                >
                                    {letter === ' ' ? '\u00A0' : letter}
                                </span>
                            </span>
                        ))}
                    </div>
                    {/* Underline animée */}
                    <motion.div
                        layoutId="underline"
                        initial={false}
                        animate={{
                            width: isHovered ? '100%' : '0%',
                            opacity: isHovered ? 1 : 0,
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                            duration: 0.8,
                        }}
                        className="h-[1px] bg-white rounded-full mt-1 w-full"
                        style={{ alignSelf: 'center' }}
                    />
                </div>

                {icon && iconPosition === 'right' && <span ref={iconRef}>{icon}</span>}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;