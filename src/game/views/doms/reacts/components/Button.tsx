import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import gsap from 'gsap';
import React, {
    useRef,
    forwardRef,
    ForwardedRef,
    useImperativeHandle,
} from 'react';

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

        const letterAnimation = (isEnter: boolean) => {
            const staggerConfig = {
                each: 0.008,
                from: isEnter ? ('start' as const) : ('end' as const),
            };

            return gsap
                .timeline()
                .to(
                    topLettersRef.current,
                    {
                        yPercent: isEnter ? -100 : 0,
                        opacity: isEnter ? 0 : 1,
                        duration: 0.4,
                        ease: 'power2.out',
                        stagger: staggerConfig,
                    },
                    0
                )
                .to(
                    bottomLettersRef.current,
                    {
                        yPercent: isEnter ? 0 : 100,
                        opacity: isEnter ? 1 : 0,
                        duration: 0.4,
                        ease: 'power2.out',
                        stagger: staggerConfig,
                    },
                    0
                );
        };

        useImperativeHandle(forwardedRef, () => ({
            buttonElement: buttonRef.current,
            animate: letterAnimation,
        }));

        useGSAP(() => {
            if (!buttonRef.current) return;

            gsap.set(bottomLettersRef.current, {
                yPercent: 100,
                opacity: 0,
            });

            buttonRef.current.addEventListener('mouseenter', () => {
                letterAnimation(true);
            });

            buttonRef.current.addEventListener('mouseleave', () => {
                letterAnimation(false);
            });
        }, []);

        return (
            <button
                ref={buttonRef}
                onClick={onClick}
                className={clsx(
                    'relative px-6 py-1.5 md:px-8 md:py-2 md:rounded-full md:border md:border-2 md:border-white underlign bg-transparent md:bg-transparent flex items-center gap-4 text-white will-change-transform',
                    className
                )}
            >
                {icon && iconPosition === 'left' && <span ref={iconRef}>{icon}</span>}

                <div className='relative border-white'>
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
                </div>

                {icon && iconPosition === 'right' && <span ref={iconRef}>{icon}</span>}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
