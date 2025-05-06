import React, { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface SoundIconProps {
  className?: string;
  isPlaying?: boolean;
  [key: string]: any;
}

const SoundIcon: React.FC<SoundIconProps> = ({
  className = '',
  isPlaying = false,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.killTweensOf(barsRef.current);

    if (isPlaying) {
      const timeline = gsap.timeline();

      timeline.to(barsRef.current, {
        height: () => gsap.utils.random(2, 20),
        duration: 0.2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        stagger: {
          each: 0.05,
          from: 'center',
        },
      });

      barsRef.current.forEach((bar, index) => {
        gsap.to(bar, {
          height: () => gsap.utils.random(3, 18),
          duration: 0.3 + (index % 3) * 0.1,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.05,
        });
      });
    } else {
      gsap.to(barsRef.current, {
        height: 2,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  }, [isPlaying]);

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-center gap-0.5 ${className}`}
      {...props}
    >
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          ref={(el) => (barsRef.current[index] = el)}
          className='w-0.5 bg-white rounded-full'
          style={{ height: '2px' }}
        ></div>
      ))}
    </div>
  );
};

export default SoundIcon;
