'use client';

import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({ rotateX: 0, rotateY: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia('(max-width: 768px)').matches);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || isMobile) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const rotateY = ((mouseX / width) - 0.5) * 10;
    const rotateX = ((mouseY / height) - 0.5) * -10;
    setStyle({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setStyle({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${style.rotateX}deg) rotateY(${style.rotateY}deg) scale3d(1, 1, 1)`,
        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}
      className={cn('transform-gpu h-full w-full', className)}
    >
      {children}
    </div>
  );
}